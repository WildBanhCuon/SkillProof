import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  CreateJobDto,
  GenerateJobFromWizardDto,
  UpdateJobDto,
} from './jobs.dto';
import { JobsService } from './jobs.service';
import { AssessmentsService } from '../assessments/assessments.service';

@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(
    private readonly jobs: JobsService,
    private readonly assessments: AssessmentsService,
  ) {}

  @Post()
  @Roles('hr')
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateJobDto) {
    return this.jobs.create(user, dto);
  }

  @Post('generate-from-wizard')
  @Roles('hr')
  generateFromWizard(
    @CurrentUser() user: JwtPayload,
    @Body() dto: GenerateJobFromWizardDto,
  ) {
    return this.jobs.generateFromWizard(user, dto);
  }

  @Get()
  list(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: JobStatus,
  ) {
    return this.jobs.list(user, status);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.jobs.findOne(user, id);
  }

  @Patch(':id')
  @Roles('hr')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobs.update(user, id, dto);
  }

  @Post(':id/check-listing')
  @Roles('hr')
  checkListing(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.jobs.checkListing(user, id);
  }

  @Post(':id/accept-suggestions')
  @Roles('hr')
  acceptSuggestions(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.jobs.acceptSuggestions(user, id);
  }

  @Post(':id/apply-suggestions')
  @Roles('hr')
  applySuggestions(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.jobs.applySuggestions(user, id);
  }

  @Post(':id/publish')
  @Roles('hr')
  publish(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.jobs.publish(user, id);
  }

  @Post(':id/archive')
  @Roles('hr')
  archive(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.jobs.archive(user, id);
  }

  @Delete(':id')
  @Roles('hr')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.jobs.remove(user, id);
  }

  @Get(':id/assessment')
  async getAssessment(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    await this.jobs.findOne(user, id);
    const assessment = await this.assessments.getForJob(id);
    if (!assessment) return null;
    return this.assessments.toPublicAssessment(assessment);
  }
}
