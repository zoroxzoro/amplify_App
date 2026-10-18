import { CampaignStatus } from '../types/campaign';

/**
 * Standard Indian Rupee (INR) currency formatter.
 * Handles both full formatted strings (e.g. ₹1,80,000) and compact formats (e.g. ₹3.22L).
 */
export function formatCurrencyINR(
  amount: number,
  options?: { compact?: boolean; hideSymbol?: boolean }
): string {
  const safeAmount = isNaN(amount) ? 0 : Math.round(amount);
  const symbol = options?.hideSymbol ? '' : '₹';

  if (options?.compact) {
    if (Math.abs(safeAmount) >= 10000000) {
      return `${symbol}${(safeAmount / 10000000).toFixed(2)}Cr`;
    }
    if (Math.abs(safeAmount) >= 100000) {
      return `${symbol}${(safeAmount / 100000).toFixed(2)}L`;
    }
    if (Math.abs(safeAmount) >= 1000) {
      return `${symbol}${(safeAmount / 1000).toFixed(1)}k`;
    }
  }

  return `${symbol}${safeAmount.toLocaleString('en-IN')}`;
}

/**
 * Standard number formatter for impressions and citizen counts.
 * E.g. 185,000 or compact 185k / 412k.
 */
export function formatNumberIN(
  num: number,
  options?: { compact?: boolean }
): string {
  const safeNum = isNaN(num) ? 0 : Math.round(num);

  if (options?.compact) {
    if (Math.abs(safeNum) >= 1000000) {
      return `${(safeNum / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(safeNum) >= 1000) {
      return `${Math.round(safeNum / 1000)}k`;
    }
  }

  return safeNum.toLocaleString('en-IN');
}

/**
 * Returns human-readable label and display badge metadata for any CampaignStatus.
 */
export interface StatusDisplayMeta {
  label: string;
  badgeText: string;
  variant: 'active' | 'pending' | 'restricted' | 'verified' | 'default';
  dotColor?: string;
  bgTint?: string;
}

export function getCampaignStatusMeta(status: CampaignStatus): StatusDisplayMeta {
  switch (status) {
    case 'amplified':
    case 'active':
      return {
        label: 'Live Broadcast Flight',
        badgeText: 'LIVE SYNDICATION',
        variant: 'active',
        dotColor: '#245B43',
        bgTint: '#b5efd0',
      };
    case 'approved':
      return {
        label: 'Approved • Funding Open',
        badgeText: 'FUNDING OPEN',
        variant: 'verified',
        dotColor: '#175039',
        bgTint: '#dde4dc',
      };
    case 'pending_review':
    case 'pending':
      return {
        label: 'Under Editorial Review',
        badgeText: 'UNDER REVIEW',
        variant: 'pending',
        dotColor: '#5b2f00',
        bgTint: '#ffdcc2',
      };
    case 'rejected':
      return {
        label: 'Action Required • Audit Revision',
        badgeText: 'ACTION REQUIRED',
        variant: 'restricted',
        dotColor: '#ba1a1a',
        bgTint: '#ffdad6',
      };
    case 'completed':
      return {
        label: 'Completed Broadcast',
        badgeText: 'COMPLETED',
        variant: 'default',
        dotColor: '#59605a',
        bgTint: '#ebefe6',
      };
    case 'draft':
    default:
      return {
        label: 'Unpublished Draft',
        badgeText: 'DRAFT',
        variant: 'default',
        dotColor: '#707973',
        bgTint: '#dfe4da',
      };
  }
}
