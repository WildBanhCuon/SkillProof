import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileSearch,
  Grid3X3,
  LineChart,
  MessageSquare,
  Scale,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { Logo } from '../../components/ui/Logo';
import { HeroDashboardMockup } from '../../components/landing/HeroDashboardMockup';
import { ProductPreviewCards } from '../../components/landing/ProductPreviewCards';
import { LandingFaq } from '../../components/landing/LandingFaq';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const TRUST_ITEMS = ['No fake match % scores', 'Inspectable rubrics', 'Any junior tech role'];

const PROBLEM_CARDS = [
  {
    icon: Users,
    title: 'CVs look the same',
    body: 'Bootcamp projects, tutorial repos, and keyword-stuffed resumes do not tell you who can actually do the job.',
  },
  {
    icon: Scale,
    title: '"Junior" ads are not junior',
    body: 'Managers mix senior requirements into junior titles — wrong applicants apply, right ones bounce.',
  },
  {
    icon: Zap,
    title: 'Screening does not scale',
    body: 'One role can bring 200–500+ applications. HR spends weeks filtering noise.',
  },
  {
    icon: Shield,
    title: 'Decisions are not defensible',
    body: 'When a hire fails or someone asks why they were rejected, there is no structured evidence trail.',
  },
];

const STEPS = [
  {
    n: '01',
    role: 'HR',
    title: 'Upgrade the job ad',
    desc: 'Paste your posting into the Job Ad Upgrade Studio. AI flags unrealistic requirements, vague responsibilities, and inconsistent seniority — then you approve a cleaner ad and skill matrix.',
    icon: Sparkles,
  },
  {
    n: '02',
    role: 'Candidate',
    title: 'Prove skills on a real test',
    desc: 'Candidates complete a 30–45 minute assessment generated from that specific job — not a generic test bank.',
    icon: ClipboardCheck,
  },
  {
    n: '03',
    role: 'HR',
    title: 'Review a ranked shortlist',
    desc: 'See scorecards with strengths, risks, cited evidence, and suggested interview questions. Spot top performers in minutes, not weeks.',
    icon: LineChart,
  },
];

const FEATURES = [
  {
    icon: FileSearch,
    title: 'Job Ad Upgrade Studio',
    desc: 'Analyze postings for overreach, vagueness, and missing info before you publish.',
  },
  {
    icon: Grid3X3,
    title: 'Skill matrix generation',
    desc: 'Turn the ad into explicit skills and evaluation criteria HR and hiring managers can align on.',
  },
  {
    icon: ClipboardCheck,
    title: 'Role-specific assessments',
    desc: 'Fresh tests from validated job context — frontend, WordPress, or other junior tech roles.',
  },
  {
    icon: Shield,
    title: 'Rubric-based evaluation',
    desc: 'Scores 0–5 per criterion with cited evidence from submissions — not opaque AI guesses.',
  },
  {
    icon: LineChart,
    title: 'Ranked HR dashboard',
    desc: 'Aggregated rubric scores into a shortlist — no fake match percentages.',
  },
  {
    icon: MessageSquare,
    title: 'Actionable candidate feedback',
    desc: 'Rejected applicants get structured feedback, not silence.',
  },
];

const AI_LOOP = [
  ['Write job ad', 'HR'],
  ['Analyze ad & skill matrix', 'AI → HR approves'],
  ['Generate test', 'AI → HR approves'],
  ['Grade answers', 'AI (rubric)'],
  ['Rank shortlist', 'Code (deterministic)'],
  ['Hire / pass', 'HR'],
];

