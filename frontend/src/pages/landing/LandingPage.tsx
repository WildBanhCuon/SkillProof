import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ClipboardCheck, LineChart, Sparkles } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

const steps = [
  {
    n: '01',
    role: 'HR',
    title: 'Create & check listing',
    desc: 'Draft a job post and let AI flag unrealistic requirements, vague responsibilities, and inconsistent seniority.',
    icon: Sparkles,
    hrPath: '/hr/jobs/new',
    candPath: null,
  },
  {
    n: '02',
    role: 'Candidate',
    title: 'Take the assessment',
    desc: 'Skill assessment auto-generated from the posting. Prove what you can do on role-relevant questions.',
    icon: ClipboardCheck,
    hrPath: null,
    candPath: '/jobs',
  },
  {
    n: '03',
    role: 'HR',
    title: 'Review ranked results',
    desc: 'See verified scores, dimension profiles, and AI recommendations. Spot top candidates in seconds.',
    icon: LineChart,
    hrPath: '/hr/jobs',
    candPath: null,
  },
];

export function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const startWalkthrough = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role === 'hr') navigate('/hr/jobs/new');
    else navigate('/jobs');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button onClick={() => navigate(user?.role === 'hr' ? '/hr/jobs' : '/jobs')}>
                Go to dashboard
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button>Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">AI-assisted hiring workflow</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
          Prove skills.
          <br />
          Not CVs.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          SkillProof helps hiring teams write better job listings, generates tailored
          assessments, and ranks candidates by what they can actually do.
        </p>
        <Button size="lg" className="mt-8" onClick={startWalkthrough}>
          Start walkthrough
          <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 sm:grid-cols-3 sm:px-6">
        {steps.map((s) => {
          const Icon = s.icon;
          const path =
            isAuthenticated && user?.role === 'hr'
              ? s.hrPath
              : isAuthenticated && user?.role === 'candidate'
                ? s.candPath
                : null;
          return (
            <Card key={s.n} className="p-6 text-left">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{s.n}</span>
              <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">{s.role}</span>
              <Icon className="mt-4 h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <h3 className="mt-3 font-semibold text-slate-900 dark:text-slate-100">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{s.desc}</p>
              {path && (
                <Link to={path} className="mt-4 inline-block text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Open →
                </Link>
              )}
            </Card>
          );
        })}
      </section>

      <p className="pb-8 text-center text-xs text-slate-400 dark:text-slate-500">
        Demo flow: Check listing → Publish → Take assessment → Review ranked results
      </p>
    </div>
  );
}
