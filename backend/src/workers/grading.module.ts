import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AiModule } from '../modules/ai/ai.module';
import { PrismaModule } from '../prisma/prisma.module';
import { GRADING_QUEUE } from './grading.constants';
import { GradingService } from '../grading/grading.service';
import { GradingProcessor } from './grading.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: GRADING_QUEUE }),
    PrismaModule,
    AiModule,
  ],
  providers: [GradingProcessor, GradingService],
  exports: [GradingService],
})
export class GradingModule {}
