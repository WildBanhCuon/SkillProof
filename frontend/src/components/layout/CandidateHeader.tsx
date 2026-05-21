import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';

export function CandidateHeader() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo to={isAuthenticated ? '/jobs' : '/'} />
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:inline">
                {user?.fullName}
              </span>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
