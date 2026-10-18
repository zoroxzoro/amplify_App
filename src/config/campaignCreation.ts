import { CampaignCategory, CampaignDraft } from '../types/campaign';

/**
 * Amplifund Campaign Creation Configuration & Validation Engine
 * Source of truth: Stitch Create Exports (create_01 through create_05)
 */

export interface WizardCategoryOption {
  id: CampaignCategory;
  label: string;
  icon: string;
  description: string;
}

export const WIZARD_CATEGORIES: WizardCategoryOption[] = [
  {
    id: 'environment',
    label: 'Environment & Public Health',
    icon: 'air',
    description: 'Ambient air monitoring, clean drinking water access, urban heat mitigation',
  },
  {
    id: 'civic',
    label: 'Civic Transparency',
    icon: 'policy',
    description: 'Municipal budget audits, public disclosure records, local governance',
  },
  {
    id: 'education',
    label: 'K-12 Educational Policy',
    icon: 'school',
    description: 'Classroom infrastructure, pupil welfare standards, school board policy',
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure Safety',
    icon: 'construction',
    description: 'Road condition telemetry, transit accessibility, pedestrian safety',
  },
  {
    id: 'science',
    label: 'Science & Biotech',
    icon: 'biotech',
    description: 'Independent clinical data audits, scientific research dissemination',
  },
  {
    id: 'culture',
    label: 'Arts & Culture',
    icon: 'palette',
    description: 'Community heritage conservation, public library preservation',
  },
];

export interface ChannelOption {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: string;
  minBudget?: number;
}

export const SYNDICATION_CHANNELS: ChannelOption[] = [
  {
    id: 'regional_press',
    title: 'Regional Digital Press & Local News',
    badge: 'High Trust',
    description: 'Direct sponsored editorial placement on top regional newspapers and accredited civic journals.',
    icon: 'newspaper',
  },
  {
    id: 'social_feeds',
    title: 'Meta & Social Feeds (Instagram/FB)',
    badge: 'Broad Viral',
    description: 'In-feed sponsored carousels and story cards targeting parents, resident associations, and local groups.',
    icon: 'share',
  },
  {
    id: 'civic_bulletins',
    title: 'Civic WhatsApp & Telegram Bulletins',
    badge: 'Direct Outreach',
    description: 'Curated digest delivery to verified resident welfare associations and community council feeds.',
    icon: 'chat',
  },
  {
    id: 'transit_displays',
    title: 'Transit & Digital Billboard Displays',
    badge: 'Budget Gate',
    description: 'Digital screens at metro hubs and transit plazas (requires minimum campaign threshold of ₹50,000).',
    icon: 'tv',
    minBudget: 50000,
  },
];

export const AUDIENCE_SEGMENT_OPTIONS: string[] = [
  'Parents & K-12 Families',
  'School Teachers & Admins',
  'Public Health Advocates',
  'Local Municipal Councilors',
  'Urban Planners',
  'Environmental Journalists',
  'Medical Professionals',
  'Resident Welfare Associations',
];

export const GEO_SCOPE_OPTIONS = [
  {
    id: 'hyperlocal' as const,
    label: 'Hyper-Local Radius',
    subtitle: 'Within 5–15 km around targeted schools or hotspots',
    badge: 'Recommended',
  },
  {
    id: 'metro' as const,
    label: 'City-wide Metropolitan Corridor',
    subtitle: 'Cross-district urban municipal coverage',
  },
  {
    id: 'regional' as const,
    label: 'Regional State-wide Broadcast',
    subtitle: 'Broad regional distribution across multiple towns',
  },
];

export const DURATION_OPTIONS = [
  { days: 7, label: '7 Days', subtitle: 'Rapid Pulse' },
  { days: 14, label: '14 Days', subtitle: 'Recommended', isRecommended: true },
  { days: 30, label: '30 Days', subtitle: 'Sustained Drive' },
];

