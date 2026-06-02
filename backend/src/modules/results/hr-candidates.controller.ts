import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ResultsService } from './results.service';

@Controller('hr')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('hr')
export class HrCandidatesController {
  constructor(private readonly results: ResultsService) {}

  @Get('candidates')
  candidatesByJob(
    @CurrentUser() user: JwtPayload,
    @Query('sort') sort?: string,
    @Query('band') band?: string,
    @Query('search') search?: string,
  ) {
    return this.results.candidatesByJob(user, { sort, band, search });
  }
}
