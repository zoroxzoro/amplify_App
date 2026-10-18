import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ScreenContainer,
  AppText,
  DashboardMetricCard,
  CreatorCampaignCard,
  PerformanceEmptyState,
  Toast,
} from '../../src/components';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { useCampaigns, DEMO_CREATOR } from '../../src/context/CampaignContext';
import { Campaign, CampaignDraft } from '../../src/types/campaign';
import { formatCurrencyINR, formatNumberIN } from '../../src/utils/formatters';

type FilterKey = 'all' | 'action' | 'promoting' | 'funding' | 'review' | 'drafts';

const DRAFT_STORAGE_KEY = '@amplifund_wizard_draft';

export default function CreatorDashboardScreen() {
  const router = useRouter();
  const {
    creatorCampaigns,
    creatorViewMode,
    setCreatorViewMode,
  } = useCampaigns();

  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedAuditCampaign, setSelectedAuditCampaign] = useState<Campaign | null>(null);
  const [localDraft, setLocalDraft] = useState<CampaignDraft | null>(null);

  // Check if there is an unsaved wizard draft in AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem(DRAFT_STORAGE_KEY)
      .then((data) => {
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (parsed.title || parsed.summary) {
              setLocalDraft(parsed);
            }
          } catch {
            // fallback
          }
        }
      })
      .catch(() => {});
  }, []);

  // Compute live studio metrics from creator campaigns
  const metrics = useMemo(() => {
    const activeFlights = creatorCampaigns.filter(
      (c) => c.status === 'active' || c.status === 'amplified'
    ).length;

    const totalMobilized = creatorCampaigns.reduce(
      (sum, c) => sum + (c.raisedAmount ?? c.metrics.fundedAmount ?? 0),
      0
    );

    const totalVerifiedReach = creatorCampaigns.reduce((sum, c) => {
      const delivered =
        c.performanceAudit?.verifiedImpressions || c.metrics.deliveredImpressions || 0;
      return sum + delivered;
    }, 0);

    const awaitingReviewCount = creatorCampaigns.filter(
      (c) => c.status === 'pending_review' || c.status === 'pending'
    ).length;

    const actionCount = creatorCampaigns.filter((c) => c.status === 'rejected').length;

    const fundingCount = creatorCampaigns.filter((c) => c.status === 'approved').length;

    const draftsCount = (localDraft ? 1 : 0) + creatorCampaigns.filter((c) => c.status === 'draft').length;

    return {
      activeFlights,
      totalMobilized,
      totalVerifiedReach,
      awaitingReviewCount,
      actionCount,
      fundingCount,
      draftsCount,
      totalCount: creatorCampaigns.length + (localDraft ? 1 : 0),
    };
  }, [creatorCampaigns, localDraft]);

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    switch (activeFilter) {
      case 'action':
        return creatorCampaigns.filter((c) => c.status === 'rejected');
      case 'promoting':
        return creatorCampaigns.filter(
          (c) => c.status === 'active' || c.status === 'amplified'
        );
      case 'funding':
        return creatorCampaigns.filter((c) => c.status === 'approved');
      case 'review':
        return creatorCampaigns.filter(
          (c) => c.status === 'pending_review' || c.status === 'pending'
        );
      case 'drafts':
        return creatorCampaigns.filter((c) => c.status === 'draft');
      case 'all':
      default:
        return creatorCampaigns;
    }
  }, [creatorCampaigns, activeFilter]);

  const handleShareTelemetry = async (campaign: Campaign) => {
    try {
      await Share.share({
        title: campaign.title,
        message: `Inspect verified broadcast telemetry for "${campaign.title}" on Amplifund Civic Distribution Protocol. Real-time impressions: ${formatNumberIN(
          campaign.performanceAudit?.verifiedImpressions || 64210
        )} citizens.`,
      });
    } catch {
      setToastMessage('Sharing unavailable on this device.');
    }
  };

  const handleDiscardDraft = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
      setLocalDraft(null);
      setToastMessage('Local draft discarded.');
    } catch {
      setToastMessage('Unable to discard draft.');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <AppText variant="headlineSm" color={colors.textPrimary} style={styles.headerTitle}>
          Creator Studio
        </AppText>
      </View>

      <View style={styles.headerRight}>
        {/* Toggle between Demo Steward and New Creator */}
        <TouchableOpacity
          onPress={() => {
            const nextMode =
              creatorViewMode === 'demo_creator' ? 'new_creator' : 'demo_creator';
            setCreatorViewMode(nextMode);
            setToastMessage(
              nextMode === 'new_creator'
                ? 'Switched to New Creator view (Empty State)'
                : 'Switched to Demo Steward view (Dr. Ananya Sen)'
            );
          }}
          style={[
            styles.modeToggleBtn,
            creatorViewMode === 'new_creator' && styles.modeToggleBtnActive,
          ]}
          activeOpacity={0.8}
        >
          <Ionicons
            name={creatorViewMode === 'new_creator' ? 'person-outline' : 'sparkles'}
            size={13}
            color={creatorViewMode === 'new_creator' ? colors.primaryInk : colors.onPrimary}
          />
          <AppText
            variant="labelMicro"
            color={creatorViewMode === 'new_creator' ? colors.primaryInk : colors.onPrimary}
            style={styles.modeToggleText}
          >
            {creatorViewMode === 'new_creator' ? 'New Creator' : 'Dr. Sen'}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer header={renderHeader()} withBottomTabPadding={false}>
      {/* Toast Alert */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="info"
          onDismiss={() => setToastMessage(null)}
        />
      )}

      {/* Creator Profile & Editorial Steward Banner */}
      <View style={styles.creatorBanner}>
        <View style={styles.creatorBannerTop}>
          <View style={styles.creatorInfo}>
            <View style={styles.stewardBadgeRow}>
              <View style={styles.stewardPill}>
                <MaterialIcons name="verified" size={13} color={colors.primaryInk} />
                <AppText variant="labelMicro" color={colors.primaryInk} style={styles.stewardPillText}>
                  VERIFIED STEWARD
                </AppText>
              </View>
              <AppText variant="labelMicro" color={colors.textSecondary} style={styles.idCode}>
                {creatorViewMode === 'new_creator' ? 'ID #NEW-STEWARD' : DEMO_CREATOR.idCode}
              </AppText>
            </View>

            <AppText variant="headlineLg" color={colors.textPrimary} style={styles.creatorName}>
              {creatorViewMode === 'new_creator' ? 'Community Creator' : DEMO_CREATOR.name}
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.institution}>
              {creatorViewMode === 'new_creator'
                ? 'Independent Civic Contributor'
                : DEMO_CREATOR.organization}
            </AppText>
          </View>

          {/* New Flight Button */}
          <TouchableOpacity
            onPress={() => router.push('/create-campaign')}
            style={styles.newFlightBtn}
            activeOpacity={0.85}
          >
            <MaterialIcons name="add-circle" size={18} color={colors.primaryInk} />
            <AppText variant="headlineSm" color={colors.primaryInk} style={styles.newFlightText}>
              New Flight
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Live Studio Telemetry Strip */}
        <View style={[styles.telemetryStrip, shadows.layer1]}>
          <View style={styles.telemetryTop}>
            <AppText variant="labelMicro" color={colors.textSecondary} style={styles.telemetryTitle}>
              ESCROW & FLIGHT SYNTHESIS
            </AppText>
            <View style={styles.syncedPill}>
              <View style={styles.pulseDot} />
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.syncedText}>
                Ledger Synced
              </AppText>
            </View>
          </View>

          <View style={styles.telemetryGrid}>
            <View style={styles.telemetryCol}>
              <AppText variant="headlineMd" color={colors.textPrimary} style={styles.metricVal}>
                {metrics.activeFlights}
              </AppText>
              <AppText variant="labelMicro" color={colors.textSecondary} style={styles.metricLabel}>
                Active Flights
              </AppText>
            </View>

            <View style={styles.telemetryDivider} />

            <View style={styles.telemetryCol}>
              <AppText variant="headlineMd" color={colors.textPrimary} style={styles.metricVal}>
                {formatCurrencyINR(metrics.totalMobilized, { compact: true })}
              </AppText>
              <AppText variant="labelMicro" color={colors.textSecondary} style={styles.metricLabel}>
                Mobilized
              </AppText>
            </View>

            <View style={styles.telemetryDivider} />

            <View style={styles.telemetryCol}>
              <AppText variant="headlineMd" color={colors.primaryInk} style={styles.metricVal}>
                {formatNumberIN(metrics.totalVerifiedReach, { compact: true })}
              </AppText>
              <AppText variant="labelMicro" color={colors.textSecondary} style={styles.metricLabel}>
                Verified Reach
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Summary Metrics Row */}
      <View style={styles.summaryRow}>
        <DashboardMetricCard
          label="AWAITING REVIEW"
          value={metrics.awaitingReviewCount}
          subtitle="Editorial Desk"
          onPress={() => setActiveFilter('review')}
        />
        <DashboardMetricCard
          label="ACTIVE FLIGHTS"
          value={metrics.activeFlights}
          subtitle="Live Syndication"
          variant="highlight"
          onPress={() => setActiveFilter('promoting')}
        />
        <DashboardMetricCard
          label="ACTION NEEDED"
          value={metrics.actionCount}
          subtitle={metrics.actionCount > 0 ? 'Pending Notes' : 'All Clear'}
          onPress={() => setActiveFilter('action')}
        />
      </View>

      {/* Horizontal Filter Pill Tabs */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {/* All */}
          <TouchableOpacity
            onPress={() => setActiveFilter('all')}
            style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
            activeOpacity={0.8}
          >
            <AppText
              variant="labelMd"
              color={activeFilter === 'all' ? colors.onPrimary : colors.textPrimary}
              style={styles.filterChipText}
            >
              All
            </AppText>
            <View style={[styles.chipCountPill, activeFilter === 'all' && styles.chipCountPillActive]}>
              <AppText
                variant="labelMicro"
                color={activeFilter === 'all' ? colors.onPrimary : colors.textSecondary}
              >
                {metrics.totalCount}
              </AppText>
            </View>
          </TouchableOpacity>

          {/* Action Needed */}
          <TouchableOpacity
            onPress={() => setActiveFilter('action')}
            style={[styles.filterChip, activeFilter === 'action' && styles.filterChipActive]}
            activeOpacity={0.8}
          >
            {metrics.actionCount > 0 && <View style={styles.alertPingDot} />}
            <AppText
              variant="labelMd"
              color={activeFilter === 'action' ? colors.onPrimary : colors.textPrimary}
              style={styles.filterChipText}
            >
              Action Needed
            </AppText>
            <View style={[styles.chipCountPill, styles.chipCountPillAlert]}>
              <AppText variant="labelMicro" color={colors.restricted} style={styles.boldNum}>
                {metrics.actionCount}
              </AppText>
            </View>
          </TouchableOpacity>

          {/* Live Flights */}
          <TouchableOpacity
            onPress={() => setActiveFilter('promoting')}
            style={[styles.filterChip, activeFilter === 'promoting' && styles.filterChipActive]}
            activeOpacity={0.8}
          >
            <AppText
              variant="labelMd"
              color={activeFilter === 'promoting' ? colors.onPrimary : colors.textPrimary}
              style={styles.filterChipText}
            >
              Live Flights
            </AppText>
            <View style={[styles.chipCountPill, activeFilter === 'promoting' && styles.chipCountPillActive]}>
              <AppText
                variant="labelMicro"
                color={activeFilter === 'promoting' ? colors.onPrimary : colors.textSecondary}
              >
                {metrics.activeFlights}
              </AppText>
            </View>
          </TouchableOpacity>

          {/* Funding */}
          <TouchableOpacity
            onPress={() => setActiveFilter('funding')}
            style={[styles.filterChip, activeFilter === 'funding' && styles.filterChipActive]}
            activeOpacity={0.8}
          >
            <AppText
              variant="labelMd"
              color={activeFilter === 'funding' ? colors.onPrimary : colors.textPrimary}
              style={styles.filterChipText}
            >
              Funding
            </AppText>
            <View style={[styles.chipCountPill, activeFilter === 'funding' && styles.chipCountPillActive]}>
              <AppText
                variant="labelMicro"
                color={activeFilter === 'funding' ? colors.onPrimary : colors.textSecondary}
              >
                {metrics.fundingCount}
              </AppText>
            </View>
          </TouchableOpacity>

          {/* Under Review */}
          <TouchableOpacity
            onPress={() => setActiveFilter('review')}
            style={[styles.filterChip, activeFilter === 'review' && styles.filterChipActive]}
            activeOpacity={0.8}
          >
            <AppText
              variant="labelMd"
              color={activeFilter === 'review' ? colors.onPrimary : colors.textPrimary}
              style={styles.filterChipText}
            >
              Under Review
            </AppText>
            <View style={[styles.chipCountPill, activeFilter === 'review' && styles.chipCountPillActive]}>
              <AppText
                variant="labelMicro"
                color={activeFilter === 'review' ? colors.onPrimary : colors.textSecondary}
              >
                {metrics.awaitingReviewCount}
              </AppText>
            </View>
          </TouchableOpacity>

          {/* Drafts */}
          <TouchableOpacity
            onPress={() => setActiveFilter('drafts')}
            style={[styles.filterChip, activeFilter === 'drafts' && styles.filterChipActive]}
            activeOpacity={0.8}
          >
            <AppText
              variant="labelMd"
              color={activeFilter === 'drafts' ? colors.onPrimary : colors.textPrimary}
              style={styles.filterChipText}
            >
              Drafts
            </AppText>
            <View style={[styles.chipCountPill, activeFilter === 'drafts' && styles.chipCountPillActive]}>
              <AppText
                variant="labelMicro"
                color={activeFilter === 'drafts' ? colors.onPrimary : colors.textSecondary}
              >
                {metrics.draftsCount}
              </AppText>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Campaigns Feed List */}
      <View style={styles.campaignsSection}>
        {/* If local draft exists and on drafts/all filter, show draft card */}
        {localDraft && (activeFilter === 'all' || activeFilter === 'drafts') && (
          <CreatorCampaignCard
            campaign={{
              id: 'local_draft_item',
              title: localDraft.title || 'Pedestrian Corridors & Zero-Emission School Streets',
              creatorName: DEMO_CREATOR.name,
              creator: {
                id: DEMO_CREATOR.id,
                name: DEMO_CREATOR.name,
                kycVerified: true,
              },
              category: localDraft.category || 'environment',
              categoryLabel: localDraft.categoryLabel || 'Environment & Policy',
              shortDescription: localDraft.summary || 'Initial draft in progress',
              summary: localDraft.summary || 'Draft campaign',
              targetAmount: localDraft.targetBudget || 120000,
              raisedAmount: 0,
              currency: 'INR',
              status: 'draft',
              statusLabel: 'Draft • Step 2 of 5',
              estimatedReach: 95000,
              targetRegion: localDraft.focalArea || 'Local Zone',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              metrics: {
                targetAmount: localDraft.targetBudget || 120000,
                fundedAmount: 0,
                backersCount: 0,
                targetImpressions: 95000,
                daysLeft: 14,
                adPlacements: 'Pending Submission',
              },
            }}
            onResumeDraft={() => router.push('/create-campaign')}
            onDiscardDraft={handleDiscardDraft}
          />
        )}

        {filteredCampaigns.map((camp) => (
          <CreatorCampaignCard
            key={camp.id}
            campaign={camp}
            onPressReport={(id) => router.push(`/creator/performance?id=${id}`)}
            onPressDetails={(id) => router.push(`/campaign/${id}`)}
            onPressEdit={(id) => {
              // Open campaign detail or edit flow
              router.push(`/campaign/${id}`);
            }}
            onPressShare={handleShareTelemetry}
            onPressAuditNotes={(c) => setSelectedAuditCampaign(c)}
          />
        ))}

        {/* Empty state when no campaigns match filter */}
        {filteredCampaigns.length === 0 && (!localDraft || (activeFilter !== 'all' && activeFilter !== 'drafts')) && (
          <PerformanceEmptyState
            type={creatorViewMode === 'new_creator' ? 'no_campaigns' : 'no_campaigns'}
            title={
              creatorViewMode === 'new_creator'
                ? 'No Campaigns Submitted Yet'
                : `No ${activeFilter === 'action' ? 'action-required' : activeFilter} campaigns`
            }
            description={
              creatorViewMode === 'new_creator'
                ? 'Welcome to Amplifund. Start a verified civic broadcast flight to syndicate critical investigations, environmental telemetry, and policy briefings directly to citizens.'
                : 'All campaigns in this category have concluded or been resolved.'
            }
            actionLabel="Start New Campaign"
            onAction={() => router.push('/create-campaign')}
          />
        )}
      </View>

      {/* Institutional Integrity & Escrow Protocol Callout */}
      <View style={styles.protocolSection}>
        <View style={[styles.protocolCard, shadows.layer1]}>
          <View style={styles.protocolIconCircle}>
            <MaterialIcons name="account-balance" size={20} color={colors.primaryInk} />
          </View>
          <View style={styles.protocolContent}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={styles.protocolTitle}>
              Institutional Escrow Protocol
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.protocolBody}>
              Amplify functions under independent civic governance. Backing pledges remain
              sequestered in RBI-compliant escrow until independent source verification is confirmed
              by the editorial board prior to programmatic media buying.
            </AppText>
            <View style={styles.protocolLinkRow}>
              <AppText variant="labelMd" color={colors.primaryInk} style={styles.protocolLinkText}>
                Read Transparency Standard #2024
              </AppText>
              <Ionicons name="arrow-forward" size={14} color={colors.primaryInk} />
            </View>
          </View>
        </View>
      </View>

      {/* Audit Notes Modal */}
      <Modal
        visible={Boolean(selectedAuditCampaign)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedAuditCampaign(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, shadows.layer2]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <MaterialIcons name="assignment-late" size={20} color={colors.restricted} />
                <AppText variant="headlineSm" color={colors.textPrimary}>
                  Editorial Audit Notes
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedAuditCampaign(null)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <AppText variant="labelMicro" color={colors.restricted} style={styles.modalSubHeader}>
              STAGE: {selectedAuditCampaign?.auditStage || 'CITATION AUDIT'}
            </AppText>

            <View style={styles.modalNoteBox}>
              <AppText variant="bodySm" color={colors.textPrimary} style={styles.modalNoteText}>
                {selectedAuditCampaign?.auditNote ||
                  'Please provide the public repository URL or DOI for the cited 2023 Municipal Air Survey. Peer review check is pending this verification before syndicate approval.'}
              </AppText>
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                onPress={() => setSelectedAuditCampaign(null)}
                style={styles.modalCancelBtn}
              >
                <AppText variant="labelMd" color={colors.textPrimary}>
                  Close
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const id = selectedAuditCampaign?.id;
                  setSelectedAuditCampaign(null);
                  if (id) {
                    router.push(`/campaign/${id}`);
                  }
                }}
                style={styles.modalEditBtn}
              >
                <MaterialIcons name="edit" size={16} color={colors.onPrimary} />
                <AppText variant="labelMd" color={colors.onPrimary} style={styles.modalBtnText}>
                  Open & Resolve
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: spacing.marginMobile,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.containmentBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  headerTitle: {
    fontSize: 17,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryInk,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  modeToggleBtnActive: {
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.primaryInk,
  },
  modeToggleText: {
    fontSize: 10,
    fontWeight: '800',
  },
  creatorBanner: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  creatorBannerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  creatorInfo: {
    flex: 1,
    gap: 2,
  },
  stewardBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  stewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  stewardPillText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  idCode: {
    fontSize: 10,
    fontWeight: '600',
  },
  creatorName: {
    fontSize: 22,
    lineHeight: 28,
  },
  institution: {
    fontSize: 12,
  },
  newFlightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    marginTop: 2,
  },
  newFlightText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  telemetryStrip: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    gap: spacing.sm,
    marginTop: 2,
  },
  telemetryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  telemetryTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  syncedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryInk,
  },
  syncedText: {
    fontWeight: '700',
    fontSize: 10.5,
  },
  telemetryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  telemetryCol: {
    alignItems: 'center',
    flex: 1,
  },
  telemetryDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.surfaceContainer,
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
  },
  metricLabel: {
    fontSize: 10.5,
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.marginMobile,
    marginTop: spacing.sm,
  },
  filtersSection: {
    marginTop: spacing.md,
  },
  filtersScroll: {
    paddingHorizontal: spacing.marginMobile,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  filterChipActive: {
    backgroundColor: colors.primaryInk,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipCountPill: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
  },
  chipCountPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  chipCountPillAlert: {
    backgroundColor: colors.restrictedBg,
  },
  alertPingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.restricted,
  },
  boldNum: {
    fontWeight: '800',
  },
  campaignsSection: {
    paddingHorizontal: spacing.marginMobile,
    marginTop: spacing.md,
  },
  protocolSection: {
    paddingHorizontal: spacing.marginMobile,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  protocolCard: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  protocolIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  protocolContent: {
    flex: 1,
    gap: 4,
  },
  protocolTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  protocolBody: {
    fontSize: 12,
    lineHeight: 17,
  },
  protocolLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  protocolLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 420,
    gap: spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeBtn: {
    padding: 4,
  },
  modalSubHeader: {
    fontWeight: '800',
    fontSize: 10,
  },
  modalNoteBox: {
    backgroundColor: colors.restrictedBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  modalNoteText: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.xs,
  },
  modalCancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalEditBtn: {
    flex: 1,
    height: 42,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryInk,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
