import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { CampaignDraft } from '../../types/campaign';

export interface Step2StoryProps {
  draft: CampaignDraft;
  errors: Record<string, string>;
  onUpdate: (fields: Partial<CampaignDraft>) => void;
}

export const Step2Story: React.FC<Step2StoryProps> = ({
  draft,
  errors,
  onUpdate,
}) => {
  const wordCount = draft.storyProse.trim()
    ? draft.storyProse.trim().split(/\s+/).length
    : 0;

  return (
    <View style={styles.container}>
      {/* Formatting & Stylistic Toolbar */}
      <View style={[styles.toolbarCard, shadows.layer1]}>
        <View style={styles.toolbarButtons}>
          <TouchableOpacity style={styles.toolBtn}>
            <AppText variant="labelMd" color={colors.textPrimary} style={styles.toolText}>H1</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toolBtn, styles.toolBtnActive]}>
            <AppText variant="labelMd" color={colors.primaryInk} style={styles.toolText}>H2</AppText>
          </TouchableOpacity>
          <View style={styles.toolDivider} />
          <TouchableOpacity style={styles.toolBtn}>
            <MaterialIcons name="format-bold" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn}>
            <MaterialIcons name="format-italic" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn}>
            <MaterialIcons name="format-list-bulleted" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn}>
            <MaterialIcons name="format-quote" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.toolbarSyncPill}>
          <View style={styles.syncDot} />
          <AppText variant="labelMicro" color={colors.primaryInk} style={styles.syncText}>
            CALIBRATED
          </AppText>
        </View>
      </View>

      {/* Field 1: Story Headline */}
      <View style={[styles.card, shadows.layer1, errors.storyHeadline ? styles.cardError : null]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            Story Headline <AppText variant="headlineSm" color={colors.restricted}>*</AppText>
          </AppText>
          <View style={styles.counterBadge}>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              {draft.storyHeadline.length}/120 chars
            </AppText>
          </View>
        </View>

        <TextInput
          style={[styles.textInput, styles.headlineInput]}
          multiline
          numberOfLines={2}
          maxLength={120}
          placeholder="Unseen Hazards: Why School HVAC Systems Demand Continuous Particulate Logging"
          placeholderTextColor={colors.textMuted}
          value={draft.storyHeadline}
          onChangeText={(text) => onUpdate({ storyHeadline: text })}
        />

        {errors.storyHeadline ? (
          <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
            {errors.storyHeadline}
          </AppText>
        ) : (
          <AppText variant="bodySm" color={colors.textSecondary} style={styles.hintText}>
            The broadsheet banner headline visible across civic feeds and reader dossiers.
          </AppText>
        )}
      </View>

      {/* Field 2: Editorial Deck / Subtitle */}
      <View style={[styles.card, shadows.layer1]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            Editorial Deck / Subtitle
          </AppText>
          <View style={styles.counterBadge}>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              {draft.storyDeck.length}/200 chars
            </AppText>
          </View>
        </View>

        <TextInput
          style={[styles.textInput, styles.deckInput]}
          multiline
          numberOfLines={2}
          maxLength={200}
          placeholder="Pediatric sensor telemetry from pilot classrooms demonstrates dangerous carbon and particulate accumulation before dismissal."
          placeholderTextColor={colors.textMuted}
          value={draft.storyDeck}
          onChangeText={(text) => onUpdate({ storyDeck: text })}
        />

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.hintText}>
          Synthesizes the primary empirical thesis for syndication distribution partners.
        </AppText>
      </View>

      {/* Field 3: Modular Narrative Prose Body */}
      <View style={[styles.card, shadows.layer1, errors.storyProse ? styles.cardError : null]}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleBlock}>
            <View style={styles.sectionBadge}>
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.sectionBadgeText}>
                SECTION 01
              </AppText>
            </View>
            <AppText variant="headlineSm" color={colors.textPrimary}>
              Background & Empirical Problem <AppText variant="headlineSm" color={colors.restricted}>*</AppText>
            </AppText>
          </View>

          <View style={styles.wordCountPill}>
            <MaterialIcons name="check-circle" size={13} color={colors.primaryInk} />
            <AppText variant="labelMicro" color={colors.primaryInk}>
              {wordCount} words
            </AppText>
          </View>
        </View>

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.fieldSubtext}>
          Detail the core situation, investigation methodology, and verified findings. (Minimum 80 characters required)
        </AppText>

        <TextInput
          style={[styles.textInput, styles.proseInput]}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          placeholder="Describe what occurred, citing specific dates, locations, sensor arrays, or observed municipal deficiencies..."
          placeholderTextColor={colors.textMuted}
          value={draft.storyProse}
          onChangeText={(text) => onUpdate({ storyProse: text })}
        />

        {errors.storyProse && (
          <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
            {errors.storyProse}
          </AppText>
        )}
      </View>

      {/* Field 4: Intended Impact */}
      <View style={[styles.card, shadows.layer1]}>
        <View style={styles.sectionTitleBlock}>
          <View style={styles.sectionBadge}>
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.sectionBadgeText}>
              SECTION 02
            </AppText>
          </View>
          <AppText variant="headlineSm" color={colors.textPrimary}>
            Intended Real-World Impact
          </AppText>
        </View>

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.fieldSubtext}>
          What should happen when this story reaches municipal decision-makers and parents?
        </AppText>

        <TextInput
          style={[styles.textInput, styles.impactInput]}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          placeholder="e.g. Compel the district education board to mandate calibrated sensors across all 120 district buildings."
          placeholderTextColor={colors.textMuted}
          value={draft.storyImpact}
          onChangeText={(text) => onUpdate({ storyImpact: text })}
        />
      </View>

      {/* Field 5: Verified Citations & Public Record Sources */}
      <View style={[styles.card, shadows.layer1]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            Empirical Citations & Source Repository
          </AppText>
          <View style={styles.verifiedPill}>
            <MaterialIcons name="bookmark-added" size={13} color={colors.primaryInk} />
            <AppText variant="labelMicro" color={colors.primaryInk}>
              SOURCES
            </AppText>
          </View>
        </View>

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.fieldSubtext}>
          Add academic journals, government disclosure archives, or sensor certification numbers.
        </AppText>

        <TextInput
          style={[styles.textInput, styles.citationsInput]}
          multiline
          numberOfLines={2}
          textAlignVertical="top"
          placeholder="e.g. ISO 21501-4 calibrated test logs, WHO Global Air Quality Guidelines (2021), Municipal Environmental Audit #2024-C"
          placeholderTextColor={colors.textMuted}
          value={draft.citations}
          onChangeText={(text) => onUpdate({ citations: text })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  toolbarCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.containmentBorder,
  },
  toolbarButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  toolBtn: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolBtnActive: {
    backgroundColor: colors.secondaryContainer,
  },
  toolText: {
    fontWeight: '800',
    fontSize: 13,
  },
  toolDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.surfaceContainerHigh,
    marginHorizontal: 3,
  },
  toolbarSyncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 6,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryInk,
  },
  syncText: {
    fontSize: 9.5,
    fontWeight: '800',
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitleBlock: {
    flex: 1,
    flexShrink: 1,
    marginRight: 6,
    gap: 4,
  },
  sectionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
  },
  sectionBadgeText: {
    fontWeight: '800',
    fontSize: 9.5,
  },
  counterBadge: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  wordCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  fieldSubtext: {
    fontSize: 12,
    marginBottom: 4,
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
  headlineInput: {
    fontFamily: 'Newsreader',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
    minHeight: 56,
  },
  deckInput: {
    fontSize: 14,
    lineHeight: 20,
    minHeight: 52,
  },
  proseInput: {
    minHeight: 130,
    lineHeight: 22,
  },
  impactInput: {
    minHeight: 70,
    lineHeight: 20,
  },
  citationsInput: {
    minHeight: 56,
    lineHeight: 18,
    fontSize: 13,
  },
  hintText: {
    fontSize: 12,
    marginTop: 2,
  },
  inlineError: {
    fontSize: 12,
    marginTop: 2,
  },
});
