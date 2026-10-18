import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  badgeDot?: boolean;
  style?: ViewStyle;
  variant?: 'ghost' | 'filled' | 'outlined';
  size?: number;
  className?: string;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  accessibilityLabel,
  badgeDot = false,
  style,
  variant = 'ghost',
  size = spacing.minTouchTarget,
  className,
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={className}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        variant === 'filled' && styles.filled,
        variant === 'outlined' && styles.outlined,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon}
      {badgeDot && <View style={styles.badgeDot} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filled: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    backgroundColor: colors.surfaceContainerLowest,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.4,
  },
  badgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.tertiaryContainer,
  },
});
