import { Module } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [AssessmentsService],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}
