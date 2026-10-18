import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

export interface ProfileMenuRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: 'action' | 'neutral' | 'success';
  onPress: () => void;
  showDivider?: boolean;
}

export const ProfileMenuRow: React.FC<ProfileMenuRowProps> = ({
  icon,
  title,
  subtitle,
  badge,
  badgeVariant = 'neutral',
  onPress,
  showDivider = true,
}) => {
  let badgeBg: string = colors.surfaceContainer;
  let badgeTextColor: string = colors.textSecondary;

  if (badgeVariant === 'action') {
    badgeBg = colors.tertiaryFixed;
    badgeTextColor = colors.onTertiaryFixed;
  } else if (badgeVariant === 'success') {
    badgeBg = colors.secondaryContainer;
    badgeTextColor = colors.onSecondaryFixed;
  }

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={styles.container}
      >
        <View style={styles.iconBox}>
          <MaterialIcons name={icon} size={20} color={colors.primaryInk} />
        </View>

        <View style={styles.contentCol}>
          <View style={styles.titleRow}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={styles.title}>
              {title}
            </AppText>
            {badge && (
              <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                <AppText
                  variant="labelMicro"
                  color={badgeTextColor}
                  style={styles.badgeText}
                >
                  {badge}
                </AppText>
              </View>
            )}
          </View>
          {subtitle && (
            <AppText
              variant="bodySm"
              color={colors.textSecondary}
              style={styles.subtitle}
              numberOfLines={1}
            >
              {subtitle}
            </AppText>
          )}
        </View>

        <Ionicons name="chevron-forward" size={18} color={colors.outlineVariant} />
      </TouchableOpacity>

      {showDivider && <View style={styles.divider} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    gap: spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCol: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 15,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceContainerLow,
    marginLeft: 68,
    marginRight: spacing.md,
  },
});
