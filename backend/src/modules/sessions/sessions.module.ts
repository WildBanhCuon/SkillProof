import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { AssessmentsModule } from '../assessments/assessments.module';
import { SandboxModule } from '../sandbox/sandbox.module';
import { GRADING_QUEUE } from '../../workers/grading.constants';

@Module({
  imports: [
    AssessmentsModule,
    SandboxModule,
    BullModule.registerQueue({ name: GRADING_QUEUE }),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
