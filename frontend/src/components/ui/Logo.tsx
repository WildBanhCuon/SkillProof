import { Link } from 'react-router-dom';

export function Logo({
  to = '/',
  className = '',
}: {
  to?: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 font-semibold text-slate-900 ${className}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
        S
      </span>
      SkillProof
    </Link>
  );
}
