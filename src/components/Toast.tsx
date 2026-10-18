import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing, shadows } from '../theme/spacing';
import { AppText } from './AppText';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps {
  message: string;
  title?: string;
  type?: ToastType;
  visible?: boolean;
  onDismiss?: () => void;
  durationMs?: number;
  style?: ViewStyle;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  title,
  type = 'info',
  visible = true,
  onDismiss,
  durationMs = 4000,
  style,
}) => {
  useEffect(() => {
    if (visible && onDismiss && durationMs > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, durationMs);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss, durationMs]);

  if (!visible) return null;

  const getTypeStyle = () => {
    switch (type) {
      case 'success':
        return {
          bg: colors.amplifiedBg,
          border: colors.amplified,
          iconBg: colors.amplified,
          textColor: colors.amplified,
        };
      case 'warning':
        return {
          bg: colors.pendingBg,
          border: colors.pending,
          iconBg: colors.pending,
          textColor: colors.pending,
        };
      case 'error':
        return {
          bg: colors.restrictedBg,
          border: colors.restricted,
          iconBg: colors.restricted,
          textColor: colors.restricted,
        };
      case 'info':
      default:
        return {
          bg: colors.surfaceContainerLow,
          border: colors.containmentBorder,
          iconBg: colors.primaryInk,
          textColor: colors.primaryInk,
        };
    }
  };

  const current = getTypeStyle();

  return (
    <View
      style={[
        styles.container,
        shadows.layer1,
        {
          backgroundColor: current.bg,
          borderColor: current.border,
        },
        style,
      ]}
    >
      <View style={styles.textContainer}>
        {title && (
          <AppText variant="headlineSm" color={current.textColor} style={styles.title}>
            {title}
          </AppText>
        )}
        <AppText variant="bodySm" color={colors.textPrimary}>
          {message}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 2,
    fontSize: 15,
  },
});
