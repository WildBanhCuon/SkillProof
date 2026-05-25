import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api, configureApiClient } from '../api/client';
import type { AuthTokens, AuthUser, UserRole } from '../api/types';

const STORAGE_KEY = 'skillproof_auth';

interface StoredAuth {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<void>;
  registerHr: (data: {
    email: string;
    password: string;
    fullName: string;
    companyName: string;
    teamProfile: string;
  }) => Promise<void>;
  refreshUser: () => Promise<void>;
  registerCandidate: (data: {
    email: string;
    password: string;
    displayName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStored(): StoredAuth | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

function saveStored(tokens: StoredAuth | null) {
  if (tokens) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  else sessionStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokensState] = useState<StoredAuth | null>(loadStored);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const setTokens = useCallback((t: StoredAuth | null) => {
    setTokensState(t);
    saveStored(t);
  }, []);

  const fetchMe = useCallback(async () => {
    if (!tokens?.accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api.get<AuthUser>('/auth/me');
      setUser(me);
    } catch {
      setTokens(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [tokens?.accessToken, setTokens]);

  useEffect(() => {
    configureApiClient({
      getAccessToken: () => tokens?.accessToken ?? null,
      getRefreshToken: () => tokens?.refreshToken ?? null,
      setTokens: (t) => {
        const current = loadStored();
        setTokens({
          accessToken: t.accessToken,
          refreshToken: t.refreshToken ?? current?.refreshToken ?? '',
        });
      },
      onUnauthorized: () => {
        setTokens(null);
        setUser(null);
      },
    });
    fetchMe();
  }, [tokens?.accessToken, fetchMe, setTokens]);

  const applyTokens = async (auth: AuthTokens) => {
    setTokens({
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
    });
    const me = await api.get<AuthUser>('/auth/me');
    setUser(me);
  };

  const login = async (email: string, password: string, role: UserRole) => {
    setTokens(null);
    setUser(null);
    const auth = await api.post<AuthTokens>('/auth/login', {
      email,
      password,
      role,
    });
    await applyTokens(auth);
  };

  const refreshUser = useCallback(async () => {
    if (!tokens?.accessToken) return;
    const me = await api.get<AuthUser>('/auth/me');
    setUser(me);
  }, [tokens?.accessToken]);

  const registerHr = async (data: {
    email: string;
    password: string;
    fullName: string;
    companyName: string;
    teamProfile: string;
  }) => {
    setTokens(null);
    setUser(null);
    const auth = await api.post<AuthTokens>('/auth/hr/register', data);
    await applyTokens(auth);
  };

  const registerCandidate = async (data: {
    email: string;
    password: string;
    displayName: string;
  }) => {
    setTokens(null);
    setUser(null);
    const auth = await api.post<AuthTokens>('/auth/candidate/register', data);
    await applyTokens(auth);
  };

  const logout = async () => {
    try {
      if (tokens?.refreshToken) {
        await api.post('/auth/logout', { refreshToken: tokens.refreshToken });
      }
    } catch {
      /* ignore */
    }
    setTokens(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      registerHr,
      registerCandidate,
      logout,
      refreshUser,
      isAuthenticated: !!user,
    }),
    [user, loading, refreshUser],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
