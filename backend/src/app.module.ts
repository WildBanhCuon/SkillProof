import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { ResultsModule } from './modules/results/results.module';
import { AiModule } from './modules/ai/ai.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { createBullRedisOptions } from './config/bull-redis.config';
import { GradingModule } from './workers/grading.module';
import { CandidateModule } from './modules/candidate/candidate.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: createBullRedisOptions(config),
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    AiModule,
    JobsModule,
    AssessmentsModule,
    SessionsModule,
    ResultsModule,
    CandidateModule,
    GradingModule,
  ],
})
export class AppModule {}
