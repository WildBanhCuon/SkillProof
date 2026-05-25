import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Calendar, UserX } from 'lucide-react';
import { api } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { DimensionRadar } from '../../components/charts/DimensionRadar';
import {
  bandLabel,
  bandVariant,
  hrDecisionLabel,
  hrDecisionVariant,
} from '../../utils/format';
import { formatApiError } from '../../utils/errors';
import { rememberLastResultsJob } from '../../utils/hrNav';
import { CandidateProfileCard } from '../../components/candidate/CandidateProfileCard';
import type { CandidateProfileData } from '../../api/types';
import { MarkdownContent } from '../../components/ui/MarkdownContent';

interface DetailResponse {
  applicationId: string;
  hrStatus: string;
  hrDecidedAt: string | null;
  requiredProfileFields?: string[];
  candidate: {
    id: string;
    fullName: string;
    email: string;
    profile?: CandidateProfileData;
  };
  testResult: {
    overallScore: number;
    matchPercent: number;
    recommendation: string;
    strengths: string[];
    improvements: string[];
    aiSummary: string;
    dimensionScores: { dimension: string; score0_100: number }[];
  };
  answers: {
    questionId: string;
    orderIndex: number;
    title: string;
    instructions: string;
    points: number;
    language: string;
    submittedCode: string;
    notes: string | null;
  }[];
  auditLogs: { pipeline: string; model: string; createdAt: string }[];
}

