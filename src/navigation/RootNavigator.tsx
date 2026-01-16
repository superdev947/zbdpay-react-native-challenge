import { AlertBell, TestIconButton, ThemeSwitcher } from '@/components';
import { TOP_COINS } from '@/constants/coins';
import { AlertsScreen, CryptoDetailScreen } from '@/screens';
import { useTheme } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useMemo } from 'react';
import { Image, Text, View } from 'react-native';
import 'react-native-gesture-handler';

export type RootDrawerParamList = {
  Alerts: undefined;
} & Record<string, { coinId: (typeof TOP_COINS)[number]['id'] }>;

export const navigationRef = createNavigationContainerRef<RootDrawerParamList>();

const Drawer = createDrawerNavigator<RootDrawerParamList>();

function CustomDrawerContent(props) {
  const { navigationTheme } = useTheme();
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 20,
          paddingHorizontal: 16,
          backgroundColor: navigationTheme.colors.card,
        }}>
        <Image
          source={require('../assets/icon.png')}
          style={{ width: 64, height: 64, borderRadius: 12, marginBottom: 8 }}
        />
        <Text
          style={{
            color: navigationTheme.colors.text,
            fontSize: 18,
            fontWeight: '800',
          }}>
          ZBD Alerts
        </Text>
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function RootNavigator() {
  const { navigationTheme } = useTheme();
  const coinScreens = useMemo(() => TOP_COINS, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.screen === 'Alerts' && navigationRef.isReady()) {
        navigationRef.navigate('Alerts');
      }
    });

    (async () => {
      const last = await Notifications.getLastNotificationResponseAsync();
      const data = last?.notification.request.content.data;

      if (data?.screen === 'Alerts') {
        const tryNavigate = () => {
          if (navigationRef.isReady()) {
            navigationRef.navigate('Alerts');
            return true;
          }
          return false;
        };

        if (!tryNavigate()) {
          timeoutId = setTimeout(() => {
            tryNavigate();
          }, 250);
        }
      }
    })();

    return () => {
      sub.remove();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <NavigationContainer theme={navigationTheme} ref={navigationRef}>
      <Drawer.Navigator
        id="root"
        drawerContent={CustomDrawerContent}
        screenOptions={{
          headerStyle: { backgroundColor: navigationTheme.colors.card },
          headerTintColor: navigationTheme.colors.text,
          headerTitleStyle: { fontWeight: '600', color: navigationTheme.colors.text },
          drawerStyle: { backgroundColor: navigationTheme.colors.card },
          drawerInactiveTintColor: navigationTheme.colors.text,
          drawerActiveTintColor: navigationTheme.colors.primary,
          drawerActiveBackgroundColor: navigationTheme.colors.border,
          drawerItemStyle: { borderRadius: 10, marginHorizontal: 10 },
          drawerLabelStyle: { fontSize: 15, fontWeight: '600' },
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                marginRight: 8,
              }}>
              <TestIconButton />
              <ThemeSwitcher />
              <AlertBell />
            </View>
          ),
        }}>
        {coinScreens.map((coin) => (
          <Drawer.Screen
            key={coin.id}
            name={coin.name}
            component={CryptoDetailScreen}
            initialParams={{ coinId: coin.id }}
            options={{
              title: coin.name,
              drawerIcon: ({ size }) => (
                <Image
                  source={{ uri: coin.icon }}
                  style={{ width: size, height: size, borderRadius: size / 2 }}
                />
              ),
            }}
          />
        ))}

        <Drawer.Screen
          name="Alerts"
          component={AlertsScreen}
          options={{
            title: 'Alerts',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="notifications-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
