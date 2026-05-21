import { Outlet } from 'react-router-dom';
import { Logo } from '../../components/ui/Logo';
import { Card } from '../../components/ui/Card';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <Logo className="mb-8" />
      <Card className="w-full max-w-md p-8">
        <Outlet />
      </Card>
      <p className="mt-6 text-center text-sm text-slate-500">
        Junior Frontend Developer MVP · SkillProof
      </p>
    </div>
  );
}
