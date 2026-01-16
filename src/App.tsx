import RootNavigator from '@/navigation/RootNavigator';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { registerForRemotePushTokenAsync } from '@/utils/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './global.css';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function prepare() {
      try {
        await Asset.loadAsync([require('./assets/icon.png')]);
        const token = await registerForRemotePushTokenAsync();
        if (__DEV__) console.log('Expo push token:', token);
      } catch (e) {
        console.warn(e);
      } finally {
        if (mounted) setAppIsReady(true);
      }
    }

    prepare();
    return () => {
      mounted = false;
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await SplashScreen.hideAsync();
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <RootNavigator />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
