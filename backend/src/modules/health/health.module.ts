import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { SandboxModule } from '../sandbox/sandbox.module';

@Module({
  imports: [SandboxModule],
  controllers: [HealthController],
})
export class HealthModule {}
