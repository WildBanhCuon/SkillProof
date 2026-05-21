import { api } from '../api/client';
import type { SessionResult } from '../api/types';

export async function pollSessionResult(
  sessionId: string,
  maxMs = 30000,
): Promise<SessionResult> {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    const res = await api.get<SessionResult>(`/sessions/${sessionId}/result`);
    if (res.status === 'evaluated') return res;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('Grading is taking longer than expected. Please refresh shortly.');
}