export function CandidateDetailPage() {
  const { id: jobId, applicationId } = useParams();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<'interview' | 'decline' | null>(null);

  useEffect(() => {
    if (jobId) rememberLastResultsJob(jobId);
  }, [jobId]);

  const { data, isLoading } = useQuery({
    queryKey: ['candidate-detail', jobId, applicationId],
    queryFn: () =>
      api.get<DetailResponse>(
        `/jobs/${jobId}/candidates/${applicationId}`,
      ),
    enabled: !!jobId && !!applicationId,
  });

  const setDecision = async (decision: 'interview' | 'decline') => {
    if (!jobId || !applicationId) return;
    const label =
      decision === 'interview' ? 'invite this candidate to an interview' : 'decline this candidate';
    if (!window.confirm(`Are you sure you want to ${label}?`)) return;

    setError('');
    setBusy(decision);
    try {
      await api.patch(
        `/jobs/${jobId}/candidates/${applicationId}/decision`,
        { decision },
      );
      await queryClient.invalidateQueries({
        queryKey: ['candidate-detail', jobId, applicationId],
      });
      await queryClient.invalidateQueries({ queryKey: ['job', jobId, 'candidates'] });
    } catch (e) {
      setError(formatApiError(e, 'Update decision'));
    } finally {
      setBusy(null);
    }
  };

  if (isLoading || !data) {
    return <p className="text-slate-500">Loading candidate…</p>;
  }

  const rec = data.testResult.recommendation.toLowerCase();
  const dimensions = data.testResult.dimensionScores.map((d) => ({
    dimension: d.dimension.toLowerCase().replace(/_/g, ' '),
    score: d.score0_100,
  }));
  const canDecide = data.hrStatus === 'pending';

  return (
    <div>
      <Link to={`/hr/jobs/${jobId}/results`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to results
        </Button>
      </Link>

      {error && (
        <div className="mb-4">
          <Alert onDismiss={() => setError('')}>{error}</Alert>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {data.candidate.fullName}
          </h1>
          <p className="text-slate-500">{data.candidate.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={hrDecisionVariant(data.hrStatus)}>
            {hrDecisionLabel(data.hrStatus)}
          </Badge>
          <Badge variant={bandVariant(rec)}>AI: {bandLabel(rec)}</Badge>
        </div>
      </div>

      {data.candidate.profile && (
        <div className="mt-6">
          <CandidateProfileCard
            profile={data.candidate.profile}
            email={data.candidate.email}
            requiredFields={data.requiredProfileFields}
          />
        </div>
      )}

      <Card className="mt-6 border-indigo-100 bg-indigo-50/40 p-6">
        <h2 className="font-semibold text-slate-900">Hiring decision</h2>
        <p className="mt-1 text-sm text-slate-600">
          The candidate sees your decision on their applications page. Accept means you
          want to schedule an interview.
        </p>
        {data.hrDecidedAt && data.hrStatus !== 'pending' && (
          <p className="mt-2 text-xs text-slate-500">
            Decided {new Date(data.hrDecidedAt).toLocaleString()}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          {canDecide ? (
            <>
              <Button
                onClick={() => setDecision('interview')}
                disabled={!!busy}
              >
                <Calendar className="h-4 w-4" />
                {busy === 'interview' ? 'Saving…' : 'Invite to interview'}
              </Button>
              <Button
                variant="outline"
                className="text-red-700 hover:bg-red-50"
                onClick={() => setDecision('decline')}
                disabled={!!busy}
              >
                <UserX className="h-4 w-4" />
                {busy === 'decline' ? 'Saving…' : 'Decline'}
              </Button>
            </>
          ) : (
            <p className="text-sm text-slate-600">
              {data.hrStatus === 'interview'
                ? 'You invited this candidate to an interview. You can change your mind by declining them.'
                : 'You declined this candidate. You can still invite them to an interview if you reconsider.'}
            </p>
          )}
          {!canDecide && (
            <div className="flex flex-wrap gap-2">
              {data.hrStatus !== 'interview' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDecision('interview')}
                  disabled={!!busy}
                >
                  Invite to interview
                </Button>
              )}
              {data.hrStatus !== 'declined' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-700"
                  onClick={() => setDecision('decline')}
                  disabled={!!busy}
                >
                  Decline
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-semibold text-slate-900">Assessment summary</h2>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            {data.testResult.overallScore}
            <span className="text-lg text-slate-400">/100</span>
          </p>
          <p className="text-indigo-600">{data.testResult.matchPercent}% match</p>
          <p className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            {data.testResult.aiSummary}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Strengths
              </p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                {data.testResult.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Improvements
              </p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                {data.testResult.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
        <Card className="flex flex-col items-center p-6">
          <DimensionRadar scores={dimensions} size={200} />
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="font-semibold text-slate-900">Assessment questions & answers</h2>
        <p className="mt-1 text-sm text-slate-500">
          Each block shows the question the candidate received, then their submission.
        </p>
        <div className="mt-6 space-y-8">
          {data.answers.map((a, idx) => (
            <div
              key={a.questionId}
              className="overflow-hidden rounded-lg border border-slate-200"
            >
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  Question {idx + 1}
                  <span className="text-slate-400"> · {a.points} pts</span>
                  {a.language && (
                    <span className="text-slate-400"> · {a.language}</span>
                  )}
                </p>
                <h3 className="mt-1 font-semibold text-slate-900">{a.title}</h3>
              </div>
              <div className="border-b border-slate-100 bg-white px-4 py-4 sm:px-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Question / instructions
                </p>
                <div className="mt-2 text-sm text-slate-700">
                  <MarkdownContent content={a.instructions} />
                </div>
              </div>
              <div className="bg-white px-4 py-4 sm:px-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Candidate answer
                </p>
                <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                  {a.submittedCode || '(empty)'}
                </pre>
                {a.notes?.trim() && (
                  <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50/60 p-3">
                    <p className="text-xs font-semibold uppercase text-amber-800">
                      Candidate notes
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-amber-900">
                      {a.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {data.auditLogs.length > 0 && (
        <Card className="mt-6 p-6">
          <h2 className="font-semibold text-slate-900">AI audit trail</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {data.auditLogs.map((log, i) => (
              <li key={i}>
                {log.pipeline} · {log.model} ·{' '}
                {new Date(log.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
