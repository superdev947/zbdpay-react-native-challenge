import { RootDrawerParamList } from '@/navigation/RootNavigator';
import { useAlertsStore } from '@/store/alertsStore';
import { useTheme } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export function AlertBell() {
  const { theme } = useTheme();
  const nav = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const all = useAlertsStore((s) => s.triggeredAll ?? []);
  const unread = all.filter((a) => !a.read).length;

  return (
    <TouchableOpacity
      onPress={() => nav.navigate('Alerts')}
      hitSlop={10}
      accessibilityLabel="Open alerts">
      <View className="relative p-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
        <Ionicons
          name="notifications-outline"
          size={20}
          style={{ color: theme === 'dark' ? 'white' : 'black' }}
        />
        {unread > 0 ? (
          <View className="absolute -right-2 -top-2 min-w-5 h-5 rounded-full bg-rose-600 items-center justify-center px-1 border-2 border-white dark:border-zinc-900 shadow-sm">
            <Text className="text-white text-[10px] font-semibold">
              {unread > 99 ? '99+' : unread}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
