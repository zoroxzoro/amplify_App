import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  ViewStyle,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  withBottomTabPadding?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  header?: React.ReactNode;
  className?: string;
  hasHorizontalPadding?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
  withBottomTabPadding = true,
  refreshing = false,
  onRefresh,
  header,
  hasHorizontalPadding = true,
  className,
}) => {
  const insets = useSafeAreaInsets();

  const containerPaddingTop = insets.top;
  // If bottom tab exists, leave room for bottom tab bar (64px + bottom inset)
  const bottomPadding = withBottomTabPadding
    ? spacing.bottomBarHeight + insets.bottom + spacing.md
    : insets.bottom + spacing.md;

  const horizontalPadding = hasHorizontalPadding ? spacing.marginMobile : 0;

  const content = (
    <View
      style={[
        styles.innerContent,
        {
          paddingHorizontal: horizontalPadding,
          paddingBottom: bottomPadding,
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { paddingTop: containerPaddingTop }, style]}
      className={className}
    >
      <StatusBar barStyle="dark-content" />
      {header && <View style={styles.headerContainer}>{header}</View>}
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primaryInk}
                colors={[colors.primaryInk]}
              />
            ) : undefined
          }
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.flexOne}>{content}</View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  innerContent: {
    flexGrow: 1,
  },
  headerContainer: {
    zIndex: 10,
    backgroundColor: colors.canvas,
  },
  flexOne: {
    flex: 1,
  },
});
