import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing, shadows } from '../theme/spacing';
import { AppText } from './AppText';
import { PrimaryButton } from './PrimaryButton';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Campaign Telemetry',
  message = 'There was a temporary disruption verifying network receipts. Please retry to synchronize.',
  onRetry,
  style,
}) => {
  return (
    <View style={[styles.container, shadows.layer1, style]}>
      <View style={styles.iconCircle}>
        <AppText variant="headlineSm" color={colors.restricted}>
          !
        </AppText>
      </View>
      <AppText variant="headlineMd" color={colors.textPrimary} style={styles.title}>
        {title}
      </AppText>
      <AppText variant="bodyMd" color={colors.textSecondary} style={styles.message}>
        {message}
      </AppText>
      {onRetry && (
        <PrimaryButton
          title="Retry Synchronization"
          onPress={onRetry}
          style={styles.retryBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.xl,
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.restrictedBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    maxWidth: 290,
  },
  retryBtn: {
    minWidth: 180,
  },
});
