import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { AppText } from './AppText';

export type StatusVariant =
  | 'active'
  | 'amplified'
  | 'pending'
  | 'restricted'
  | 'verified'
  | 'default';

export interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  icon?: React.ReactNode;
  style?: ViewStyle;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'default',
  icon,
  style,
  className,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'active':
      case 'amplified':
        return {
          bg: colors.amplifiedBg,
          text: colors.amplified,
          border: colors.amplified,
        };
      case 'pending':
        return {
          bg: colors.pendingBg,
          text: colors.pending,
          border: colors.pending,
        };
      case 'restricted':
        return {
          bg: colors.restrictedBg,
          text: colors.restricted,
          border: colors.restricted,
        };
      case 'verified':
        return {
          bg: colors.primaryFixed,
          text: colors.onPrimaryFixedVariant,
          border: 'transparent',
        };
      case 'default':
      default:
        return {
          bg: colors.secondaryContainerSoft,
          text: colors.primaryInk,
          border: 'transparent',
        };
    }
  };

  const current = getVariantStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: current.bg,
          borderColor: current.border,
          borderWidth: current.border !== 'transparent' ? 1 : 0,
        },
        style,
      ]}
      className={className}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <AppText
        variant="labelMicro"
        color={current.text}
        style={styles.label}
      >
        {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  iconContainer: {
    marginRight: spacing.xs,
  },
  label: {
    letterSpacing: 0.84, // 0.08em all-caps
  },
});
