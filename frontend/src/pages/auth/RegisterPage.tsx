import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatAuthError } from '../../utils/errors';
import { useAuth } from '../../auth/AuthContext';
import type { UserRole } from '../../api/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

export function RegisterPage() {
  const { registerHr, registerCandidate } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('hr');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
    teamProfile: '',
    displayName: '',
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (role === 'hr') {
        await registerHr({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          companyName: form.companyName,
          teamProfile: form.teamProfile,
        });
        navigate('/hr/jobs');
      } else {
        await registerCandidate({
          email: form.email,
          password: form.password,
          displayName: form.displayName,
        });
        navigate('/jobs');
      }
    } catch (err) {
      setError(formatAuthError(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
      <p className="mt-1 text-sm text-slate-500">Join SkillProof to hire or apply with proof</p>

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
            {r === 'hr' ? 'Company / HR' : 'Candidate'}
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
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {role === 'hr' ? (
          <>
            <Input
              label="Full name"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <Input
              label="Company name"
              required
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
            <label className="block w-full">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                About your team and product
              </span>
              <textarea
                required
                minLength={10}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                value={form.teamProfile}
                onChange={(e) => setForm({ ...form, teamProfile: e.target.value })}
                placeholder="e.g. We are a 20-person SaaS team building a learning platform for enterprises."
              />
              <p className="mt-1 text-xs text-slate-500">
                Used as the default in job posting wizard — you can edit it anytime in your profile.
              </p>
            </label>
          </>
        ) : (
          <Input
            label="Display name"
            required
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          />
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
