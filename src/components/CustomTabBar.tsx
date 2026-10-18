import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, shadows } from '../theme/spacing';
import { AppText } from './AppText';

import { useCampaigns } from '../context/CampaignContext';

export interface CustomBottomTabBarProps {
  state: any;
  descriptors: any;
  navigation?: any;
  navigateToTab?: (routeKey: string) => void;
  emitter?: any;
  insets?: any;
}

export const CustomBottomTabBar: React.FC<CustomBottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
  navigateToTab,
  emitter,
}) => {
  const safeAreaInsets = useSafeAreaInsets();
  const bottomInset = Math.max(safeAreaInsets.bottom, Platform.OS === 'ios' ? 16 : 8);

  const { activities } = useCampaigns();
  const hasUnreadActivities = activities?.some((a) => a.isUnread) ?? false;

  const currentRoute = state.routes[state.index];
  const currentDescriptor = descriptors[currentRoute?.key];
  if (
    currentDescriptor?.options?.tabBarStyle?.display === 'none' ||
    currentRoute?.name === 'create'
  ) {
    return null;
  }

  return (
    <View
      style={[
        styles.barContainer,
        shadows.layer2,
        {
          paddingBottom: bottomInset,
          height: spacing.bottomBarHeight + bottomInset,
        },
      ]}
    >
      <View style={styles.tabRow}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            let defaultPrevented = false;
            if (emitter) {
              const event = emitter.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              defaultPrevented = Boolean(event?.defaultPrevented);
            } else if (navigation?.emit) {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              defaultPrevented = Boolean(event?.defaultPrevented);
            }

            if (!isFocused && !defaultPrevented) {
              if (navigateToTab) {
                navigateToTab(route.key);
              } else if (navigation?.navigate) {
                navigation.navigate(route.name);
              }
            }
          };

          const onLongPress = () => {
            if (emitter) {
              emitter.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            } else if (navigation?.emit) {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            }
          };

          // Center Create Button (prominent floating circle)
          if (route.name === 'create') {
            return (
              <View key={route.key} style={styles.centerButtonWrapper}>
                <Pressable
                  onPress={onPress}
                  onLongPress={onLongPress}
                  accessibilityRole="button"
                  accessibilityLabel="Create Campaign"
                  accessibilityState={{ selected: isFocused }}
                  style={({ pressed }) => [
                    styles.centerButton,
                    shadows.layer3,
                    pressed && styles.centerButtonPressed,
                  ]}
                >
                  <MaterialIcons name="campaign" size={28} color={colors.onPrimary} />
                </Pressable>
              </View>
            );
          }

          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          let label = 'Home';

          switch (route.name) {
            case 'index':
              iconName = isFocused ? 'home' : 'home-outline';
              label = 'Home';
              break;
            case 'explore':
              iconName = isFocused ? 'compass' : 'compass-outline';
              label = 'Explore';
              break;
            case 'activity':
              iconName = isFocused ? 'time' : 'time-outline';
              label = 'Activity';
              break;
            case 'profile':
              iconName = isFocused ? 'person' : 'person-outline';
              label = 'Profile';
              break;
          }

          const hasBadge = route.name === 'activity' && hasUnreadActivities;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={options.tabBarAccessibilityLabel || label}
              style={styles.tabItem}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isFocused ? colors.primaryInk : colors.textMuted}
                />
                {hasBadge && <View style={styles.activityBadge} />}
              </View>
              <AppText
                variant="labelMicro"
                color={isFocused ? colors.primaryInk : colors.textMuted}
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelFocused : undefined,
                ]}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: colors.containmentBorder,
    zIndex: 100,
  },
  tabRow: {
    flexDirection: 'row',
    height: spacing.bottomBarHeight,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xs,
  },
  tabItem: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
  },
  iconContainer: {
    position: 'relative',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 10,
    letterSpacing: 0.2,
  },
  tabLabelFocused: {
    fontWeight: '700',
  },
  activityBadge: {
    position: 'absolute',
    top: -1,
    right: -5,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.tertiaryContainer,
  },
  centerButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    marginTop: -16, // Elevates the create button above the tab bar
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
  },
  centerButtonPressed: {
    backgroundColor: colors.primary,
    transform: [{ scale: 0.94 }],
  },
});
