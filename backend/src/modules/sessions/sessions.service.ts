import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SessionStatus, SessionType } from '@prisma/client';
import {
  missingRequiredProfileFields,
  parseRequiredProfileFields,
  profileValuesFromUser,
} from '../../common/profile-fields';
import { PrismaService } from '../../prisma/prisma.service';
import { AssessmentsService } from '../assessments/assessments.service';
import { JwtPayload } from '../auth/auth.types';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { GRADING_QUEUE } from '../../workers/grading.constants';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assessments: AssessmentsService,
    @InjectQueue(GRADING_QUEUE) private readonly gradingQueue: Queue,
  ) {}

  async startSession(
    user: JwtPayload,
    jobId: string,
    mode: 'practice' | 'application',
  ) {
    const sessionType =
      mode === 'practice' ? SessionType.PRACTICE : SessionType.APPLICATION;

    const job = await this.prisma.jobPosting.findUnique({
      where: { id: jobId, status: 'PUBLISHED' },
    });
    if (!job) throw new NotFoundException('Published job not found');

    if (mode === 'application') {
      const candidate = await this.prisma.candidateUser.findUnique({
        where: { id: user.sub },
        include: { profile: true },
      });
      if (!candidate) throw new ForbiddenException();
      const required = parseRequiredProfileFields(job.requiredProfileFields);
      const values = profileValuesFromUser(
        candidate.displayName,
        candidate.profile,
      );
      const missing = missingRequiredProfileFields(required, values);
      if (missing.length) {
        throw new BadRequestException({
          message:
            'Complete the required fields on your profile before applying.',
          missingProfileFields: missing,
        });
      }
    }

    const assessment = await this.assessments.getForJob(jobId);
    if (!assessment) {
      throw new BadRequestException('Job has no assessment');
    }

    if (mode === 'application') {
      // Candidate can only submit one application per offer.
      // We treat any non-expired application session as "already applied".
      const existing = await this.prisma.testSession.findFirst({
        where: {
          candidateUserId: user.sub,
          jobPostingId: jobId,
          sessionType: SessionType.APPLICATION,
          status: {
            in: ['IN_PROGRESS', 'SUBMITTED', 'GRADING', 'GRADED'],
          },
        },
        orderBy: { startedAt: 'desc' },
      });

      if (existing) {
        if (existing.status === 'IN_PROGRESS') {
          return this.formatSession(existing.id, user.sub);
        }
        throw new BadRequestException(
          'Already applied to this offer. Check “My applications” for your submission.',
        );
      }
    }

    const active = await this.prisma.testSession.findFirst({
      where: {
        candidateUserId: user.sub,
        jobPostingId: jobId,
        sessionType,
        status: 'IN_PROGRESS',
      },
    });
    if (active) return this.formatSession(active.id, user.sub);

    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() + assessment.durationMinutes,
    );

    const session = await this.prisma.testSession.create({
      data: {
        jobPostingId: jobId,
        candidateUserId: user.sub,
        sessionType:
          mode === 'practice' ? SessionType.PRACTICE : SessionType.APPLICATION,
        expiresAt,
        answers: {
          create: assessment.questions.map((q) => ({
            questionId: q.id,
            submittedCode: q.starterCode,
          })),
        },
      },
    });

    return this.formatSession(session.id, user.sub);
  }

  async saveAnswer(
    user: JwtPayload,
    sessionId: string,
    questionId: string,
    code: string,
    notes?: string,
  ) {
    const session = await this.ensureCandidateSession(sessionId, user.sub);
    if (session.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Session is locked');
    }
    if (session.expiresAt < new Date()) {
      await this.prisma.testSession.update({
        where: { id: sessionId },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('Session expired');
    }

    return this.prisma.answer.upsert({
      where: {
        sessionId_questionId: { sessionId, questionId },
      },
      create: {
        sessionId,
        questionId,
        submittedCode: code,
        notes,
      },
      update: { submittedCode: code, notes },
    });
  }

  async submit(user: JwtPayload, sessionId: string) {
    const session = await this.ensureCandidateSession(sessionId, user.sub);
    if (session.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Already submitted');
    }

    await this.prisma.testSession.update({
      where: { id: sessionId },
      data: { status: 'GRADING', submittedAt: new Date() },
    });

    try {
      await this.gradingQueue.add('grade-session', { sessionId });
    } catch (e) {
      // Avoid leaving the session stuck in GRADING if Redis/Bull is unavailable.
      await this.prisma.testSession.update({
        where: { id: sessionId },
        data: { status: 'IN_PROGRESS', submittedAt: null },
      });
      throw new ServiceUnavailableException(
        'Grading queue is temporarily unavailable. Please try again in a moment.',
      );
    }

    return {
      sessionId,
      submissionId: sessionId,
      status: 'queued',
    };
  }

  async getResult(user: JwtPayload, sessionId: string) {
    const session = await this.ensureCandidateSession(sessionId, user.sub);
    if (
      session.status !== 'GRADED' &&
      session.status !== 'SUBMITTED' &&
      session.status !== 'GRADING'
    ) {
      throw new BadRequestException('Session not submitted');
    }

    if (session.status === 'GRADING') {
      return { sessionId, status: 'grading' };
    }

    const result = await this.prisma.testResult.findUnique({
      where: { sessionId },
      include: { dimensionScores: true },
    });
    if (!result) {
      return { sessionId, status: 'grading' };
    }

    return {
      sessionId,
      status: 'evaluated',
      overallScore: result.overallScore,
      matchPercent: result.matchPercent,
      recommendation: result.recommendation.toLowerCase(),
      strengths: result.strengths,
      improvements: result.improvements,
      aiSummary: result.aiSummary,
      dimensionScores: result.dimensionScores.map((d) => ({
        dimension: d.dimension.toLowerCase(),
        score: d.score0_100,
      })),
      visibleToCompany: result.visibleToCompany,
    };
  }

  private async formatSession(sessionId: string, candidateId: string) {
    const session = await this.prisma.testSession.findUniqueOrThrow({
      where: { id: sessionId },
      include: {
        jobPosting: { include: { company: true } },
        answers: { include: { question: true } },
      },
    });
    if (session.candidateUserId !== candidateId) {
      throw new ForbiddenException();
    }

    const assessment = await this.assessments.getForJob(session.jobPostingId);

    return {
      id: session.id,
      jobId: session.jobPostingId,
      jobTitle: session.jobPosting.title,
      companyName: session.jobPosting.company.name,
      sessionType: session.sessionType.toLowerCase(),
      status: session.status.toLowerCase(),
      startedAt: session.startedAt,
      expiresAt: session.expiresAt,
      durationMinutes: assessment?.durationMinutes,
      totalPoints: assessment?.totalPoints,
      questions: assessment?.questions.map((q) => ({
        id: q.id,
        orderIndex: q.orderIndex,
        title: q.title,
        instructions: q.instructions,
        starterCode: q.starterCode,
        points: q.points,
        language: q.language,
      })),
    };
  }

  private async ensureCandidateSession(sessionId: string, candidateId: string) {
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
    });
    if (!session || session.candidateUserId !== candidateId) {
      throw new ForbiddenException();
    }
    return session;
  }
}
