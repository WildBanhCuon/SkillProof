import { Outlet } from 'react-router-dom';
import { Logo } from '../../components/ui/Logo';
import { Card } from '../../components/ui/Card';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Logo className="mb-8" size="lg" />
      <Card className="w-full max-w-md p-8">
        <Outlet />
      </Card>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        SkillProof · Hire with evidence, not guesswork
      </p>
    </div>
  );
}