const METRICS = [
  { value: '60–70%', label: 'Less screening time per junior role' },
  { value: '30%', label: 'Higher interview-to-hire conversion (target)' },
  { value: '↓', label: 'Mis-hire rate at 3–6 months' },
  { value: 'Days → hours', label: 'Time to build a defensible shortlist' },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              <span className="text-xs font-semibold">AI-assisted junior hiring</span>
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
              Too many applicants.
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">Not enough proof.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              SkillProof helps hiring teams turn messy junior applications into{' '}
              <strong className="font-semibold text-slate-800 dark:text-slate-200">
                verified, job-ready shortlists
              </strong>{' '}
              — with better job ads, role-calibrated assessments, and rubric-backed evidence
              instead of CV keywords.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" onClick={() => scrollToId('how-it-works')}>
                See how it works
              </Button>
            </div>
            <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {TRUST_ITEMS.map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
                >
                  <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <HeroDashboardMockup />
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Built for teams hiring junior developers, WordPress specialists, frontend
            engineers, and more.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <span>200+ applications per role</span>
            <span className="hidden text-slate-300 sm:inline dark:text-slate-600">·</span>
            <span>30–45 min assessments</span>
            <span className="hidden text-slate-300 sm:inline dark:text-slate-600">·</span>
            <span>60–70% less screening time</span>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="why-skillproof" className="scroll-mt-20 bg-white py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              The junior hiring trap
            </h2>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              High volume. Low signal. High cost when you guess wrong.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {PROBLEM_CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <Card key={c.title} className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/60">
                    <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {c.body}
                  </p>
                </Card>
              );
            })}
          </div>
          <p className="mx-auto mt-12 max-w-2xl text-center text-lg text-slate-700 dark:text-slate-300">
            SkillProof replaces{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              school name, years of experience, and polished wording
            </span>{' '}
            with{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              structured proof of ability
            </span>
            .
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-20 bg-slate-50 py-20 dark:bg-slate-900/40"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              From vague job ad to verified shortlist
            </h2>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              One workflow for HR. A fairer path for candidates.
            </p>
          </div>
          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            <div
              className="pointer-events-none absolute left-[16%] right-[16%] top-12 hidden h-0.5 bg-indigo-200 md:block dark:bg-indigo-800"
              aria-hidden
            />
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.n} className="relative z-10 p-6">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {s.n}
                  </span>
                  <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {s.role}
                  </span>
                  <Icon className="mt-4 h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {s.desc}
                  </p>
                </Card>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" onClick={() => scrollToId('previews')}>
              Watch the demo flow
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 bg-white py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Everything you need to hire juniors with evidence
            </h2>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              AI where it helps. Transparent rubrics where it matters.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="p-6">
                  <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{f.desc}</p>
                </Card>
              );
            })}
          </div>
          <Card className="mt-10 border-indigo-200 bg-indigo-50/40 p-6 dark:border-indigo-800/50 dark:bg-indigo-950/20 lg:p-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              AI + human in the loop
            </h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[320px] text-left text-sm">
                <thead>
                  <tr className="border-b border-indigo-200/80 dark:border-indigo-800/50">
                    <th className="pb-2 font-medium text-slate-600 dark:text-slate-400">Step</th>
                    <th className="pb-2 font-medium text-slate-600 dark:text-slate-400">Who</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {AI_LOOP.map(([step, who]) => (
                    <tr
                      key={step}
                      className="border-b border-indigo-100/80 last:border-0 dark:border-indigo-900/40"
                    >
                      <td className="py-2 pr-4">{step}</td>
                      <td className="py-2 font-medium text-indigo-700 dark:text-indigo-300">
                        {who}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              We do not predict &ldquo;good hire&rdquo; from biased historical labels. We show
              inspectable evidence.
            </p>
          </Card>
        </div>
      </section>

      {/* Dual audience */}
      <section
        id="for-candidates"
        className="scroll-mt-20 bg-slate-50 py-20 dark:bg-slate-900/40"
      >
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          <Card className="overflow-hidden border-2 border-indigo-200 dark:border-indigo-800/60">
            <div className="bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
              For HR & talent leaders
            </div>
            <div className="p-6">
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li>Cut screening time by 60–70% per junior role</li>
                <li>Defend realistic requirements with hiring managers</li>
                <li>Lower mis-hires and first-year turnover</li>
                <li>Build an audit-friendly decision trail for DE&I and internal review</li>
              </ul>
              <Link to="/register" className="mt-6 inline-block">
                <Button>Get started</Button>
              </Link>
              <blockquote className="mt-6 border-l-2 border-indigo-300 pl-4 text-sm italic text-slate-600 dark:border-indigo-700 dark:text-slate-400">
                &ldquo;I spend two weeks filtering noise per posting. I need juniors who can
                actually perform — and proof I can show my CTO.&rdquo;
                <footer className="mt-2 not-italic text-xs text-slate-500">
                  — Marion, Head of Talent
                </footer>
              </blockquote>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-200">
              For junior applicants
            </div>
            <div className="p-6">
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li>Prove ability beyond diploma and years of experience</li>
                <li>One role-specific test instead of endless repetitive screens</li>
                <li>Structured feedback when you are not selected</li>
                <li>Fairer funnel when CVs all look the same</li>
              </ul>
              <Link to="/register" className="mt-6 inline-block">
                <Button variant="outline">Browse open roles</Button>
              </Link>
              <blockquote className="mt-6 border-l-2 border-slate-300 pl-4 text-sm italic text-slate-600 dark:border-slate-600 dark:text-slate-400">
                &ldquo;I sent hundreds of applications and got silence. I need a way to show what
                I can actually build.&rdquo;
                <footer className="mt-2 not-italic text-xs text-slate-500">
                  — Sofiane, CS graduate
                </footer>
              </blockquote>
            </div>
          </Card>
        </div>
      </section>

      {/* Product previews */}
      <section id="previews" className="scroll-mt-20 bg-white py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              See what HR gets on day one
            </h2>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              Three connected screens. One defensible decision hub.
            </p>
          </div>
          <div className="mt-12">
            <ProductPreviewCards />
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="bg-indigo-600 py-16 dark:bg-indigo-700">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
            Hiring outcomes that compound
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-3xl font-bold text-white sm:text-4xl">{m.value}</p>
                <p className="mt-2 text-sm text-indigo-100">{m.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-xs text-indigo-200/90">
            Targets based on product design goals; prototype demo uses sample data.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-20 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-slate-100">
            Common questions
          </h2>
          <div className="mt-10">
            <LandingFaq />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Stop sorting CVs. Start reviewing proof.
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Take a vague junior job ad to a verified shortlist in one workflow.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register">
              <Button size="lg">Get started</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Log in
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Free to explore in demo · No credit card
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 px-4 py-12 text-slate-300 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo to="/" size="lg" inverted className="pointer-events-auto" />
            <p className="mt-2 text-sm text-slate-400">Verified junior tech hiring.</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Product</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  className="hover:text-white"
                  onClick={() => scrollToId('how-it-works')}
                >
                  How it works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white"
                  onClick={() => scrollToId('features')}
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white"
                  onClick={() => scrollToId('for-candidates')}
                >
                  For candidates
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Contact</p>
            <p className="mt-3 text-sm text-slate-400">hello@skillproof.app</p>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © 2026 SkillProof · Course prototype — ESCEN AI for Impact
        </p>
      </footer>
    </div>
  );
}
