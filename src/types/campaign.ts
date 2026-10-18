export type CampaignCategory =
  | 'environment'
  | 'transparency'
  | 'education'
  | 'infrastructure'
  | 'healthcare'
  | 'civic'
  | 'science'
  | 'culture';

export type CampaignStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'active'
  | 'completed'
  | 'rejected'
  | 'pending'
  | 'amplified'
  | 'restricted';

export interface CampaignCreator {
  id: string;
  name: string;
  title?: string;
  organization?: string;
  kycVerified: boolean;
  avatarUrl?: string;
}

export interface DistributionMetrics {
  targetAmount: number; // in INR
  fundedAmount: number; // in INR
  backersCount: number;
  targetImpressions: number; // e.g. 185,000 citizens
  deliveredImpressions?: number;
  daysLeft: number;
  adPlacements: string; // e.g. "Regional News & Audio", "Social Feeds & Meta"
  cpmRateEstimate?: number;
}

export interface CampaignStory {
  headline?: string;
  deck?: string;
  problemBackground?: string;
  intendedImpact?: string;
  evidenceSources?: string[];
  pillarWho?: string;
  pillarWhy?: string;
  pillarEvidence?: string;
}

export interface AdCreativeDetails {
  adHeadline?: string;
  adCopy?: string;
  callToAction?: string;
  coverImageUri?: string;
  feedCreativeUri?: string;
  storyCreativeUri?: string;
}

export interface TargetingDetails {
  geographicFootprint: 'hyperlocal' | 'metro' | 'regional';
  focalArea: string;
  priorityWards?: string[];
  audienceSegments: string[];
  channels: string[];
  durationDays: number;
  customDuration?: string;
  estimatedReach: {
    min: number;
    max: number;
  };
}

export interface PerformanceAuditChannel {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  status: 'active' | 'scheduled' | 'completed';
  spend: number;
  impressions: number;
  clicks: number;
  effectiveCpm: number;
}

export interface PerformanceAuditDailyPoint {
  day: string;
  impressions: number;
  isActual: boolean;
}

export interface PerformanceAuditData {
  flightId?: string;
  reportingPeriod?: string;
  flightDay?: number;
  totalFlightDays?: number;
  deployedMediaSpend?: number;
  verifiedImpressions?: number;
  uniqueCitizens?: number;
  dossierReads?: number;
  deepReadsCitizens?: number;
  deepReadPercent?: number;
  ctr?: number;
  focalCorridor?: string;
  hasMeasuredData: boolean;
  isIllustrativeDemo?: boolean;
  merkleRootHash?: string;
  lastSealedLedger?: string;
  independentNodesAttested?: string;
  channels?: PerformanceAuditChannel[];
  dailyDelivery?: PerformanceAuditDailyPoint[];
}

export interface Campaign {
  id: string;
  title: string;
  creatorName: string;
  creator: CampaignCreator;
  category: CampaignCategory;
  categoryLabel: string;
  shortDescription: string;
  summary: string;
  storyDossier?: string;
  coverImage?: string;
  imageUrl?: string;
  targetAmount: number;
  raisedAmount: number;
  currency: string;
  status: CampaignStatus;
  statusLabel: string;
  estimatedReach: number;
  metrics: DistributionMetrics;
  isFeatured?: boolean;
  isUrgent?: boolean;
  isSpotlight?: boolean;
  targetRegion: string;
  createdAt: string;
  updatedAt: string;

  // Extended wizard metadata
  objective?: string;
  story?: CampaignStory;
  adCreative?: AdCreativeDetails;
  targeting?: TargetingDetails;
  reviewStatus?: 'pending_review' | 'under_review' | 'approved' | 'rejected';

  // Creator Studio & Performance Audit fields
  isUserCreated?: boolean;
  creatorId?: string;
  auditNote?: string;
  auditStage?: string;
  auditRubricPassed?: number;
  auditRubricTotal?: number;
  performanceAudit?: PerformanceAuditData;
}

export interface CampaignDraft {
  // Step 1: Basics
  title: string;
  category: CampaignCategory;
  categoryLabel: string;
  organization: string;
  summary: string;
  objective: string;
  pillarWho: string;
  pillarWhy: string;
  pillarEvidence: string;
  targetBudget: number;

  // Step 2: Story
  storyHeadline: string;
  storyDeck: string;
  storyProse: string;
  storyImpact: string;
  citations: string;

  // Step 3: Visuals
  coverImageUri: string;
  feedCreativeUri: string;
  adHeadline: string;
  adCopy: string;
  callToAction: string;

  // Step 4: Reach
  geoScope: 'hyperlocal' | 'metro' | 'regional';
  focalArea: string;
  priorityWards: string[];
  audienceSegments: string[];
  channels: string[];
  durationDays: number;
  estimatedReach: {
    min: number;
    max: number;
  };

  // Step 5: Declarations
  termsAgreed: boolean;
  accuracyAffirmed: boolean;
  escrowAgreed: boolean;
}


export interface Contribution {
  id: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  estimatedReach: {
    min: number;
    max: number;
  };
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  receiptId?: string;
  paymentMethod?: string;
  allocation?: {
    adSpend: number;
    verificationFee: number;
    gatewayFee: number;
    totalPayable: number;
  };
}
