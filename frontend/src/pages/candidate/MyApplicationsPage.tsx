import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ClipboardList, Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import type { CandidateApplicationItem } from '../../api/types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  applicationStatusLabel,
  applicationStatusVariant,
} from '../../utils/format';

type Filter = 'all' | 'application' | 'practice';

function actionFor(item: CandidateApplicationItem) {
  if (
    item.applicationStatus === 'in_progress' ||
    item.applicationStatus === 'practice_in_progress'
  ) {
    return { label: 'Continue test', to: `/sessions/${item.sessionId}` };
  }
  if (item.hasResult) {
    return {
      label: 'View results',
      to: `/sessions/${item.sessionId}/result`,
      state: { sessionType: item.sessionType },
    };
  }
  if (item.applicationStatus === 'under_review') {
    return { label: 'View details', to: `/my-applications/${item.sessionId}` };
  }
  return { label: 'View details', to: `/my-applications/${item.sessionId}` };
}

export function MyApplicationsPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['candidate', 'applications'],
    queryFn: () =>
      api.get<{ items: CandidateApplicationItem[] }>('/candidate/applications'),
  });

  const items = useMemo(() => {
    const list = data?.items ?? [];
    if (filter === 'all') return list;
    return list.filter((i) => i.sessionType === filter);
  }, [data?.items, filter]);

  const counts = useMemo(() => {
    const list = data?.items ?? [];
    return {
      all: list.length,
      application: list.filter((i) => i.sessionType === 'application').length,
      practice: list.filter((i) => i.sessionType === 'practice').length,
    };
  }, [data?.items]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My applications</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track job applications and practice tests you have started.
          </p>
        </div>
        <Link to="/jobs">
          <Button variant="outline">Browse jobs</Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ['all', 'All'],
            ['application', 'Applications'],
            ['practice', 'Practice'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </div>

      {isLoading && (
        <p className="mt-10 flex items-center gap-2 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading your applications…
        </p>
      )}

      {error && (
        <p className="mt-6 text-sm text-red-600">Could not load applications.</p>
      )}

      {!isLoading && !error && items.length === 0 && (
        <Card className="mt-8 p-10 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-4 font-medium text-slate-900">No tests yet</p>
          <p className="mt-1 text-sm text-slate-500">
            {filter === 'all'
              ? 'Apply to a job or run a practice test to see it here.'
              : `No ${filter === 'application' ? 'applications' : 'practice tests'} yet.`}
          </p>
          <Link to="/jobs" className="mt-4 inline-block">
            <Button>Browse open roles</Button>
          </Link>
        </Card>
      )}

      <ul className="mt-6 space-y-3">
        {items.map((item) => {
          const action = actionFor(item);
          return (
            <li key={item.sessionId}>
              <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-slate-900">
                      {item.jobTitle}
                    </h2>
                    <Badge
                      variant={applicationStatusVariant(item.applicationStatus)}
                    >
                      {applicationStatusLabel(item.applicationStatus)}
                    </Badge>
                    {item.sessionType === 'practice' && (
                      <Badge variant="info">Practice</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{item.companyName}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    Started {new Date(item.startedAt).toLocaleString()}
                    {item.submittedAt &&
                      ` · Submitted ${new Date(item.submittedAt).toLocaleString()}`}
                    {item.hasResult && item.overallScore != null && (
                      <span className="text-slate-600">
                        {' '}
                        · Score {item.overallScore}%
                      </span>
                    )}
                  </p>
                </div>
                <Link to={action.to} state={action.state}>
                  <Button variant="secondary" size="sm">
                    {action.label}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            </li>
          );
        })}
      </ul>

      <Card className="mt-8 border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-800">What the statuses mean</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong>In progress</strong> — finish and submit your assessment.
          </li>
          <li>
            <strong>Under review</strong> — submitted; waiting for the employer to
            decide.
          </li>
          <li>
            <strong>Interview invited</strong> — they want to meet you; check your
            email for next steps.
          </li>
          <li>
            <strong>Not selected</strong> — role filled or not moving forward; you
            can still view feedback.
          </li>
        </ul>
      </Card>
    </div>
  );
}
