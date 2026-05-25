import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SaveAnswerDto, StartSessionDto } from './sessions.dto';
import { SessionsService } from './sessions.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Post('jobs/:jobId/sessions')
  @Roles('candidate')
  start(
    @CurrentUser() user: JwtPayload,
    @Param('jobId') jobId: string,
    @Body() dto: StartSessionDto,
  ) {
    return this.sessions.startSession(user, jobId, dto.mode);
  }

  @Patch('sessions/:sessionId/answers/:questionId')
  @Roles('candidate')
  saveAnswer(
    @CurrentUser() user: JwtPayload,
    @Param('sessionId') sessionId: string,
    @Param('questionId') questionId: string,
    @Body() dto: SaveAnswerDto,
  ) {
    return this.sessions.saveAnswer(
      user,
      sessionId,
      questionId,
      dto.submittedCode,
      dto.notes,
    );
  }

  @Post('sessions/:sessionId/submit')
  @Roles('candidate')
  @HttpCode(HttpStatus.ACCEPTED)
  submit(
    @CurrentUser() user: JwtPayload,
    @Param('sessionId') sessionId: string,
  ) {
    return this.sessions.submit(user, sessionId);
  }

  @Get('sessions/:sessionId/result')
  @Roles('candidate')
  result(
    @CurrentUser() user: JwtPayload,
    @Param('sessionId') sessionId: string,
  ) {
    return this.sessions.getResult(user, sessionId);
  }
}
