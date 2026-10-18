import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { AppText } from './AppText';

export interface FundingProgressBarProps {
  current: number;
  target: number;
  currencySymbol?: string;
  showLabels?: boolean;
  reachLabel?: string;
  style?: ViewStyle;
  height?: number;
  className?: string;
}

export const FundingProgressBar: React.FC<FundingProgressBarProps> = ({
  current,
  target,
  currencySymbol = '₹',
  showLabels = true,
  reachLabel,
  style,
  height = 8,
  className,
}) => {
  const percentage = Math.min(100, Math.round((current / (target || 1)) * 100));
  const isCompleted = percentage >= 100;
  const fillColor = isCompleted ? colors.amplified : colors.primaryContainer;

  return (
    <View style={[styles.container, style]} className={className}>
      {showLabels && (
        <View style={styles.labelRow}>
          <View style={styles.amountContainer}>
            <AppText variant="headlineSm" color={colors.primaryInk} style={styles.boldAmount}>
              {currencySymbol}{current.toLocaleString('en-IN')}
            </AppText>
            <AppText variant="labelMicro" color={colors.textSecondary} style={styles.ofTarget}>
              funded of {currencySymbol}{target.toLocaleString('en-IN')}
            </AppText>
          </View>
          <AppText variant="labelMd" color={fillColor} style={styles.percentageText}>
            {percentage}%
          </AppText>
        </View>
      )}

      {/* Track rail */}
      <View style={[styles.rail, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>

      {reachLabel && (
        <View style={styles.metaRow}>
          <AppText variant="labelMicro" color={colors.textSecondary}>
            {reachLabel}
          </AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  boldAmount: {
    fontWeight: '700',
  },
  ofTarget: {
    textTransform: 'none',
  },
  percentageText: {
    fontWeight: '700',
  },
  rail: {
    width: '100%',
    backgroundColor: colors.secondaryContainerSoft,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
});
