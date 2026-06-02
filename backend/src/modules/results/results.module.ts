import { Module } from '@nestjs/common';
import { HrCandidatesController } from './hr-candidates.controller';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';

@Module({
  controllers: [ResultsController, HrCandidatesController],
  providers: [ResultsService],
})
export class ResultsModule {}
