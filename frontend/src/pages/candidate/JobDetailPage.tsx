import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { formatApiError } from '../../utils/errors';
import type { JobPosting, TestSession } from '../../api/types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { MarkdownContent } from '../../components/ui/MarkdownContent';

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id, 'public'],
    queryFn: () => api.get<JobPosting>(`/jobs/${id}`),
    enabled: !!id,
  });

  const startSession = async (mode: 'practice' | 'application') => {
    if (!id) return;
    setError('');
    setLoading(mode);
    try {
      const session = await api.post<TestSession>(`/jobs/${id}/sessions`, {
        mode,
      });
      navigate(`/sessions/${session.id}`, { state: { session } });
    } catch (e) {
      setError(formatApiError(e, 'Start assessment session'));
    } finally {
      setLoading('');
    }
  };

  if (isLoading || !job) {
    return <p className="text-slate-500">Loading job…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/jobs" className="text-sm text-indigo-600 hover:underline">
        ← All jobs
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">{job.title}</h1>
      <p className="text-lg text-indigo-600">{job.company?.name}</p>

      {error && (
        <div className="mt-4">
          <Alert onDismiss={() => setError('')}>{error}</Alert>
        </div>
      )}

      <Card className="mt-6 p-6">
        <MarkdownContent content={job.description} />
      </Card>

      {job.assessment && (
        <p className="mt-4 text-sm text-slate-500">
          Assessment: {job.assessment.durationMinutes} minutes ·{' '}
          {job.assessment.totalPoints} points
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="flex-1"
          disabled={!!loading}
          onClick={() => startSession('practice')}
        >
          {loading === 'practice' ? 'Starting…' : 'Practice test'}
        </Button>
        <Button
          className="flex-1"
          disabled={!!loading}
          onClick={() => startSession('application')}
        >
          {loading === 'application' ? 'Starting…' : 'Apply — take assessment'}
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">
        Practice results are private. Apply submits your score to the employer.
      </p>
    </div>
  );
}
