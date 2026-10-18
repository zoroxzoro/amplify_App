import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { AppText } from './AppText';

export interface CategoryChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  count?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  className?: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  selected = false,
  onPress,
  icon,
  count,
  style,
  textStyle,
  className,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Filter by ${label}`}
      className={className}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : styles.chipUnselected,
        pressed && styles.chipPressed,
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <AppText
        variant="labelMd"
        style={[
          styles.text,
          selected ? styles.textSelected : styles.textUnselected,
          textStyle,
        ]}
      >
        {label}
      </AppText>
      {count !== undefined && (
        <View
          style={[
            styles.countBadge,
            selected ? styles.countBadgeSelected : styles.countBadgeUnselected,
          ]}
        >
          <AppText
            variant="labelMicro"
            color={selected ? colors.primaryInk : colors.onSurfaceVariant}
          >
            {count}
          </AppText>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md - 2,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  chipSelected: {
    backgroundColor: colors.primaryContainer,
  },
  chipUnselected: {
    backgroundColor: colors.secondaryContainerSoft,
  },
  chipPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    marginRight: spacing.xs + 2,
  },
  text: {
    fontWeight: '600',
  },
  textSelected: {
    color: colors.onPrimary,
  },
  textUnselected: {
    color: colors.onSurfaceVariant,
  },
  countBadge: {
    marginLeft: spacing.xs + 2,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
  },
  countBadgeSelected: {
    backgroundColor: colors.primaryFixed,
  },
  countBadgeUnselected: {
    backgroundColor: colors.surfaceContainerHigh,
  },
});
