import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Archive, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import type { JobPosting } from '../../api/types';
import { Button } from '../ui/Button';
import { formatApiError } from '../../utils/errors';

export function JobPostingActions({
  job,
  size = 'sm',
  onError,
  redirectAfterDelete = false,
}: {
  job: JobPosting;
  size?: 'sm' | 'md';
  onError?: (message: string) => void;
  redirectAfterDelete?: boolean;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState<'archive' | 'delete' | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['hr', 'jobs'] });
    queryClient.invalidateQueries({ queryKey: ['job', job.id] });
  };

  const archive = async () => {
    if (
      !window.confirm(
        `Archive "${job.title}"?\n\nCandidates will no longer see this posting or apply. Existing applications and results are kept.`,
      )
    ) {
      return;
    }
    setBusy('archive');
    try {
      await api.post(`/jobs/${job.id}/archive`);
      invalidate();
    } catch (e) {
      onError?.(formatApiError(e, 'Archive job'));
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (
      !window.confirm(
        `Delete "${job.title}" permanently?\n\nThis cannot be undone.`,
      )
    ) {
      return;
    }
    setBusy('delete');
    try {
      await api.delete(`/jobs/${job.id}`);
      invalidate();
      if (redirectAfterDelete) {
        navigate('/hr/jobs');
      }
    } catch (e) {
      onError?.(formatApiError(e, 'Delete job'));
    } finally {
      setBusy(null);
    }
  };

  const canArchive = job.status === 'PUBLISHED';
  const canDelete = job.status !== 'PUBLISHED';

  if (!canArchive && !canDelete) return null;

  return (
    <>
      {canArchive && (
        <Button
          variant="outline"
          size={size}
          disabled={!!busy}
          onClick={archive}
        >
          <Archive className="h-4 w-4" />
          {busy === 'archive' ? 'Archiving…' : 'Archive'}
        </Button>
      )}
      {canDelete && (
        <Button
          variant="outline"
          size={size}
          disabled={!!busy}
          onClick={remove}
          className="text-red-700 dark:text-red-300 hover:bg-red-50 dark:bg-red-950/40 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
          {busy === 'delete' ? 'Deleting…' : 'Delete'}
        </Button>
      )}
    </>
  );
}
