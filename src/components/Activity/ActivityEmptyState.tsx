import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

export interface ActivityEmptyStateProps {
  category: string;
  onExplore: () => void;
  onCreate?: () => void;
}

export const ActivityEmptyState: React.FC<ActivityEmptyStateProps> = ({
  category,
  onExplore,
  onCreate,
}) => {
  const getMessage = () => {
    switch (category) {
      case 'broadcasts':
        return 'No live ad syndications or delivery telemetry logs currently running.';
      case 'escrow':
        return 'No contribution vouchers or escrow settlement receipts recorded yet.';
      case 'editorial':
        return 'No campaign submissions or editorial peer-review updates in queue.';
      case 'milestones':
        return 'No funding thresholds or verification milestones unlocked yet.';
      default:
        return 'Live broadcast telemetry, escrow settlement logs, and editorial audit trails will stream here as you back and launch campaigns.';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <MaterialIcons name="history-toggle-off" size={32} color={colors.primaryInk} />
      </View>
      <AppText variant="headlineSm" color={colors.textPrimary} style={styles.title}>
        No Activity Recorded
      </AppText>
      <AppText variant="bodyMd" color={colors.textSecondary} style={styles.subtitle}>
        {getMessage()}
      </AppText>

      <View style={styles.btnRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onExplore}
          style={styles.primaryBtn}
        >
          <MaterialIcons name="explore" size={18} color={colors.onPrimary} />
          <AppText variant="labelMd" color={colors.onPrimary} style={styles.btnText}>
            Explore Campaigns
          </AppText>
        </TouchableOpacity>

        {onCreate && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onCreate}
            style={styles.secondaryBtn}
          >
            <MaterialIcons name="add-circle-outline" size={18} color={colors.primaryInk} />
            <AppText variant="labelMd" color={colors.primaryInk} style={styles.btnText}>
              Launch Campaign
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    marginTop: spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  btnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  btnText: {
    fontWeight: '600',
  },
});
