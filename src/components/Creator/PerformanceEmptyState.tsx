import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { borderRadius, spacing, shadows } from '../../theme/spacing';

export interface PerformanceEmptyStateProps {
  type?: 'no_measured_data' | 'no_campaigns';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const PerformanceEmptyState: React.FC<PerformanceEmptyStateProps> = ({
  type = 'no_measured_data',
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  const isNoMeasuredData = type === 'no_measured_data';

  const defaultTitle = isNoMeasuredData
    ? 'No Measured Performance Data Yet'
    : 'No Campaigns Submitted Yet';

  const defaultDescription = isNoMeasuredData
    ? 'Actual audience impressions, verified device footprints, and citizen click-throughs are captured via cryptographic ad server receipts once the campaign achieves 100% escrow funding and completes editorial verification.'
    : 'Start a verified civic broadcast flight to syndicate critical investigations, environmental telemetry, and policy briefings directly to citizens and decision-makers.';

  const defaultActionLabel = isNoMeasuredData
    ? 'View Pre-Flight Projections'
    : 'Start Your First Flight';

  return (
    <View style={[styles.container, shadows.layer1, style]}>
      <View style={styles.iconCircle}>
        {isNoMeasuredData ? (
          <MaterialIcons name="hourglass-empty" size={28} color={colors.primaryInk} />
        ) : (
          <MaterialIcons name="campaign" size={28} color={colors.primaryInk} />
        )}
      </View>

      <AppText variant="headlineSm" color={colors.textPrimary} style={styles.title}>
        {title || defaultTitle}
      </AppText>

      <AppText variant="bodySm" color={colors.textSecondary} style={styles.description}>
        {description || defaultDescription}
      </AppText>

      {onAction ? (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onAction}
          activeOpacity={0.85}
        >
          <Ionicons
            name={isNoMeasuredData ? 'stats-chart-outline' : 'add-circle-outline'}
            size={18}
            color={colors.onPrimary}
          />
          <AppText variant="headlineSm" color={colors.onPrimary} style={styles.btnText}>
            {actionLabel || defaultActionLabel}
          </AppText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
  },
  description: {
    textAlign: 'center',
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.textSecondary,
    maxWidth: 320,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primaryInk,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
