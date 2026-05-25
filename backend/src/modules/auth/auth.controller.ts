import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CandidateRegisterDto,
  HrRegisterDto,
  LoginDto,
  LogoutDto,
  RefreshDto,
} from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from './auth.types';
import { UpdateCompanyProfileDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('hr/register')
  registerHr(@Body() dto: HrRegisterDto) {
    return this.auth.registerHr(dto);
  }

  @Post('candidate/register')
  registerCandidate(@Body() dto: CandidateRegisterDto) {
    return this.auth.registerCandidate(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Body() dto: LogoutDto) {
    await this.auth.logout(dto.refreshToken);
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: JwtPayload) {
    return this.auth.me(user);
  }

  @Patch('company-profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hr')
  updateCompanyProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateCompanyProfileDto,
  ) {
    return this.auth.updateCompanyProfile(user, dto);
  }
}
