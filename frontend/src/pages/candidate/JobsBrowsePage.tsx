import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '../../api/client';
import type { CandidateApplicationItem, JobPosting } from '../../api/types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { markdownExcerpt } from '../../components/ui/MarkdownContent';

interface PublishedJobsResponse {
  items: JobPosting[];
  companies: string[];
  total: number;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title_asc', label: 'Title A–Z' },
  { value: 'title_desc', label: 'Title Z–A' },
  { value: 'duration_asc', label: 'Shortest test' },
  { value: 'duration_desc', label: 'Longest test' },
] as const;

export function JobsBrowsePage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('');
  const [sort, setSort] = useState<string>('newest');

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['candidate', 'jobs', search, company, sort],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (company) params.set('company', company);
      if (sort) params.set('sort', sort);
      const q = params.toString();
      return api.get<PublishedJobsResponse>(
        `/jobs${q ? `?${q}` : ''}`,
      );
    },
  });

  const jobs = data?.items ?? [];
  const companies = data?.companies ?? [];
  const hasFilters = !!search || !!company || sort !== 'newest';

  const { data: myApplications } = useQuery({
    queryKey: ['candidate', 'applications'],
    queryFn: () => api.get<{ items: CandidateApplicationItem[] }>('/candidate/applications'),
  });

  const appliedJobIds = useMemo(() => {
    const set = new Set<string>();
    for (const a of myApplications?.items ?? []) {
      if (a.sessionType === 'application' && a.applicationStatus !== 'expired') {
        set.add(a.jobId);
      }
    }
    return set;
  }, [myApplications]);

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setCompany('');
    setSort('newest');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Open positions</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400 dark:text-slate-500">
        Apply with a skill-based assessment — prove what you can do
      </p>

      <Card className="mt-6 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <SlidersHorizontal className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          Find a role
        </div>
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="search"
              placeholder="Search title, company, or description…"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 py-2 pl-9 pr-3 text-sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <select
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            aria-label="Filter by company"
          >
            <option value="">All companies</option>
            {companies.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort jobs"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {hasFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
        {!isLoading && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
            {isFetching ? 'Updating…' : `${data?.total ?? 0} position${(data?.total ?? 0) === 1 ? '' : 's'}`}
          </p>
        )}
      </Card>

      {isLoading && <p className="mt-8 text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading…</p>}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {jobs.map((job) => (
          <Link key={job.id} to={`/jobs/${job.id}`}>
            <Card className="h-full p-6 transition-shadow hover:shadow-md">
              <div className="flex flex-wrap gap-2">
                <Badge variant="published">Open</Badge>
                {appliedJobIds.has(job.id) && <Badge variant="info">Applied</Badge>}
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {job.title}
              </h2>
              <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-400">
                {job.company?.name ?? 'Company'}
              </p>
              <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                {markdownExcerpt(job.description)}
              </p>
              {job.assessment && (
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  {job.assessment.durationMinutes} min ·{' '}
                  {job.assessment.questionCount ??
                    job.assessment.questions?.length ??
                    0}{' '}
                  questions
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {!isLoading && jobs.length === 0 && (
        <Card className="mt-8 p-8 text-center text-slate-500 dark:text-slate-400 dark:text-slate-500">
          {hasFilters ? (
            <>
              No jobs match your filters.{' '}
              <button
                type="button"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </>
          ) : (
            'No published jobs right now. Check back soon.'
          )}
        </Card>
      )}
    </div>
  );
}
