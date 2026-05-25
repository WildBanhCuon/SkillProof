import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { formatApiError } from '../../utils/errors';

export function DeleteAccountSection({
  role,
}: {
  role: 'hr' | 'candidate';
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/delete-account', { password });
      await logout();
      navigate('/', { replace: true });
    } catch (err) {
      setError(formatApiError(err, 'Delete account'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-8 border-red-200 dark:border-red-900/60">
      <div className="border-b border-red-100 px-6 py-4 dark:border-red-900/40">
        <h2 className="font-semibold text-red-800 dark:text-red-300">Delete account</h2>
        <p className="mt-1 text-sm text-red-700/90 dark:text-red-300/80">
          {role === 'hr'
            ? 'Permanently removes your account. If you are the only user at your company, all job postings and candidate data for that company are deleted too.'
            : 'Permanently removes your account, applications, and assessment history. This cannot be undone.'}
        </p>
      </div>

      <div className="p-6">
        {!open ? (
          <Button
            type="button"
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
            onClick={() => setOpen(true)}
          >
            Delete my account
          </Button>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <Alert variant="error">
              This action is permanent. Enter your password to confirm.
            </Alert>
            {error && <Alert onDismiss={() => setError('')}>{error}</Alert>}
            <Input
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={loading || !password}
                className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting…' : 'Yes, delete my account'}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => {
                  setOpen(false);
                  setPassword('');
                  setError('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
