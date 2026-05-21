import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Recommendation } from '@prisma/client';
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
        candidateUser: true,
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
        candidateUser: true,
        testSession: {
          include: {
            testResult: { include: { dimensionScores: true } },
            answers: {
              include: {
                question: true,
                sandboxRuns: { orderBy: { ranAt: 'desc' }, take: 1 },
              },
            },
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

    return {
      applicationId: app.id,
      candidate: {
        id: app.candidateUser.id,
        fullName: app.candidateUser.displayName,
        email: app.candidateUser.email,
      },
      testResult: app.testSession.testResult,
      answers: app.testSession.answers.map((a) => ({
        questionId: a.questionId,
        title: a.question.title,
        submittedCode: a.submittedCode,
        sandboxResults: a.sandboxRuns[0]?.results,
      })),
      auditLogs: auditLogs.map((l) => ({
        pipeline: l.pipeline,
        model: l.model,
        createdAt: l.createdAt,
      })),
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
