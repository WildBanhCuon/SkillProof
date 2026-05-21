import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ResultsService } from './results.service';

@Controller('jobs/:jobId')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('hr')
export class ResultsController {
  constructor(private readonly results: ResultsService) {}

  @Get('stats')
  stats(@CurrentUser() user: JwtPayload, @Param('jobId') jobId: string) {
    return this.results.stats(user, jobId);
  }

  @Get('candidates')
  candidates(
    @CurrentUser() user: JwtPayload,
    @Param('jobId') jobId: string,
    @Query('sort') sort?: string,
    @Query('band') band?: string,
    @Query('search') search?: string,
  ) {
    return this.results.candidates(user, jobId, { sort, band, search });
  }

  @Get('candidates/:applicationId')
  detail(
    @CurrentUser() user: JwtPayload,
    @Param('jobId') jobId: string,
    @Param('applicationId') applicationId: string,
  ) {
    return this.results.candidateDetail(user, jobId, applicationId);
  }
}
