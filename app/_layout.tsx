import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CampaignProvider } from '../src/context/CampaignContext';
import { useAppFonts } from '../src/hooks/useAppFonts';
import { colors } from '../src/theme/colors';

// Import NativeWind CSS
import '../src/global.css';

// Keep the splash screen visible while fonts are loading
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { isReady } = useAppFonts();

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <CampaignProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.canvas },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="campaign/[id]"
            options={{
              headerShown: false,
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="contribution/[id]"
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="creator/dashboard"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="creator/performance"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="create-campaign/index"
            options={{
              headerShown: false,
              presentation: 'card',
            }}
          />
        </Stack>
      </CampaignProvider>
    </SafeAreaProvider>
  );
}
