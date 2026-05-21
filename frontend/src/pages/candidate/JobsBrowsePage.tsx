import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import type { JobPosting } from '../../api/types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { markdownExcerpt } from '../../components/ui/MarkdownContent';

export function JobsBrowsePage() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['candidate', 'jobs'],
    queryFn: () => api.get<JobPosting[]>('/jobs'),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Open positions</h1>
      <p className="mt-1 text-slate-500">
        Apply with a skill-based assessment — prove what you can do
      </p>

      {isLoading && <p className="mt-8 text-slate-500">Loading…</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {jobs.map((job) => (
          <Link key={job.id} to={`/jobs/${job.id}`}>
            <Card className="h-full p-6 transition-shadow hover:shadow-md">
              <Badge variant="published">Open</Badge>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">
                {job.title}
              </h2>
              <p className="mt-1 text-sm text-indigo-600">
                {job.company?.name ?? 'Company'}
              </p>
              <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                {markdownExcerpt(job.description)}
              </p>
              {job.assessment && (
                <p className="mt-4 text-xs text-slate-500">
                  {job.assessment.durationMinutes} min ·{' '}
                  {job.assessment.questions?.length ?? 0} questions
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {!isLoading && jobs.length === 0 && (
        <Card className="mt-8 p-8 text-center text-slate-500">
          No published jobs right now. Check back soon.
        </Card>
      )}
    </div>
  );
}
