import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { borderRadius, spacing, shadows } from '../../theme/spacing';
import { Campaign } from '../../types/campaign';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { formatCurrencyINR, formatNumberIN } from '../../utils/formatters';

export interface CreatorCampaignCardProps {
  campaign: Campaign;
  onPressReport?: (campaignId: string) => void;
  onPressDetails?: (campaignId: string) => void;
  onPressEdit?: (campaignId: string) => void;
  onPressShare?: (campaign: Campaign) => void;
  onPressAuditNotes?: (campaign: Campaign) => void;
  onResumeDraft?: () => void;
  onDiscardDraft?: () => void;
}

export const CreatorCampaignCard: React.FC<CreatorCampaignCardProps> = ({
  campaign,
  onPressReport,
  onPressDetails,
  onPressEdit,
  onPressShare,
  onPressAuditNotes,
  onResumeDraft,
  onDiscardDraft,
}) => {
  const isActionRequired = campaign.status === 'rejected';
  const isLive = campaign.status === 'active' || campaign.status === 'amplified';
  const isFunding = campaign.status === 'approved';
  const isReview = campaign.status === 'pending_review' || campaign.status === 'pending';
  const isDraft = campaign.status === 'draft';

  const targetAmount = campaign.targetAmount || campaign.metrics.targetAmount || 150000;
  const raisedAmount = campaign.raisedAmount ?? campaign.metrics.fundedAmount ?? 0;
  const fundedPercent = Math.min(100, Math.round((raisedAmount / targetAmount) * 100));

  const deliveredImpressions =
    campaign.performanceAudit?.verifiedImpressions ||
    campaign.metrics.deliveredImpressions ||
    0;
  const targetImpressions = campaign.estimatedReach || campaign.metrics.targetImpressions || 185000;
  const deliveryPercent = Math.min(
    100,
    Math.round((deliveredImpressions / targetImpressions) * 100)
  );

  const audit = campaign.performanceAudit;

  return (
    <View style={[styles.card, shadows.layer1]}>
      {/* Top Status & Stage Row */}
      <View style={styles.topRow}>
        <View style={styles.badgeGroup}>
          <CampaignStatusBadge status={campaign.status} />
          {campaign.auditStage && (
            <AppText variant="labelMicro" color={colors.textSecondary} style={styles.stageText}>
              {campaign.auditStage}
            </AppText>
          )}
          {isLive && (
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.unlockedText}>
              • Escrow Unlocked
            </AppText>
          )}
        </View>

        <AppText variant="labelMicro" color={colors.textSecondary}>
          {isLive
            ? `Day ${audit?.flightDay || 3} of ${audit?.totalFlightDays || 14}`
            : isFunding
            ? `${campaign.metrics.backersCount || 188} Backers`
            : isReview
            ? 'Queue Turnaround ~14h'
            : isActionRequired
            ? 'Revision Needed'
            : 'Saved recently'}
        </AppText>
      </View>

      {/* Campaign Details Row with Cover Image */}
      <TouchableOpacity
        onPress={() => onPressDetails?.(campaign.id)}
        activeOpacity={0.8}
        style={styles.detailsRow}
      >
        <Image
          source={{
            uri:
              campaign.coverImage ||
              campaign.imageUrl ||
              'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=300&q=80',
          }}
          style={styles.thumbnail}
        />
        <View style={styles.contentCol}>
          <AppText
            variant="headlineSm"
            color={colors.textPrimary}
            numberOfLines={2}
            style={styles.title}
          >
            {campaign.title}
          </AppText>

          <AppText variant="bodySm" color={colors.textSecondary} style={styles.metaSubtext}>
            {isLive
              ? `Flight ID: #${audit?.flightId || 'FL-DEL-0419'}`
              : isFunding
              ? `${formatCurrencyINR(raisedAmount)} raised of ${formatCurrencyINR(targetAmount)} (${fundedPercent}%)`
              : isReview
              ? `Target: ${formatCurrencyINR(targetAmount)} • Est. ~${formatNumberIN(targetImpressions)} citizens`
              : isActionRequired
              ? `Target: ${formatCurrencyINR(targetAmount)} • Est. Reach: ~${formatNumberIN(targetImpressions)}`
              : `Target Reach: ~${formatNumberIN(targetImpressions)}`}
          </AppText>
        </View>
      </TouchableOpacity>

      {/* 1. ACTION REQUIRED: Audit Note Box */}
      {isActionRequired && (
        <View style={styles.auditCalloutBox}>
          <MaterialIcons
            name="assignment-late"
            size={18}
            color={colors.restricted}
            style={styles.calloutIcon}
          />
          <View style={styles.calloutContent}>
            <AppText variant="labelMicro" color={colors.restricted} style={styles.calloutTitle}>
              EDITORIAL AUDIT NOTE
            </AppText>
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.calloutText}>
              {campaign.auditNote ||
                'Please provide the public repository URL or DOI for cited telemetry data. Peer review is pending this verification before ad syndication unlocks.'}
            </AppText>
          </View>
        </View>
      )}

      {/* 2. LIVE FLIGHT: Live Broadcast Delivery Strip */}
      {isLive && (
        <View style={styles.telemetryBox}>
          <View style={styles.telemetryHeader}>
            <View style={styles.telemetryLabelRow}>
              <MaterialIcons name="broadcast-on-personal" size={14} color={colors.primaryInk} />
              <AppText variant="labelMicro" color={colors.textPrimary}>
                Ad Flight Day {audit?.flightDay || 3} of {audit?.totalFlightDays || 14}
              </AppText>
            </View>
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.boldPercent}>
              {deliveryPercent}% Delivery Complete
            </AppText>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${deliveryPercent}%` }]} />
          </View>

          <View style={styles.telemetryNumbers}>
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.metricBold}>
              {formatNumberIN(deliveredImpressions)} verified impressions
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary}>
              Target: ~{formatNumberIN(targetImpressions)}
            </AppText>
          </View>

          <View style={styles.channelsRow}>
            <MaterialIcons name="cell-tower" size={13} color={colors.textSecondary} />
            <AppText variant="labelMicro" color={colors.textSecondary} numberOfLines={1}>
              {campaign.metrics.adPlacements ||
                'Syndicating via Meta Geo-Fence, Civic Mastheads & Local Press Wire'}
            </AppText>
          </View>
        </View>
      )}

      {/* 3. FUNDING: Milestone & Funding Gauge */}
      {isFunding && (
        <View style={styles.fundingBox}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${fundedPercent}%` }]} />
          </View>
          <View style={styles.fundingNumbers}>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              Escrow Target: {formatCurrencyINR(targetAmount, { compact: true })}
            </AppText>
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.reachText}>
              Est. Reach: {formatNumberIN(targetImpressions)} Citizens
            </AppText>
          </View>

          <View style={styles.milestoneNotice}>
            <Ionicons name="checkmark-circle" size={16} color={colors.primaryInk} />
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.milestoneText}>
              <AppText variant="bodySm" color={colors.textPrimary} style={styles.boldSpan}>
                Milestone 1 reached:
              </AppText>{' '}
              50% escrow release approved for advance regional ad reservations.
            </AppText>
          </View>
        </View>
      )}

      {/* 4. UNDER REVIEW: Rubric Checklist */}
      {isReview && (
        <View style={styles.reviewBox}>
          <View style={styles.rubricHeader}>
            <AppText variant="labelMicro" color={colors.textPrimary} style={styles.rubricTitle}>
              VERIFICATION RUBRIC
            </AppText>
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.boldPercent}>
              {campaign.auditRubricPassed || 3} of {campaign.auditRubricTotal || 4} Passed
            </AppText>
          </View>

          <View style={styles.rubricTrack}>
            <View style={styles.rubricSegmentActive} />
            <View style={styles.rubricSegmentActive} />
            <View style={styles.rubricSegmentActive} />
            <View style={styles.rubricSegmentPending} />
          </View>

          <AppText variant="bodySm" color={colors.textSecondary} style={styles.rubricDescription}>
            {campaign.auditNote ||
              'Identity cleared • Text-to-image ratio validated • Source citation peer audit currently in queue.'}
          </AppText>
        </View>
      )}

      {/* 5. DRAFT: Step indicator */}
      {isDraft && (
        <View style={styles.draftBox}>
          <AppText variant="bodySm" color={colors.textSecondary}>
            Initial dossier outline saved. Ready to continue to Story & Visuals.
          </AppText>
        </View>
      )}

      {/* Action Buttons Footer */}
      <View style={styles.actionsRow}>
        {isActionRequired ? (
          <>
            <TouchableOpacity
              onPress={() => onPressAuditNotes?.(campaign)}
              style={styles.secondaryActionBtn}
              activeOpacity={0.8}
            >
              <AppText variant="headlineSm" color={colors.textPrimary} style={styles.btnText}>
                View Audit Notes
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPressEdit?.(campaign.id)}
              style={styles.primaryActionBtn}
              activeOpacity={0.85}
            >
              <MaterialIcons name="edit-note" size={17} color={colors.onPrimary} />
              <AppText variant="headlineSm" color={colors.onPrimary} style={styles.btnText}>
                Resolve & Edit
              </AppText>
            </TouchableOpacity>
          </>
        ) : isLive ? (
          <>
            <TouchableOpacity
              onPress={() => onPressShare?.(campaign)}
              style={styles.secondaryActionBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="share-outline" size={16} color={colors.textPrimary} />
              <AppText variant="headlineSm" color={colors.textPrimary} style={styles.btnText}>
                Share Telemetry
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPressReport?.(campaign.id)}
              style={styles.primaryActionBtn}
              activeOpacity={0.85}
            >
              <MaterialIcons name="query-stats" size={17} color={colors.onPrimary} />
              <AppText variant="headlineSm" color={colors.onPrimary} style={styles.btnText}>
                Live Analytics
              </AppText>
            </TouchableOpacity>
          </>
        ) : isFunding ? (
          <>
            <TouchableOpacity
              onPress={() => onPressDetails?.(campaign.id)}
              style={styles.secondaryActionBtn}
              activeOpacity={0.8}
            >
              <AppText variant="headlineSm" color={colors.textPrimary} style={styles.btnText}>
                View Story Dossier
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPressReport?.(campaign.id)}
              style={styles.primaryActionBtn}
              activeOpacity={0.85}
            >
              <MaterialIcons name="analytics" size={17} color={colors.onPrimary} />
              <AppText variant="headlineSm" color={colors.onPrimary} style={styles.btnText}>
                Audit Report
              </AppText>
            </TouchableOpacity>
          </>
        ) : isReview ? (
          <>
            <TouchableOpacity
              onPress={() => onPressDetails?.(campaign.id)}
              style={[styles.secondaryActionBtn, { flex: 1 }]}
              activeOpacity={0.8}
            >
              <Ionicons name="document-text-outline" size={16} color={colors.textPrimary} />
              <AppText variant="headlineSm" color={colors.textPrimary} style={styles.btnText}>
                Preview Submitted Dossier
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPressReport?.(campaign.id)}
              style={styles.secondaryActionBtn}
              activeOpacity={0.8}
            >
              <MaterialIcons name="assessment" size={16} color={colors.primaryInk} />
              <AppText variant="headlineSm" color={colors.primaryInk} style={styles.btnText}>
                Audit Desk
              </AppText>
            </TouchableOpacity>
          </>
        ) : isDraft ? (
          <>
            <TouchableOpacity
              onPress={onDiscardDraft}
              style={[styles.secondaryActionBtn, styles.dangerBtn]}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={16} color={colors.restricted} />
              <AppText variant="headlineSm" color={colors.restricted} style={styles.btnText}>
                Discard
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onResumeDraft}
              style={styles.primaryActionBtn}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={16} color={colors.onPrimary} />
              <AppText variant="headlineSm" color={colors.onPrimary} style={styles.btnText}>
                Resume Editing
              </AppText>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  stageText: {
    fontSize: 10,
    fontWeight: '600',
  },
  unlockedText: {
    fontWeight: '700',
    fontSize: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerHigh,
    flexShrink: 0,
  },
  contentCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  metaSubtext: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  auditCalloutBox: {
    backgroundColor: colors.restrictedBg,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  calloutIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  calloutContent: {
    flex: 1,
    gap: 2,
  },
  calloutTitle: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  calloutText: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  telemetryBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: 6,
  },
  telemetryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  telemetryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  boldPercent: {
    fontWeight: '800',
    fontSize: 10.5,
  },
  progressTrack: {
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryInk,
  },
  telemetryNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 1,
  },
  metricBold: {
    fontWeight: '700',
    fontSize: 12,
  },
  channelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  fundingBox: {
    gap: 6,
  },
  fundingNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reachText: {
    fontWeight: '700',
  },
  milestoneNotice: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 2,
  },
  milestoneText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
  },
  boldSpan: {
    fontWeight: '700',
  },
  reviewBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: 6,
  },
  rubricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rubricTitle: {
    fontWeight: '800',
    fontSize: 10,
  },
  rubricTrack: {
    flexDirection: 'row',
    gap: 4,
  },
  rubricSegmentActive: {
    flex: 1,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryInk,
  },
  rubricSegmentPending: {
    flex: 1,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerHighest,
  },
  rubricDescription: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  draftBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  secondaryActionBtn: {
    flex: 1,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  primaryActionBtn: {
    flex: 1,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryInk,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  dangerBtn: {
    backgroundColor: colors.restrictedBg,
  },
  btnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
