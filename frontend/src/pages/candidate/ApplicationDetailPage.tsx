import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import type { CandidateApplicationDetail } from '../../api/types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DimensionRadar } from '../../components/charts/DimensionRadar';
import {
  applicationStatusLabel,
  applicationStatusVariant,
  bandLabel,
  bandVariant,
} from '../../utils/format';

export function ApplicationDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['candidate', 'application', sessionId],
    queryFn: () =>
      api.get<CandidateApplicationDetail>(
        `/candidate/applications/${sessionId}`,
      ),
    enabled: !!sessionId,
  });

  useEffect(() => {
    if (
      data?.applicationStatus === 'interview_invited' ||
      data?.applicationStatus === 'declined'
    ) {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'notifications'] });
    }
  }, [data?.applicationStatus, queryClient]);

  if (isLoading || !data) {
    return (
      <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400 dark:text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading…
      </p>
    );
  }

  const isPractice = data.sessionType === 'practice';
  const canContinue =
    data.applicationStatus === 'in_progress' ||
    data.applicationStatus === 'practice_in_progress';

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/my-applications" className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:text-indigo-400">
        <span className="inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          My applications
        </span>
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{data.jobTitle}</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">{data.companyName}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant={applicationStatusVariant(data.applicationStatus)}>
              {applicationStatusLabel(data.applicationStatus)}
            </Badge>
            {isPractice && <Badge variant="info">Practice</Badge>}
            {data.recommendation && (
              <Badge variant={bandVariant(data.recommendation)}>
                {bandLabel(data.recommendation)}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canContinue && (
            <Link to={`/sessions/${data.sessionId}`}>
              <Button>Continue test</Button>
            </Link>
          )}
          {data.overallScore != null && (
            <Link
              to={`/sessions/${data.sessionId}/result`}
              state={{ sessionType: data.sessionType }}
            >
              <Button variant="secondary">Full results</Button>
            </Link>
          )}
        </div>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400 dark:text-slate-500">Timeline</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Started</dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {new Date(data.startedAt).toLocaleString()}
            </dd>
          </div>
          {data.submittedAt && (
            <div>
              <dt className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Submitted</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {new Date(data.submittedAt).toLocaleString()}
              </dd>
            </div>
          )}
          {data.appliedAt && (
            <div>
              <dt className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Application recorded</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {new Date(data.appliedAt).toLocaleString()}
              </dd>
            </div>
          )}
          {data.overallScore != null && (
            <div>
              <dt className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Overall score</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">{data.overallScore}%</dd>
            </div>
          )}
        </dl>
      </Card>

      {data.aiSummary && (
        <Card className="mt-6 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Summary</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {data.aiSummary}
          </p>
          {data.strengths && data.strengths.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 dark:text-slate-500">
                Strengths
              </p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                {data.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {data.improvements && data.improvements.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 dark:text-slate-500">
                Areas to improve
              </p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                {data.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {data.dimensionScores && data.dimensionScores.length > 0 && (
        <Card className="mt-6 flex flex-col items-center p-6">
          <h2 className="self-start font-semibold text-slate-900 dark:text-slate-100">Skill breakdown</h2>
          <DimensionRadar scores={data.dimensionScores} size={220} className="mt-4" />
        </Card>
      )}

      {data.applicationStatus === 'interview_invited' && (
        <Card className="mt-6 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-6">
          <h2 className="font-semibold text-emerald-900 dark:text-emerald-200">Interview invited</h2>
          <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200">
            {data.companyName} wants to move forward with you for this role. They
            may contact you at the email on your account to schedule an interview.
          </p>
        </Card>
      )}

      {data.applicationStatus === 'declined' && (
        <Card className="mt-6 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-6">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            The employer decided not to continue with your application for this
            role. Your assessment feedback below can still help you improve.
          </p>
        </Card>
      )}

      {isPractice && (
        <p className="mt-6 text-sm text-amber-800 dark:text-amber-200">
          Practice results are for your learning only — they are not shared with
          employers.
        </p>
      )}
    </div>
  );
}
