import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApplicationHrStatus } from '@prisma/client';
import { profileForApi, profileValuesFromUser } from '../../common/profile-fields';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../auth/auth.types';
import { deriveCandidateApplicationStatus } from './candidate-application-status';
import {
  isHrDecisionStatus,
  isUnreadHrDecision,
  notificationMessage,
} from './candidate-notifications';
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

  async listNotifications(user: JwtPayload) {
    if (user.role !== 'candidate') {
      throw new UnauthorizedException();
    }

    const applications = await this.prisma.application.findMany({
      where: {
        candidateUserId: user.sub,
        hrStatus: {
          in: [ApplicationHrStatus.INTERVIEW, ApplicationHrStatus.DECLINED],
        },
        hrDecidedAt: { not: null },
      },
      include: {
        jobPosting: { include: { company: true } },
      },
      orderBy: { hrDecidedAt: 'desc' },
      take: 30,
    });

    const items = applications.map((app) => ({
      applicationId: app.id,
      sessionId: app.testSessionId,
      jobId: app.jobPostingId,
      jobTitle: app.jobPosting.title,
      companyName: app.jobPosting.company.name,
      hrStatus: app.hrStatus.toLowerCase(),
      hrDecidedAt: app.hrDecidedAt,
      read: !isUnreadHrDecision(app),
      message: notificationMessage(
        app.hrStatus,
        app.jobPosting.title,
        app.jobPosting.company.name,
      ),
    }));

    return {
      unreadCount: items.filter((item) => !item.read).length,
      items,
    };
  }

  async markNotificationsRead(
    user: JwtPayload,
    applicationId?: string,
  ) {
    if (user.role !== 'candidate') {
      throw new UnauthorizedException();
    }

    const apps = await this.prisma.application.findMany({
      where: {
        candidateUserId: user.sub,
        ...(applicationId ? { id: applicationId } : {}),
        hrStatus: {
          in: [ApplicationHrStatus.INTERVIEW, ApplicationHrStatus.DECLINED],
        },
        hrDecidedAt: { not: null },
      },
    });

    const toMark = apps.filter((app) => isUnreadHrDecision(app));
    if (!toMark.length) {
      return { marked: 0 };
    }

    const now = new Date();
    await this.prisma.$transaction(
      toMark.map((app) =>
        this.prisma.application.update({
          where: { id: app.id },
          data: { hrDecisionSeenAt: now },
        }),
      ),
    );

    return { marked: toMark.length };
  }

  private async markApplicationDecisionSeen(applicationId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!app || !isUnreadHrDecision(app)) return;
    await this.prisma.application.update({
      where: { id: applicationId },
      data: { hrDecisionSeenAt: new Date() },
    });
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

    if (
      s.application &&
      isHrDecisionStatus(s.application.hrStatus) &&
      isUnreadHrDecision(s.application)
    ) {
      await this.markApplicationDecisionSeen(s.application.id);
    }

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