export const CURATED_DEMO_IMAGES = {
  cover: [
    {
      label: 'Classroom Air Sensor (Stitch Reference)',
      uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBs9M9TRvzG-X9SvmOQWMdVcIPRyQGT7FLdNcIvliR76VQgTz_jDFfiFBm7T1_02ZFM4Lk5eB9v2PLEfMg9JSTck25-8F_IMGOcN-rPjX0pJrAVorhWcfWJaCYvJHbq5Tseh2FhHCfntvG6E5zg4aESgAlYhB1S9RC54TP1mHkor9VJ7BwVweX8cUm_EpMAj40oBLTHa6H5Mq4FXlg1BRUC40ddAlH0mzQFBX6I36jues2PUuP5Vp0',
      caption: 'Classroom sensor audit in primary corridor',
    },
    {
      label: 'Editorial Window Sensor',
      uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4N97BLZJsFVYIwatmmmQjluxvVHJSWOBLxTWv0DlS4_mCrlCfgfv2IADVZerOqEKkvl7UwG-cGRudx_2oBdzC-D-5O-bkQFEwYBfAkuYFYxlBZp9m0yzzVGxxLmoeg5MU_4ZbcT_qzwe9rw9xk3LahVgYVIq67rbuozZMbRUAo7302n65Kc32h0WczSxS2AfA9d-xwHVPr41NBVxL7Q3V8EYQNkYy9FJKRrbzh9PD8Zc_JcJO59U',
      caption: 'Natural lighting documentary telemetry',
    },
  ],
  feed: [
    {
      label: 'Clean Air Social Banner (1:1)',
      uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFPff25ioQARLufhmAT-BxeFIwTPv8uhsFaKjhrEoX2cE7A_Izf0t6Kj279drLP3CAkYoyURQJuXTl88fCKLND_5flnA7UmhhUzfElXK4CbH3AH1WqB1iVIdm8yQHorwoOkxyqVAgI9-pjKTXudI3DbIc3RCBL4fDLMsedsKZwNHL6Q6KZjqnExXK-2tLnzXvFGFUOef5EKcyzIXXYbESYJg33cWosJnWpPU2aJX1ifOC-bUnE01Y',
      caption: 'High contrast typographic social card',
    },
    {
      label: 'Data Visualization Graphic (1:1)',
      uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmPU0qhxZsU0ffe47idrogaiN3DjsMb4ZYUHcodUsgS-OB43A-vpMhE5MqVFcoY9uT-w0imH1UIJ1vscWEGhF1UEtjCyX0bN57JykA0cIOUmSffbXvV6U5UhqjTeOHaoFFBuyKMaL24LLcs8Rs6-X1W9wJR85rEWNTkGMkV5cGxTeHGrz89-bdJttj14Xp1002sSxRSz1dWK3C9sZ1_44PmhJSGDOlQaIDZ-u01NV04fP2SGvzk1k',
      caption: 'Forensic telemetry graph overlay',
    },
  ],
};

export const MIN_CAMPAIGN_BUDGET = 5000; // ₹5,000 minimum
export const MAX_CAMPAIGN_BUDGET = 1000000; // ₹10,00,000 maximum
export const DEFAULT_CAMPAIGN_BUDGET = 150000; // ₹1,50,000 (Stitch benchmark)

/**
 * Illustrative reach calculation helper.
 * NOTE: This is a simulated prototype model based on average civic CPM estimates.
 * It is NOT a guarantee or real programmatic ad flight guarantee.
 */
export function calculateCampaignProjectedReach(
  budget: number,
  channelCount: number = 3,
  geoScope: 'hyperlocal' | 'metro' | 'regional' = 'hyperlocal'
): { min: number; max: number; note: string } {
  const safeBudget = Math.max(MIN_CAMPAIGN_BUDGET, budget || 0);

  // Base multiplier: ₹1 buys ~0.65 to ~0.95 impressions depending on geo concentration
  let multiplierMin = 0.63;
  let multiplierMax = 0.94;

  if (geoScope === 'hyperlocal') {
    multiplierMin = 0.70;
    multiplierMax = 0.98;
  } else if (geoScope === 'metro') {
    multiplierMin = 0.65;
    multiplierMax = 0.90;
  } else {
    multiplierMin = 0.58;
    multiplierMax = 0.82;
  }

  // Multi-channel synergy factor (up to +15% reach efficiency)
  const channelSynergy = 1 + Math.min(channelCount, 4) * 0.03;

  const min = Math.round(safeBudget * multiplierMin * channelSynergy);
  const max = Math.round(safeBudget * multiplierMax * channelSynergy);

  return {
    min,
    max,
    note: 'Illustrative projection based on standard regional CPM benchmarks; subject to final review and inventory.',
  };
}

/**
 * Initial canonical draft state from Stitch reference
 */
