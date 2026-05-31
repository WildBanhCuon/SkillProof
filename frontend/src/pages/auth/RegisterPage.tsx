import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatAuthError } from '../../utils/errors';
import { useAuth } from '../../auth/AuthContext';
import type { UserRole } from '../../api/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

export function RegisterPage() {
  const { registerCandidate } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('hr');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (role === 'hr') {
        navigate('/register/company');
        return;
      }
      await registerCandidate({ email, password });
      navigate('/profile?onboarding=1');
    } catch (err) {
      setError(formatAuthError(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create account</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Sign up with email and password — you&apos;ll add profile details right after.
      </p>

      <div className="mt-6 flex rounded-lg border border-slate-200 p-1 dark:border-slate-700">
        {(['hr', 'candidate'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              role === r
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {r === 'hr' ? 'Company / HR' : 'Candidate'}
          </button>
        ))}
      </div>

      {role === 'hr' && (
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Company accounts choose a plan and complete checkout first.{' '}
          <Link
            to="/register/company"
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Continue to company signup →
          </Link>
        </p>
      )}

      {error && (
        <div className="mt-4">
          <Alert onDismiss={() => setError('')}>{error}</Alert>
        </div>
      )}

      {role === 'candidate' ? (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>
        </form>
      ) : (
        <div className="mt-6">
          <Link to="/register/company">
            <Button className="w-full">Choose a plan & sign up</Button>
          </Link>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Sign in
        </Link>
      </p>
    </>
  );
}
