export type ActivityCategory = 'all' | 'broadcasts' | 'escrow' | 'editorial' | 'milestones';

export type ActivityType =
  | 'broadcast_live'
  | 'milestone_met'
  | 'contribution_cleared'
  | 'editorial_review'
  | 'audit_report'
  | 'campaign_submitted';

export type ActivityDateGroup = 'today' | 'yesterday' | 'earlier';

export interface ActivityMetricsChip {
  label: string;
  sublabel: string;
  progressPercent: number;
  footnote?: string;
}

export interface ActivityItemData {
  id: string;
  category: 'broadcasts' | 'escrow' | 'editorial' | 'milestones';
  type: ActivityType;
  title: string;
  body: string;
  timeLabel: string;
  timestamp: string;
  dateGroup: ActivityDateGroup;
  isUnread: boolean;
  campaignId?: string;
  campaignTitle?: string;
  actionLabel?: string;
  actionType?: 'telemetry' | 'campaign' | 'creator_dashboard' | 'receipt';
  badgeText?: string;
  metricsChip?: ActivityMetricsChip;
}
