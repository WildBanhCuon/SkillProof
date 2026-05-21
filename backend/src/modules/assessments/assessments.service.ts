import { Injectable } from '@nestjs/common';
import { SkillImportance } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';

@Injectable()
export class AssessmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
  ) {}

  async generateForJob(jobId: string) {
    const job = await this.prisma.jobPosting.findUniqueOrThrow({
      where: { id: jobId },
      include: { skillRequirements: true },
    });

    const existing = await this.prisma.assessment.findUnique({
      where: { jobPostingId: jobId },
    });
    if (existing) {
      await this.prisma.sandboxTestCase.deleteMany({
        where: { question: { assessmentId: existing.id } },
      });
      await this.prisma.question.deleteMany({
        where: { assessmentId: existing.id },
      });
      await this.prisma.assessment.delete({ where: { id: existing.id } });
    }

    const gen = await this.gemini.generateAssessment(
      jobId,
      job.title,
      job.description,
      job.skillRequirements.map((s) => ({
        skillName: s.skillName,
        importance: s.importance.toLowerCase(),
        testable: s.testable,
      })),
    );

    const assessment = await this.prisma.assessment.create({
      data: {
        jobPostingId: jobId,
        durationMinutes: gen.durationMinutes,
        totalPoints: gen.totalPoints,
        questions: {
          create: gen.questions.map((q, idx) => ({
            orderIndex: idx,
            title: q.title,
            instructions: q.instructions,
            starterCode: q.starterCode,
            points: q.points,
            rubric: q.rubric as object,
            language: q.language,
            testCases: {
              create: q.testCases.map((tc) => ({
                isHidden: tc.isHidden ?? true,
                input: tc.input ?? null,
                expectedOutput: tc.expectedOutput,
                timeoutMs: 5000,
              })),
            },
          })),
        },
      },
      include: {
        questions: { include: { testCases: true }, orderBy: { orderIndex: 'asc' } },
      },
    });

    return assessment;
  }

  async getForJob(jobId: string, includeHiddenTests: boolean) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { jobPostingId: jobId },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
          include: {
            testCases: includeHiddenTests
              ? true
              : { where: { isHidden: false } },
          },
        },
      },
    });
    return assessment;
  }

  toPublicAssessment(assessment: NonNullable<Awaited<ReturnType<typeof this.getForJob>>>) {
    return {
      id: assessment.id,
      jobId: assessment.jobPostingId,
      durationMinutes: assessment.durationMinutes,
      totalPoints: assessment.totalPoints,
      questionCount: assessment.questions.length,
      questions: assessment.questions.map((q) => ({
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
}
