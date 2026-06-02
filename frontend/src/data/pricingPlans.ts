export type PlanId = 'starter' | 'growth' | 'scale' | 'pro';

export type BillingPeriod = 'monthly' | 'annual';

export interface PricingPlan {
  id: PlanId;
  name: string;
  targetSize: string;
  monthlyEur: number;
  annualEur: number;
  activeJobs: number;
  gradedCandidatesPerMonth: number;
  overageJobs: string;
  overageCandidates: string;
  highlighted?: boolean;
  features: string[];
}

/** From docs/pricing/pricing-strategy.md — proposed monthly tiers */
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    targetSize: '20–50 employees',
    monthlyEur: 149,
    annualEur: 1430,
    activeJobs: 2,
    gradedCandidatesPerMonth: 100,
    overageJobs: '€25 / extra active job',
    overageCandidates: '€1.00 / extra graded candidate',
    features: [
      '2 active job slots',
      '100 graded candidates / month',
      'Unlimited recruiter seats',
      'Job ad upgrade + AI assessments',
      'Rubric-based shortlists',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    targetSize: '50–100 employees',
    monthlyEur: 299,
    annualEur: 2870,
    activeJobs: 5,
    gradedCandidatesPerMonth: 300,
    overageJobs: '€20 / extra active job',
    overageCandidates: '€0.75 / extra graded candidate',
    highlighted: true,
    features: [
      '5 active job slots',
      '300 graded candidates / month',
      'Unlimited recruiter seats',
      'Everything in Starter',
      'Priority email support',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    targetSize: '100–250 employees',
    monthlyEur: 549,
    annualEur: 5270,
    activeJobs: 10,
    gradedCandidatesPerMonth: 800,
    overageJobs: '€15 / extra active job',
    overageCandidates: '€0.50 / extra graded candidate',
    features: [
      '10 active job slots',
      '800 graded candidates / month',
      'Unlimited recruiter seats',
      'Everything in Growth',
      'Dedicated onboarding call',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    targetSize: '250–500 employees',
    monthlyEur: 899,
    annualEur: 8630,
    activeJobs: 20,
    gradedCandidatesPerMonth: 2000,
    overageJobs: 'Custom volume pricing',
    overageCandidates: 'Custom volume pricing',
    features: [
      '20 active job slots',
      '2,000 graded candidates / month',
      'Unlimited recruiter seats',
      'Everything in Scale',
      'Custom overage & SLA options',
    ],
  },
];

export function getPlanById(id: PlanId): PricingPlan | undefined {
  return PRICING_PLANS.find((p) => p.id === id);
}

export function formatPlanPrice(plan: PricingPlan, billing: BillingPeriod): string {
  if (billing === 'annual') {
    return `€${plan.annualEur.toLocaleString('en-EU')}`;
  }
  return `€${plan.monthlyEur}`;
}

export function planPriceSubline(plan: PricingPlan, billing: BillingPeriod): string {
  if (billing === 'annual') {
    const perMonth = Math.round(plan.annualEur / 12);
    return `per year · ~€${perMonth}/mo (20% off)`;
  }
  return 'per month';
}
