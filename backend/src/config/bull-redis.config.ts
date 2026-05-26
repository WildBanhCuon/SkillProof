import { ConfigService } from '@nestjs/config';

/** Bull/ioredis settings that fail fast when Redis is unreachable (avoids hanging HTTP requests). */
export function createBullRedisOptions(
  config: ConfigService,
): Record<string, unknown> {
  const url = config.get<string>('REDIS_URL', 'redis://localhost:6379');
  const parsed = new URL(url);
  const isTls = url.startsWith('rediss://');

  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    password: parsed.password
      ? decodeURIComponent(parsed.password)
      : undefined,
    ...(isTls ? { tls: { rejectUnauthorized: false } } : {}),
    connectTimeout: 10_000,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    enableOfflineQueue: false,
    retryStrategy: (times: number) => {
      if (times > 3) return null;
      return Math.min(times * 500, 2000);
    },
  };
}
