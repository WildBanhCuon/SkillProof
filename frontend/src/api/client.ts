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

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data === 'object' && data && 'message' in data) {
      const msg = (data as { message: string | string[] }).message;
      return Array.isArray(msg) ? msg.join(', ') : msg;
    }
  } catch {
    /* ignore */
  }
  return res.statusText || `Request failed (${res.status})`;
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
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return apiRequest<T>(path, options, false);
    onUnauthorized();
    throw new ApiError('Session expired', 401);
  }

  if (!res.ok) {
    throw new ApiError(await parseError(res), res.status, await res.text());
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
};
