import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

export interface WizardHeaderProps {
  currentStep: number;
  totalSteps?: number;
  stepName: string;
  stepSubtitle: string;
  onSaveDraft: () => void;
  onStepPress?: (step: number) => void;
}

const STEP_LABELS = [
  { step: 1, label: '01 Basics' },
  { step: 2, label: '02 Story' },
  { step: 3, label: '03 Visuals' },
  { step: 4, label: '04 Reach' },
  { step: 5, label: '05 Submit' },
];

export const WizardHeader: React.FC<WizardHeaderProps> = ({
  currentStep,
  totalSteps = 5,
  stepName,
  stepSubtitle,
  onSaveDraft,
  onStepPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Draft Saved Status Row */}
      <View style={styles.statusRow}>
        <View style={styles.statusPill}>
          <View style={styles.pulseDot} />
          <Ionicons name="cloud-done-outline" size={13} color={colors.primaryInk} />
          <AppText
            variant="labelMicro"
            color={colors.textSecondary}
            style={styles.statusText}
            numberOfLines={1}
          >
            Draft saved just now • Offline ready
          </AppText>
        </View>

        <TouchableOpacity
          onPress={onSaveDraft}
          style={styles.saveDraftBtn}
          activeOpacity={0.7}
          accessibilityLabel="Save campaign draft"
        >
          <AppText variant="labelMd" color={colors.primaryInk} style={styles.saveDraftText}>
            Save Draft
          </AppText>
        </TouchableOpacity>
      </View>

      {/* 5-Step Persistent Stepper Card */}
      <View style={[styles.stepperCard, shadows.layer1]}>
        <View style={styles.stepperTopRow}>
          <AppText variant="labelMicro" color={colors.primaryInk} style={styles.stepBadgeText}>
            STEP 0{currentStep} OF 0{totalSteps}
          </AppText>
          <AppText variant="labelMd" color={colors.primaryInk} style={styles.stepTitleText}>
            {stepName}
          </AppText>
        </View>

        {/* 5 Segmented Tracks */}
        <View style={styles.tracksRow}>
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <View
                key={stepNum}
                style={[
                  styles.trackSegment,
                  isCompleted && styles.trackCompleted,
                  isCurrent && styles.trackCurrent,
                ]}
              />
            );
          })}
        </View>

        {/* Step Micro Labels */}
        <View style={styles.labelsRow}>
          {STEP_LABELS.map((item) => {
            const isActive = item.step === currentStep;
            const isPassed = item.step < currentStep;

            return (
              <TouchableOpacity
                key={item.step}
                disabled={!isPassed && !isActive}
                onPress={() => onStepPress?.(item.step)}
                style={styles.labelBtn}
              >
                <AppText
                  variant="labelMicro"
                  color={isActive ? colors.primaryInk : isPassed ? colors.textPrimary : colors.textMuted}
                  style={[styles.stepMicroLabel, isActive && styles.stepMicroLabelActive]}
                  numberOfLines={1}
                >
                  {item.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Step Title & Explanation Block */}
      <View style={styles.titleBlock}>
        <AppText variant="headlineLg" color={colors.textPrimary} style={styles.sectionHeadline}>
          {stepName}
        </AppText>
        <AppText variant="bodySm" color={colors.textSecondary} style={styles.sectionSubtitle}>
          {stepSubtitle}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
    gap: 8,
  },
  statusPill: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginRight: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryInk,
    flexShrink: 0,
  },
  statusText: {
    fontSize: 11,
    flexShrink: 1,
  },
  saveDraftBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceContainerHigh,
    flexShrink: 0,
  },
  saveDraftText: {
    fontWeight: '700',
  },
  stepperCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
  },
  stepperTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  stepBadgeText: {
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  stepTitleText: {
    fontWeight: '700',
  },
  tracksRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  trackSegment: {
    flex: 1,
    height: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerHighest,
  },
  trackCompleted: {
    backgroundColor: colors.primaryFixedDim,
  },
  trackCurrent: {
    backgroundColor: colors.primaryInk,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelBtn: {
    flex: 1,
    alignItems: 'center',
  },
  stepMicroLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  stepMicroLabelActive: {
    fontWeight: '800',
    color: colors.primaryInk,
  },
  titleBlock: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  sectionHeadline: {
    lineHeight: 32,
  },
  sectionSubtitle: {
    marginTop: 4,
    lineHeight: 20,
  },
});
