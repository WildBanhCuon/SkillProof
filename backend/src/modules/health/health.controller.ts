import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Judge0Service } from '../sandbox/judge0.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly judge0: Judge0Service,
  ) {}

  @Get()
  async check() {
    let db = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      db = 'error';
    }
    const judge0 = await this.judge0.ping();
    const status = db === 'ok' ? 'ok' : 'degraded';
    return {
      status,
      service: 'skillproof-api',
      version: '0.1.0',
      checks: { database: db, judge0 },
    };
  }
}
