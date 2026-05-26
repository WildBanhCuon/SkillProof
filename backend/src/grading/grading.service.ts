import { Injectable, Logger } from '@nestjs/common';
import {
  Dimension,
  Recommendation,
  SessionType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../modules/ai/gemini.service';

@Injectable()
export class GradingService {
  private readonly logger = new Logger(GradingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
  ) {}

  async gradeSession(sessionId: string): Promise<void> {
    const session = await this.prisma.testSession.findUniqueOrThrow({
      where: { id: sessionId },
      include: {
        jobPosting: { include: { skillRequirements: true } },
        answers: { include: { question: true } },
      },
    });

    if (session.status === 'GRADED') {
      this.logger.log(`Session ${sessionId} already graded, skipping`);
      return;
    }

    const grade = await this.gemini.gradeSession(sessionId, {
      jobTitle: session.jobPosting.title,
      skills: session.jobPosting.skillRequirements.map((s) => s.skillName),
      questions: session.answers.map((a) => ({
        id: a.questionId,
        title: a.question.title,
        points: a.question.points,
        rubric: a.question.rubric,
        instructions: a.question.instructions,
      })),
      answers: session.answers.map((a) => ({
        questionId: a.questionId,
        code: a.submittedCode,
        notes: a.notes,
      })),
    });

    const recommendationMap: Record<string, Recommendation> = {
      ready_now: 'READY_NOW',
      trainable: 'TRAINABLE',
      at_risk: 'AT_RISK',
    };

    const dimensionMap: Record<string, Dimension> = {
      technical: 'TECHNICAL',
      problem_solving: 'PROBLEM_SOLVING',
      code_quality: 'CODE_QUALITY',
      communication: 'COMMUNICATION',
    };

    const visibleToCompany =
      session.sessionType === SessionType.APPLICATION;

    const dimensionRows = grade.dimensionScores.map((d) => ({
      dimension: dimensionMap[d.dimension] ?? 'TECHNICAL',
      score0_100: d.score,
    }));

    await this.prisma.testResult.upsert({
      where: { sessionId },
      create: {
        sessionId,
        visibleToCompany,
        overallScore: grade.overallScore,
        matchPercent: grade.matchPercent,
        recommendation:
          recommendationMap[grade.recommendation] ?? 'TRAINABLE',
        strengths: grade.strengths,
        improvements: grade.improvements,
        aiSummary: grade.aiSummary,
        dimensionScores: { create: dimensionRows },
      },
      update: {
        visibleToCompany,
        overallScore: grade.overallScore,
        matchPercent: grade.matchPercent,
        recommendation:
          recommendationMap[grade.recommendation] ?? 'TRAINABLE',
        strengths: grade.strengths,
        improvements: grade.improvements,
        aiSummary: grade.aiSummary,
        dimensionScores: {
          deleteMany: {},
          create: dimensionRows,
        },
      },
    });

    if (visibleToCompany) {
      await this.prisma.application.upsert({
        where: {
          jobPostingId_candidateUserId: {
            jobPostingId: session.jobPostingId,
            candidateUserId: session.candidateUserId,
          },
        },
        create: {
          jobPostingId: session.jobPostingId,
          candidateUserId: session.candidateUserId,
          testSessionId: sessionId,
        },
        update: { testSessionId: sessionId },
      });
    }

    await this.prisma.testSession.update({
      where: { id: sessionId },
      data: { status: 'GRADED' },
    });
  }
}
