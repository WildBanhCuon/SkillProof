import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import {
  getPlanById,
  isSubscriptionOnTrial,
  planPriceSublineWithTrial,
} from '../../data/pricingPlans';
import {
  formatTrialEndsAt,
  getCompanySubscription,
  getPlanLabel,
} from '../../utils/companySubscription';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function SubscriptionPlanCard() {
  const { user } = useAuth();
  const sub = getCompanySubscription(user?.companyId);

  if (!sub) {
    return (
      <Card className="mb-6 border-dashed p-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          No subscription on file for this browser. New companies pick a plan during{' '}
          <Link to="/register/company" className="font-medium text-indigo-600 dark:text-indigo-400">
            company signup
          </Link>
          .
        </p>
      </Card>
    );
  }

  const plan = getPlanById(sub.planId);

  return (
    <Card className="mb-6 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/60">
            <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Current plan (demo)
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {getPlanLabel(sub)}
            </p>
            {plan && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {planPriceSublineWithTrial(plan, sub.billing)} · {plan.activeJobs} jobs ·{' '}
                {plan.gradedCandidatesPerMonth} graded candidates/mo
              </p>
            )}
            {isSubscriptionOnTrial(sub.trialEndsAt) && (
              <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Free trial active until {formatTrialEndsAt(sub.trialEndsAt)}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Demo payment ···{sub.paymentLast4} ·{' '}
              {new Date(sub.paidAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Link to="/pricing">
          <Button variant="outline" size="sm">
            View plans
          </Button>
        </Link>
      </div>
    </Card>
  );
}
