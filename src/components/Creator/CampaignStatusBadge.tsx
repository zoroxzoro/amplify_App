import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/spacing';
import { CampaignStatus } from '../../types/campaign';
import { getCampaignStatusMeta } from '../../utils/formatters';

export interface CampaignStatusBadgeProps {
  status: CampaignStatus;
  style?: ViewStyle;
}

export const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({
  status,
  style,
}) => {
  const meta = getCampaignStatusMeta(status);

  const isLive = status === 'active' || status === 'amplified';
  const isAction = status === 'rejected';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor:
            meta.variant === 'active'
              ? colors.primaryFixed
              : meta.variant === 'restricted'
              ? colors.restrictedBg
              : meta.variant === 'pending'
              ? colors.pendingBg
              : colors.surfaceContainer,
        },
        style,
      ]}
    >
      {isLive && <View style={[styles.dot, { backgroundColor: colors.primaryInk }]} />}
      {isAction && <View style={[styles.dot, { backgroundColor: colors.restricted }]} />}

      <AppText
        variant="labelMicro"
        color={
          meta.variant === 'active'
            ? colors.onPrimaryFixedVariant
            : meta.variant === 'restricted'
            ? colors.restricted
            : meta.variant === 'pending'
            ? colors.pending
            : colors.textSecondary
        }
        style={styles.label}
      >
        {meta.badgeText}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    flexShrink: 0,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  label: {
    letterSpacing: 0.6,
    fontWeight: '800',
    fontSize: 10,
  },
});
