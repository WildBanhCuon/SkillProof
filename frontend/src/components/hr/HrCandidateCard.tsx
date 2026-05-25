import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import type { CandidateRow } from '../../api/types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { DimensionRadar } from '../charts/DimensionRadar';
import {
  bandLabel,
  bandVariant,
  hrDecisionLabel,
  hrDecisionVariant,
} from '../../utils/format';

export function HrCandidateCard({
  jobId,
  candidate: c,
  listIndex,
}: {
  jobId: string;
  candidate: CandidateRow;
  listIndex: number;
}) {
  const rank = c.rank ?? listIndex + 1;
  const isTop = c.isTopMatch ?? listIndex === 0;

  return (
    <Card className={`p-6 ${isTop ? 'ring-2 ring-emerald-200' : ''}`}>
      {isTop && (
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
          <Trophy className="h-4 w-4" />
          Top match
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_auto_auto]">
        <div className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300">
            #{rank}
          </span>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/60 font-semibold text-indigo-700 dark:text-indigo-300">
            {c.candidate.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {c.candidate.fullName}
              </h3>
              <Badge variant={hrDecisionVariant(c.hrStatus ?? 'pending')}>
                {hrDecisionLabel(c.hrStatus ?? 'pending')}
              </Badge>
              <Badge variant={bandVariant(c.recommendation)}>
                AI: {bandLabel(c.recommendation)}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">{c.candidate.email}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  Strengths
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-600 dark:text-slate-300">
                  {c.strengths?.slice(0, 3).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  Areas to improve
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-600 dark:text-slate-300">
                  {c.improvements?.slice(0, 3).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 px-3 py-2 text-sm text-blue-900 dark:text-blue-200">
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
                  ? 'text-slate-900 dark:text-slate-100'
                  : 'text-red-600 dark:text-red-400'
            }`}
          >
            {c.overallScore}
            <span className="text-lg text-slate-400 dark:text-slate-500">/100</span>
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Overall score</p>
          <div className="mt-3 h-2 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-600"
              style={{ width: `${c.matchPercent}%` }}
            />
          </div>
          <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
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
  );
}