export const DEFAULT_CAMPAIGN_DRAFT: CampaignDraft = {
  // Step 1: Basics
  title: 'Mandatory Air Quality Monitors in All Primary School Zones',
  category: 'environment',
  categoryLabel: 'Environment & Public Health',
  organization: 'Clean Air for Kids Coalition (Dr. R. Mehta)',
  summary:
    'Primary school children spend over six hours daily in unmonitored indoor air zones that regularly cross hazardous particulate thresholds. Our campaign pools local distribution funds to compel immediate installation of open-access sensors.',
  objective:
    'Mandate open-access, continuous air sensor monitoring in all district primary school corridors before the winter inversion cycle.',
  pillarWho:
    'Parents, school administrators, and municipal education committees across Ward 14–22.',
  pillarWhy:
    'Recent winter particulate spikes exceeded WHO thresholds by 420% during morning assemblies.',
  pillarEvidence:
    'Pediatric sensor telemetry and ISO 21501-4 calibrated optical readings gathered across 14 pilot classrooms.',
  targetBudget: DEFAULT_CAMPAIGN_BUDGET,

  // Step 2: Story
  storyHeadline:
    'Unseen Hazards: Why School HVAC Systems Demand Continuous Particulate Logging',
  storyDeck:
    'Pediatric sensor telemetry from 14 pilot classrooms demonstrates dangerous carbon and PM2.5 accumulation before afternoon dismissal.',
  storyProse:
    'Between November and February, ambient airborne particulate levels inside unventilated primary school facilities surged beyond baseline safety margins. Sensor arrays calibrated to ISO 21501-4 standards captured intermittent spikes exceeding 68 µg/m³ during high-occupancy intervals. In 82% of monitored instructional spaces, air exchange rates stalled below municipal guidelines, precipitating acute afternoon carbon-dioxide saturation.',
  storyImpact:
    'Securing this public broadcast will compel the district municipal board to fund and deploy real-time sensor dashboards accessible to all parents.',
  citations:
    'ISO 21501-4 optical sensor test logs, District School Environmental Health Report #2024-C, WHO Global Air Quality Guidelines (2021).',

  // Step 3: Visuals
  coverImageUri: CURATED_DEMO_IMAGES.cover[0].uri,
  feedCreativeUri: CURATED_DEMO_IMAGES.feed[0].uri,
  adHeadline: 'Does your child’s classroom meet clean air standards?',
  adCopy:
    'Real-time sensor audits show 78% of local classrooms lack ventilation. Back the public air report today.',
  callToAction: 'Read Civic Dossier',

  // Step 4: Reach
  geoScope: 'hyperlocal',
  focalArea: 'Within 15 km of Municipal Ward 14–22 Industrial Belt',
  priorityWards: ['Ward 14 (Central)', 'Ward 18 (North)', 'Ward 21 (Anand Nagar)'],
  audienceSegments: [
    'Parents & K-12 Families',
    'School Teachers & Admins',
    'Public Health Advocates',
    'Local Municipal Councilors',
  ],
  channels: [
    'Regional Digital Press & Local News',
    'Meta & Social Feeds (Instagram/FB)',
    'Civic WhatsApp & Telegram Bulletins',
  ],
  durationDays: 14,
  estimatedReach: {
    min: 95000,
    max: 140000,
  },

  // Step 5: Declarations
  termsAgreed: true,
  accuracyAffirmed: true,
  escrowAgreed: true,
};

// -------------------------------------------------------------
// Step Validation Rules
// -------------------------------------------------------------

