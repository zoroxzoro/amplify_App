import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { AppText } from './AppText';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  maxChars?: number;
  currentCharCount?: number;
  badge?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  maxChars,
  currentCharCount,
  badge,
  iconLeft,
  iconRight,
  containerStyle,
  style,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const charCount = currentCharCount ?? (value ? value.toString().length : 0);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {/* Label and counter row */}
      {(label || maxChars || badge) && (
        <View style={styles.labelRow}>
          <View style={styles.labelWithRequired}>
            {label && (
              <AppText variant="headlineSm" color={colors.textPrimary}>
                {label} {required && <AppText variant="headlineSm" color={colors.restricted}>*</AppText>}
              </AppText>
            )}
          </View>

          <View style={styles.badgeCounterRow}>
            {badge}
            {maxChars !== undefined && (
              <View style={styles.counterPill}>
                <AppText variant="labelMicro" color={colors.textSecondary}>
                  {charCount}/{maxChars} chars
                </AppText>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Input container */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          Boolean(error) && styles.inputError,
        ]}
      >
        {iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
      </View>

      {/* Helper text or error message */}
      {error ? (
        <AppText variant="bodySm" color={colors.restricted} style={styles.messageText}>
          {error}
        </AppText>
      ) : helperText ? (
        <AppText variant="bodySm" color={colors.textSecondary} style={styles.messageText}>
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  labelWithRequired: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  counterPill: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  inputContainer: {
    minHeight: spacing.inputHeight,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.input,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFocused: {
    borderColor: colors.primaryInk,
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: colors.restricted,
  },
  input: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: colors.onSurface,
    paddingVertical: spacing.sm,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  messageText: {
    marginTop: spacing.xs,
  },
});
