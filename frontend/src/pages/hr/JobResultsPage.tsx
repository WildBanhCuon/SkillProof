import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Share2, Trophy } from 'lucide-react';
import { api } from '../../api/client';
import type { CandidateRow, JobPosting, JobStats } from '../../api/types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DimensionRadar } from '../../components/charts/DimensionRadar';
import { bandLabel, bandVariant } from '../../utils/format';

const bands = [
  { id: '', label: 'All' },
  { id: 'ready_now', label: 'Ready now' },
  { id: 'trainable', label: 'Trainable' },
  { id: 'at_risk', label: 'At risk' },
];

export function JobResultsPage() {
  const { id: jobId } = useParams<{ id: string }>();
  const [band, setBand] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('score');

  const { data: job } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => api.get<JobPosting>(`/jobs/${jobId}`),
    enabled: !!jobId,
  });

  const { data: stats } = useQuery({
    queryKey: ['job', jobId, 'stats'],
    queryFn: () => api.get<JobStats>(`/jobs/${jobId}/stats`),
    enabled: !!jobId,
  });

  const { data: list, isLoading } = useQuery({
    queryKey: ['job', jobId, 'candidates', band, search, sort],
    queryFn: () => {
      const params = new URLSearchParams();
      if (sort) params.set('sort', sort);
      if (band) params.set('band', band);
      if (search) params.set('search', search);
      const q = params.toString();
      return api.get<{ jobId: string; candidates: CandidateRow[] }>(
        `/jobs/${jobId}/candidates${q ? `?${q}` : ''}`,
      );
    },
    enabled: !!jobId,
  });

  const candidates = list?.candidates ?? [];

  const shareUrl = jobId
    ? `${window.location.origin}/jobs/${jobId}`
    : '';

  return (
    <div>
      <p className="text-sm text-slate-500">
        <Link to="/hr/jobs" className="hover:text-indigo-600">
          Jobs
        </Link>{' '}
        / Results
      </p>
      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {job?.title ?? 'Job results'}
            </h1>
            <Badge variant="published">Published</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Ranked by verified assessment scores
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(shareUrl)}
          >
            <Share2 className="h-4 w-4" />
            Share posting
          </Button>
          <Link to={`/hr/jobs/${jobId}`}>
            <Button variant="outline" size="sm">
              View posting
            </Button>
          </Link>
        </div>
      </div>

      {stats && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Applications received', value: stats.applicationsReceived },
            { label: 'Verified matches', value: stats.verifiedMatches },
            { label: 'Top performers', value: stats.topPerformers },
            {
              label: 'Tests completed',
              value: stats.applicationsReceived,
            },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <p className="text-xs font-medium uppercase text-slate-500">
                {s.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{s.value}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {bands.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBand(b.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                band === b.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm"
              placeholder="Search candidates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="score">Highest score</option>
          </select>
        </div>
      </div>

      {isLoading && <p className="mt-8 text-slate-500">Loading candidates…</p>}

      <div className="mt-6 space-y-4">
        {candidates.map((c, idx) => (
          <Card
            key={c.applicationId}
            className={`p-6 ${idx === 0 ? 'ring-2 ring-emerald-200' : ''}`}
          >
            {idx === 0 && (
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-700">
                <Trophy className="h-4 w-4" />
                Top match
              </div>
            )}
            <div className="grid gap-6 lg:grid-cols-[1fr_auto_auto]">
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                  #{c.rank ?? idx + 1}
                </span>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                  {c.candidate.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">
                      {c.candidate.fullName}
                    </h3>
                    <Badge variant={bandVariant(c.recommendation)}>
                      {bandLabel(c.recommendation)}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">{c.candidate.email}</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Strengths
                      </p>
                      <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                        {c.strengths?.slice(0, 3).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Areas to improve
                      </p>
                      <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                        {c.improvements?.slice(0, 3).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-900">
                    {c.aiSummary}
                  </p>
                </div>
              </div>
              <DimensionRadar scores={c.dimensionScores ?? []} />
              <div className="text-center">
                <p
                  className={`text-4xl font-bold ${
                    c.overallScore >= 80
                      ? 'text-emerald-600'
                      : c.overallScore >= 60
                        ? 'text-slate-900'
                        : 'text-red-600'
                  }`}
                >
                  {c.overallScore}
                  <span className="text-lg text-slate-400">/100</span>
                </p>
                <p className="mt-2 text-sm text-slate-500">Overall score</p>
                <div className="mt-3 h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: `${c.matchPercent}%` }}
                  />
                </div>
                <p className="mt-1 text-sm font-medium text-indigo-600">
                  {c.matchPercent}% match
                </p>
                <Link
                  to={`/hr/jobs/${jobId}/candidates/${c.applicationId}`}
                  className="mt-4 inline-block"
                >
                  <Button variant="outline" size="sm">
                    View details →
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
        {!isLoading && candidates.length === 0 && (
          <Card className="p-8 text-center text-slate-500">
            No candidates yet. Share the posting so applicants can take the test.
          </Card>
        )}
      </div>
    </div>
  );
}
