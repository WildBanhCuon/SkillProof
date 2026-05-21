import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DimensionRadar } from '../../components/charts/DimensionRadar';
import { bandLabel, bandVariant } from '../../utils/format';

interface DetailResponse {
  applicationId: string;
  candidate: { id: string; fullName: string; email: string };
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
    title: string;
    submittedCode: string;
    sandboxResults?: unknown;
  }[];
  auditLogs: { pipeline: string; model: string; createdAt: string }[];
}

export function CandidateDetailPage() {
  const { id: jobId, applicationId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['candidate-detail', jobId, applicationId],
    queryFn: () =>
      api.get<DetailResponse>(
        `/jobs/${jobId}/candidates/${applicationId}`,
      ),
    enabled: !!jobId && !!applicationId,
  });

  if (isLoading || !data) {
    return <p className="text-slate-500">Loading candidate…</p>;
  }

  const rec = data.testResult.recommendation.toLowerCase();
  const dimensions = data.testResult.dimensionScores.map((d) => ({
    dimension: d.dimension.toLowerCase().replace(/_/g, ' '),
    score: d.score0_100,
  }));

  return (
    <div>
      <Link to={`/hr/jobs/${jobId}/results`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to results
        </Button>
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {data.candidate.fullName}
          </h1>
          <p className="text-slate-500">{data.candidate.email}</p>
        </div>
        <Badge variant={bandVariant(rec)}>{bandLabel(rec)}</Badge>
      </div>

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
        <h2 className="font-semibold text-slate-900">Submitted answers</h2>
        <div className="mt-4 space-y-6">
          {data.answers.map((a) => (
            <div key={a.questionId} className="border-t border-slate-100 pt-4">
              <h3 className="font-medium text-slate-900">{a.title}</h3>
              <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                {a.submittedCode}
              </pre>
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
