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
import { GradingModule } from './workers/grading.module';
import { CandidateModule } from './modules/candidate/candidate.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        // Bull uses ioredis under the hood. Render-managed Redis is often `rediss://...`
        // (TLS) and may require an insecure cert skip in some environments.
        redis: (() => {
          const url = config.get<string>('REDIS_URL', 'redis://localhost:6379');
          const isTls = url.startsWith('rediss://');
          return {
            url,
            ...(isTls
              ? {
                  tls: {
                    rejectUnauthorized: false,
                  },
                }
              : {}),
            // Default ioredis max is 20; Render cold starts / brief network glitches
            // can otherwise surface as a hard 500.
            maxRetriesPerRequest: 50,
          };
        })(),
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
