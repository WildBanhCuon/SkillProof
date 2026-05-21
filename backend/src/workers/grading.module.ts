import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { GradingProcessor } from './grading.processor';
import { GRADING_QUEUE } from './grading.constants';
import { AiModule } from '../modules/ai/ai.module';
import { SandboxModule } from '../modules/sandbox/sandbox.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: GRADING_QUEUE }),
    AiModule,
    SandboxModule,
  ],
  providers: [GradingProcessor],
})
export class GradingModule {}
