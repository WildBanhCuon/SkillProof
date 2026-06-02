import { Outlet } from 'react-router-dom';
import { CandidateHeader } from './CandidateHeader';

export function CandidateLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <CandidateHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
