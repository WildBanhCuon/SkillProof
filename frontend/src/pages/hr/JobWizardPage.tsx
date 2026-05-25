import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../../api/client';
import type { JobPosting } from '../../api/types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import {
  EXPERIENCE_OPTIONS,
  INITIAL_WIZARD_ANSWERS,
  JobWizardAnswers,
  SENIORITY_OPTIONS,
  TONE_OPTIONS,
  WIZARD_STEPS,
  WORK_MODE_OPTIONS,
} from '../../data/jobWizard';
import { formatApiError } from '../../utils/errors';
import { useAuth } from '../../auth/AuthContext';

function OptionCard({
  selected,
  onClick,
  label,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
        selected
          ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <span className="font-medium text-slate-900">{label}</span>
      {hint && <span className="mt-0.5 block text-sm text-slate-500">{hint}</span>}
    </button>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-100 py-3 last:border-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
        {value || '—'}
      </p>
    </div>
  );
}

export function JobWizardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const teamPrefilled = useRef(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<JobWizardAnswers>(INITIAL_WIZARD_ANSWERS);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const profile = user?.companyTeamProfile?.trim();
    if (!profile || teamPrefilled.current) return;
    teamPrefilled.current = true;
    setAnswers((a) => ({ ...a, teamContext: profile }));
  }, [user?.companyTeamProfile]);

  const update = <K extends keyof JobWizardAnswers>(
    key: K,
    value: JobWizardAnswers[K],
  ) => setAnswers((a) => ({ ...a, [key]: value }));

  const current = WIZARD_STEPS[step];
  const isReview = current.id === 'review';

  const canGoNext = (): boolean => {
    switch (current.id) {
      case 'role':
        return answers.roleTitle.trim().length >= 2;
      case 'team':
        return answers.teamContext.trim().length >= 10;
      case 'work':
        return answers.responsibilities.trim().length >= 10;
      case 'skills':
        return answers.mustHaveSkills.trim().length >= 3;
      default:
        return true;
    }
  };

  const next = () => {
    if (!canGoNext()) {
      setError('Please fill in the required fields before continuing.');
      return;
    }
    setError('');
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
  };

  const back = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 0));
  };

  const generate = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setGenerating(true);
    try {
      const generated = await api.post<{ title: string; description: string }>(
        '/jobs/generate-from-wizard',
        answers,
      );
      const job = await api.post<JobPosting>('/jobs', {
        title: generated.title,
        description: generated.description,
      });
      navigate(`/hr/jobs/${job.id}`, {
        state: {
          wizardSuccess: 'AI draft created. Review the text, run Check listing, then publish.',
        },
      });
    } catch (err) {
      setError(formatApiError(err, 'Generate job posting'));
    } finally {
      setGenerating(false);
    }
  };

  const seniorityLabel =
    SENIORITY_OPTIONS.find((o) => o.value === answers.seniority)?.label ?? answers.seniority;
  const experienceLabel =
    EXPERIENCE_OPTIONS.find((o) => o.value === answers.experienceLevel)?.label ??
    answers.experienceLevel;
  const workModeLabel =
    WORK_MODE_OPTIONS.find((o) => o.value === answers.workMode)?.label ?? answers.workMode;
  const toneLabel =
    TONE_OPTIONS.find((o) => o.value === answers.tone)?.label ?? answers.tone;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm text-slate-500">
        <Link to="/hr/jobs" className="hover:text-indigo-600">
          Jobs
        </Link>{' '}
        / Guided setup
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">
        Create a job posting
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Answer a few questions — AI will draft a professional listing you can edit.
      </p>

      <div className="mt-6 flex gap-1">
        {WIZARD_STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`h-1.5 flex-1 rounded-full ${
              i <= step ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
            title={s.title}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Step {step + 1} of {WIZARD_STEPS.length} — {current.title}
      </p>

      {error && (
        <div className="mt-4">
          <Alert onDismiss={() => setError('')}>{error}</Alert>
        </div>
      )}

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-slate-900">{current.subtitle}</h2>

        <form
          className="mt-6 space-y-4"
          onSubmit={isReview ? generate : (e) => { e.preventDefault(); next(); }}
        >
          {current.id === 'role' && (
            <>
              <Input
                label="Job title"
                required
                value={answers.roleTitle}
                onChange={(e) => update('roleTitle', e.target.value)}
                placeholder="e.g. Junior Frontend Developer"
              />
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Seniority level
                </span>
                <div className="grid gap-2 sm:grid-cols-3">
                  {SENIORITY_OPTIONS.map((o) => (
                    <OptionCard
                      key={o.value}
                      selected={answers.seniority === o.value}
                      onClick={() => update('seniority', o.value)}
                      label={o.label}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {current.id === 'team' && (
            <label className="block w-full">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                About your team and product
              </span>
              {user?.companyTeamProfile?.trim() ? (
                <p className="mb-2 text-xs text-slate-500">
                  Prefilled from your{' '}
                  <Link to="/hr/profile" className="font-medium text-indigo-600 hover:underline">
                    company profile
                  </Link>
                  . Adjust here only if this role differs.
                </p>
              ) : (
                <p className="mb-2 text-xs text-amber-700">
                  Add a default in your{' '}
                  <Link to="/hr/profile" className="font-medium text-indigo-600 hover:underline">
                    company profile
                  </Link>{' '}
                  to skip retyping this next time.
                </p>
              )}
              <textarea
                required
                rows={5}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                value={answers.teamContext}
                onChange={(e) => update('teamContext', e.target.value)}
                placeholder="e.g. We are a 20-person SaaS team building a learning platform. You would join the product squad with 2 designers and 4 developers."
              />
            </label>
          )}

          {current.id === 'work' && (
            <label className="block w-full">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Main responsibilities
              </span>
              <textarea
                required
                rows={6}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                value={answers.responsibilities}
                onChange={(e) => update('responsibilities', e.target.value)}
                placeholder={'List what they will do — one task per line is fine.\ne.g. Build UI in React\nPair with backend on APIs\nParticipate in code reviews'}
              />
            </label>
          )}

          {current.id === 'skills' && (
            <>
              <label className="block w-full">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Must-have skills
                </span>
                <textarea
                  required
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  value={answers.mustHaveSkills}
                  onChange={(e) => update('mustHaveSkills', e.target.value)}
                  placeholder="e.g. React, TypeScript, HTML/CSS, Git"
                />
              </label>
              <label className="block w-full">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Nice-to-have skills (optional)
                </span>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  value={answers.niceToHaveSkills}
                  onChange={(e) => update('niceToHaveSkills', e.target.value)}
                  placeholder="e.g. Figma basics, unit testing"
                />
              </label>
            </>
          )}

          {current.id === 'logistics' && (
            <>
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Experience expected
                </span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <OptionCard
                      key={o.value}
                      selected={answers.experienceLevel === o.value}
                      onClick={() => update('experienceLevel', o.value)}
                      label={o.label}
                    />
                  ))}
                </div>
              </div>
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Work mode
                </span>
                <div className="grid gap-2 sm:grid-cols-3">
                  {WORK_MODE_OPTIONS.map((o) => (
                    <OptionCard
                      key={o.value}
                      selected={answers.workMode === o.value}
                      onClick={() => update('workMode', o.value)}
                      label={o.label}
                    />
                  ))}
                </div>
              </div>
              <Input
                label="Location (optional)"
                value={answers.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="e.g. Brussels, Belgium"
              />
            </>
          )}

          {current.id === 'tone' && (
            <div className="grid gap-2">
              {TONE_OPTIONS.map((o) => (
                <OptionCard
                  key={o.value}
                  selected={answers.tone === o.value}
                  onClick={() => update('tone', o.value)}
                  label={o.label}
                  hint={o.hint}
                />
              ))}
            </div>
          )}

          {current.id === 'review' && (
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 px-4">
              <ReviewRow label="Job title" value={answers.roleTitle} />
              <ReviewRow label="Seniority" value={seniorityLabel} />
              <ReviewRow label="Team context" value={answers.teamContext} />
              <ReviewRow label="Responsibilities" value={answers.responsibilities} />
              <ReviewRow label="Must-have skills" value={answers.mustHaveSkills} />
              <ReviewRow
                label="Nice-to-have"
                value={answers.niceToHaveSkills || 'None'}
              />
              <ReviewRow label="Experience" value={experienceLabel} />
              <ReviewRow
                label="Work mode & location"
                value={`${workModeLabel}${answers.location ? ` · ${answers.location}` : ''}`}
              />
              <ReviewRow label="Tone" value={toneLabel} />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
            <div className="flex gap-2">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={back} disabled={generating}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Link to="/hr/jobs">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              )}
            </div>
            {isReview ? (
              <Button type="submit" disabled={generating}>
                <Sparkles className="h-4 w-4" />
                {generating ? 'Writing your posting…' : 'Generate with AI'}
              </Button>
            ) : (
              <Button type="submit" disabled={!canGoNext()}>
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </Card>

      <p className="mt-4 text-center text-sm text-slate-500">
        Prefer to write yourself?{' '}
        <Link to="/hr/jobs/new" className="font-medium text-indigo-600 hover:underline">
          Open blank editor
        </Link>
      </p>
    </div>
  );
}
