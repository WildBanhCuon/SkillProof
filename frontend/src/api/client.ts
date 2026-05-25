const API_URL = import.meta.env.VITE_API_URL ?? '/v1';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type TokenGetter = () => string | null;
type TokenSetter = (tokens: { accessToken: string; refreshToken?: string }) => void;
type LogoutFn = () => void;

let getAccessToken: TokenGetter = () => null;
let getRefreshToken: TokenGetter = () => null;
let setTokens: TokenSetter = () => {};
let onUnauthorized: LogoutFn = () => {};

export function configureApiClient(config: {
  getAccessToken: TokenGetter;
  getRefreshToken: TokenGetter;
  setTokens: TokenSetter;
  onUnauthorized: LogoutFn;
}) {
  getAccessToken = config.getAccessToken;
  getRefreshToken = config.getRefreshToken;
  setTokens = config.setTokens;
  onUnauthorized = config.onUnauthorized;
}

type NestErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

async function parseErrorResponse(
  res: Response,
): Promise<{ message: string; body: unknown }> {
  const text = await res.text();
  let body: unknown = text;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      /* plain text body */
    }
  }

  if (typeof body === 'object' && body !== null) {
    const data = body as NestErrorBody;
    if (data.message) {
      const msg = Array.isArray(data.message)
        ? data.message.join('; ')
        : data.message;
      if (msg.trim()) return { message: msg.trim(), body };
    }
    if (typeof data.error === 'string' && data.error.trim()) {
      return { message: data.error.trim(), body };
    }
  }

  if (typeof body === 'string' && body.trim()) {
    return { message: body.trim(), body };
  }

  const fallback = res.statusText?.trim() || `HTTP ${res.status}`;
  return { message: fallback, body };
}

/** Routes that must not send a stale Bearer token or trigger session refresh. */
function isPublicAuthPath(path: string): boolean {
  return (
    path === '/auth/login' ||
    path === '/auth/hr/register' ||
    path === '/auth/candidate/register' ||
    path === '/auth/refresh' ||
    path === '/auth/generate-team-profile-from-website'
  );
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as {
    accessToken: string;
    refreshToken?: string;
  };
  setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? refreshToken,
  });
  return true;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getAccessToken();
  const publicAuth = isPublicAuthPath(path);
  if (token && !publicAuth) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && retry && !publicAuth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return apiRequest<T>(path, options, false);
    onUnauthorized();
    throw new ApiError(
      'Your session has expired. Please sign in again.',
      401,
    );
  }

  if (!res.ok) {
    const { message, body } = await parseErrorResponse(res);
    throw new ApiError(message, res.status, body);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => apiRequest<T>(path, { method: 'DELETE' }),
};
