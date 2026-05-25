import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import {
  candidatesNavPath,
  isHrCandidatesNavActive,
  isHrJobsNavActive,
} from '../../utils/hrNav';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export function HrNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const candidatesTo = candidatesNavPath(pathname);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo to="/hr/jobs" />
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink
            to="/hr/jobs"
            className={linkClass({
              isActive: isHrJobsNavActive(pathname),
            })}
          >
            Jobs
          </NavLink>
          <NavLink
            to={candidatesTo}
            className={linkClass({
              isActive: isHrCandidatesNavActive(pathname),
            })}
          >
            Candidates
          </NavLink>
          <span className="cursor-not-allowed rounded-lg px-3 py-2 text-sm text-slate-400">
            Tests
          </span>
          <span className="cursor-not-allowed rounded-lg px-3 py-2 text-sm text-slate-400">
            Analytics
          </span>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">{user?.fullName}</p>
            <p className="text-xs text-slate-500">HR Manager</p>
          </div>
          <Link
            to="/hr/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 hover:bg-indigo-200"
            title="Company profile"
          >
            {initials ?? 'HR'}
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
