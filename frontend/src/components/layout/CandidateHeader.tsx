import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { CandidateNotificationBell } from '../candidate/CandidateNotificationBell';

const nav = [
  { to: '/jobs', label: 'Browse jobs' },
  { to: '/my-applications', label: 'My applications' },
  { to: '/profile', label: 'Profile' },
];

function navLinkClass(active: boolean) {
  return `shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
  }`;
}

function isNavActive(pathname: string, to: string) {
  if (to === '/jobs') {
    return pathname === '/jobs' || /^\/jobs\/[^/]+$/.test(pathname);
  }
  if (to === '/profile') return pathname.startsWith('/profile');
  return pathname.startsWith('/my-applications');
}

export function CandidateHeader() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8">
          <Logo to={isAuthenticated ? '/my-applications' : '/'} />
          {isAuthenticated && (
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={navLinkClass(isNavActive(location.pathname, item.to))}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="hidden text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 sm:inline"
                title="Edit profile"
              >
                {user?.fullName}
              </Link>
              <ThemeToggle />
              <CandidateNotificationBell initials={initials} />
              <Button variant="ghost" size="sm" onClick={() => logout()} aria-label="Log out">
                <LogOut className="h-4 w-4" />
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
      {isAuthenticated && (
        <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden dark:border-slate-800">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={navLinkClass(isNavActive(location.pathname, item.to))}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
