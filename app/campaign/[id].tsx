import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  ScreenContainer,
  AppText,
  StatusBadge,
  EmptyState,
  CampaignImage,
} from '../../src/components';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { useCampaigns } from '../../src/context/CampaignContext';

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getCampaignById } = useCampaigns();

  const campaign = id ? getCampaignById(id) : undefined;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showBudgetAccordion, setShowBudgetAccordion] = useState(true);
  const [showProtocolAccordion, setShowProtocolAccordion] = useState(false);

  if (!campaign) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Campaign Not Found"
          description="The requested campaign could not be found or has concluded its public distribution window."
          actionTitle="Back to Discover"
          onAction={() => router.back()}
        />
      </ScreenContainer>
    );
  }

  const fundedAmount = campaign.raisedAmount ?? campaign.metrics?.fundedAmount ?? 0;
  const targetAmount = campaign.targetAmount ?? campaign.metrics?.targetAmount ?? 1;
  const percentage = Math.min(100, Math.round((fundedAmount / (targetAmount || 1)) * 100));
  const daysLeft = campaign.metrics?.daysLeft ?? 6;
  const backersCount = campaign.metrics?.backersCount ?? 412;
  const targetImpressions = campaign.metrics?.targetImpressions ?? 185000;
  const reachFormatted = targetImpressions >= 1000
    ? `${Math.round(targetImpressions / 1000)}K`
    : targetImpressions.toLocaleString('en-IN');
  const imageUrl = campaign.coverImage || campaign.imageUrl;
  const creatorName = campaign.creatorName || campaign.creator?.name || 'Dr. Ananya Sen';
  const creatorTitle = campaign.creator?.title || 'Lead Research Steward';
  const creatorOrg = campaign.creator?.organization || 'Center for Ecological Design';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Amplify civic broadcast: "${campaign.title}" - Pool public funds for verified message distribution on Amplifund.`,
        title: campaign.title,
      });
    } catch {
      // Fallback
    }
  };

  const navigateToContribution = () => {
    router.push(`/contribution/${campaign.id}`);
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
        <View style={styles.headerBrandBadge}>
          <MaterialIcons name="campaign" size={16} color={colors.onPrimary} />
        </View>
        <AppText variant="headlineSm" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
          Campaign Dossier
        </AppText>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity
          onPress={() => setIsBookmarked(!isBookmarked)}
          style={styles.iconBtn}
          accessibilityLabel="Bookmark campaign"
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={isBookmarked ? colors.primaryInk : colors.textPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShare}
          style={styles.iconBtn}
          accessibilityLabel="Share campaign"
        >
          <Ionicons name="share-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.screenWrapper}>
      <ScreenContainer header={renderHeader()} withBottomTabPadding={false}>
        {/* Top Dossier Context Row */}
        <View style={styles.topContextRow}>
          <View style={styles.dossierBadge}>
            <MaterialIcons name="verified" size={14} color={colors.primaryInk} />
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.dossierText}>
              CIVIC DOSSIER № {campaign.id.toUpperCase().replace(/\D/g, '') || '408'}
            </AppText>
          </View>
          <StatusBadge
            label={
              campaign.status === 'pending_review' || campaign.status === 'pending'
                ? 'PENDING EDITORIAL REVIEW'
                : campaign.status === 'amplified'
                ? 'ACTIVE BROADCAST'
                : 'VERIFIED PROPOSAL'
            }
            variant={
              campaign.status === 'pending_review' || campaign.status === 'pending'
                ? 'pending'
                : campaign.status === 'amplified'
                ? 'active'
                : 'default'
            }
          />
        </View>

        {(campaign.status === 'pending_review' || campaign.status === 'pending') && (
          <View style={styles.pendingReviewNotice}>
            <View style={styles.pendingReviewNoticeHeader}>
              <MaterialIcons name="fact-check" size={18} color={colors.pending} />
              <AppText variant="headlineSm" color={colors.textPrimary}>
                Submitted for Verification
              </AppText>
            </View>
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.pendingReviewNoticeBody}>
              This initiative has been submitted for cryptographic verification and factual audit. It is not yet live for public distribution backing.
            </AppText>
          </View>
        )}

        {/* Hero Imagery with Editorial Frame */}
        <View style={[styles.heroImageWrapper, shadows.layer1]}>
          <CampaignImage
            uri={imageUrl}
            containerStyle={styles.campaignHeroImage}
            fallbackIcon="campaign"
            fallbackText={campaign.categoryLabel}
          >
            <View style={styles.heroOverlayGradient} />
            <View style={styles.heroOverlayBottom}>
              <View style={styles.activePill}>
                <View style={styles.activePillDot} />
                <AppText variant="labelMicro" color={colors.primaryInk} style={styles.activePillText}>
                  Active Distribution Initiative
                </AppText>
              </View>
            </View>
          </CampaignImage>
          <View style={styles.plateCaptionRow}>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              Plate 04 / Verified Corridor Survey
            </AppText>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              Satellite & Field Telemetry
            </AppText>
          </View>
        </View>

        {/* Editorial Meta & Main Headline */}
        <View style={styles.headlineSection}>
          <View style={styles.metaCategoryRow}>
            <View style={styles.categoryPill}>
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.categoryPillText}>
                {campaign.categoryLabel}
              </AppText>
            </View>
            <AppText variant="bodySm" color={colors.textSecondary}>•</AppText>
            <AppText variant="bodySm" color={colors.textSecondary}>
              Published {new Date(campaign.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </AppText>
          </View>

          <AppText variant="displayLg" color={colors.textPrimary} style={styles.mainTitle}>
            {campaign.title}
          </AppText>

          <AppText variant="bodyLg" color={colors.textSecondary} style={styles.summaryLead}>
            {campaign.shortDescription || campaign.summary}
          </AppText>
        </View>

        {/* Creator Credibility Attribution Row */}
        <View style={[styles.stewardCard, shadows.layer1]}>
          <CampaignImage
            uri={campaign.creator?.avatarUrl}
            containerStyle={styles.stewardAvatarBox}
            fallbackIcon="person"
          />
          <View style={styles.stewardInfo}>
            <View style={styles.stewardNameRow}>
              <AppText variant="headlineSm" color={colors.textPrimary} numberOfLines={1}>
                {creatorName}
              </AppText>
              <MaterialIcons name="check-circle" size={16} color={colors.primaryInk} />
            </View>
            <AppText variant="bodySm" color={colors.textSecondary} numberOfLines={1}>
              {creatorTitle} • {creatorOrg}
            </AppText>
          </View>
          <View style={styles.kycTag}>
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.kycText}>
              KYC PASSED
            </AppText>
          </View>
        </View>

        {/* Transparent Amplification Funding Panel (Card) */}
        <View style={[styles.fundingPanel, shadows.layer1]}>
          {/* Civic Notice Banner */}
          <View style={styles.noticeBanner}>
            <MaterialIcons name="campaign" size={18} color={colors.primaryInk} style={styles.noticeIcon} />
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.noticeText}>
              <AppText variant="bodySm" color={colors.textPrimary} style={styles.noticeBold}>NOTICE: </AppText>
              This is an independent civic broadcast pool, not a personal charity. Every rupee directly secures targeted public placement across local feeds and editorial syndication.
            </AppText>
          </View>

          {/* Progress Track & Numbers */}
          <View style={styles.progressBlock}>
            <View style={styles.progressLabelRow}>
              <View style={styles.amountGroup}>
                <AppText variant="headlineMd" color={colors.textPrimary} style={styles.fundedNumber}>
                  ₹{fundedAmount.toLocaleString('en-IN')}
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  of ₹{targetAmount.toLocaleString('en-IN')} goal
                </AppText>
              </View>
              <AppText variant="headlineSm" color={colors.primaryInk} style={styles.percentText}>
                {percentage}%
              </AppText>
            </View>
            <View style={styles.progressRail}>
              <View style={[styles.progressFill, { width: `${percentage}%` }]} />
            </View>
          </View>

          {/* 3-Column Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <AppText variant="headlineSm" color={colors.textPrimary}>
                {backersCount}
              </AppText>
              <AppText variant="labelMicro" color={colors.textSecondary} style={styles.metricSub}>
                PARTNERS
              </AppText>
            </View>

            <View style={styles.metricCard}>
              <AppText variant="headlineSm" color={colors.textPrimary}>
                {daysLeft} Days
              </AppText>
              <AppText variant="labelMicro" color={colors.textSecondary} style={styles.metricSub}>
                REMAINING
              </AppText>
            </View>

            <View style={styles.metricCard}>
              <AppText variant="headlineSm" color={colors.primaryInk} style={styles.reachHighlight}>
                {reachFormatted}
              </AppText>
              <AppText variant="labelMicro" color={colors.textSecondary} style={styles.metricSub}>
                EST. REACH
              </AppText>
            </View>
          </View>
        </View>

        {/* Editorial Story Body */}
        <View style={styles.storySection}>
          <AppText variant="labelMicro" color={colors.textSecondary} style={styles.storySubheader}>
            THE EMPIRICAL FIELD ANALYSIS
          </AppText>
          <AppText variant="headlineMd" color={colors.textPrimary} style={styles.storyTitle}>
            Problem Overview & Evidence Base
          </AppText>

          <AppText variant="bodyLg" color={colors.textPrimary} style={styles.storyParagraph}>
            {campaign.storyDossier || campaign.summary}
          </AppText>

          {/* Key Stat Callout Box */}
          <View style={styles.statCalloutBox}>
            <View style={styles.statCalloutHeader}>
              <MaterialIcons name="query-stats" size={20} color={colors.primaryInk} />
              <AppText variant="headlineSm" color={colors.primaryInk}>
                Verified Microclimate & Civic Metric
              </AppText>
            </View>
            <AppText variant="bodyMd" color={colors.textSecondary} style={styles.statCalloutBody}>
              Satellite thermal infrared bands demonstrate persistent surface temperature variances across unshaded industrial zones, resulting in elevated health advisories and critical municipal infrastructure strain.
            </AppText>
          </View>

          {/* Supporting Sources Repository */}
          <View style={[styles.sourcesCard, shadows.layer1]}>
            <View style={styles.sourcesHeader}>
              <AppText variant="labelMd" color={colors.textPrimary} style={styles.sourcesTitle}>
                VERIFIED SOURCE REPOSITORY
              </AppText>
              <View style={styles.peerVerifiedTag}>
                <AppText variant="labelMicro" color={colors.primaryInk} style={styles.peerVerifiedText}>
                  Peer Verified
                </AppText>
              </View>
            </View>

            <View style={styles.sourceItem}>
              <MaterialIcons name="satellite-alt" size={18} color={colors.primaryInk} />
              <AppText variant="bodySm" color={colors.textPrimary} style={styles.sourceItemText}>
                State Meteorological Department Thermal Mapping Telemetry
              </AppText>
            </View>

            <View style={styles.sourceItem}>
              <MaterialIcons name="description" size={18} color={colors.primaryInk} />
              <AppText variant="bodySm" color={colors.textPrimary} style={styles.sourceItemText}>
                Municipal Ward Demographic & Industrial Buffer Survey (2024–2026)
              </AppText>
            </View>

            <View style={styles.sourceFooterNotice}>
              <MaterialIcons name="fact-check" size={14} color={colors.primaryInk} />
              <AppText variant="labelMicro" color={colors.textSecondary}>
                All dossier claims independently cross-referenced by Amplifund review desks.
              </AppText>
            </View>
          </View>
        </View>

        {/* Targeted Distribution Architecture */}
        <View style={[styles.distributionCard, shadows.layer1]}>
          <View style={styles.distributionTitleRow}>
            <MaterialIcons name="cell-tower" size={20} color={colors.primaryInk} />
            <AppText variant="headlineSm" color={colors.textPrimary}>
              Targeted Distribution Architecture
            </AppText>
          </View>
          <AppText variant="bodySm" color={colors.textSecondary} style={styles.distributionIntro}>
            When mobilized by pool partners, this brief executes programmatic distribution across the following hyper-local digital channels:
          </AppText>

          <View style={styles.channelsList}>
            <View style={styles.channelChip}>
              <MaterialIcons name="photo-camera" size={15} color={colors.primaryInk} />
              <AppText variant="bodySm" color={colors.textPrimary}>Regional Feeds & Meta</AppText>
            </View>
            <View style={styles.channelChip}>
              <MaterialIcons name="newspaper" size={15} color={colors.primaryInk} />
              <AppText variant="bodySm" color={colors.textPrimary}>Local Digital News Outlets</AppText>
            </View>
            <View style={styles.channelChip}>
              <MaterialIcons name="forum" size={15} color={colors.primaryInk} />
              <AppText variant="bodySm" color={colors.textPrimary}>WhatsApp Civic Broadcasts</AppText>
            </View>
          </View>

          <View style={styles.geoTargetBox}>
            <AppText variant="labelMicro" color={colors.textSecondary} style={styles.geoTitle}>
              PRIORITY GEOGRAPHIC TARGETING:
            </AppText>
            <View style={styles.geoItem}>
              <MaterialIcons name="location-on" size={16} color={colors.primaryInk} />
              <AppText variant="bodySm" color={colors.textPrimary}>
                {campaign.targetRegion || 'Wards 14–28 & Municipal Corridor'}
              </AppText>
            </View>
          </View>
        </View>

        {/* Expandable Accordions */}
        <View style={styles.accordionsSection}>
          {/* Accordion 1: Capital Allocation Breakdown */}
          <View style={[styles.accordionItem, shadows.layer1]}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => setShowBudgetAccordion(!showBudgetAccordion)}
              activeOpacity={0.75}
            >
              <View style={styles.accordionHeaderLeft}>
                <MaterialIcons name="account-balance-wallet" size={18} color={colors.primaryInk} />
                <AppText variant="headlineSm" color={colors.textPrimary}>
                  Capital Allocation Breakdown
                </AppText>
              </View>
              <MaterialIcons
                name={showBudgetAccordion ? 'expand-less' : 'expand-more'}
                size={22}
                color={colors.outline}
              />
            </TouchableOpacity>

            {showBudgetAccordion && (
              <View style={styles.accordionContent}>
                <View style={styles.budgetRow}>
                  <View style={styles.budgetLabels}>
                    <AppText variant="bodySm" color={colors.textPrimary} style={styles.budgetStrong}>
                      88% Direct Targeted Ad Spend
                    </AppText>
                    <AppText variant="bodySm" color={colors.textSecondary}>
                      Direct digital feed syndication
                    </AppText>
                  </View>
                  <AppText variant="bodySm" color={colors.primaryInk} style={styles.budgetAmount}>
                    ₹{Math.round(targetAmount * 0.88).toLocaleString('en-IN')}
                  </AppText>
                </View>
                <View style={styles.budgetMiniRail}>
                  <View style={[styles.budgetMiniFill, { width: '88%', backgroundColor: colors.primaryInk }]} />
                </View>

                <View style={styles.budgetRow}>
                  <View style={styles.budgetLabels}>
                    <AppText variant="bodySm" color={colors.textPrimary} style={styles.budgetStrong}>
                      8% Platform Verification & Auditing
                    </AppText>
                    <AppText variant="bodySm" color={colors.textSecondary}>
                      Academic fact-checking desk
                    </AppText>
                  </View>
                  <AppText variant="bodySm" color={colors.primaryInk} style={styles.budgetAmount}>
                    ₹{Math.round(targetAmount * 0.08).toLocaleString('en-IN')}
                  </AppText>
                </View>
                <View style={styles.budgetMiniRail}>
                  <View style={[styles.budgetMiniFill, { width: '8%', backgroundColor: colors.tertiary }]} />
                </View>

                <View style={styles.budgetRow}>
                  <View style={styles.budgetLabels}>
                    <AppText variant="bodySm" color={colors.textPrimary} style={styles.budgetStrong}>
                      4% Escrow & Bank Gateway Clearing
                    </AppText>
                    <AppText variant="bodySm" color={colors.textSecondary}>
                      Statutory compliance & UPI escrow
                    </AppText>
                  </View>
                  <AppText variant="bodySm" color={colors.primaryInk} style={styles.budgetAmount}>
                    ₹{Math.round(targetAmount * 0.04).toLocaleString('en-IN')}
                  </AppText>
                </View>
                <View style={styles.budgetMiniRail}>
                  <View style={[styles.budgetMiniFill, { width: '4%', backgroundColor: colors.outline }]} />
                </View>

                <AppText variant="labelMicro" color={colors.textSecondary} style={styles.escrowNotice}>
                  If the minimum broadcast threshold is unreached by deadline, 100% of escrow balances are reversed without penalty.
                </AppText>
              </View>
            )}
          </View>

          {/* Accordion 2: Review & Verification Protocol */}
          <View style={[styles.accordionItem, shadows.layer1]}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => setShowProtocolAccordion(!showProtocolAccordion)}
              activeOpacity={0.75}
            >
              <View style={styles.accordionHeaderLeft}>
                <MaterialIcons name="gavel" size={18} color={colors.primaryInk} />
                <AppText variant="headlineSm" color={colors.textPrimary}>
                  Review & Verification Protocol
                </AppText>
              </View>
              <MaterialIcons
                name={showProtocolAccordion ? 'expand-less' : 'expand-more'}
                size={22}
                color={colors.outline}
              />
            </TouchableOpacity>

            {showProtocolAccordion && (
              <View style={styles.accordionContent}>
                <AppText variant="bodySm" color={colors.textSecondary} style={styles.protocolText}>
                  All campaign proposals undergo a mandatory 3-tiered review: Identity & KYC Clearance, Fact-Checking with peer citations, and Ad Creative Compliance to prevent misleading claims before distribution commences.
                </AppText>
              </View>
            )}
          </View>
        </View>

        {/* Padding spacer for sticky footer bar */}
        <View style={styles.bottomSpacer} />
      </ScreenContainer>

      {/* Floating Sticky Bottom CTA Bar */}
      <View style={[styles.stickyBottomBar, shadows.layer2]}>
        <View style={styles.stickyContent}>
          <View style={styles.stickyMetricBox}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={styles.stickyAmount}>
              ₹{fundedAmount.toLocaleString('en-IN')}
            </AppText>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              {percentage}% of ₹{(targetAmount / 100000).toFixed(1)}L objective
            </AppText>
          </View>

          <TouchableOpacity
            style={styles.stickyCtaBtn}
            activeOpacity={0.85}
            onPress={navigateToContribution}
            accessibilityRole="button"
            accessibilityLabel="Amplify campaign"
          >
            <MaterialIcons name="bolt" size={20} color={colors.onPrimary} />
            <AppText variant="headlineSm" color={colors.onPrimary} style={styles.stickyCtaText}>
              Amplify (from ₹50)
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.surface,
  },
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
    gap: spacing.xs + 2,
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  headerBrandBadge: {
    width: 26,
    height: 26,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  dossierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dossierText: {
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  heroImageWrapper: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  campaignHeroImage: {
    width: '100%',
    height: 220,
  },
  heroOverlayGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
    backgroundColor: 'rgba(24, 29, 23, 0.45)',
  },
  heroOverlayBottom: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
  },
  activePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activePillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryInk,
  },
  activePillText: {
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  plateCaptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
  },
  headlineSection: {
    marginBottom: spacing.md,
  },
  metaCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  categoryPill: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  categoryPillText: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  mainTitle: {
    marginBottom: spacing.xs,
    lineHeight: 36,
  },
  summaryLead: {
    fontStyle: 'italic',
    lineHeight: 24,
  },
  stewardCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stewardAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  stewardInfo: {
    flex: 1,
    minWidth: 0,
  },
  stewardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  kycTag: {
    backgroundColor: colors.secondaryContainerSoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  kycText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  fundingPanel: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  noticeBanner: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  noticeIcon: {
    marginTop: 2,
  },
  noticeText: {
    flex: 1,
    lineHeight: 19,
  },
  noticeBold: {
    fontWeight: '700',
  },
  progressBlock: {
    marginBottom: spacing.md,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  amountGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  fundedNumber: {
    fontWeight: '700',
  },
  percentText: {
    fontWeight: '700',
  },
  progressRail: {
    width: '100%',
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondaryContainerSoft,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryContainer,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricSub: {
    marginTop: 2,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  reachHighlight: {
    fontWeight: '700',
  },
  storySection: {
    marginBottom: spacing.md,
  },
  storySubheader: {
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  storyTitle: {
    marginBottom: spacing.xs,
  },
  storyParagraph: {
    lineHeight: 26,
    marginBottom: spacing.md,
  },
  statCalloutBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primaryInk,
  },
  statCalloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statCalloutBody: {
    lineHeight: 22,
  },
  sourcesCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sourcesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sourcesTitle: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  peerVerifiedTag: {
    backgroundColor: colors.secondaryContainerSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  peerVerifiedText: {
    fontWeight: '700',
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainer,
  },
  sourceItemText: {
    flex: 1,
  },
  sourceFooterNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  distributionCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  distributionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  distributionIntro: {
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  channelsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.md,
  },
  channelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  geoTargetBox: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  geoTitle: {
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  geoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accordionsSection: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  accordionItem: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingReviewNotice: {
    backgroundColor: colors.surfaceContainerLow,
    borderLeftWidth: 3,
    borderLeftColor: colors.pending,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: 4,
  },
  pendingReviewNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pendingReviewNoticeBody: {
    lineHeight: 18,
  },
  accordionContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
    paddingTop: spacing.sm,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
  },
  budgetLabels: {
    flex: 1,
    marginRight: spacing.sm,
  },
  budgetStrong: {
    fontWeight: '600',
  },
  budgetAmount: {
    fontWeight: '700',
  },
  budgetMiniRail: {
    width: '100%',
    height: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondaryContainerSoft,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 6,
  },
  budgetMiniFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  escrowNotice: {
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  protocolText: {
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 90,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: colors.containmentBorder,
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 24 : spacing.sm,
  },
  stickyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  stickyMetricBox: {
    flex: 1,
  },
  stickyAmount: {
    fontWeight: '800',
    lineHeight: 20,
  },
  stickyCtaBtn: {
    flex: 1.3,
    backgroundColor: colors.primaryContainer,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: '#1E4E39',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  stickyCtaText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
});
