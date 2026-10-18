import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { borderRadius, spacing, shadows } from '../../theme/spacing';

export interface DashboardMetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'surface' | 'accent' | 'highlight';
  onPress?: () => void;
  style?: ViewStyle;
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  label,
  value,
  subtitle,
  icon,
  variant = 'surface',
  onPress,
  style,
}) => {
  const isPrimary = variant === 'primary';
  const isHighlight = variant === 'highlight';

  const ContainerComponent = onPress ? TouchableOpacity : View;

  return (
    <ContainerComponent
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.card,
        isPrimary && styles.cardPrimary,
        isHighlight && styles.cardHighlight,
        shadows.layer1,
        style,
      ]}
    >
      <View style={styles.topRow}>
        <AppText
          variant="labelMicro"
          color={isPrimary ? colors.primaryFixed : colors.textSecondary}
          style={styles.label}
        >
          {label}
        </AppText>
        {icon && <View style={styles.iconBox}>{icon}</View>}
      </View>

      <AppText
        variant="headlineLg"
        color={isPrimary ? colors.onPrimary : colors.textPrimary}
        style={styles.value}
      >
        {value}
      </AppText>

      {subtitle ? (
        <AppText
          variant="bodySm"
          color={isPrimary ? colors.primaryFixedDim : colors.textSecondary}
          style={styles.subtitle}
          numberOfLines={1}
        >
          {subtitle}
        </AppText>
      ) : null}
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    minWidth: 100,
  },
  cardPrimary: {
    backgroundColor: colors.primaryInk,
    borderColor: colors.primaryInk,
  },
  cardHighlight: {
    backgroundColor: colors.primaryFixed,
    borderColor: colors.primaryFixedDim,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  iconBox: {
    flexShrink: 0,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
});
