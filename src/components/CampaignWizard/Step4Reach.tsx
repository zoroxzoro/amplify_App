import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { CampaignDraft } from '../../types/campaign';
import {
  GEO_SCOPE_OPTIONS,
  AUDIENCE_SEGMENT_OPTIONS,
  SYNDICATION_CHANNELS,
  DURATION_OPTIONS,
  calculateCampaignProjectedReach,
} from '../../config/campaignCreation';

export interface Step4ReachProps {
  draft: CampaignDraft;
  errors: Record<string, string>;
  onUpdate: (fields: Partial<CampaignDraft>) => void;
}

export const Step4Reach: React.FC<Step4ReachProps> = ({
  draft,
  errors,
  onUpdate,
}) => {
  const [newWardInput, setNewWardInput] = useState('');
  const [showAddWard, setShowAddWard] = useState(false);

  const reachProjection = calculateCampaignProjectedReach(
    draft.targetBudget,
    draft.channels.length,
    draft.geoScope
  );

  const toggleAudienceSegment = (segment: string) => {
    const exists = draft.audienceSegments.includes(segment);
    const updated = exists
      ? draft.audienceSegments.filter((s) => s !== segment)
      : [...draft.audienceSegments, segment];
    onUpdate({ audienceSegments: updated });
  };

  const toggleChannel = (channelTitle: string) => {
    const exists = draft.channels.includes(channelTitle);
    const updated = exists
      ? draft.channels.filter((c) => c !== channelTitle)
      : [...draft.channels, channelTitle];
    onUpdate({ channels: updated });
  };

  const removeWard = (ward: string) => {
    onUpdate({ priorityWards: draft.priorityWards.filter((w) => w !== ward) });
  };

  const addWard = () => {
    if (newWardInput.trim()) {
      onUpdate({ priorityWards: [...draft.priorityWards, newWardInput.trim()] });
      setNewWardInput('');
      setShowAddWard(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Crucial Disclosure Banner */}
      <View style={[styles.disclosureBanner, shadows.layer1]}>
        <View style={styles.disclosureIconBox}>
          <MaterialIcons name="policy" size={20} color={colors.primaryInk} />
        </View>
        <View style={styles.disclosureContent}>
          <AppText variant="labelMd" color={colors.textPrimary} style={styles.disclosureTitle}>
            CIVIC DISTRIBUTION NOTE
          </AppText>
          <AppText variant="bodySm" color={colors.textSecondary} style={styles.disclosureBody}>
            Creator settings represent requested targeting. Platform review finalizes ad inventory based on regional compliance and publisher CPM rates.
          </AppText>
        </View>
      </View>

      {/* Section 1: Geographic Footprint */}
      <View style={[styles.card, shadows.layer1, errors.focalArea ? styles.cardError : null]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            1. Geographic Footprint <AppText variant="headlineSm" color={colors.restricted}>*</AppText>
          </AppText>
          <View style={styles.geoBadge}>
            <AppText variant="labelMicro" color={colors.primaryInk}>
              GEO-FENCED
            </AppText>
          </View>
        </View>

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.fieldSubtext}>
          Choose the territorial boundary for local feed delivery.
        </AppText>

        {/* Geo Scope Radios */}
        <View style={styles.geoScopeList}>
          {GEO_SCOPE_OPTIONS.map((opt) => {
            const isSelected = draft.geoScope === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.geoOption, isSelected && styles.geoOptionSelected]}
                onPress={() => onUpdate({ geoScope: opt.id })}
                activeOpacity={0.8}
              >
                <View style={styles.geoRadioRow}>
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={16}
                    color={isSelected ? colors.primaryInk : colors.textMuted}
                  />
                  <View style={styles.geoLabelBox}>
                    <AppText
                      variant="headlineSm"
                      color={isSelected ? colors.primaryInk : colors.textPrimary}
                      style={styles.geoLabelText}
                    >
                      {opt.label}
                    </AppText>
                    <AppText variant="bodySm" color={colors.textSecondary} style={styles.geoSubtitle}>
                      {opt.subtitle}
                    </AppText>
                  </View>
                </View>

                {opt.badge && (
                  <View style={styles.optBadge}>
                    <AppText variant="labelMicro" color={colors.onPrimaryFixedVariant}>
                      {opt.badge}
                    </AppText>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Focal Coverage Zone Input */}
        <View style={styles.focalBox}>
          <AppText variant="labelMd" color={colors.textPrimary} style={styles.focalLabel}>
            Focal Coverage Zone
          </AppText>
          <View style={styles.focalInputWrapper}>
            <MaterialIcons name="near-me" size={18} color={colors.primaryInk} />
            <TextInput
              style={styles.focalInput}
              placeholder="e.g. Within 15 km of Municipal Ward 14–22 Industrial Belt"
              placeholderTextColor={colors.textMuted}
              value={draft.focalArea}
              onChangeText={(text) => onUpdate({ focalArea: text })}
            />
          </View>
        </View>

        {/* Identified Priority Wards */}
        <View style={styles.wardsContainer}>
          <AppText variant="labelMicro" color={colors.textSecondary} style={styles.wardsLabel}>
            IDENTIFIED PRIORITY WARDS
          </AppText>
          <View style={styles.wardChipsRow}>
            {draft.priorityWards.map((ward) => (
              <View key={ward} style={styles.wardChip}>
                <Ionicons name="location-sharp" size={13} color={colors.primaryInk} />
                <AppText variant="labelMd" color={colors.textPrimary}>
                  {ward}
                </AppText>
                <TouchableOpacity onPress={() => removeWard(ward)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={15} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}

            {showAddWard ? (
              <View style={styles.addWardInline}>
                <TextInput
                  style={styles.addWardInput}
                  placeholder="Ward name"
                  placeholderTextColor={colors.textMuted}
                  value={newWardInput}
                  onChangeText={setNewWardInput}
                  autoFocus
                />
                <TouchableOpacity style={styles.addWardConfirmBtn} onPress={addWard}>
                  <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addWardBtn}
                onPress={() => setShowAddWard(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={14} color={colors.primaryInk} />
                <AppText variant="labelMd" color={colors.primaryInk}>
                  Add Ward
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {errors.focalArea && (
          <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
            {errors.focalArea}
          </AppText>
        )}
      </View>

      {/* Section 2: Audience Segments & Affinity Groups */}
      <View style={[styles.card, shadows.layer1, errors.audienceSegments ? styles.cardError : null]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            2. Audience & Affinity Groups <AppText variant="headlineSm" color={colors.restricted}>*</AppText>
          </AppText>
          <View style={styles.countBadge}>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              {draft.audienceSegments.length} Selected
            </AppText>
          </View>
        </View>

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.fieldSubtext}>
          Targeted cohorts receive tailored editorial snippets formatted to their community concerns.
        </AppText>

        <View style={styles.chipsWrap}>
          {AUDIENCE_SEGMENT_OPTIONS.map((seg) => {
            const isSelected = draft.audienceSegments.includes(seg);
            return (
              <TouchableOpacity
                key={seg}
                style={[styles.audienceChip, isSelected ? styles.audienceChipSelected : styles.audienceChipUnselected]}
                onPress={() => toggleAudienceSegment(seg)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'add'}
                  size={15}
                  color={isSelected ? colors.onPrimary : colors.textSecondary}
                />
                <AppText
                  variant="labelMd"
                  color={isSelected ? colors.onPrimary : colors.textPrimary}
                  style={isSelected ? styles.audienceChipTextSelected : undefined}
                >
                  {seg}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {errors.audienceSegments && (
          <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
            {errors.audienceSegments}
          </AppText>
        )}
      </View>

      {/* Section 3: Syndication Channels */}
      <View style={[styles.card, shadows.layer1, errors.channels ? styles.cardError : null]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            3. Syndication Channels <AppText variant="headlineSm" color={colors.restricted}>*</AppText>
          </AppText>
          <View style={styles.syncedBadge}>
            <AppText variant="labelMicro" color={colors.primaryInk}>
              MULTI-CHANNEL
            </AppText>
          </View>
        </View>

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.fieldSubtext}>
          Cross-platform distribution ensures independent verification and broad community saturation.
        </AppText>

        <View style={styles.channelList}>
          {SYNDICATION_CHANNELS.map((ch) => {
            const isChecked = draft.channels.includes(ch.title);
            const isGateLocked = Boolean(ch.minBudget && draft.targetBudget < ch.minBudget);

            return (
              <TouchableOpacity
                key={ch.id}
                style={[
                  styles.channelItem,
                  isChecked && styles.channelItemSelected,
                  isGateLocked && styles.channelItemDisabled,
                ]}
                onPress={() => {
                  if (!isGateLocked) {
                    toggleChannel(ch.title);
                  }
                }}
                activeOpacity={isGateLocked ? 1 : 0.8}
              >
                <Ionicons
                  name={isChecked ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={isChecked ? colors.primaryInk : colors.textMuted}
                  style={styles.channelCheck}
                />
                <View style={styles.channelDetails}>
                  <View style={styles.channelTop}>
                    <AppText
                      variant="headlineSm"
                      color={colors.textPrimary}
                      style={styles.channelTitle}
                    >
                      {ch.title}
                    </AppText>
                    <View style={isGateLocked ? styles.gateBadge : styles.channelBadge}>
                      <AppText
                        variant="labelMicro"
                        color={isGateLocked ? colors.restricted : colors.onSecondaryContainer}
                      >
                        {ch.badge}
                      </AppText>
                    </View>
                  </View>
                  <AppText variant="bodySm" color={colors.textSecondary} style={styles.channelDesc}>
                    {ch.description}
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {errors.channels && (
          <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
            {errors.channels}
          </AppText>
        )}
      </View>

      {/* Section 4: Broadcast Window Duration */}
      <View style={[styles.card, shadows.layer1, errors.durationDays ? styles.cardError : null]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            4. Broadcast Window Duration <AppText variant="headlineSm" color={colors.restricted}>*</AppText>
          </AppText>
          <AppText variant="labelMicro" color={colors.primaryInk} style={styles.badgeTextRight}>
            CLOSES IN {draft.durationDays}D
          </AppText>
        </View>

        <View style={styles.durationGrid}>
          {DURATION_OPTIONS.map((d) => {
            const isSelected = draft.durationDays === d.days;
            return (
              <TouchableOpacity
                key={d.days}
                style={[styles.durationCard, isSelected && styles.durationCardSelected]}
                onPress={() => onUpdate({ durationDays: d.days })}
                activeOpacity={0.8}
              >
                <View style={styles.durationCardHeader}>
                  <AppText
                    variant="headlineSm"
                    color={isSelected ? colors.onPrimary : colors.textPrimary}
                    style={styles.durationLabel}
                  >
                    {d.label}
                  </AppText>
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={16}
                    color={isSelected ? colors.onPrimary : colors.textMuted}
                  />
                </View>
                <AppText
                  variant="labelMicro"
                  color={isSelected ? colors.primaryFixed : colors.textSecondary}
                >
                  {d.subtitle}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Section 5: Estimated Reach Sandbox Container */}
      <View style={[styles.reachSandboxCard, shadows.layer1]}>
        <View style={styles.reachSandboxHeader}>
          <View style={styles.reachSandboxTitleRow}>
            <MaterialIcons name="query-stats" size={18} color={colors.primaryInk} />
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.reachSandboxLabel}>
              PROJECTED AUDIENCE REACH (SANDBOX)
            </AppText>
          </View>
          <View style={styles.liveModelBadge}>
            <AppText variant="labelMicro" color={colors.onPrimaryFixedVariant}>
              LIVE MODEL
            </AppText>
          </View>
        </View>

        <View style={styles.reachMetricContainer}>
          <AppText variant="labelMicro" color={colors.textSecondary}>
            ESTIMATED DELIVERY VOLUME
          </AppText>
          <AppText variant="displayLg" color={colors.primaryInk} style={styles.reachBigNumber}>
            {reachProjection.min.toLocaleString('en-IN')} – {reachProjection.max.toLocaleString('en-IN')}
          </AppText>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.reachUnit}>
            verified impressions
          </AppText>
        </View>

        <View style={styles.reachDisclaimerBox}>
          <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
          <AppText variant="bodySm" color={colors.textSecondary} style={styles.reachDisclaimerText}>
            {reachProjection.note}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  disclosureBanner: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  disclosureIconBox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  disclosureContent: {
    flex: 1,
  },
  disclosureTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  disclosureBody: {
    fontSize: 12,
    lineHeight: 18,
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
    marginRight: 6,
  },
  geoBadge: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    flexShrink: 0,
  },
  syncedBadge: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  countBadge: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  badgeTextRight: {
    flexShrink: 0,
    fontWeight: '700',
  },
  fieldSubtext: {
    fontSize: 12,
    marginBottom: 6,
  },
  geoScopeList: {
    gap: 8,
    marginTop: 2,
  },
  geoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  geoOptionSelected: {
    borderWidth: 1,
    borderColor: colors.primaryInk,
  },
  geoRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  geoLabelBox: {
    flex: 1,
  },
  geoLabelText: {
    fontSize: 14,
  },
  geoSubtitle: {
    fontSize: 11.5,
    marginTop: 1,
  },
  optBadge: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  focalBox: {
    marginTop: spacing.xs,
    gap: 4,
  },
  focalLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  focalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
  },
  focalInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textPrimary,
  },
  wardsContainer: {
    marginTop: spacing.xs,
    gap: 6,
  },
  wardsLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  wardChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  wardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  addWardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  addWardInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addWardInput: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    width: 100,
  },
  addWardConfirmBtn: {
    backgroundColor: colors.primaryInk,
    borderRadius: borderRadius.sm,
    padding: 6,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  audienceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  audienceChipSelected: {
    backgroundColor: colors.primaryContainer,
  },
  audienceChipUnselected: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  audienceChipTextSelected: {
    fontWeight: '700',
  },
  channelList: {
    gap: 8,
    marginTop: 2,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: 10,
  },
  channelItemSelected: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.primaryInk,
  },
  channelItemDisabled: {
    opacity: 0.6,
  },
  channelCheck: {
    marginTop: 2,
  },
  channelDetails: {
    flex: 1,
    gap: 2,
  },
  channelTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  channelTitle: {
    fontSize: 13.5,
    flex: 1,
    marginRight: 6,
  },
  channelBadge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  gateBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  channelDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  durationGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  durationCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: 4,
  },
  durationCardSelected: {
    backgroundColor: colors.primaryContainer,
  },
  durationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationLabel: {
    fontSize: 13,
  },
  reachSandboxCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
  },
  reachSandboxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reachSandboxTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reachSandboxLabel: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  liveModelBadge: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  reachMetricContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: 2,
    ...shadows.layer1,
  },
  reachBigNumber: {
    lineHeight: 38,
  },
  reachUnit: {
    fontSize: 14,
  },
  reachDisclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 2,
  },
  reachDisclaimerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
  },
  inlineError: {
    fontSize: 12,
    marginTop: 2,
  },
});
