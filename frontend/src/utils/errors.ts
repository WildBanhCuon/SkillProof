import { ApiError } from '../api/client';

const API_HINT = import.meta.env.VITE_API_URL ?? '/v1';

/** Turn any thrown value into a user-visible message with action context. */
export function formatApiError(error: unknown, action: string): string {
  if (error instanceof ApiError) {
    const prefix = error.status ? `${action} (HTTP ${error.status})` : action;
    const detail = error.message?.trim();
    return detail ? `${prefix}: ${detail}` : prefix;
  }

  if (error instanceof Error) {
    const msg = error.message?.trim() || error.name;
    if (
      msg === 'Failed to fetch' ||
      msg.includes('NetworkError') ||
      msg.includes('Load failed')
    ) {
      return `${action}: Cannot reach the API at ${API_HINT}. Start the backend (cd backend && npm run start:dev) and check VITE_API_URL in frontend/.env.`;
    }
    return `${action}: ${msg}`;
  }

  return `${action}: An unexpected error occurred.`;
}
