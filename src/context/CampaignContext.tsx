import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Campaign, CampaignDraft, Contribution } from '../types/campaign';
import { ActivityItemData } from '../types/activity';
import { SEED_CAMPAIGNS } from '../data/seedCampaigns';
import { SEED_ACTIVITIES } from '../data/mockActivities';

export const DEMO_CREATOR = {
  id: 'cr1',
  name: 'Dr. Ananya Sen',
  title: 'Urban Ecologist & Steward',
  organization: 'Institute of Public Ecology & Civic Policy',
  idCode: 'ID #8842-SEN',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
};

interface CampaignContextType {
  campaigns: Campaign[];
  creatorCampaigns: Campaign[];
  contributions: Contribution[];
  activities: ActivityItemData[];
  selectedCategory: string;
  creatorViewMode: 'demo_creator' | 'new_creator';
  setCreatorViewMode: (mode: 'demo_creator' | 'new_creator') => void;
  setSelectedCategory: (category: string) => void;
  getCampaignById: (id: string) => Campaign | undefined;
  createCampaign: (draft: CampaignDraft) => Promise<Campaign>;
  updateCampaignStatus: (campaignId: string, status: any) => Promise<void>;
  markActivityAsRead: (id: string) => void;
  markAllActivitiesAsRead: () => void;
  addContribution: (
    campaignId: string,
    amount: number,
    options?: {
      status?: 'confirmed' | 'failed';
      paymentMethod?: string;
      allocation?: {
        adSpend: number;
        verificationFee: number;
        gatewayFee: number;
        totalPayable: number;
      };
    }
  ) => Promise<Contribution>;
  calculateEstimatedReach: (amount: number) => { min: number; max: number };
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const STORAGE_KEY_CONTRIBUTIONS = '@amplifund_contributions';
const STORAGE_KEY_USER_CAMPAIGNS = '@amplifund_user_created_campaigns';
const STORAGE_KEY_ACTIVITIES = '@amplifund_activities';

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED_CAMPAIGNS);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [activities, setActivities] = useState<ActivityItemData[]>(SEED_ACTIVITIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [creatorViewMode, setCreatorViewMode] = useState<'demo_creator' | 'new_creator'>('demo_creator');

  useEffect(() => {
    // Attempt non-blocking load of persisted contributions, activities & user created campaigns
    AsyncStorage.getItem(STORAGE_KEY_CONTRIBUTIONS)
      .then((data) => {
        if (data) {
          try {
            setContributions(JSON.parse(data));
          } catch {
            // fallback gracefully
          }
        }
      })
      .catch(() => {});

    AsyncStorage.getItem(STORAGE_KEY_ACTIVITIES)
      .then((data) => {
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setActivities(parsed);
            }
          } catch {
            // fallback gracefully
          }
        }
      })
      .catch(() => {});

    AsyncStorage.getItem(STORAGE_KEY_USER_CAMPAIGNS)
      .then((data) => {
        if (data) {
          try {
            const userCamps: Campaign[] = JSON.parse(data);
            if (Array.isArray(userCamps) && userCamps.length > 0) {
              setCampaigns((prev) => {
                const existingIds = new Set(prev.map((c) => c.id));
                const filteredNew = userCamps.filter((c) => !existingIds.has(c.id));
                return [...filteredNew, ...prev];
              });
            }
          } catch {
            // fallback gracefully
          }
        }
      })
      .catch(() => {});
  }, []);

  const getCampaignById = (id: string) => {
    return campaigns.find((c) => c.id === id);
  };

  const calculateEstimatedReach = (amount: number) => {
    // Formula based on design benchmark: ₹500 ≈ 3,500 – 4,800 reach (7x to 9.6x multiplier)
    const min = Math.round(amount * 7);
    const max = Math.round(amount * 9.6);
    return { min, max };
  };

  const createCampaign = async (draft: CampaignDraft): Promise<Campaign> => {
    const timestamp = new Date().toISOString();
    const newId = `camp_${Date.now()}`;
    const avgReach = Math.round((draft.estimatedReach.min + draft.estimatedReach.max) / 2);

    const creatorId = creatorViewMode === 'new_creator' ? 'new_creator_user' : DEMO_CREATOR.id;
    const creatorName = creatorViewMode === 'new_creator' ? 'New Creator' : DEMO_CREATOR.name;

    const newCampaign: Campaign = {
      id: newId,
      title: draft.title.trim(),
      creatorName,
      creatorId,
      isUserCreated: true,
      creator: {
        id: creatorId,
        name: creatorName,
        organization: draft.organization.trim() || DEMO_CREATOR.organization,
        kycVerified: true,
        avatarUrl: DEMO_CREATOR.avatarUrl,
      },
      category: draft.category,
      categoryLabel: draft.categoryLabel || 'Civic Topic',
      shortDescription: draft.summary.trim(),
      summary: draft.summary.trim(),
      storyDossier: draft.storyProse.trim(),
      coverImage:
        draft.coverImageUri ||
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      imageUrl:
        draft.coverImageUri ||
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      targetAmount: draft.targetBudget,
      raisedAmount: 0,
      currency: 'INR',
      status: 'pending_review',
      statusLabel: 'Under Review • Stage 1 of 4',
      auditStage: 'Stage 1 of 4: Initial Intake',
      auditRubricPassed: 1,
      auditRubricTotal: 4,
      auditNote:
        'Cryptographic dossier timestamp registered. Editorial verification in queue.',
      estimatedReach: avgReach,
      metrics: {
        targetAmount: draft.targetBudget,
        fundedAmount: 0,
        backersCount: 0,
        targetImpressions: avgReach,
        deliveredImpressions: 0,
        daysLeft: draft.durationDays || 14,
        adPlacements: draft.channels.join(', ') || 'Regional News Feeds',
      },
      performanceAudit: {
        hasMeasuredData: false,
        isIllustrativeDemo: false,
      },
      targetRegion: draft.focalArea || 'Hyper-Local Zone',
      createdAt: timestamp,
      updatedAt: timestamp,
      objective: draft.objective,
      story: {
        headline: draft.storyHeadline,
        deck: draft.storyDeck,
        problemBackground: draft.storyProse,
        intendedImpact: draft.storyImpact,
        evidenceSources: draft.citations ? [draft.citations] : [],
        pillarWho: draft.pillarWho,
        pillarWhy: draft.pillarWhy,
        pillarEvidence: draft.pillarEvidence,
      },
      adCreative: {
        adHeadline: draft.adHeadline,
        adCopy: draft.adCopy,
        callToAction: draft.callToAction,
        coverImageUri: draft.coverImageUri,
        feedCreativeUri: draft.feedCreativeUri,
      },
      targeting: {
        geographicFootprint: draft.geoScope,
        focalArea: draft.focalArea,
        priorityWards: draft.priorityWards,
        audienceSegments: draft.audienceSegments,
        channels: draft.channels,
        durationDays: draft.durationDays,
        estimatedReach: draft.estimatedReach,
      },
      reviewStatus: 'pending_review',
    };

    setCampaigns((prev) => [newCampaign, ...prev]);

    // Prepend activity log entry
    const newActivity: ActivityItemData = {
      id: `act_user_${Date.now()}`,
      category: 'editorial',
      type: 'campaign_submitted',
      title: `Campaign Blueprint Submitted: ${draft.title.trim()}`,
      body: 'Your campaign entered the statutory 24-hour verification queue with clean structural hashes.',
      timeLabel: 'Just now • System Protocol',
      timestamp,
      dateGroup: 'today',
      isUnread: true,
      campaignId: newId,
      campaignTitle: draft.title.trim(),
      actionLabel: 'Track in Creator Studio',
      actionType: 'creator_dashboard',
      badgeText: 'Stage 1 of 4: Intake',
    };
    setActivities((prev) => {
      const updated = [newActivity, ...prev];
      AsyncStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(updated)).catch(() => {});
      return updated;
    });

    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEY_USER_CAMPAIGNS);
      const existingList: Campaign[] = existingData ? JSON.parse(existingData) : [];
      const updatedList = [newCampaign, ...existingList.filter((c) => c.id !== newId)];
      await AsyncStorage.setItem(STORAGE_KEY_USER_CAMPAIGNS, JSON.stringify(updatedList));
    } catch {
      // safe fallback
    }

    return newCampaign;
  };

  const addContribution = async (
    campaignId: string,
    amount: number,
    options?: {
      status?: 'confirmed' | 'failed';
      paymentMethod?: string;
      allocation?: {
        adSpend: number;
        verificationFee: number;
        gatewayFee: number;
        totalPayable: number;
      };
    }
  ): Promise<Contribution> => {
    const campaign = getCampaignById(campaignId);
    const reach = calculateEstimatedReach(amount);
    const contributionStatus = options?.status || 'confirmed';

    const newContribution: Contribution = {
      id: `contrib_${Date.now()}`,
      campaignId,
      campaignTitle: campaign?.title || 'Civic Amplification',
      amount,
      estimatedReach: reach,
      timestamp: new Date().toISOString(),
      status: contributionStatus,
      receiptId: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: options?.paymentMethod || 'Demo UPI',
      allocation: options?.allocation,
    };

    const updated = [newContribution, ...contributions];
    setContributions(updated);

    // Only update campaign funded metric and log activity if transaction succeeded
    if (contributionStatus === 'confirmed') {
      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id === campaignId) {
            const newFunded = (c.raisedAmount ?? c.metrics.fundedAmount) + amount;
            return {
              ...c,
              raisedAmount: newFunded,
              metrics: {
                ...c.metrics,
                fundedAmount: newFunded,
                backersCount: c.metrics.backersCount + 1,
              },
            };
          }
          return c;
        })
      );

      const contribActivity: ActivityItemData = {
        id: `act_user_${Date.now()}`,
        category: 'escrow',
        type: 'contribution_cleared',
        title: `Contribution Cleared: ₹${amount.toLocaleString()} (${reach.min.toLocaleString()}–${reach.max.toLocaleString()} Est. Reach)`,
        body: `Your backing for '${campaign?.title || 'Civic Campaign'}' is held in statutory escrow. Receipt ${newContribution.receiptId} issued.`,
        timeLabel: 'Just now • Payment Receipt',
        timestamp: newContribution.timestamp,
        dateGroup: 'today',
        isUnread: true,
        campaignId,
        campaignTitle: campaign?.title,
        actionLabel: 'View Campaign',
        actionType: 'campaign',
        badgeText: 'Escrow clearing protocol initiated',
      };
      setActivities((prev) => {
        const next = [contribActivity, ...prev];
        AsyncStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(next)).catch(() => {});
        return next;
      });
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY_CONTRIBUTIONS, JSON.stringify(updated));
    } catch {
      // safe fallback
    }

    return newContribution;
  };

  const creatorCampaigns = React.useMemo(() => {
    if (creatorViewMode === 'new_creator') {
      return campaigns.filter((c) => c.isUserCreated && c.creatorId === 'new_creator_user');
    }
    return campaigns.filter(
      (c) =>
        c.creatorId === DEMO_CREATOR.id ||
        c.creator?.id === DEMO_CREATOR.id ||
        c.isUserCreated === true
    );
  }, [campaigns, creatorViewMode]);

  const visibleActivities = React.useMemo(() => {
    if (creatorViewMode === 'new_creator') {
      return activities.filter((a) => a.id.startsWith('act_user_'));
    }
    return activities;
  }, [activities, creatorViewMode]);

  const markActivityAsRead = (id: string) => {
    setActivities((prev) => {
      const next = prev.map((act) => (act.id === id ? { ...act, isUnread: false } : act));
      AsyncStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  const markAllActivitiesAsRead = () => {
    setActivities((prev) => {
      const next = prev.map((act) => ({ ...act, isUnread: false }));
      AsyncStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  const updateCampaignStatus = async (campaignId: string, status: any) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            status,
            statusLabel:
              status === 'active' || status === 'amplified'
                ? 'Live Broadcast Flight'
                : status === 'approved'
                ? 'Approved • Funding Open'
                : status === 'pending_review'
                ? 'Under Editorial Review'
                : status === 'rejected'
                ? 'Action Required'
                : status === 'completed'
                ? 'Completed'
                : 'Draft',
          };
        }
        return c;
      })
    );
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        creatorCampaigns,
        contributions,
        activities: visibleActivities,
        selectedCategory,
        creatorViewMode,
        setCreatorViewMode,
        setSelectedCategory,
        getCampaignById,
        createCampaign,
        updateCampaignStatus,
        markActivityAsRead,
        markAllActivitiesAsRead,
        addContribution,
        calculateEstimatedReach,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
};
