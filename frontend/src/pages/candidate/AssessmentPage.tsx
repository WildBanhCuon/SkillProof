import { useCallback, useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  Play,
} from 'lucide-react';
import { ApiError, api } from '../../api/client';
import type { TestRun, TestSession } from '../../api/types';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';

export function AssessmentPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const session = (location.state as { session?: TestSession })?.session;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [runs, setRuns] = useState<TestRun[] | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const questions = session?.questions ?? [];
  const q = questions[currentIdx];

  useEffect(() => {
    if (!session) return;
    const initial: Record<string, string> = {};
    for (const question of session.questions) {
      initial[question.id] = question.starterCode;
    }
    setCodes(initial);
  }, [session]);

  useEffect(() => {
    if (!session?.expiresAt) return;
    const tick = () => {
      const ms = new Date(session.expiresAt).getTime() - Date.now();
      if (ms <= 0) {
        setTimeLeft('00:00:00');
        return;
      }
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session?.expiresAt]);

  const saveAnswer = useCallback(async () => {
    if (!sessionId || !q) return;
    setSaving(true);
    try {
      await api.patch(`/sessions/${sessionId}/answers/${q.id}`, {
        submittedCode: codes[q.id] ?? q.starterCode,
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }, [sessionId, q, codes]);

  useEffect(() => {
    if (!sessionId || !q) return;
    const t = setTimeout(() => {
      void (async () => {
        setSaving(true);
        try {
          await api.patch(`/sessions/${sessionId}/answers/${q.id}`, {
            submittedCode: codes[q.id] ?? q.starterCode,
          });
        } catch {
          /* ignore autosave errors */
        } finally {
          setSaving(false);
        }
      })();
    }, 1200);
    return () => clearTimeout(t);
  }, [codes, q?.id, sessionId]);

  const runTests = async () => {
    if (!sessionId || !q) return;
    setRunning(true);
    setError('');
    try {
      await saveAnswer();
      const res = await api.post<{ runs: TestRun[] }>(
        `/sessions/${sessionId}/answers/${q.id}/run`,
      );
      setRuns(res.runs);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Run failed');
    } finally {
      setRunning(false);
    }
  };

  const submitAll = async () => {
    if (!sessionId) return;
    setSubmitting(true);
    setError('');
    try {
      await saveAnswer();
      await api.post(`/sessions/${sessionId}/submit`);
      navigate(`/sessions/${sessionId}/result`, {
        state: { sessionType: session?.sessionType },
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Submit failed');
      setSubmitting(false);
    }
  };

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((currentIdx + 1) / questions.length) * 100);
  }, [currentIdx, questions.length]);

  if (!session || !sessionId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6">
        <p className="text-slate-600">Session not found. Start from a job posting.</p>
        <Link to="/jobs">
          <Button>Browse jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Logo to="/jobs" />
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-mono text-blue-800">
              <Clock className="h-4 w-4" />
              {timeLeft}
            </span>
            <Link to="/jobs">
              <Button variant="outline" size="sm">
                Exit test
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Skill assessment
          </p>
          <h1 className="text-xl font-bold text-slate-900">
            {session.jobTitle} @ {session.companyName}
          </h1>
          <div className="mt-2 flex flex-wrap gap-6 text-sm text-slate-500">
            <span>{session.durationMinutes} min</span>
            <span>{questions.length} questions</span>
            <span>{session.totalPoints} points</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-slate-600">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div className="h-2 flex-1 max-w-md overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-slate-500">{progress}%</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <Alert onDismiss={() => setError('')}>{error}</Alert>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-4">
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Questions
            </p>
            <ul className="mt-3 space-y-2">
              {questions.map((question, i) => (
                <li key={question.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentIdx(i);
                      setRuns(null);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${
                      i === currentIdx
                        ? 'bg-indigo-50 text-indigo-800'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {i < currentIdx ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                    )}
                    <span className="truncate">{question.title}</span>
                    <span className="ml-auto text-xs text-slate-400">
                      {question.points}pt
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
          <div className="flex gap-2 overflow-x-auto lg:hidden">
            {questions.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIdx(i)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                  i === currentIdx ? 'bg-indigo-600 text-white' : 'bg-white ring-1 ring-slate-200'
                }`}
              >
                Q{i + 1}
              </button>
            ))}
          </div>
        </aside>

        <main>
          {q && (
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-indigo-600">
                    Question {currentIdx + 1} — {q.title}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    {q.instructions.split('\n')[0]}
                  </h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
                  {q.points} pts
                </span>
              </div>
              <div className="grid gap-0 lg:grid-cols-2">
                <div className="border-b border-slate-100 p-6 lg:border-b-0 lg:border-r">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Instructions
                  </p>
                  <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                    {q.instructions}
                  </div>
                </div>
                <div className="min-h-[320px]">
                  <Editor
                    height="320px"
                    language={q.language === 'typescript' ? 'typescript' : 'javascript'}
                    value={codes[q.id] ?? q.starterCode}
                    onChange={(v) =>
                      setCodes((prev) => ({ ...prev, [q.id]: v ?? '' }))
                    }
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      wordWrap: 'on',
                    }}
                  />
                </div>
              </div>
              {runs && (
                <div className="border-t border-slate-100 px-6 py-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Public test results
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {runs.map((r) => (
                      <li
                        key={r.testCaseId}
                        className={r.passed ? 'text-emerald-600' : 'text-red-600'}
                      >
                        {r.passed ? '✓' : '✗'} {r.status}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
                <Button
                  variant="outline"
                  disabled={currentIdx === 0}
                  onClick={() => {
                    setCurrentIdx((i) => i - 1);
                    setRuns(null);
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={runTests} disabled={running}>
                    {running ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Run tests
                  </Button>
                  {saving && (
                    <span className="self-center text-xs text-slate-400">
                      Saving…
                    </span>
                  )}
                </div>
                {currentIdx < questions.length - 1 ? (
                  <Button
                    onClick={() => {
                      setCurrentIdx((i) => i + 1);
                      setRuns(null);
                    }}
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={submitAll} disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      'Submit assessment'
                    )}
                  </Button>
                )}
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
