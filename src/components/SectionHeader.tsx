import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AppText } from './AppText';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  style?: ViewStyle;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onAction,
  badge,
  icon,
  style,
  className,
}) => {
  return (
    <View style={[styles.container, style]} className={className}>
      <View style={styles.topRow}>
        <View style={styles.titleWithIcon}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <AppText variant="headlineSm" color={colors.textPrimary}>
            {title}
          </AppText>
        </View>

        {badge && <View>{badge}</View>}

        {actionText && onAction && (
          <TouchableOpacity
            onPress={onAction}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppText variant="labelMd" color={colors.primaryInk} style={styles.actionText}>
              {actionText}
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      {subtitle && (
        <AppText variant="bodySm" color={colors.textSecondary} style={styles.subtitle}>
          {subtitle}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: spacing.xs + 2,
  },
  actionText: {
    fontWeight: '600',
  },
  subtitle: {
    marginTop: spacing.xs,
  },
});
