import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { profileForApi, profileValuesFromUser } from '../../common/profile-fields';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../auth/auth.types';
import { deriveCandidateApplicationStatus } from './candidate-application-status';
import { UpdateCandidateProfileDto } from './candidate-profile.dto';

@Injectable()
export class CandidateService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(user: JwtPayload) {
    if (user.role !== 'candidate') {
      throw new UnauthorizedException();
    }
    const candidate = await this.prisma.candidateUser.findUnique({
      where: { id: user.sub },
      include: { profile: true },
    });
    if (!candidate) throw new NotFoundException();
    const values = profileValuesFromUser(
      candidate.displayName,
      candidate.profile,
    );
    return {
      email: candidate.email,
      profile: profileForApi(values),
      updatedAt: candidate.profile?.updatedAt ?? null,
    };
  }

  async updateProfile(user: JwtPayload, dto: UpdateCandidateProfileDto) {
    if (user.role !== 'candidate') {
      throw new UnauthorizedException();
    }
    const emptyToNull = (v?: string) =>
      v === undefined ? undefined : v.trim() === '' ? null : v.trim();

    if (dto.displayName) {
      await this.prisma.candidateUser.update({
        where: { id: user.sub },
        data: { displayName: dto.displayName.trim() },
      });
    }

    const profileData = {
      bio: emptyToNull(dto.bio),
      phoneCountryCode: emptyToNull(dto.phoneCountryCode),
      phone: emptyToNull(dto.phone),
      linkedInUrl: emptyToNull(dto.linkedInUrl),
      portfolioUrl: emptyToNull(dto.portfolioUrl),
      githubUrl: emptyToNull(dto.githubUrl),
      websiteUrl: emptyToNull(dto.websiteUrl),
      resumeUrl: emptyToNull(dto.resumeUrl),
    };
    const hasProfileUpdate = Object.values(profileData).some(
      (v) => v !== undefined,
    );

    if (hasProfileUpdate) {
      await this.prisma.candidateProfile.upsert({
        where: { candidateUserId: user.sub },
        create: {
          candidateUserId: user.sub,
          bio: profileData.bio ?? null,
          phoneCountryCode: profileData.phoneCountryCode ?? null,
          phone: profileData.phone ?? null,
          linkedInUrl: profileData.linkedInUrl ?? null,
          portfolioUrl: profileData.portfolioUrl ?? null,
          githubUrl: profileData.githubUrl ?? null,
          websiteUrl: profileData.websiteUrl ?? null,
          resumeUrl: profileData.resumeUrl ?? null,
        },
        update: Object.fromEntries(
          Object.entries(profileData).filter(([, v]) => v !== undefined),
        ),
      });
    }

    return this.getProfile(user);
  }

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
          s.application?.hrStatus,
          s.testResult?.recommendation,
        ),
        hrStatus: s.application?.hrStatus?.toLowerCase() ?? null,
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
      s.application?.hrStatus,
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
      hrStatus: s.application?.hrStatus?.toLowerCase() ?? null,
      hrDecidedAt: s.application?.hrDecidedAt ?? null,
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
