import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationHrStatus, Recommendation } from '@prisma/client';
import {
  parseRequiredProfileFields,
  profileForApi,
  profileValuesFromUser,
} from '../../common/profile-fields';
import { hrStatusToApi } from '../candidate/candidate-application-status';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../auth/auth.types';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async stats(user: JwtPayload, jobId: string) {
    await this.ensureHrJob(jobId, user.companyId!);

    const applications = await this.prisma.application.count({
      where: { jobPostingId: jobId },
    });

    const results = await this.prisma.testResult.findMany({
      where: {
        visibleToCompany: true,
        session: { jobPostingId: jobId },
      },
    });

    const verifiedMatches = results.filter((r) => r.matchPercent >= 70).length;
    const topPerformers = results.filter(
      (r) => r.recommendation === 'READY_NOW',
    ).length;

    return {
      jobId,
      applicationsReceived: applications,
      verifiedMatches,
      topPerformers,
    };
  }

  async candidates(
    user: JwtPayload,
    jobId: string,
    opts: {
      sort?: string;
      band?: string;
      search?: string;
    },
  ) {
    await this.ensureHrJob(jobId, user.companyId!);

    const bandFilter = opts.band
      ? ({
          ready_now: 'READY_NOW',
          trainable: 'TRAINABLE',
          at_risk: 'AT_RISK',
        }[opts.band] as Recommendation | undefined)
      : undefined;

    const applications = await this.prisma.application.findMany({
      where: {
        jobPostingId: jobId,
        ...(opts.search
          ? {
              candidateUser: {
                displayName: { contains: opts.search, mode: 'insensitive' as const },
              },
            }
          : {}),
      },
      include: {
        candidateUser: { include: { profile: true } },
        testSession: {
          include: {
            testResult: { include: { dimensionScores: true } },
          },
        },
      },
    });

    let rows = applications
      .filter((a) => a.testSession.testResult?.visibleToCompany)
      .map((a) => {
        const r = a.testSession.testResult!;
        return {
          applicationId: a.id,
          candidate: {
            id: a.candidateUser.id,
            fullName: a.candidateUser.displayName,
            email: a.candidateUser.email,
            profile: profileForApi(
              profileValuesFromUser(
                a.candidateUser.displayName,
                a.candidateUser.profile,
              ),
            ),
          },
          overallScore: r.overallScore,
          matchPercent: r.matchPercent,
          recommendation: r.recommendation.toLowerCase(),
          strengths: r.strengths,
          improvements: r.improvements,
          aiSummary: r.aiSummary,
          dimensionScores: r.dimensionScores.map((d) => ({
            dimension: d.dimension.toLowerCase().replace('_', ' '),
            score: d.score0_100,
          })),
          appliedAt: a.appliedAt,
          hrStatus: hrStatusToApi(a.hrStatus),
          hrDecidedAt: a.hrDecidedAt,
        };
      });

    if (bandFilter) {
      rows = rows.filter((r) => r.recommendation === opts.band);
    }

    if (opts.sort === 'score' || !opts.sort) {
      rows.sort((a, b) => b.overallScore - a.overallScore);
    }

    rows = rows.map((r, i) => ({ ...r, rank: i + 1, isTopMatch: i === 0 }));

    return { jobId, candidates: rows };
  }

  async candidateDetail(
    user: JwtPayload,
    jobId: string,
    applicationId: string,
  ) {
    await this.ensureHrJob(jobId, user.companyId!);

    const app = await this.prisma.application.findFirst({
      where: { id: applicationId, jobPostingId: jobId },
      include: {
        candidateUser: { include: { profile: true } },
        testSession: {
          include: {
            testResult: { include: { dimensionScores: true } },
            answers: { include: { question: true } },
          },
        },
      },
    });
    if (!app?.testSession.testResult) {
      throw new NotFoundException('Application or results not found');
    }

    const auditLogs = await this.prisma.aiAuditLog.findMany({
      where: { referenceId: app.testSessionId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const job = await this.prisma.jobPosting.findUnique({
      where: { id: jobId },
      select: { requiredProfileFields: true },
    });

    return {
      applicationId: app.id,
      hrStatus: hrStatusToApi(app.hrStatus),
      hrDecidedAt: app.hrDecidedAt,
      requiredProfileFields: parseRequiredProfileFields(
        job?.requiredProfileFields,
      ),
      candidate: {
        id: app.candidateUser.id,
        fullName: app.candidateUser.displayName,
        email: app.candidateUser.email,
        profile: profileForApi(
          profileValuesFromUser(
            app.candidateUser.displayName,
            app.candidateUser.profile,
          ),
        ),
      },
      testResult: {
        ...app.testSession.testResult,
        recommendation: app.testSession.testResult.recommendation.toLowerCase(),
      },
      answers: [...app.testSession.answers]
        .sort((a, b) => a.question.orderIndex - b.question.orderIndex)
        .map((a) => ({
          questionId: a.questionId,
          orderIndex: a.question.orderIndex,
          title: a.question.title,
          instructions: a.question.instructions,
          points: a.question.points,
          language: a.question.language,
          submittedCode: a.submittedCode,
          notes: a.notes,
        })),
      auditLogs: auditLogs.map((l) => ({
        pipeline: l.pipeline,
        model: l.model,
        createdAt: l.createdAt,
      })),
    };
  }

  async setApplicationDecision(
    user: JwtPayload,
    jobId: string,
    applicationId: string,
    decision: 'interview' | 'decline',
  ) {
    await this.ensureHrJob(jobId, user.companyId!);

    const app = await this.prisma.application.findFirst({
      where: { id: applicationId, jobPostingId: jobId },
      include: {
        testSession: { include: { testResult: true } },
      },
    });
    if (!app?.testSession.testResult) {
      throw new NotFoundException('Application not found');
    }
    if (app.testSession.status !== 'GRADED') {
      throw new BadRequestException(
        'You can decide only after the assessment is graded',
      );
    }

    const hrStatus =
      decision === 'interview'
        ? ApplicationHrStatus.INTERVIEW
        : ApplicationHrStatus.DECLINED;

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        hrStatus,
        hrDecidedAt: new Date(),
      },
    });

    return {
      applicationId: updated.id,
      hrStatus: hrStatusToApi(updated.hrStatus),
      hrDecidedAt: updated.hrDecidedAt,
    };
  }

  private async ensureHrJob(jobId: string, companyId: string) {
    const job = await this.prisma.jobPosting.findUnique({
      where: { id: jobId },
    });
    if (!job || job.companyId !== companyId) {
      throw new ForbiddenException();
    }
    return job;
  }
}
