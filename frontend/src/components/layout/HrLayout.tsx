import { Outlet } from 'react-router-dom';
import { HrNav } from './HrNav';

export function HrLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <HrNav />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
