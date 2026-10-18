import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppText } from '../AppText';
import { StatusBadge } from '../StatusBadge';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { CampaignDraft } from '../../types/campaign';
import {
  WIZARD_CATEGORIES,
  calculateCampaignProjectedReach,
} from '../../config/campaignCreation';

export interface Step1BasicsProps {
  draft: CampaignDraft;
  errors: Record<string, string>;
  onUpdate: (fields: Partial<CampaignDraft>) => void;
}

export const Step1Basics: React.FC<Step1BasicsProps> = ({
  draft,
  errors,
  onUpdate,
}) => {
  const [creationMode, setCreationMode] = useState<'manual' | 'ai'>('manual');
  const [isPolishing, setIsPolishing] = useState(false);
  const [isPolished, setIsPolished] = useState(false);

  // Micro-interaction: AI Polish
  const handleAIPolish = () => {
    setIsPolishing(true);
    setTimeout(() => {
      onUpdate({
        summary:
          'Primary school classrooms frequently exceed hazardous particulate limits during winter thermal inversions without parental notification. This campaign funds high-reach civic ad distributions to mandate public, calibrated real-time air sensors in all district facilities.',
      });
      setIsPolishing(false);
      setIsPolished(true);
      setTimeout(() => setIsPolished(false), 3000);
    }, 600);
  };

  const currentBudget = draft.targetBudget || 150000;
  const reachEstimate = calculateCampaignProjectedReach(currentBudget);

  return (
    <View style={styles.container}>
      {/* Creation Mode Segmented Switch */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          onPress={() => setCreationMode('manual')}
          style={[styles.segmentBtn, creationMode === 'manual' && styles.segmentBtnActive]}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="edit-note"
            size={18}
            color={creationMode === 'manual' ? colors.primaryInk : colors.textSecondary}
          />
          <AppText
            variant="headlineSm"
            color={creationMode === 'manual' ? colors.primaryInk : colors.textSecondary}
            style={styles.segmentText}
          >
            Create Manually
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCreationMode('ai')}
          style={[styles.segmentBtn, creationMode === 'ai' && styles.segmentBtnActive]}
          activeOpacity={0.8}
        >
          <Ionicons
            name="mic-outline"
            size={18}
            color={creationMode === 'ai' ? colors.primaryInk : colors.textSecondary}
          />
          <AppText
            variant="headlineSm"
            color={creationMode === 'ai' ? colors.primaryInk : colors.textSecondary}
            style={styles.segmentText}
          >
            Voice & AI Transcribe
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Field 1: Campaign Headline */}
      <View style={[styles.card, shadows.layer1, errors.title ? styles.cardError : null]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            Campaign Headline <AppText variant="headlineSm" color={colors.restricted}>*</AppText>
          </AppText>
          <View style={styles.counterBadge}>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              {draft.title.length}/80 chars
            </AppText>
          </View>
        </View>

        <TextInput
          style={styles.textInput}
          placeholder="Enter a punchy, factual statement headline"
          placeholderTextColor={colors.textMuted}
          maxLength={80}
          value={draft.title}
          onChangeText={(text) => onUpdate({ title: text })}
        />

        {errors.title ? (
          <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
            {errors.title}
          </AppText>
        ) : (
          <View style={styles.hintRow}>
            <Ionicons name="information-circle-outline" size={14} color={colors.primaryInk} />
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.hintText}>
              This headline acts as the core banner across newsfeeds unless customized in Step 03.
            </AppText>
          </View>
        )}
      </View>

      {/* Field 2: Distribution Category Pills */}
      <View style={[styles.card, shadows.layer1, errors.category ? styles.cardError : null]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            Distribution Category <AppText variant="headlineSm" color={colors.restricted}>*</AppText>
          </AppText>
          <StatusBadge label="VERIFIED REGISTRY" variant="verified" />
        </View>

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.fieldSubtext}>
          Anchors your distribution ledger to verified municipal civic classifications.
        </AppText>

        <View style={styles.pillsWrap}>
          {WIZARD_CATEGORIES.map((cat) => {
            const isSelected = draft.category === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => onUpdate({ category: cat.id, categoryLabel: cat.label })}
                style={[styles.pill, isSelected ? styles.pillSelected : styles.pillUnselected]}
                activeOpacity={0.8}
              >
                {isSelected && <Ionicons name="checkmark" size={14} color={colors.onPrimary} />}
                <AppText
                  variant="labelMd"
                  color={isSelected ? colors.onPrimary : colors.textPrimary}
                  style={styles.pillText}
                >
                  {cat.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {errors.category && (
          <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
            {errors.category}
          </AppText>
        )}
      </View>

      {/* Field 3: Issuing Organization or Steward */}
      <View style={[styles.card, shadows.layer1, errors.organization ? styles.cardError : null]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            Issuing Organization or Steward <AppText variant="headlineSm" color={colors.restricted}>*</AppText>
          </AppText>
          <View style={styles.kycBadge}>
            <Ionicons name="shield-checkmark" size={12} color={colors.primaryInk} />
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.kycText}>
              KYC VERIFIED
            </AppText>
          </View>
        </View>

        <View style={styles.inputWithIcon}>
          <MaterialIcons name="corporate-fare" size={18} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.flexInput}
            placeholder="Name of entity, coalition, or individual backer"
            placeholderTextColor={colors.textMuted}
            value={draft.organization}
            onChangeText={(text) => onUpdate({ organization: text })}
          />
        </View>

        {errors.organization && (
          <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
            {errors.organization}
          </AppText>
        )}
      </View>

      {/* Field 4: Executive Summary */}
      <View style={[styles.card, shadows.layer1, errors.summary ? styles.cardError : null]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            Executive Summary <AppText variant="headlineSm" color={colors.restricted}>*</AppText>
          </AppText>

          <TouchableOpacity
            onPress={handleAIPolish}
            disabled={isPolishing}
            style={[styles.polishBtn, isPolished && styles.polishBtnSuccess]}
            activeOpacity={0.8}
          >
            <AppText variant="labelMicro" color={isPolished ? colors.onPrimary : colors.primaryInk}>
              {isPolishing ? '⏳ Refining...' : isPolished ? '✓ Polished' : '✨ Polish'}
            </AppText>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholder="Condense your message into two clear, compelling journalistic sentences (160–240 characters recommended)..."
          placeholderTextColor={colors.textMuted}
          maxLength={320}
          value={draft.summary}
          onChangeText={(text) => onUpdate({ summary: text })}
        />

        <View style={styles.summaryFooterRow}>
          <AppText variant="labelMicro" color={colors.textSecondary}>
            Recommended: 160–240 characters
          </AppText>
          <AppText variant="labelMicro" color={colors.textSecondary}>
            {draft.summary.length}/320 chars
          </AppText>
        </View>

        {errors.summary && (
          <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
            {errors.summary}
          </AppText>
        )}
      </View>

      {/* Field 5: Campaign Objective */}
      <View style={[styles.card, shadows.layer1, errors.objective ? styles.cardError : null]}>
        <AppText variant="headlineSm" color={colors.textPrimary}>
          Core Objective <AppText variant="headlineSm" color={colors.restricted}>*</AppText>
        </AppText>
        <AppText variant="bodySm" color={colors.textSecondary} style={styles.fieldSubtext}>
          What concrete policy outcome or public mandate will this broadcast achieve?
        </AppText>

        <TextInput
          style={styles.textInput}
          placeholder="e.g. Mandate calibrated air monitors across all district schools"
          placeholderTextColor={colors.textMuted}
          value={draft.objective}
          onChangeText={(text) => onUpdate({ objective: text })}
        />

        {errors.objective && (
          <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
            {errors.objective}
          </AppText>
        )}
      </View>

      {/* Field 6: Core Amplification Pillars Card */}
      <View style={[styles.pillarsCard, shadows.layer1]}>
        <View style={styles.pillarsHeader}>
          <View style={styles.pillarIconBox}>
            <MaterialIcons name="campaign" size={18} color={colors.onPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="headlineSm" color={colors.textPrimary}>
              Core Amplification Pillars
            </AppText>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              REQUIRED BROADCAST ANCHORS
            </AppText>
          </View>
        </View>

        {/* Pillar 1: Who */}
        <View style={styles.pillarItem}>
          <View style={styles.pillarLabelRow}>
            <View style={styles.pillarNum}>
              <AppText variant="labelMicro" color={colors.onPrimary}>1</AppText>
            </View>
            <AppText variant="labelMd" color={colors.textPrimary} style={styles.pillarLabel} numberOfLines={2}>
              Who should this broadcast reach?
            </AppText>
          </View>
          <TextInput
            style={styles.pillarInput}
            placeholder="Target audience description"
            placeholderTextColor={colors.textMuted}
            value={draft.pillarWho}
            onChangeText={(text) => onUpdate({ pillarWho: text })}
          />
        </View>

        {/* Pillar 2: Why */}
        <View style={styles.pillarItem}>
          <View style={styles.pillarLabelRow}>
            <View style={styles.pillarNum}>
              <AppText variant="labelMicro" color={colors.onPrimary}>2</AppText>
            </View>
            <AppText variant="labelMd" color={colors.textPrimary} style={styles.pillarLabel} numberOfLines={2}>
              Why does this matter right now?
            </AppText>
          </View>
          <TextInput
            style={styles.pillarInput}
            placeholder="Immediate urgency or trigger event"
            placeholderTextColor={colors.textMuted}
            value={draft.pillarWhy}
            onChangeText={(text) => onUpdate({ pillarWhy: text })}
          />
        </View>

        {/* Pillar 3: Evidence */}
        <View style={styles.pillarItem}>
          <View style={styles.pillarLabelRow}>
            <View style={styles.pillarNum}>
              <AppText variant="labelMicro" color={colors.onPrimary}>3</AppText>
            </View>
            <AppText variant="labelMd" color={colors.textPrimary} style={styles.pillarLabel} numberOfLines={2}>
              What verified evidence supports this?
            </AppText>
          </View>
          <TextInput
            style={styles.pillarInput}
            placeholder="Data source, citation, or investigation reference"
            placeholderTextColor={colors.textMuted}
            value={draft.pillarEvidence}
            onChangeText={(text) => onUpdate({ pillarEvidence: text })}
          />
        </View>
      </View>

      {/* Field 7: Target Advertising Budget (INR) */}
      <View style={[styles.card, shadows.layer1, errors.targetBudget ? styles.cardError : null]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            Target Advertising Budget (INR) <AppText variant="headlineSm" color={colors.restricted}>*</AppText>
          </AppText>
          <View style={styles.escrowPill}>
            <Ionicons name="lock-closed" size={11} color={colors.primaryInk} />
            <AppText variant="labelMicro" color={colors.primaryInk}>
              ESCROW PROTECTED
            </AppText>
          </View>
        </View>

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.fieldSubtext}>
          Total community distribution budget pooled before programmatic syndication unlocks.
        </AppText>

        <View style={styles.budgetInputContainer}>
          <AppText variant="headlineMd" color={colors.textPrimary} style={styles.currencySymbol}>
            ₹
          </AppText>
          <TextInput
            style={styles.budgetInput}
            keyboardType="numeric"
            value={draft.targetBudget ? draft.targetBudget.toString() : ''}
            onChangeText={(val) => {
              const cleaned = parseInt(val.replace(/\D/g, ''), 10) || 0;
              onUpdate({ targetBudget: cleaned });
            }}
            placeholder="150000"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.reachPreviewPill}>
          <MaterialIcons name="query-stats" size={16} color={colors.primaryInk} />
          <AppText variant="bodySm" color={colors.primaryInk} style={styles.reachPreviewText}>
            Projected reach: ~{reachEstimate.min.toLocaleString('en-IN')} – {reachEstimate.max.toLocaleString('en-IN')} citizens
          </AppText>
        </View>

        {errors.targetBudget && (
          <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
            {errors.targetBudget}
          </AppText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.md,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
  },
  segmentBtnActive: {
    backgroundColor: colors.surfaceContainerLowest,
    ...shadows.layer1,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
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
    marginBottom: 6,
  },
  cardHeaderTitle: {
    flex: 1,
    flexShrink: 1,
    marginRight: 4,
  },
  counterBadge: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  textInput: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans',
  },
  multilineInput: {
    minHeight: 88,
    lineHeight: 20,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
  },
  fieldSubtext: {
    fontSize: 12,
    marginBottom: 6,
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  pillSelected: {
    backgroundColor: colors.primaryInk,
  },
  pillUnselected: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  kycText: {
    fontWeight: '800',
    fontSize: 9.5,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: 8,
  },
  flexInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },
  polishBtn: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  polishBtnSuccess: {
    backgroundColor: colors.primaryInk,
  },
  summaryFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  pillarsCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
  },
  pillarsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  pillarIconBox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarItem: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: 4,
  },
  pillarLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillarNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primaryInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarLabel: {
    fontWeight: '700',
    fontSize: 12,
    flex: 1,
  },
  pillarInput: {
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  escrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  currencySymbol: {
    marginRight: 6,
    fontWeight: '700',
  },
  budgetInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  reachPreviewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    marginTop: 4,
  },
  reachPreviewText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inlineError: {
    fontSize: 12,
    marginTop: 2,
  },
});
