import { ConfigService } from '@nestjs/config';

/**
 * Bull/ioredis options for Render and local Docker Redis.
 * `maxRetriesPerRequest: null` is required by Bull (avoids MaxRetriesPerRequestError).
 * Do not set `enableOfflineQueue: false` — Bull's worker issues commands at startup
 * before the socket is ready and will crash the process if the offline queue is off.
 */
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
  };
}
