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
} from 'lucide-react';
import { api } from '../../api/client';
import { formatApiError } from '../../utils/errors';
import { monacoLanguage } from '../../utils/monacoLanguage';
import type { TestSession } from '../../api/types';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';

export function AssessmentPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const session = (location.state as { session?: TestSession })?.session;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const questions = session?.questions ?? [];
  const q = questions[currentIdx];

  useEffect(() => {
    if (!session) return;
    const initial: Record<string, string> = {};
    for (const question of session.questions) {
      initial[question.id] =
        question.questionType === 'mcq' ? '' : question.starterCode;
    }
    setCodes(initial);
  }, [session]);

  const isMcq = q?.questionType === 'mcq';

  const currentAnswered = q
    ? isMcq
      ? !!(codes[q.id]?.trim())
      : !!(codes[q.id]?.trim() ?? q.starterCode)
    : false;

  const requireAnswer = () => {
    if (!q || currentAnswered) return true;
    setError(
      isMcq
        ? 'Select an answer before continuing.'
        : 'Add your solution before continuing.',
    );
    return false;
  };

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
      setError(formatApiError(e, 'Autosave answer'));
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

  const submitAll = async () => {
    if (!sessionId) return;
    if (!requireAnswer()) return;
    setSubmitting(true);
    setError('');
    try {
      await saveAnswer();
      await api.post(`/sessions/${sessionId}/submit`);
      navigate(`/sessions/${sessionId}/result`, {
        state: { sessionType: session?.sessionType },
      });
    } catch (e) {
      setError(formatApiError(e, 'Submit assessment'));
    } finally {
      setSubmitting(false);
    }
  };

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((currentIdx + 1) / questions.length) * 100);
  }, [currentIdx, questions.length]);

  if (!session || !sessionId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950 p-6">
        <p className="text-slate-600 dark:text-slate-300">Session not found. Start from a job posting.</p>
        <Link to="/jobs">
          <Button>Browse jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Logo to="/jobs" />
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 text-sm font-mono text-blue-800 dark:text-blue-200">
              <Clock className="h-4 w-4" />
              {timeLeft}
            </span>
            <ThemeToggle />
            <Link to="/jobs">
              <Button variant="outline" size="sm">
                Exit test
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Skill assessment
          </p>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {session.jobTitle} @ {session.companyName}
          </h1>
          <div className="mt-2 flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
            <span>{session.durationMinutes} min</span>
            <span>{questions.length} questions</span>
            <span>{session.totalPoints} points</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div className="h-2 flex-1 max-w-md overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">{progress}%</span>
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
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Questions
            </p>
            <ul className="mt-3 space-y-2">
              {questions.map((question, i) => (
                <li key={question.id}>
                  <button
                    type="button"
                    onClick={() => setCurrentIdx(i)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${
                      i === currentIdx
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950'
                    }`}
                  >
                    {i < currentIdx ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                    )}
                    <span className="truncate">{question.title}</span>
                    <span className="ml-auto shrink-0 text-[10px] uppercase text-slate-400 dark:text-slate-500">
                      {question.questionType === 'mcq' ? 'MCQ' : 'Code'}
                    </span>
                    <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
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
                  i === currentIdx ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 ring-1 ring-slate-200'
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
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                    Question {currentIdx + 1} — {q.title}{' '}
                    <span className="text-slate-500 dark:text-slate-400">
                      ({isMcq ? 'Multiple choice' : 'Coding'})
                    </span>
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {q.instructions.split('\n')[0]}
                  </h2>
                </div>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-medium">
                  {q.points} pts
                </span>
              </div>
              {isMcq ? (
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    Question
                  </p>
                  <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                    {q.instructions}
                  </div>
                  <fieldset className="mt-6 space-y-3">
                    {(q.options ?? []).map((opt) => {
                      const selected = codes[q.id] === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                            selected
                              ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 dark:border-indigo-500 dark:bg-indigo-950/50 dark:ring-indigo-500'
                              : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`mcq-${q.id}`}
                            className="mt-1 h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            checked={selected}
                            onChange={() => {
                              setCodes((prev) => ({ ...prev, [q.id]: opt.id }));
                              setError('');
                            }}
                          />
                          <span className="text-sm text-slate-800 dark:text-slate-200">
                            {opt.label}
                          </span>
                        </label>
                      );
                    })}
                  </fieldset>
                </div>
              ) : (
                <div className="grid gap-0 lg:grid-cols-2">
                  <div className="border-b border-slate-100 p-6 dark:border-slate-800 lg:border-b-0 lg:border-r">
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                      Instructions
                    </p>
                    <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                      {q.instructions}
                    </div>
                  </div>
                  <div className="min-h-[320px]">
                    <Editor
                      key={`${q.id}-${monacoLanguage(q.language)}`}
                      height="320px"
                      language={monacoLanguage(q.language)}
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
              )}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 px-6 py-4">
                <Button
                  variant="outline"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => i - 1)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                {saving && (
                  <span className="self-center text-xs text-slate-400 dark:text-slate-500">
                    Saving…
                  </span>
                )}
                {currentIdx < questions.length - 1 ? (
                  <Button
                    onClick={() => {
                      if (!requireAnswer()) return;
                      setCurrentIdx((i) => i + 1);
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
