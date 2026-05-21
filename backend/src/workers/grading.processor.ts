import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import {
  Dimension,
  Recommendation,
  SessionType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../modules/ai/gemini.service';
import { Judge0Service } from '../modules/sandbox/judge0.service';
import { GRADING_QUEUE } from './grading.constants';

@Processor(GRADING_QUEUE)
export class GradingProcessor {
  private readonly logger = new Logger(GradingProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
    private readonly judge0: Judge0Service,
  ) {}

  @Process('grade-session')
  async handle(job: Job<{ sessionId: string }>) {
    const { sessionId } = job.data;
    this.logger.log(`Grading session ${sessionId}`);

    try {
      const session = await this.prisma.testSession.findUniqueOrThrow({
        where: { id: sessionId },
        include: {
          jobPosting: { include: { skillRequirements: true } },
          answers: {
            include: {
              question: { include: { testCases: true } },
            },
          },
        },
      });

      for (const answer of session.answers) {
        const hiddenTests = answer.question.testCases.filter((t) => t.isHidden);
        const runs = await this.judge0.runTests(
          answer.submittedCode,
          answer.question.language,
          hiddenTests.map((tc) => ({
            id: tc.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            timeoutMs: tc.timeoutMs,
          })),
        );
        await this.prisma.sandboxRun.create({
          data: {
            answerId: answer.id,
            isHiddenSuite: true,
            results: runs as object,
          },
        });
      }

      const answersWithRuns = await this.prisma.answer.findMany({
        where: { sessionId },
        include: {
          question: true,
          sandboxRuns: { orderBy: { ranAt: 'desc' }, take: 1 },
        },
      });

      const grade = await this.gemini.gradeSession(sessionId, {
        jobTitle: session.jobPosting.title,
        skills: session.jobPosting.skillRequirements.map((s) => s.skillName),
        questions: session.answers.map((a) => ({
          id: a.questionId,
          title: a.question.title,
          points: a.question.points,
          rubric: a.question.rubric,
        })),
        answers: answersWithRuns.map((a) => ({
          questionId: a.questionId,
          code: a.submittedCode,
          sandboxResults: a.sandboxRuns[0]?.results ?? [],
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

      await this.prisma.testResult.create({
        data: {
          sessionId,
          visibleToCompany,
          overallScore: grade.overallScore,
          matchPercent: grade.matchPercent,
          recommendation:
            recommendationMap[grade.recommendation] ?? 'TRAINABLE',
          strengths: grade.strengths,
          improvements: grade.improvements,
          aiSummary: grade.aiSummary,
          dimensionScores: {
            create: grade.dimensionScores.map((d) => ({
              dimension: dimensionMap[d.dimension] ?? 'TECHNICAL',
              score0_100: d.score,
            })),
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
    } catch (err) {
      this.logger.error(`Grading failed for ${sessionId}`, err);
      await this.prisma.testSession.update({
        where: { id: sessionId },
        data: { status: 'SUBMITTED' },
      });
      throw err;
    }
  }
}
