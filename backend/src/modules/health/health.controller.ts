import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    let db = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      db = 'error';
    }
    const status = db === 'ok' ? 'ok' : 'degraded';
    return {
      status,
      service: 'skillproof-api',
      version: '0.1.0',
      checks: { database: db },
    };
  }
}
