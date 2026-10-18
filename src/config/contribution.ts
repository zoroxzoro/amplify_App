/**
 * Centralized Contribution and Advertising Allocation Configuration
 * Amplifund Civic Distribution Protocol
 */

export const MIN_CONTRIBUTION = 50; // In INR (₹)
export const MAX_CONTRIBUTION = 50000; // In INR (₹)
export const DEFAULT_CONTRIBUTION = 250; // In INR (₹)

export interface ContributionTier {
  amount: number;
  reachLabel: string;
  isPopular?: boolean;
}

export const CONTRIBUTION_TIERS: ContributionTier[] = [
  { amount: 100, reachLabel: '~700 local residents' },
  { amount: 250, reachLabel: '~1,850 residents', isPopular: true },
  { amount: 500, reachLabel: '~3,900 residents + 1 ward' },
  { amount: 1000, reachLabel: '~8,200 priority impressions' },
  { amount: 2500, reachLabel: '~21,000 regional impressions' },
];

/**
 * Transparent statutory allocation percentages (demonstration model).
 * 88% Direct Targeted Ad Inventory
 * 8% Independent Evidence Verification & Auditing Desk
 * 4% Secure Custodial Escrow & Gateway Fee
 */
export const ALLOCATION_PERCENTAGES = {
  AD_INVENTORY: 0.88,
  VERIFICATION: 0.08,
  ESCROW_GATEWAY: 0.04,
} as const;

export interface AllocationBreakdown {
  grossAmount: number;
  adSpend: number;
  verificationFee: number;
  gatewayFee: number;
  totalPayable: number;
}

/**
 * Computes transparent breakdown for any given contribution amount.
 */
export function calculateAllocation(amount: number): AllocationBreakdown {
  const safeAmount = Math.max(0, amount);
  const adSpend = Math.round(safeAmount * ALLOCATION_PERCENTAGES.AD_INVENTORY * 100) / 100;
  const verificationFee = Math.round(safeAmount * ALLOCATION_PERCENTAGES.VERIFICATION * 100) / 100;
  const gatewayFee = Math.round((safeAmount - adSpend - verificationFee) * 100) / 100;

  return {
    grossAmount: safeAmount,
    adSpend,
    verificationFee,
    gatewayFee,
    totalPayable: safeAmount,
  };
}

/**
 * Computes estimated audience impressions based on CPM.
 * Defaults to ₹88 effective CPM benchmark.
 */
export function calculateProjectedReach(amount: number, cpmRate: number = 88): {
  estimatedImpressions: number;
  minReach: number;
  maxReach: number;
  formattedReach: string;
} {
  const safeAmount = Math.max(0, amount);
  // ad spend is 88% of contribution
  const netAdSpend = safeAmount * ALLOCATION_PERCENTAGES.AD_INVENTORY;
  const rawReach = Math.round((netAdSpend / cpmRate) * 1000);
  const minReach = Math.round(rawReach * 0.9);
  const maxReach = Math.round(rawReach * 1.15);

  const formattedReach = rawReach >= 1000
    ? `~${(rawReach / 1000).toFixed(1)}k`
    : `~${rawReach}`;

  return {
    estimatedImpressions: rawReach,
    minReach,
    maxReach,
    formattedReach,
  };
}

/**
 * Validates user-entered contribution amount.
 */
export function validateContributionAmount(amount: number): {
  isValid: boolean;
  error?: string;
} {
  if (isNaN(amount) || amount <= 0) {
    return { isValid: false, error: 'Please enter a valid contribution amount.' };
  }
  if (amount < MIN_CONTRIBUTION) {
    return {
      isValid: false,
      error: `Minimum allocation is ₹${MIN_CONTRIBUTION}.`,
    };
  }
  if (amount > MAX_CONTRIBUTION) {
    return {
      isValid: false,
      error: `Maximum allocation is ₹${MAX_CONTRIBUTION.toLocaleString('en-IN')}.`,
    };
  }
  return { isValid: true };
}