export function validateStep1Basics(draft: CampaignDraft): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const trimmedTitle = draft.title?.trim() || '';
  if (!trimmedTitle) {
    errors.title = 'Campaign headline is required.';
  } else if (trimmedTitle.length < 10) {
    errors.title = 'Headline must be at least 10 characters long.';
  } else if (trimmedTitle.length > 80) {
    errors.title = 'Headline cannot exceed 80 characters.';
  }

  if (!draft.category) {
    errors.category = 'Please select a distribution category.';
  }

  const trimmedOrg = draft.organization?.trim() || '';
  if (!trimmedOrg) {
    errors.organization = 'Issuing organization or steward name is required.';
  }

  const trimmedSummary = draft.summary?.trim() || '';
  if (!trimmedSummary) {
    errors.summary = 'Executive summary is required.';
  } else if (trimmedSummary.length < 30) {
    errors.summary = 'Executive summary must be at least 30 characters.';
  } else if (trimmedSummary.length > 320) {
    errors.summary = 'Executive summary should not exceed 320 characters.';
  }

  const trimmedObjective = draft.objective?.trim() || '';
  if (!trimmedObjective) {
    errors.objective = 'Campaign objective is required.';
  }

  if (!draft.targetBudget || isNaN(draft.targetBudget)) {
    errors.targetBudget = 'A valid target advertising budget is required.';
  } else if (draft.targetBudget < MIN_CAMPAIGN_BUDGET) {
    errors.targetBudget = `Minimum budget threshold is ₹${MIN_CAMPAIGN_BUDGET.toLocaleString('en-IN')}.`;
  } else if (draft.targetBudget > MAX_CAMPAIGN_BUDGET) {
    errors.targetBudget = `Maximum budget is ₹${MAX_CAMPAIGN_BUDGET.toLocaleString('en-IN')}.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStep2Story(draft: CampaignDraft): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const trimmedHeadline = draft.storyHeadline?.trim() || '';
  if (!trimmedHeadline) {
    errors.storyHeadline = 'Story headline is required.';
  } else if (trimmedHeadline.length < 15) {
    errors.storyHeadline = 'Story headline must be at least 15 characters.';
  }

  const trimmedProse = draft.storyProse?.trim() || '';
  if (!trimmedProse) {
    errors.storyProse = 'Dossier background narrative is required.';
  } else if (trimmedProse.length < 80) {
    errors.storyProse = 'Please provide at least 80 characters detailing the problem and background.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStep3Visuals(draft: CampaignDraft): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!draft.coverImageUri?.trim()) {
    errors.coverImageUri = 'A 16:9 story header visual is required.';
  }

  const trimmedAdHeadline = draft.adHeadline?.trim() || '';
  if (!trimmedAdHeadline) {
    errors.adHeadline = 'Ad headline is required for programmatic feeds.';
  } else if (trimmedAdHeadline.length > 70) {
    errors.adHeadline = 'Ad headline cannot exceed 70 characters.';
  }

  const trimmedAdCopy = draft.adCopy?.trim() || '';
  if (!trimmedAdCopy) {
    errors.adCopy = 'Ad deck copy is required for syndication.';
  } else if (trimmedAdCopy.length > 140) {
    errors.adCopy = 'Ad copy cannot exceed 140 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStep4Reach(draft: CampaignDraft): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!draft.focalArea?.trim()) {
    errors.focalArea = 'Please specify a focal geographic coverage zone.';
  }

  if (!draft.audienceSegments || draft.audienceSegments.length === 0) {
    errors.audienceSegments = 'Please select at least 1 target audience segment.';
  }

  if (!draft.channels || draft.channels.length === 0) {
    errors.channels = 'Please select at least 1 syndication channel.';
  }

  if (!draft.durationDays || draft.durationDays <= 0) {
    errors.durationDays = 'Please select a valid broadcast duration.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateStep5Review(draft: CampaignDraft): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!draft.termsAgreed) {
    errors.termsAgreed = 'You must affirm the advertising syndication nature of this campaign.';
  }
  if (!draft.accuracyAffirmed) {
    errors.accuracyAffirmed = 'You must warrant the veracity of all cited empirical claims.';
  }
  if (!draft.escrowAgreed) {
    errors.escrowAgreed = 'You must agree to the 100% refund escrow protocol.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateAllSteps(draft: CampaignDraft): {
  isValid: boolean;
  firstInvalidStep: number | null;
  errors: Record<string, string>;
} {
  const step1 = validateStep1Basics(draft);
  if (!step1.isValid) return { isValid: false, firstInvalidStep: 1, errors: step1.errors };

  const step2 = validateStep2Story(draft);
  if (!step2.isValid) return { isValid: false, firstInvalidStep: 2, errors: step2.errors };

  const step3 = validateStep3Visuals(draft);
  if (!step3.isValid) return { isValid: false, firstInvalidStep: 3, errors: step3.errors };

  const step4 = validateStep4Reach(draft);
  if (!step4.isValid) return { isValid: false, firstInvalidStep: 4, errors: step4.errors };

  const step5 = validateStep5Review(draft);
  if (!step5.isValid) return { isValid: false, firstInvalidStep: 5, errors: step5.errors };

  return {
    isValid: true,
    firstInvalidStep: null,
    errors: {},
  };
}
