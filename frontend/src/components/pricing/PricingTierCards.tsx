import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import {
  PRICING_PLANS,
  formatPlanPrice,
  freeTrialLabel,
  planPriceSublineWithTrial,
  type BillingPeriod,
  type PlanId,
} from '../../data/pricingPlans';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface PricingTierCardsProps {
  billing: BillingPeriod;
  selectedPlanId?: PlanId | null;
  onSelectPlan?: (planId: PlanId) => void;
  /** Show CTA buttons (pricing page). If false, selection is click-only (checkout). */
  showCta?: boolean;
  /** Four plans in one row (company checkout). */
  fourInRow?: boolean;
}

export function PricingTierCards({
  billing,
  selectedPlanId,
  onSelectPlan,
  showCta = true,
  fourInRow = false,
}: PricingTierCardsProps) {
  const gridClass = fourInRow
    ? 'min-w-[56rem] grid-cols-4 gap-3 sm:min-w-0 sm:gap-4'
    : 'gap-6 md:grid-cols-2 lg:grid-cols-4';

  const cards = PRICING_PLANS.map((plan) => {
        const selected = selectedPlanId === plan.id;
        const highlighted = plan.highlighted;

        return (
          <Card
            key={plan.id}
            className={`relative flex flex-col transition-shadow ${
              fourInRow ? 'p-4 sm:p-5' : 'p-6'
            } ${
              selected
                ? 'ring-2 ring-indigo-600 dark:ring-indigo-400'
                : highlighted
                  ? 'border-indigo-200 shadow-md dark:border-indigo-800'
                  : ''
            } ${onSelectPlan ? 'cursor-pointer hover:shadow-md' : ''}`}
            onClick={onSelectPlan ? () => onSelectPlan(plan.id) : undefined}
            role={onSelectPlan ? 'button' : undefined}
            tabIndex={onSelectPlan ? 0 : undefined}
            onKeyDown={
              onSelectPlan
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPlan(plan.id);
                    }
                  }
                : undefined
            }
          >
            {highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white">
                Most popular
              </span>
            )}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {plan.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {plan.targetSize}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                {freeTrialLabel()}
              </p>
              <p
                className={`mt-1 font-bold tracking-tight text-slate-900 dark:text-slate-100 ${
                  fourInRow ? 'text-2xl sm:text-3xl' : 'text-3xl'
                }`}
              >
                {formatPlanPrice(plan, billing)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {planPriceSublineWithTrial(plan, billing)}
              </p>
            </div>
            <ul
              className={`mt-5 flex-1 space-y-2 text-sm text-slate-600 dark:text-slate-300 ${
                fourInRow ? 'space-y-1.5 text-xs sm:text-sm' : ''
              }`}
            >
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              Overage: {plan.overageJobs}; {plan.overageCandidates}
            </p>
            {showCta && (
              <div className="mt-6">
                <Link
                  to={`/register/company?plan=${plan.id}&billing=${billing}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    className="w-full"
                    variant={highlighted ? 'primary' : 'outline'}
                  >
                    Start free trial
                  </Button>
                </Link>
              </div>
            )}
            {onSelectPlan && selected && (
              <p className="mt-4 text-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
                Selected
              </p>
            )}
          </Card>
        );
  });

  if (fourInRow) {
    return (
      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className={`grid ${gridClass}`}>{cards}</div>
      </div>
    );
  }

  return <div className={`grid ${gridClass}`}>{cards}</div>;
}
