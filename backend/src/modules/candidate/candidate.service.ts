import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../auth/auth.types';
import { deriveCandidateApplicationStatus } from './candidate-application-status';

@Injectable()
export class CandidateService {
  constructor(private readonly prisma: PrismaService) {}

  async listApplications(user: JwtPayload) {
    if (user.role !== 'candidate') {
      throw new UnauthorizedException();
    }

    const sessions = await this.prisma.testSession.findMany({
      where: { candidateUserId: user.sub },
      include: {
        jobPosting: { include: { company: true } },
        testResult: true,
        application: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    return {
      items: sessions.map((s) => ({
        sessionId: s.id,
        applicationId: s.application?.id ?? null,
        jobId: s.jobPostingId,
        jobTitle: s.jobPosting.title,
        companyName: s.jobPosting.company.name,
        jobStatus: s.jobPosting.status,
        sessionType: s.sessionType.toLowerCase(),
        sessionStatus: s.status.toLowerCase(),
        applicationStatus: deriveCandidateApplicationStatus(
          s.sessionType,
          s.status,
          s.testResult?.recommendation,
        ),
        startedAt: s.startedAt,
        submittedAt: s.submittedAt,
        expiresAt: s.expiresAt,
        overallScore: s.testResult?.overallScore ?? null,
        matchPercent: s.testResult?.matchPercent ?? null,
        recommendation: s.testResult?.recommendation?.toLowerCase() ?? null,
        hasResult: s.status === 'GRADED' && !!s.testResult,
      })),
    };
  }

  async getApplication(
    user: JwtPayload,
    sessionId: string,
  ) {
    if (user.role !== 'candidate') {
      throw new UnauthorizedException();
    }

    const s = await this.prisma.testSession.findFirst({
      where: { id: sessionId, candidateUserId: user.sub },
      include: {
        jobPosting: { include: { company: true } },
        testResult: { include: { dimensionScores: true } },
        application: true,
      },
    });
    if (!s) throw new NotFoundException('Application not found');

    const applicationStatus = deriveCandidateApplicationStatus(
      s.sessionType,
      s.status,
      s.testResult?.recommendation,
    );

    return {
      sessionId: s.id,
      applicationId: s.application?.id ?? null,
      jobId: s.jobPostingId,
      jobTitle: s.jobPosting.title,
      companyName: s.jobPosting.company.name,
      sessionType: s.sessionType.toLowerCase(),
      sessionStatus: s.status.toLowerCase(),
      applicationStatus,
      startedAt: s.startedAt,
      submittedAt: s.submittedAt,
      expiresAt: s.expiresAt,
      appliedAt: s.application?.appliedAt ?? null,
      overallScore: s.testResult?.overallScore ?? null,
      matchPercent: s.testResult?.matchPercent ?? null,
      recommendation: s.testResult?.recommendation?.toLowerCase() ?? null,
      strengths: s.testResult?.strengths ?? null,
      improvements: s.testResult?.improvements ?? null,
      aiSummary: s.testResult?.aiSummary ?? null,
      dimensionScores:
        s.testResult?.dimensionScores.map((d) => ({
          dimension: d.dimension.toLowerCase(),
          score: d.score0_100,
        })) ?? null,
    };
  }
}
