import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatAuthError } from '../../utils/errors';
import { useAuth } from '../../auth/AuthContext';
import type { UserRole } from '../../api/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('hr');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, role);
      navigate(role === 'hr' ? '/hr/jobs' : '/jobs');
    } catch (err) {
      setError(formatAuthError(err, 'Sign in failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
      <p className="mt-1 text-sm text-slate-500">Sign in to your SkillProof account</p>

      <div className="mt-6 flex rounded-lg border border-slate-200 p-1">
        {(['hr', 'candidate'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              role === r
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {r === 'hr' ? 'HR / Recruiter' : 'Candidate'}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4">
          <Alert onDismiss={() => setError('')}>{error}</Alert>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={role === 'hr' ? 'marion@acme.test' : 'sofiane@test.com'}
        />
        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password123!"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        No account?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:underline">
          Create one
        </Link>
      </p>
    </>
  );
}
