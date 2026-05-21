import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { api } from '../../api/client';
import type { JobPosting } from '../../api/types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { statusLabel, statusVariant } from '../../utils/format';

export function JobsListPage() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['hr', 'jobs'],
    queryFn: () => api.get<JobPosting[]>('/jobs'),
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jobs</h1>
          <p className="text-sm text-slate-500">Manage postings and review candidates</p>
        </div>
        <Link to="/hr/jobs/new">
          <Button>
            <Plus className="h-4 w-4" />
            New posting
          </Button>
        </Link>
      </div>

      {isLoading && (
        <p className="mt-8 text-slate-500">Loading jobs…</p>
      )}

      <div className="mt-6 space-y-3">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-slate-900">{job.title}</h2>
                <Badge variant={statusVariant(job.status)}>
                  {statusLabel(job.status)}
                </Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {job.description.slice(0, 120)}…
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link to={`/hr/jobs/${job.id}`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
              {job.status === 'PUBLISHED' && (
                <Link to={`/hr/jobs/${job.id}/results`}>
                  <Button size="sm">View results</Button>
                </Link>
              )}
            </div>
          </Card>
        ))}
        {!isLoading && jobs.length === 0 && (
          <Card className="p-8 text-center text-slate-500">
            No jobs yet. Create your first posting.
          </Card>
        )}
      </div>
    </div>
  );
}
