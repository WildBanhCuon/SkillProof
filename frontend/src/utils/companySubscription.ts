import type { BillingPeriod, PlanId } from '../data/pricingPlans';
import {
  computeTrialEndsAt,
  getPlanById,
  isSubscriptionOnTrial,
} from '../data/pricingPlans';

const PENDING_KEY = 'skillproof_checkout_pending';
const SUBSCRIPTION_PREFIX = 'skillproof_subscription_';

export interface CheckoutPending {
  planId: PlanId;
  billing: BillingPeriod;
  paymentLast4: string;
  paidAt: string;
  /** ISO date — end of the free trial (inclusive billing starts after). */
  trialEndsAt: string;
}

export interface CompanySubscription extends CheckoutPending {
  companyId: string;
  companyEmail?: string;
}

function subscriptionKey(companyId: string) {
  return `${SUBSCRIPTION_PREFIX}${companyId}`;
}

export function setPendingCheckout(data: Omit<CheckoutPending, 'trialEndsAt'> & {
  trialEndsAt?: string;
}) {
  const checkout: CheckoutPending = {
    ...data,
    trialEndsAt: data.trialEndsAt ?? computeTrialEndsAt(data.paidAt),
  };
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(checkout));
}

export function getPendingCheckout(): CheckoutPending | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutPending;
  } catch {
    return null;
  }
}

export function clearPendingCheckout() {
  sessionStorage.removeItem(PENDING_KEY);
}

export function saveCompanySubscription(sub: CompanySubscription) {
  localStorage.setItem(subscriptionKey(sub.companyId), JSON.stringify(sub));
  clearPendingCheckout();
}

export function getCompanySubscription(
  companyId: string | undefined,
): CompanySubscription | null {
  if (!companyId) return null;
  try {
    const raw = localStorage.getItem(subscriptionKey(companyId));
    if (!raw) return null;
    return JSON.parse(raw) as CompanySubscription;
  } catch {
    return null;
  }
}

export function getPlanLabel(sub: CompanySubscription): string {
  const plan = getPlanById(sub.planId);
  const name = plan?.name ?? sub.planId;
  const billing = sub.billing === 'annual' ? 'Annual' : 'Monthly';
  const trial = isSubscriptionOnTrial(sub.trialEndsAt) ? ' · Free trial' : '';
  return `${name} · ${billing}${trial}`;
}

export function formatTrialEndsAt(trialEndsAt: string | undefined): string {
  if (!trialEndsAt) return '';
  return new Date(trialEndsAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
