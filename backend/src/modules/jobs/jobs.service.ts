import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobStatus, SkillImportance } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { GeminiService } from '../ai/gemini.service';
import { AssessmentsService } from '../assessments/assessments.service';
import { JwtPayload } from '../auth/auth.types';
import {
  CreateJobDto,
  GenerateJobFromWizardDto,
  UpdateJobDto,
} from './jobs.dto';

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
    private readonly assessments: AssessmentsService,
  ) {}

  async generateFromWizard(user: JwtPayload, dto: GenerateJobFromWizardDto) {
    return this.gemini.generateJobFromWizard({
      roleTitle: dto.roleTitle,
      seniority: dto.seniority,
      teamContext: dto.teamContext,
      responsibilities: dto.responsibilities,
      mustHaveSkills: dto.mustHaveSkills,
      niceToHaveSkills: dto.niceToHaveSkills ?? '',
      experienceLevel: dto.experienceLevel,
      workMode: dto.workMode,
      location: dto.location ?? '',
      tone: dto.tone,
    });
  }

  async create(user: JwtPayload, dto: CreateJobDto) {
    return this.prisma.jobPosting.create({
      data: {
        companyId: user.companyId!,
        title: dto.title,
        description: dto.description,
        status: 'DRAFT',
      },
      include: { skillRequirements: true, assessment: true },
    });
  }

  async list(user: JwtPayload, status?: JobStatus) {
    if (user.role === 'candidate') {
      return this.prisma.jobPosting.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          company: { select: { name: true } },
          assessment: {
            select: {
              durationMinutes: true,
              totalPoints: true,
              questions: { select: { id: true } },
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
      });
    }
    return this.prisma.jobPosting.findMany({
      where: {
        companyId: user.companyId,
        ...(status ? { status } : {}),
      },
      include: {
        skillRequirements: true,
        assessment: { select: { id: true, durationMinutes: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(user: JwtPayload, id: string) {
    const job = await this.prisma.jobPosting.findUnique({
      where: { id },
      include: {
        company: { select: { name: true } },
        skillRequirements: true,
        listingAnalyses: { orderBy: { createdAt: 'desc' }, take: 1 },
        assessment: {
          include: {
            questions: { orderBy: { orderIndex: 'asc' } },
          },
        },
      },
    });
    if (!job) throw new NotFoundException('Job not found');
    if (user.role === 'hr' && job.companyId !== user.companyId) {
      throw new ForbiddenException();
    }
    if (user.role === 'candidate' && job.status !== 'PUBLISHED') {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async update(user: JwtPayload, id: string, dto: UpdateJobDto) {
    const job = await this.ensureHrDraft(id, user.companyId!);
    return this.prisma.jobPosting.update({
      where: { id: job.id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.description ? 'DRAFT' : undefined,
      },
      include: { skillRequirements: true },
    });
  }

  async checkListing(user: JwtPayload, id: string) {
    const job = await this.ensureHrDraft(id, user.companyId!);
    const result = await this.gemini.analyzeListing(
      id,
      job.title,
      job.description,
    );

    await this.prisma.skillRequirement.deleteMany({
      where: { jobPostingId: id },
    });

    await this.prisma.listingAnalysis.create({
      data: { jobPostingId: id, issues: result.issues },
    });

    await this.prisma.skillRequirement.createMany({
      data: result.skills.map((s) => ({
        jobPostingId: id,
        skillName: s.skillName,
        importance:
          s.importance === 'must_have'
            ? SkillImportance.MUST_HAVE
            : SkillImportance.NICE_TO_HAVE,
        expectedLevel: s.expectedLevel,
        testable: s.testable,
      })),
    });

    return this.prisma.jobPosting.update({
      where: { id },
      data: {
        status: 'ANALYZED',
        suggestedDescription: null,
        suggestionsAppliedAt: null,
      },
      include: {
        skillRequirements: true,
        listingAnalyses: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
  }

  async acceptSuggestions(user: JwtPayload, id: string) {
    const job = await this.ensureHrOwned(id, user.companyId!);
    const analysis = job.listingAnalyses?.[0];
    const issues = analysis?.issues ?? [];
    const rewrite = await this.gemini.rewriteListing(
      id,
      job.title,
      job.description,
      issues,
    );
    await this.prisma.jobPosting.update({
      where: { id },
      data: { suggestedDescription: rewrite.improvedDescription },
    });
    return { improvedDescription: rewrite.improvedDescription };
  }

  async applySuggestions(user: JwtPayload, id: string) {
    const job = await this.ensureHrOwned(id, user.companyId!);
    if (!job.suggestedDescription) {
      throw new BadRequestException(
        'No suggestions to apply. Run accept-suggestions first.',
      );
    }
    return this.prisma.jobPosting.update({
      where: { id },
      data: {
        description: job.suggestedDescription,
        suggestedDescription: null,
        suggestionsAppliedAt: new Date(),
      },
      include: { skillRequirements: true },
    });
  }

  async publish(user: JwtPayload, id: string) {
    const job = await this.prisma.jobPosting.findUnique({
      where: { id },
      include: { skillRequirements: true, listingAnalyses: true },
    });
    if (!job || job.companyId !== user.companyId) {
      throw new ForbiddenException();
    }
    if (job.status === 'DRAFT') {
      throw new BadRequestException(
        'Run check-listing before publishing.',
      );
    }
    if (!job.skillRequirements.length) {
      throw new BadRequestException(
        'Skills matrix required. Run check-listing first.',
      );
    }

    await this.assessments.generateForJob(id);

    return this.prisma.jobPosting.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
      include: {
        skillRequirements: true,
        assessment: {
          include: { questions: { orderBy: { orderIndex: 'asc' } } },
        },
      },
    });
  }

  async archive(user: JwtPayload, id: string) {
    const job = await this.ensureHrOwned(id, user.companyId!);
    if (job.status !== 'PUBLISHED') {
      throw new BadRequestException(
        'Only published jobs can be archived. Drafts can be deleted instead.',
      );
    }
    return this.prisma.jobPosting.update({
      where: { id },
      data: { status: 'CLOSED' },
      include: { skillRequirements: true, assessment: { select: { id: true } } },
    });
  }

  async remove(user: JwtPayload, id: string) {
    const job = await this.ensureHrOwned(id, user.companyId!);
    if (job.status === 'PUBLISHED') {
      throw new BadRequestException(
        'Archive this job first so candidates can no longer apply, then you can delete it.',
      );
    }
    await this.prisma.jobPosting.delete({ where: { id } });
  }

  private async ensureHrDraft(id: string, companyId: string) {
    const job = await this.prisma.jobPosting.findUnique({ where: { id } });
    if (!job || job.companyId !== companyId) throw new ForbiddenException();
    if (job.status === 'PUBLISHED' || job.status === 'CLOSED') {
      throw new BadRequestException('Cannot edit published job');
    }
    return job;
  }

  private async ensureHrOwned(id: string, companyId: string) {
    const job = await this.prisma.jobPosting.findUnique({
      where: { id },
      include: {
        listingAnalyses: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    if (!job || job.companyId !== companyId) throw new ForbiddenException();
    return job;
  }
}
