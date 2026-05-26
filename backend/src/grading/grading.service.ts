import { Injectable, Logger } from '@nestjs/common';
import {
  Dimension,
  QuestionType,
  Recommendation,
  SessionType,
} from '@prisma/client';
import { getMcqCorrectOptionId } from '../common/question-public';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../modules/ai/gemini.service';
import type { SessionGradeResult } from '../modules/ai/ai.schemas';

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

    const totalMax = session.answers.reduce(
      (sum, a) => sum + a.question.points,
      0,
    );

    let mcqEarned = 0;
    let mcqMax = 0;
    const mcqDetails: {
      questionId: string;
      title: string;
      correct: boolean;
      earned: number;
      max: number;
    }[] = [];

    const codeAnswers = session.answers.filter(
      (a) => a.question.questionType === QuestionType.CODE,
    );

    for (const a of session.answers) {
      if (a.question.questionType !== QuestionType.MCQ) continue;
      mcqMax += a.question.points;
      const correctId = getMcqCorrectOptionId(a.question.rubric);
      const selected = a.submittedCode?.trim() ?? '';
      const correct = !!correctId && selected === correctId;
      const earned = correct ? a.question.points : 0;
      mcqEarned += earned;
      mcqDetails.push({
        questionId: a.questionId,
        title: a.question.title,
        correct,
        earned,
        max: a.question.points,
      });
    }

    let grade: SessionGradeResult;

    if (codeAnswers.length === 0) {
      grade = this.gradeFromMcqOnly(
        mcqEarned,
        totalMax,
        mcqDetails,
        session.jobPosting.title,
      );
    } else {
      const codeMax = codeAnswers.reduce((s, a) => s + a.question.points, 0);
      const aiGrade = await this.gemini.gradeSession(sessionId, {
        jobTitle: session.jobPosting.title,
        skills: session.jobPosting.skillRequirements.map((s) => s.skillName),
        questions: codeAnswers.map((a) => ({
          id: a.questionId,
          title: a.question.title,
          points: a.question.points,
          rubric: a.question.rubric,
          instructions: a.question.instructions,
          questionType: 'code' as const,
        })),
        answers: codeAnswers.map((a) => ({
          questionId: a.questionId,
          code: a.submittedCode,
          notes: a.notes,
        })),
        mcqAutoGrade:
          mcqMax > 0
            ? {
                earnedPoints: mcqEarned,
                maxPoints: mcqMax,
                details: mcqDetails,
              }
            : undefined,
      });

      const codeEarned = Math.round((aiGrade.overallScore / 100) * codeMax);
      const totalEarned = mcqEarned + codeEarned;
      const overallScore =
        totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;

      grade = {
        ...aiGrade,
        overallScore,
        matchPercent: Math.min(
          100,
          Math.round((overallScore + aiGrade.matchPercent) / 2),
        ),
      };
    }

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

  private gradeFromMcqOnly(
    mcqEarned: number,
    totalMax: number,
    mcqDetails: {
      questionId: string;
      title: string;
      correct: boolean;
      earned: number;
      max: number;
    }[],
    jobTitle: string,
  ): SessionGradeResult {
    const overallScore =
      totalMax > 0 ? Math.round((mcqEarned / totalMax) * 100) : 0;
    const correctCount = mcqDetails.filter((d) => d.correct).length;
    const recommendation =
      overallScore >= 75 ? 'ready_now' : overallScore >= 50 ? 'trainable' : 'at_risk';

    return {
      overallScore,
      matchPercent: overallScore,
      recommendation,
      strengths:
        correctCount > 0
          ? [
              `Strong knowledge on ${correctCount} of ${mcqDetails.length} knowledge-check questions`,
            ]
          : ['Completed the knowledge-check section'],
      improvements:
        correctCount < mcqDetails.length
          ? [
              'Review role-specific tools and workflows highlighted in incorrect answers',
            ]
          : [],
      aiSummary: `Knowledge-check assessment for ${jobTitle}: ${mcqEarned}/${totalMax} points (${overallScore}%).`,
      dimensionScores: [
        { dimension: 'technical', score: overallScore },
        { dimension: 'problem_solving', score: overallScore },
        { dimension: 'code_quality', score: Math.max(40, overallScore - 10) },
        { dimension: 'communication', score: overallScore },
      ],
    };
  }
}
