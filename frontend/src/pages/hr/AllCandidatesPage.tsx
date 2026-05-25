import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Search, Users } from 'lucide-react';
import { api } from '../../api/client';
import type { CandidateRow } from '../../api/types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { HrCandidateCard } from '../../components/hr/HrCandidateCard';
import { statusLabel, statusVariant } from '../../utils/format';

const bands = [
  { id: '', label: 'All' },
  { id: 'ready_now', label: 'Ready now' },
  { id: 'trainable', label: 'Trainable' },
  { id: 'at_risk', label: 'At risk' },
];

interface JobCandidateGroup {
  jobId: string;
  title: string;
  status: string;
  publishedAt: string | null;
  candidateCount: number;
  candidates: CandidateRow[];
}

interface CandidatesByJobResponse {
  totalCandidates: number;
  jobs: JobCandidateGroup[];
}

export function AllCandidatesPage() {
  const [band, setBand] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('score');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['hr', 'candidates-by-job', band, search, sort],
    queryFn: () => {
      const params = new URLSearchParams();
      if (sort) params.set('sort', sort);
      if (band) params.set('band', band);
      if (search.trim()) params.set('search', search.trim());
      const q = params.toString();
      return api.get<CandidatesByJobResponse>(
        `/hr/candidates${q ? `?${q}` : ''}`,
      );
    },
  });

  const toggleJob = (jobId: string) => {
    setCollapsed((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const jobs = data?.jobs ?? [];
  const jobsWithCandidates = jobs.filter((j) => j.candidateCount > 0);
  const emptyJobs = jobs.filter((j) => j.candidateCount === 0);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">All candidates</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
            Applications grouped by job posting, ranked by assessment score.
          </p>
        </div>
        {data && (
          <Card className="flex items-center gap-3 px-4 py-3">
            <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {data.totalCandidates}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">verified applicants</p>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="search"
            placeholder="Search by candidate name…"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 py-2 pl-9 pr-3 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {bands.map((b) => (
            <button
              key={b.id || 'all'}
              type="button"
              onClick={() => setBand(b.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                band === b.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
        <select
          className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="score">Sort by score</option>
        </select>
      </div>

      {isLoading && (
        <p className="mt-8 text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading candidates…</p>
      )}

      {!isLoading && jobsWithCandidates.length === 0 && emptyJobs.length === 0 && (
        <Card className="mt-8 p-8 text-center text-slate-500 dark:text-slate-400 dark:text-slate-500">
          No published job postings yet.{' '}
          <Link to="/hr/jobs" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Create a job
          </Link>{' '}
          to start receiving applications.
        </Card>
      )}

      {!isLoading &&
        jobsWithCandidates.length === 0 &&
        emptyJobs.length > 0 &&
        !search &&
        !band && (
          <Card className="mt-8 p-8 text-center text-slate-500 dark:text-slate-400 dark:text-slate-500">
            No graded applications yet across your active postings.
          </Card>
        )}

      <div className="mt-8 space-y-10">
        {jobsWithCandidates.map((job) => {
          const isCollapsed = collapsed[job.jobId];
          return (
            <section key={job.jobId}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
                <button
                  type="button"
                  onClick={() => toggleJob(job.jobId)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
                  )}
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {job.title}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
                      {job.candidateCount}{' '}
                      {job.candidateCount === 1 ? 'candidate' : 'candidates'}
                      {job.publishedAt &&
                        ` · Published ${new Date(job.publishedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(job.status.toUpperCase())}>
                    {statusLabel(job.status.toUpperCase())}
                  </Badge>
                  <Link to={`/hr/jobs/${job.jobId}/results`}>
                    <Button variant="outline" size="sm">
                      Full results
                    </Button>
                  </Link>
                </div>
              </div>

              {!isCollapsed && (
                <div className="mt-4 space-y-4">
                  {job.candidates.map((c, idx) => (
                    <HrCandidateCard
                      key={c.applicationId}
                      jobId={job.jobId}
                      candidate={c}
                      listIndex={idx}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}

        {!isLoading && emptyJobs.length > 0 && !search && !band && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 dark:text-slate-500">
              Postings without applicants yet
            </h2>
            <ul className="mt-3 space-y-2">
              {emptyJobs.map((job) => (
                <li key={job.jobId}>
                  <Card className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{job.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">No applications yet</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={statusVariant(job.status.toUpperCase())}>
                        {statusLabel(job.status.toUpperCase())}
                      </Badge>
                      <Link to={`/hr/jobs/${job.jobId}`}>
                        <Button variant="outline" size="sm">
                          View posting
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
