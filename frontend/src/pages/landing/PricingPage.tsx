import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LandingNav } from '../../components/landing/LandingNav';
import { PricingTierCards } from '../../components/pricing/PricingTierCards';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { freeTrialHeadline, type BillingPeriod } from '../../data/pricingPlans';

export function PricingPage() {
  const [billing, setBilling] = useState<BillingPeriod>('monthly');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <LandingNav standalone />

      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            Simple plans for hiring teams
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            {freeTrialHeadline()}. Then monthly subscriptions based on active job slots
            and graded candidates — unlimited recruiter seats on every plan.
          </p>

          <div className="mt-8 inline-flex rounded-lg border border-slate-200 p-1 dark:border-slate-700">
            {(['monthly', 'annual'] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBilling(b)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  billing === b
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {b === 'monthly' ? 'Monthly' : 'Annual (save 20%)'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <PricingTierCards billing={billing} showCta />
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          All prices in EUR · {freeTrialHeadline()} on all tiers · Demo checkout only in
          this prototype
        </p>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Not sure which plan fits?
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Start with Growth for a typical 50–100 person company hiring junior tech roles.
            You can change plans later.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/register/company?plan=growth">
              <Button size="lg">Start free trial</Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline">
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-4 py-8 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo to="/" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2026 SkillProof · Course prototype
          </p>
        </div>
      </footer>
    </div>
  );
}
