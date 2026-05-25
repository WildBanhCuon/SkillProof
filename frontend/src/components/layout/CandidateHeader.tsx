import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

const nav = [
  { to: '/jobs', label: 'Browse jobs' },
  { to: '/my-applications', label: 'My applications' },
  { to: '/profile', label: 'Profile' },
];

export function CandidateHeader() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo to={isAuthenticated ? '/my-applications' : '/'} />
          {isAuthenticated && (
            <nav className="hidden items-center gap-1 sm:flex">
              {nav.map((item) => {
                const active =
                  item.to === '/jobs'
                    ? location.pathname === '/jobs' ||
                      /^\/jobs\/[^/]+$/.test(location.pathname)
                    : item.to === '/profile'
                      ? location.pathname.startsWith('/profile')
                      : location.pathname.startsWith('/my-applications');
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 hover:text-slate-900 dark:hover:text-slate-100 dark:text-slate-100 dark:text-slate-400 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-600 dark:text-slate-300 dark:text-slate-400 dark:text-slate-500 sm:inline">
                {user?.fullName}
              </span>
              <ThemeToggle />
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
