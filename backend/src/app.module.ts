import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { ResultsModule } from './modules/results/results.module';
import { AiModule } from './modules/ai/ai.module';
import { SandboxModule } from './modules/sandbox/sandbox.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { GradingModule } from './workers/grading.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: config.get<string>('REDIS_URL', 'redis://localhost:6379'),
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    AiModule,
    SandboxModule,
    JobsModule,
    AssessmentsModule,
    SessionsModule,
    ResultsModule,
    GradingModule,
  ],
})
export class AppModule {}
