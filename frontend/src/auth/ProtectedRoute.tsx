import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { UserRole } from '../api/types';

export function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: UserRole;
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500 dark:text-slate-400 dark:text-slate-500">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return (
      <Navigate
        to={user?.role === 'hr' ? '/hr/jobs' : '/jobs'}
        replace
      />
    );
  }

  return <>{children}</>;
}
