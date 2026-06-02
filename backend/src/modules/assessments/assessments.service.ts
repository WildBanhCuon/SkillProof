import { Injectable } from '@nestjs/common';
import { AssessmentPurpose, QuestionType } from '@prisma/client';
import { formatQuestionForCandidate } from '../../common/question-public';
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

    await this.prisma.assessment.deleteMany({ where: { jobPostingId: jobId } });

    const skills = job.skillRequirements.map((s) => ({
      skillName: s.skillName,
      importance: s.importance.toLowerCase(),
      testable: s.testable,
    }));

    const applicationGen = await this.gemini.generateAssessment(
      jobId,
      job.title,
      job.description,
      skills,
      'application',
    );

    const application = await this.createAssessmentFromGen(
      jobId,
      AssessmentPurpose.APPLICATION,
      applicationGen,
    );

    const practiceGen = await this.gemini.generateAssessment(
      jobId,
      job.title,
      job.description,
      skills,
      'practice',
      applicationGen.questions.map((q) => q.title),
    );

    const practice = await this.createAssessmentFromGen(
      jobId,
      AssessmentPurpose.PRACTICE,
      practiceGen,
    );

    return { application, practice };
  }

  async ensurePracticeAssessment(jobId: string) {
    const existing = await this.getForJob(jobId, AssessmentPurpose.PRACTICE);
    if (existing) return existing;

    const application = await this.getForJob(jobId, AssessmentPurpose.APPLICATION);
    if (!application) return null;

    const job = await this.prisma.jobPosting.findUniqueOrThrow({
      where: { id: jobId },
      include: { skillRequirements: true },
    });

    const skills = job.skillRequirements.map((s) => ({
      skillName: s.skillName,
      importance: s.importance.toLowerCase(),
      testable: s.testable,
    }));

    const practiceGen = await this.gemini.generateAssessment(
      jobId,
      job.title,
      job.description,
      skills,
      'practice',
      application.questions.map((q) => q.title),
    );

    return this.createAssessmentFromGen(
      jobId,
      AssessmentPurpose.PRACTICE,
      practiceGen,
    );
  }

  private async createAssessmentFromGen(
    jobId: string,
    purpose: AssessmentPurpose,
    gen: Awaited<ReturnType<GeminiService['generateAssessment']>>,
  ) {
    return this.prisma.assessment.create({
      data: {
        jobPostingId: jobId,
        purpose,
        durationMinutes: gen.durationMinutes,
        totalPoints: gen.totalPoints,
        questions: {
          create: gen.questions.map((q, idx) => {
            const isMcq = q.questionType === 'mcq';
            return {
              orderIndex: idx,
              questionType: isMcq ? QuestionType.MCQ : QuestionType.CODE,
              title: q.title,
              instructions: q.instructions,
              starterCode: isMcq ? '' : (q.starterCode ?? ''),
              points: q.points,
              language: isMcq ? 'text' : (q.language ?? 'javascript'),
              mcqOptions: isMcq ? q.options : undefined,
              rubric: isMcq
                ? ({
                    ...(q.rubric ?? {}),
                    correctOptionId: q.correctOptionId,
                  } as object)
                : ((q.rubric ?? {}) as object),
            };
          }),
        },
      },
      include: {
        questions: { orderBy: { orderIndex: 'asc' } },
      },
    });
  }

  purposeForSessionType(
    sessionType: 'practice' | 'application',
  ): AssessmentPurpose {
    return sessionType === 'practice'
      ? AssessmentPurpose.PRACTICE
      : AssessmentPurpose.APPLICATION;
  }

  async getForJob(jobId: string, purpose: AssessmentPurpose) {
    return this.prisma.assessment.findUnique({
      where: {
        jobPostingId_purpose: { jobPostingId: jobId, purpose },
      },
      include: {
        questions: { orderBy: { orderIndex: 'asc' } },
      },
    });
  }

  toPublicAssessment(
    assessment: NonNullable<
      Awaited<ReturnType<typeof this.getForJob>>
    >,
  ) {
    return {
      id: assessment.id,
      jobId: assessment.jobPostingId,
      purpose: assessment.purpose.toLowerCase(),
      durationMinutes: assessment.durationMinutes,
      totalPoints: assessment.totalPoints,
      questionCount: assessment.questions.length,
      questions: assessment.questions.map((q) => formatQuestionForCandidate(q)),
    };
  }
}
