import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { CampaignDraft } from '../../types/campaign';
import { calculateAllocation } from '../../config/contribution';
import { calculateCampaignProjectedReach } from '../../config/campaignCreation';

export interface Step5ReviewProps {
  draft: CampaignDraft;
  errors: Record<string, string>;
  onUpdate: (fields: Partial<CampaignDraft>) => void;
  onEditStep: (stepNumber: number) => void;
}

export const Step5Review: React.FC<Step5ReviewProps> = ({
  draft,
  errors,
  onUpdate,
  onEditStep,
}) => {
  const budget = draft.targetBudget || 150000;
  const allocation = calculateAllocation(budget);
  const reach = calculateCampaignProjectedReach(
    budget,
    draft.channels.length,
    draft.geoScope
  );

  const wordCount = draft.storyProse.trim()
    ? draft.storyProse.trim().split(/\s+/).length
    : 0;

  return (
    <View style={styles.container}>
      {/* SECTION 1: Creator-Entered Funding Goal */}
      <View style={[styles.goalCard, shadows.layer1]}>
        <View style={styles.goalCardAccentBar} />

        <View style={styles.goalTopRow}>
          <View style={styles.goalTitleContainer}>
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.stewardMandate}>
              STEWARD MANDATE
            </AppText>
            <AppText variant="headlineMd" color={colors.textPrimary} style={styles.goalTitleText}>
              Set Campaign Funding Goal *
            </AppText>
          </View>
          <MaterialIcons name="payments" size={24} color={colors.primaryInk} style={styles.goalIcon} />
        </View>

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.goalExplanation}>
          Enter the exact funding threshold required to execute this broadcast flight. Amplify does not use algorithmic guesses for funding targets.
        </AppText>

        <View style={styles.budgetInputBox}>
          <AppText variant="labelMicro" color={colors.textSecondary} style={styles.budgetInputLabel}>
            REQUIRED BROADCAST BUDGET (INR)
          </AppText>
          <View style={styles.budgetRow}>
            <AppText variant="headlineMd" color={colors.textPrimary} style={styles.rupeeSign}>
              ₹
            </AppText>
            <TextInput
              style={styles.budgetAmountInput}
              keyboardType="numeric"
              value={budget.toLocaleString('en-IN')}
              onChangeText={(val) => {
                const numeric = parseInt(val.replace(/\D/g, ''), 10) || 0;
                onUpdate({ targetBudget: numeric });
              }}
            />
            <View style={styles.explicitTag}>
              <Ionicons name="checkmark-circle" size={12} color={colors.primaryInk} />
              <AppText variant="labelMicro" color={colors.textPrimary}>
                EXPLICIT
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.goalMetaRow}>
          <View style={styles.hintReachPill}>
            <MaterialIcons name="query-stats" size={16} color={colors.primaryInk} />
            <AppText variant="bodySm" color={colors.primaryInk} style={styles.hintReachText}>
              At ₹{budget.toLocaleString('en-IN')}, delivers ~{reach.min.toLocaleString('en-IN')} impressions.
            </AppText>
          </View>

          <View style={styles.escrowTermsRow}>
            <View style={styles.escrowTermItem}>
              <Ionicons name="timer-outline" size={14} color={colors.textSecondary} />
              <AppText variant="labelMd" color={colors.textSecondary}>
                {draft.durationDays}-Day Window
              </AppText>
            </View>
            <AppText variant="labelMd" color={colors.primaryInk} style={styles.escrowTermBold}>
              Fixed All-or-Nothing Escrow
            </AppText>
          </View>
        </View>
      </View>

      {/* SECTION 2: Itemized Broadcast Allocation & Fee Breakdown */}
      <View style={[styles.card, shadows.layer1]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            Itemized Fund Allocation
          </AppText>
          <View style={styles.transparentBadge}>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              100% TRANSPARENT
            </AppText>
          </View>
        </View>

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.fieldSubtext}>
          Escrow disbursal is strictly gated by source audit sign-off prior to media buying.
        </AppText>

        {/* 3-Color Visual Allocation Bar */}
        <View style={styles.allocationBar}>
          <View style={[styles.barSlice, { flex: 88, backgroundColor: colors.primaryInk }]} />
          <View style={[styles.barSlice, { flex: 8, backgroundColor: colors.primaryContainer }]} />
          <View style={[styles.barSlice, { flex: 4, backgroundColor: colors.secondary }]} />
        </View>

        {/* Itemized Rows */}
        <View style={styles.itemizedList}>
          <View style={styles.itemizedRow}>
            <View style={styles.itemizedLeft}>
              <View style={[styles.itemDot, { backgroundColor: colors.primaryInk }]} />
              <View style={styles.itemLabels}>
                <AppText variant="labelMd" color={colors.textPrimary} style={styles.itemTitle}>
                  Direct Advertising Placements (88%)
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary} style={styles.itemSubtitle}>
                  Meta networks & regional news feeds
                </AppText>
              </View>
            </View>
            <AppText variant="labelMd" color={colors.textPrimary} style={styles.itemAmount}>
              ₹{allocation.adSpend.toLocaleString('en-IN')}
            </AppText>
          </View>

          <View style={styles.itemizedRow}>
            <View style={styles.itemizedLeft}>
              <View style={[styles.itemDot, { backgroundColor: colors.primaryContainer }]} />
              <View style={styles.itemLabels}>
                <AppText variant="labelMd" color={colors.textPrimary} style={styles.itemTitle}>
                  Fact & Source Audit (8%)
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary} style={styles.itemSubtitle}>
                  Investigative civic verification desk
                </AppText>
              </View>
            </View>
            <AppText variant="labelMd" color={colors.textPrimary} style={styles.itemAmount}>
              ₹{allocation.verificationFee.toLocaleString('en-IN')}
            </AppText>
          </View>

          <View style={styles.itemizedRow}>
            <View style={styles.itemizedLeft}>
              <View style={[styles.itemDot, { backgroundColor: colors.secondary }]} />
              <View style={styles.itemLabels}>
                <AppText variant="labelMd" color={colors.textPrimary} style={styles.itemTitle}>
                  Escrow Custody & Payment (4%)
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary} style={styles.itemSubtitle}>
                  Statutory compliance & processing
                </AppText>
              </View>
            </View>
            <AppText variant="labelMd" color={colors.textPrimary} style={styles.itemAmount}>
              ₹{allocation.gatewayFee.toLocaleString('en-IN')}
            </AppText>
          </View>
        </View>

        {/* Total Guarantee Footer */}
        <View style={styles.guaranteeFooter}>
          <View style={styles.guaranteeLeft}>
            <Ionicons name="shield-checkmark" size={16} color={colors.primaryInk} />
            <AppText variant="labelMd" color={colors.textPrimary} style={styles.guaranteeText}>
              100% Refund Guarantee
            </AppText>
          </View>
          <AppText variant="headlineSm" color={colors.primaryInk} style={styles.guaranteeAmount}>
            ₹{budget.toLocaleString('en-IN')}
          </AppText>
        </View>
      </View>

      {/* SECTION 3: Campaign Summary Dossier (Dossier Manifest) */}
      <View style={styles.manifestSection}>
        <View style={styles.sectionHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary}>
            Dossier Manifest
          </AppText>
          <AppText variant="labelMicro" color={colors.textSecondary}>
            VERIFIED SEGMENTS
          </AppText>
        </View>

        {/* Card 1: Basics */}
        <View style={[styles.manifestCard, shadows.layer1]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.manifestCardHeaderLeft}>
              <MaterialIcons name="badge" size={16} color={colors.primaryInk} />
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.manifestNum}>
                01 BASICS
              </AppText>
            </View>
            <TouchableOpacity onPress={() => onEditStep(1)} style={styles.editBtn}>
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.editText}>
                EDIT
              </AppText>
            </TouchableOpacity>
          </View>

          <AppText variant="headlineSm" color={colors.textPrimary} numberOfLines={2}>
            {draft.title || 'Untitled Campaign'}
          </AppText>

          <View style={styles.manifestSubRow}>
            <View style={styles.categoryBadgeMini}>
              <AppText variant="labelMicro" color={colors.onSecondaryContainer}>
                {draft.categoryLabel}
              </AppText>
            </View>
            <AppText variant="bodySm" color={colors.textSecondary} numberOfLines={1} style={styles.stewardText}>
              • Steward: {draft.organization}
            </AppText>
          </View>
        </View>

        {/* Card 2: Story */}
        <View style={[styles.manifestCard, shadows.layer1]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.manifestCardHeaderLeft}>
              <MaterialIcons name="article" size={16} color={colors.primaryInk} />
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.manifestNum}>
                02 STORY
              </AppText>
            </View>
            <TouchableOpacity onPress={() => onEditStep(2)} style={styles.editBtn}>
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.editText}>
                EDIT
              </AppText>
            </TouchableOpacity>
          </View>

          <AppText variant="bodyMd" color={colors.textPrimary} style={styles.storyQuote} numberOfLines={2}>
            {`"${draft.storyHeadline || draft.summary}"`}
          </AppText>

          <View style={styles.manifestSubRow}>
            <AppText variant="labelMd" color={colors.textSecondary}>
              {wordCount} words narrative
            </AppText>
            {draft.citations ? (
              <AppText variant="labelMd" color={colors.primaryInk}>
                • Citations verified
              </AppText>
            ) : null}
          </View>
        </View>

        {/* Card 3: Visuals */}
        <View style={[styles.manifestCard, shadows.layer1]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.manifestCardHeaderLeft}>
              <MaterialIcons name="photo-library" size={16} color={colors.primaryInk} />
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.manifestNum}>
                03 VISUALS
              </AppText>
            </View>
            <TouchableOpacity onPress={() => onEditStep(3)} style={styles.editBtn}>
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.editText}>
                EDIT
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.visualsGrid}>
            {draft.coverImageUri ? (
              <View style={styles.visualItem}>
                <Image source={{ uri: draft.coverImageUri }} style={styles.visualThumb169} />
                <AppText variant="labelMicro" color={colors.textSecondary}>
                  16:9 Header Visual
                </AppText>
              </View>
            ) : null}

            {draft.feedCreativeUri ? (
              <View style={styles.visualItem}>
                <Image source={{ uri: draft.feedCreativeUri }} style={styles.visualThumbSquare} />
                <AppText variant="labelMicro" color={colors.textSecondary}>
                  1:1 Square Feed Ad
                </AppText>
              </View>
            ) : null}
          </View>

          <AppText variant="bodySm" color={colors.textSecondary} numberOfLines={1}>
            {`Ad Headline: "${draft.adHeadline}"`}
          </AppText>
        </View>

        {/* Card 4: Reach & Distribution */}
        <View style={[styles.manifestCard, shadows.layer1]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.manifestCardHeaderLeft}>
              <MaterialIcons name="cell-tower" size={16} color={colors.primaryInk} />
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.manifestNum}>
                04 REACH & DISTRIBUTION
              </AppText>
            </View>
            <TouchableOpacity onPress={() => onEditStep(4)} style={styles.editBtn}>
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.editText}>
                EDIT
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.reachManifestRow}>
            <MaterialIcons name="my-location" size={20} color={colors.primaryInk} />
            <View style={styles.reachManifestContent}>
              <AppText variant="labelMd" color={colors.textPrimary} style={styles.reachZoneTitle}>
                {draft.focalArea || 'Hyper-Local Zone'}
              </AppText>
              <AppText variant="bodySm" color={colors.textSecondary}>
                {draft.audienceSegments.length} Segments • {draft.channels.length} Channels • {draft.durationDays} Days
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* SECTION 4: Pre-Submission Quality Gates */}
      <View style={[styles.card, shadows.layer1]}>
        <View style={styles.qualityHeader}>
          <MaterialIcons name="task-alt" size={20} color={colors.primaryInk} />
          <AppText variant="headlineSm" color={colors.textPrimary}>
            Pre-Submission Quality Gates
          </AppText>
        </View>

        <View style={styles.qualityList}>
          <View style={styles.qualityItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primaryInk} />
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.qualityItemText}>
              Title & executive summary strictly within character length specifications
            </AppText>
          </View>

          <View style={styles.qualityItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primaryInk} />
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.qualityItemText}>
              Empirical dossier narrative and source citations verified
            </AppText>
          </View>

          <View style={styles.qualityItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primaryInk} />
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.qualityItemText}>
              Primary 16:9 and 1:1 feed ad visuals configured
            </AppText>
          </View>

          <View style={styles.qualityItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primaryInk} />
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.qualityItemText}>
              Explicit funding threshold set by creator (₹{budget.toLocaleString('en-IN')})
            </AppText>
          </View>
        </View>
      </View>

      {/* SECTION 5: Mandatory Declarations & Terms */}
      <View style={[styles.card, shadows.layer1, (errors.termsAgreed || errors.accuracyAffirmed || errors.escrowAgreed) ? styles.cardError : null]}>
        <View style={styles.declarationsHeader}>
          <MaterialIcons name="gavel" size={20} color={colors.primaryInk} />
          <AppText variant="headlineSm" color={colors.textPrimary}>
            Mandatory Declarations
          </AppText>
        </View>

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.fieldSubtext}>
          Amplify requires stewards to affirm accountability and civic fidelity before submission.
        </AppText>

        <View style={styles.declarationsList}>
          {/* Declaration 1 */}
          <TouchableOpacity
            style={styles.declarationRow}
            onPress={() => onUpdate({ termsAgreed: !draft.termsAgreed })}
            activeOpacity={0.8}
          >
            <Ionicons
              name={draft.termsAgreed ? 'checkbox' : 'square-outline'}
              size={20}
              color={draft.termsAgreed ? colors.primaryInk : colors.textMuted}
              style={styles.declarationCheck}
            />
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.declarationText}>
              I confirm this campaign purchases <AppText variant="bodySm" color={colors.textPrimary} style={styles.boldText}>advertising syndication and verified message distribution</AppText>, and does not constitute a personal charity, donation, or non-profit fundraising solicitation.
            </AppText>
          </TouchableOpacity>
          {errors.termsAgreed && (
            <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
              {errors.termsAgreed}
            </AppText>
          )}

          {/* Declaration 2 */}
          <TouchableOpacity
            style={styles.declarationRow}
            onPress={() => onUpdate({ accuracyAffirmed: !draft.accuracyAffirmed })}
            activeOpacity={0.8}
          >
            <Ionicons
              name={draft.accuracyAffirmed ? 'checkbox' : 'square-outline'}
              size={20}
              color={draft.accuracyAffirmed ? colors.primaryInk : colors.textMuted}
              style={styles.declarationCheck}
            />
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.declarationText}>
              I warrant that all cited empirical data, sensor telemetry, and studies are accurate to the best of my knowledge and withstand editorial audit.
            </AppText>
          </TouchableOpacity>
          {errors.accuracyAffirmed && (
            <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
              {errors.accuracyAffirmed}
            </AppText>
          )}

          {/* Declaration 3 */}
          <TouchableOpacity
            style={styles.declarationRow}
            onPress={() => onUpdate({ escrowAgreed: !draft.escrowAgreed })}
            activeOpacity={0.8}
          >
            <Ionicons
              name={draft.escrowAgreed ? 'checkbox' : 'square-outline'}
              size={20}
              color={draft.escrowAgreed ? colors.primaryInk : colors.textMuted}
              style={styles.declarationCheck}
            />
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.declarationText}>
              I agree to the <AppText variant="bodySm" color={colors.primaryInk} style={styles.boldText}>Amplify Escrow & 100% Refund Protocol</AppText>, including automatic release back to co-distributors if threshold is not met within duration.
            </AppText>
          </TouchableOpacity>
          {errors.escrowAgreed && (
            <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
              {errors.escrowAgreed}
            </AppText>
          )}
        </View>
      </View>

      {/* SECTION 6: Post-Submission Status Pipeline Preview */}
      <View style={[styles.pipelineCard, shadows.layer1]}>
        <AppText variant="labelMicro" color={colors.textSecondary} style={styles.pipelineTitle}>
          EDITORIAL PIPELINE SEQUENCE
        </AppText>

        <View style={styles.pipelineSteps}>
          <View style={styles.pipelineStep}>
            <View style={[styles.pipelineDot, styles.pipelineDotActive]} />
            <View style={styles.pipelineStepText}>
              <AppText variant="labelMd" color={colors.primaryInk} style={styles.pipelineStageName}>
                Stage 1: Submitted
              </AppText>
              <AppText variant="bodySm" color={colors.textSecondary}>
                Immediate cryptographic dossier timestamp
              </AppText>
            </View>
          </View>

          <View style={styles.pipelineStep}>
            <View style={styles.pipelineDot} />
            <View style={styles.pipelineStepText}>
              <AppText variant="labelMd" color={colors.textPrimary} style={styles.pipelineStageName}>
                Stage 2: Under Editorial Review (12–24h)
              </AppText>
              <AppText variant="bodySm" color={colors.textSecondary}>
                Source veracity check & ad compliance vetting
              </AppText>
            </View>
          </View>

          <View style={styles.pipelineStep}>
            <View style={styles.pipelineDot} />
            <View style={styles.pipelineStepText}>
              <AppText variant="labelMd" color={colors.textPrimary} style={styles.pipelineStageName}>
                Stage 3: Approved for Community Backing
              </AppText>
              <AppText variant="bodySm" color={colors.textSecondary}>
                14-day funding window opens for co-distributors
              </AppText>
            </View>
          </View>

          <View style={styles.pipelineStep}>
            <View style={styles.pipelineDot} />
            <View style={styles.pipelineStepText}>
              <AppText variant="labelMd" color={colors.textPrimary} style={styles.pipelineStageName}>
                Stage 4: Live Broadcast Flight
              </AppText>
              <AppText variant="bodySm" color={colors.textSecondary}>
                Programmatic feed injection & verified impression logging
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  goalCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    gap: spacing.xs,
  },
  goalCardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: colors.primaryInk,
  },
  goalTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: 4,
    gap: 8,
  },
  goalTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  goalTitleText: {
    fontSize: 18,
    lineHeight: 24,
  },
  goalIcon: {
    flexShrink: 0,
    marginTop: 2,
  },
  stewardMandate: {
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  goalExplanation: {
    fontSize: 12.5,
    lineHeight: 18,
    paddingLeft: 4,
    marginBottom: 4,
  },
  budgetInputBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: 4,
  },
  budgetInputLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  rupeeSign: {
    fontWeight: '700',
    marginRight: 6,
  },
  budgetAmountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  explicitTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  goalMetaRow: {
    gap: 6,
    marginTop: 4,
    paddingLeft: 4,
  },
  hintReachPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  hintReachText: {
    fontSize: 12,
    fontWeight: '600',
  },
  escrowTermsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 2,
  },
  escrowTermItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  escrowTermBold: {
    fontWeight: '700',
    flexShrink: 0,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    gap: spacing.xs,
  },
  cardError: {
    borderColor: colors.restricted,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  cardHeaderTitle: {
    flex: 1,
    flexShrink: 1,
    marginRight: 6,
  },
  transparentBadge: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    flexShrink: 0,
  },
  fieldSubtext: {
    fontSize: 12,
    marginBottom: 6,
  },
  allocationBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
    marginBottom: spacing.sm,
  },
  barSlice: {
    height: '100%',
  },
  itemizedList: {
    gap: 8,
  },
  itemizedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  itemizedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  itemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  itemLabels: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 11,
  },
  itemAmount: {
    fontWeight: '800',
    fontSize: 13,
  },
  guaranteeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerHigh,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  guaranteeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guaranteeText: {
    fontWeight: '700',
  },
  guaranteeAmount: {
    fontWeight: '800',
  },
  manifestSection: {
    gap: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  manifestCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    gap: 6,
  },
  manifestCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  manifestNum: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  editBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceContainerLow,
  },
  editText: {
    fontWeight: '800',
  },
  manifestSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  categoryBadgeMini: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    flexShrink: 0,
  },
  stewardText: {
    flex: 1,
    flexShrink: 1,
  },
  storyQuote: {
    fontStyle: 'italic',
    lineHeight: 20,
  },
  visualsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  visualItem: {
    flex: 1,
    gap: 2,
  },
  visualThumb169: {
    width: '100%',
    height: 72,
    borderRadius: borderRadius.sm,
  },
  visualThumbSquare: {
    width: '100%',
    height: 72,
    borderRadius: borderRadius.sm,
  },
  reachManifestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  reachManifestContent: {
    flex: 1,
  },
  reachZoneTitle: {
    fontWeight: '700',
  },
  qualityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  qualityList: {
    gap: 8,
    marginTop: 4,
  },
  qualityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  qualityItemText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  declarationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  declarationsList: {
    gap: 10,
    marginTop: 2,
  },
  declarationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  declarationCheck: {
    marginTop: 2,
  },
  declarationText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
  },
  pipelineCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
  },
  pipelineTitle: {
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  pipelineSteps: {
    gap: 12,
    paddingLeft: 6,
    borderLeftWidth: 2,
    borderLeftColor: colors.outlineVariant,
    marginLeft: 6,
  },
  pipelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  pipelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surfaceContainerHighest,
    marginLeft: -11,
    marginTop: 4,
  },
  pipelineDotActive: {
    backgroundColor: colors.primaryInk,
  },
  pipelineStepText: {
    flex: 1,
  },
  pipelineStageName: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  inlineError: {
    fontSize: 12,
    marginTop: 2,
  },
});
