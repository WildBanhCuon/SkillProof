import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { formatApiError } from '../../utils/errors';
import type { SessionResult } from '../../api/types';
import { pollSessionResult } from '../../utils/poll';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { bandLabel, bandVariant } from '../../utils/format';

export function ResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const sessionType = (location.state as { sessionType?: string })?.sessionType;

  const [result, setResult] = useState<SessionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await pollSessionResult(sessionId);
        if (!cancelled) setResult(res);
      } catch (e) {
        if (!cancelled) {
          setError(formatApiError(e, 'Load assessment results'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const isPractice = sessionType === 'practice';

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Logo to="/jobs" />
          <Link to="/my-applications">
            <Button variant="outline" size="sm">
              My applications
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        {loading && (
          <div className="flex flex-col items-center gap-4 py-16 text-slate-600">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            <p>Grading your submission…</p>
            <p className="text-sm text-slate-500">This usually takes a few seconds</p>
          </div>
        )}

        {error && (
          <Alert>{error}</Alert>
        )}

        {result && result.status === 'evaluated' && (
          <>
            <h1 className="text-2xl font-bold text-slate-900">Your results</h1>
            {isPractice ? (
              <p className="mt-2 text-sm text-amber-700">
                Practice mode — these results are not shared with employers.
              </p>
            ) : (
              <p className="mt-2 text-sm text-emerald-700">
                Application submitted — your verified score was sent to the hiring team.
              </p>
            )}

            <Card className="mt-6 p-6">
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-5xl font-bold text-slate-900">
                  {result.overallScore}
                  <span className="text-xl text-slate-400">/100</span>
                </p>
                {result.recommendation && (
                  <Badge variant={bandVariant(result.recommendation)}>
                    {bandLabel(result.recommendation)}
                  </Badge>
                )}
                <p className="text-indigo-600">{result.matchPercent}% skills match</p>
              </div>
              {result.aiSummary && (
                <p className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
                  {result.aiSummary}
                </p>
              )}
            </Card>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Card className="p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Strengths
                </p>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                  {result.strengths?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Areas to improve
                </p>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                  {result.improvements?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </Card>
            </div>

            {result.dimensionScores && result.dimensionScores.length > 0 && (
              <Card className="mt-6 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Dimension scores
                </p>
                <div className="mt-3 space-y-3">
                  {result.dimensionScores.map((d) => (
                    <div key={d.dimension}>
                      <div className="flex justify-between text-sm">
                        <span className="capitalize text-slate-700">
                          {d.dimension.replace(/_/g, ' ')}
                        </span>
                        <span className="font-medium">{d.score}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${d.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
