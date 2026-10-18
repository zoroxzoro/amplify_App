import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { ActivityItemData } from '../../types/activity';

export interface ActivityCardProps {
  activity: ActivityItemData;
  onPress: () => void;
  onActionPress?: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onPress,
  onActionPress,
}) => {
  // Select icon and color scheme based on category/type
  let iconName: keyof typeof MaterialIcons.glyphMap = 'notifications';
  let iconBg: string = colors.secondaryContainer;
  let iconColor: string = colors.primaryInk;

  switch (activity.category) {
    case 'broadcasts':
      iconName = activity.type === 'audit_report' ? 'analytics' : 'sensors';
      iconBg = colors.surfaceContainer;
      iconColor = colors.primaryInk;
      break;
    case 'milestones':
      iconName = 'flag';
      iconBg = colors.primaryFixed;
      iconColor = colors.onPrimaryFixed;
      break;
    case 'escrow':
      iconName = 'shield';
      iconBg = colors.surfaceContainerHigh;
      iconColor = colors.primaryContainer;
      break;
    case 'editorial':
      iconName = activity.type === 'campaign_submitted' ? 'cloud-done' : 'rule';
      iconBg = activity.type === 'campaign_submitted' ? colors.surfaceContainer : colors.tertiaryFixed;
      iconColor = activity.type === 'campaign_submitted' ? colors.secondary : colors.tertiaryContainer;
      break;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        shadows.layer1,
        activity.isUnread && styles.unreadCard,
      ]}
    >
      <View style={styles.topRow}>
        {/* Icon box */}
        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
          <MaterialIcons name={iconName} size={20} color={iconColor} />
        </View>

        {/* Content body */}
        <View style={styles.contentCol}>
          {/* Header sub-row with timestamp and unread dot */}
          <View style={styles.metaRow}>
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.timeLabel}>
              {activity.timeLabel}
            </AppText>
            {activity.isUnread && <View style={styles.unreadDot} />}
          </View>

          {/* Title */}
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.titleText}>
            {activity.title}
          </AppText>

          {/* Description */}
          <AppText variant="bodyMd" color={colors.textSecondary} style={styles.bodyText}>
            {activity.body}
          </AppText>

          {/* Inline Telemetry Progress Chip (if available) */}
          {activity.metricsChip && (
            <View style={styles.metricsChip}>
              <View style={styles.metricsChipHeader}>
                <AppText variant="labelMicro" color={colors.primaryInk} style={styles.metricsChipTitle}>
                  {activity.metricsChip.label}
                </AppText>
                <AppText variant="labelMicro" color={colors.textSecondary}>
                  {activity.metricsChip.sublabel}
                </AppText>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min(100, activity.metricsChip.progressPercent)}%` },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Badge indicator tag (if any) */}
          {activity.badgeText && !activity.metricsChip && (
            <View style={styles.badgeTag}>
              <MaterialIcons name="verified-user" size={13} color={colors.primaryInk} />
              <AppText variant="labelMicro" color={colors.textSecondary} style={styles.badgeText}>
                {activity.badgeText}
              </AppText>
            </View>
          )}

          {/* Action Row */}
          {(activity.actionLabel || activity.metricsChip?.footnote) && (
            <View style={styles.actionRow}>
              {activity.actionLabel && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onActionPress || onPress}
                  style={styles.actionBtn}
                >
                  <AppText variant="labelMd" color={colors.primaryInk} style={styles.actionBtnText}>
                    {activity.actionLabel}
                  </AppText>
                  <Ionicons name="arrow-forward" size={14} color={colors.primaryInk} />
                </TouchableOpacity>
              )}
              {activity.metricsChip?.footnote && (
                <AppText variant="labelMicro" color={colors.textMuted}>
                  {activity.metricsChip.footnote}
                </AppText>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  unreadCard: {
    borderColor: colors.outlineVariant,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  contentCol: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryContainer,
  },
  titleText: {
    lineHeight: 22,
    marginBottom: 4,
  },
  bodyText: {
    lineHeight: 20,
    color: colors.textSecondary,
  },
  metricsChip: {
    marginTop: spacing.sm,
    padding: spacing.xs + 4,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceContainerLow,
    gap: 6,
  },
  metricsChipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricsChipTitle: {
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondaryContainer,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryContainer,
  },
  badgeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  badgeText: {
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtnText: {
    fontWeight: '700',
  },
});
