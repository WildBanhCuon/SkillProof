import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { GradingService } from '../grading/grading.service';
import { GRADING_QUEUE } from './grading.constants';

@Processor(GRADING_QUEUE)
export class GradingProcessor {
  private readonly logger = new Logger(GradingProcessor.name);

  constructor(
    private readonly grading: GradingService,
    private readonly prisma: PrismaService,
  ) {}

  @Process('grade-session')
  async handle(job: Job<{ sessionId: string }>) {
    const { sessionId } = job.data;
    this.logger.log(`Grading session ${sessionId}`);

    try {
      await this.grading.gradeSession(sessionId);
    } catch (err) {
      this.logger.error(`Grading failed for ${sessionId}`, err);
      await this.prisma.testSession.update({
        where: { id: sessionId },
        data: { status: 'SUBMITTED' },
      });
      throw err;
    }
  }
}
