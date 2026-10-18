import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/spacing';

export interface ProfileStatTileProps {
  label: string;
  value: string | number;
  sublabel: string;
  isPrimary?: boolean;
}

export const ProfileStatTile: React.FC<ProfileStatTileProps> = ({
  label,
  value,
  sublabel,
  isPrimary = false,
}) => {
  return (
    <View style={styles.card}>
      <AppText variant="labelMicro" color={colors.textSecondary} style={styles.label}>
        {label}
      </AppText>
      <AppText
        variant="headlineMd"
        color={isPrimary ? colors.primaryInk : colors.textPrimary}
        style={styles.value}
      >
        {value}
      </AppText>
      <AppText
        variant="labelMicro"
        color={isPrimary ? colors.primaryContainer : colors.textSecondary}
        style={styles.sublabel}
      >
        {sublabel}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    padding: 12,
    justifyContent: 'space-between',
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    fontWeight: '700',
    marginTop: 3,
    marginBottom: 2,
  },
  sublabel: {
    fontWeight: '500',
  },
});
