import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import type { AuthUser } from '../../api/types';
import { useAuth } from '../../auth/AuthContext';
import { PricingTierCards } from '../../components/pricing/PricingTierCards';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import {
  computeTrialEndsAt,
  formatPlanPrice,
  freeTrialLabel,
  getPlanById,
  planPriceSublineWithTrial,
  type BillingPeriod,
  type PlanId,
} from '../../data/pricingPlans';
import { formatTrialEndsAt } from '../../utils/companySubscription';
import {
  clearPendingCheckout,
  getPendingCheckout,
  saveCompanySubscription,
  setPendingCheckout,
} from '../../utils/companySubscription';
import { formatAuthError } from '../../utils/errors';
import { buildDemoCompanyRegistration } from '../../data/demoPrefill';
import { useDemoPrefill } from '../../hooks/useDemoPrefill';

const STEPS = ['Choose plan', 'Payment', 'Account'] as const;
type Step = 0 | 1 | 2;

function parsePlanId(value: string | null): PlanId {
  if (value === 'starter' || value === 'growth' || value === 'scale' || value === 'pro') {
    return value;
  }
  return 'growth';
}

function parseBilling(value: string | null): BillingPeriod {
  return value === 'annual' ? 'annual' : 'monthly';
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function HrRegisterPage() {
  const { registerHr, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<Step>(0);
  const [planId, setPlanId] = useState<PlanId>(() => parsePlanId(searchParams.get('plan')));
  const [billing, setBilling] = useState<BillingPeriod>(() =>
    parseBilling(searchParams.get('billing')),
  );

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const plan = useMemo(() => getPlanById(planId), [planId]);
  const applyCompanyPrefill = useCallback(() => {
    const demo = buildDemoCompanyRegistration();
    setPlanId(demo.planId);
    setBilling(demo.billing);
    setCardName(demo.cardName);
    setCardNumber(demo.cardNumber);
    setCardExpiry(demo.cardExpiry);
    setCardCvc(demo.cardCvc);
    setEmail(demo.email);
    setPassword(demo.password);
  }, []);

  useDemoPrefill(applyCompanyPrefill, [applyCompanyPrefill, step]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'hr') {
      navigate('/hr/jobs', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const goToPayment = () => {
    setError('');
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const processDemoPayment = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const digits = cardNumber.replace(/\D/g, '');
    const paymentLast4 =
      digits.length >= 4 ? digits.slice(-4) : '4242';
    setProcessingPayment(true);
    await new Promise((r) => setTimeout(r, 800));
    setPendingCheckout({
      planId,
      billing,
      paymentLast4,
      paidAt: new Date().toISOString(),
    });
    setProcessingPayment(false);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onCreateAccount = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const pending = getPendingCheckout();
    if (!pending) {
      setError('Complete plan and payment steps first.');
      setStep(0);
      return;
    }
    setLoading(true);
    try {
      await registerHr({ email, password });
      const me = await api.get<AuthUser>('/auth/me');
      if (me.companyId) {
        saveCompanySubscription({
          ...pending,
          companyId: me.companyId,
          companyEmail: me.email,
        });
      } else {
        clearPendingCheckout();
      }
      navigate('/hr/profile?onboarding=1');
    } catch (err) {
      setError(formatAuthError(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Logo to="/" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/pricing" className="text-sm text-slate-600 hover:text-indigo-600 dark:text-slate-300">
              View plans
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            Create your company account
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Choose a plan — every tier includes a {freeTrialLabel()} — then complete demo
            checkout and set up your login.
          </p>
        </div>

        <ol className="mx-auto mt-8 flex max-w-lg justify-between gap-2">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={`flex flex-1 flex-col items-center text-center text-xs sm:text-sm ${
                i <= step
                  ? 'font-medium text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400'
              }`}
            >
              <span
                className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                  i < step
                    ? 'bg-indigo-600 text-white'
                    : i === step
                      ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-indigo-400 dark:ring-offset-slate-950'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {i + 1}
              </span>
              {label}
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-6 max-w-3xl">
          <Alert variant="info">
            <strong>1-month free trial on all plans.</strong>{' '}
            You are not charged today; billing starts after the trial. Demo checkout is
            simulated — no real payment provider.
          </Alert>
        </div>

        {error && (
          <div className="mx-auto mt-4 max-w-3xl">
            <Alert onDismiss={() => setError('')}>{error}</Alert>
          </div>
        )}

        {step === 0 && (
          <div className="mx-auto mt-8 max-w-7xl">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex rounded-lg border border-slate-200 p-1 dark:border-slate-700">
                {(['monthly', 'annual'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBilling(b)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                      billing === b
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {b === 'monthly' ? 'Monthly' : 'Annual (−20%)'}
                  </button>
                ))}
              </div>
            </div>
            <PricingTierCards
              billing={billing}
              selectedPlanId={planId}
              onSelectPlan={setPlanId}
              showCta={false}
              fourInRow
            />
            <div className="mt-8 flex justify-center">
              <Button size="lg" onClick={goToPayment}>
                Continue to payment
              </Button>
            </div>
          </div>
        )}

        {step === 1 && plan && (
          <Card className="mx-auto mt-8 max-w-lg p-6 sm:p-8">
            <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Order summary — {plan.name}
              </p>
              <p className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Due today: €0 · {freeTrialLabel()}
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">
                Then {formatPlanPrice(plan, billing)}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  {billing === 'annual' ? 'per year' : 'per month'}
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Trial ends {formatTrialEndsAt(computeTrialEndsAt())} ·{' '}
                {planPriceSublineWithTrial(plan, billing)}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {plan.activeJobs} active jobs · {plan.gradedCandidatesPerMonth} graded
                candidates / month
              </p>
            </div>

            <form onSubmit={processDemoPayment} className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <CreditCard className="h-4 w-4" />
                Payment details
              </div>
              <Input
                label="Name on card (optional)"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Alex Martin"
              />
              <Input
                label="Card number (optional)"
                inputMode="numeric"
                autoComplete="cc-number"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry (optional)"
                  placeholder="12/28"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  autoComplete="cc-exp"
                />
                <Input
                  label="CVC (optional)"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="123"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  autoComplete="cc-csc"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Card is saved for billing after your free month (demo: leave empty or use{' '}
                <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">4242 4242 4242 4242</code>
                ), then click <strong>Start free trial</strong>.
              </p>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={processingPayment}>
                  {processingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    'Start free trial'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {step === 2 && plan && (
          <Card className="mx-auto mt-8 max-w-md p-6 sm:p-8">
            <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
              Free trial started (demo) · {plan.name} · billing from{' '}
              {formatTrialEndsAt(computeTrialEndsAt())}
            </div>
            <form onSubmit={onCreateAccount} className="space-y-4">
              <Input
                label="Work email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep(1)}
              >
                Back to payment
              </Button>
            </form>
          </Card>
        )}

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            Sign in
          </Link>
          {' · '}
          <Link to="/register" className="text-indigo-600 hover:underline dark:text-indigo-400">
            Candidate signup
          </Link>
        </p>
      </main>
    </div>
  );
}
