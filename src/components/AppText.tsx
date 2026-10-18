import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { typography, TypographyVariant } from '../theme/typography';
import { colors } from '../theme/colors';

export interface AppTextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
  children?: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'bodyMd',
  color = colors.onSurface,
  align,
  style,
  className,
  children,
  ...props
}) => {
  const variantStyle = typography[variant] || typography.bodyMd;

  return (
    <RNText
      className={className}
      style={[
        styles.base,
        variantStyle,
        { color },
        align ? { textAlign: align } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
