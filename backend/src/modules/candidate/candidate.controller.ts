import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateCandidateProfileDto } from './candidate-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/auth.types';
import { CandidateService } from './candidate.service';

@Controller('candidate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('candidate')
export class CandidateController {
  constructor(private readonly candidate: CandidateService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.candidate.getProfile(user);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateCandidateProfileDto,
  ) {
    return this.candidate.updateProfile(user, dto);
  }

  @Get('applications')
  listApplications(@CurrentUser() user: JwtPayload) {
    return this.candidate.listApplications(user);
  }

  @Get('applications/:sessionId')
  getApplication(
    @CurrentUser() user: JwtPayload,
    @Param('sessionId') sessionId: string,
  ) {
    return this.candidate.getApplication(user, sessionId);
  }
}
