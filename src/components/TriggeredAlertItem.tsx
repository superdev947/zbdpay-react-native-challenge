import type { RootDrawerParamList } from '@/navigation/RootNavigator';
import { Ionicons } from '@expo/vector-icons';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable, Text, View, useColorScheme } from 'react-native';

import { TOP_COINS } from '@/constants/coins';
import type { TriggeredAlert } from '@/types/alerts';
import { formatUsd, utcStamp } from '@/utils/format';

interface TriggeredAlertItemProps {
  item: TriggeredAlert;
  isUnread?: boolean;
  onMarkRead?: () => void;
}

const TriggeredAlertItemComponent = ({
  item,
  isUnread = false,
  onMarkRead,
}: TriggeredAlertItemProps) => {
  const nav = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const iconMuted = isDark ? '#a1a1aa' : '#71717a';
  const iconStrong = isDark ? '#e4e4e7' : '#0f172a';
  const chevronColor = isDark ? '#71717a' : '#a1a1aa';

  const coin = TOP_COINS.find((c) => c.id === item.coinId);
  const name = coin?.name ?? item.coinId;

  const pillClass =
    item.direction === 'above'
      ? 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800'
      : 'bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800';

  const containerClass = isUnread
    ? 'bg-indigo-50 dark:bg-zinc-900 rounded-xl p-4 border border-indigo-100 dark:border-indigo-700'
    : 'bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800';

  const dirColor = item.direction === 'above' ? '#059669' : '#dc2626';
  const dirIcon = item.direction === 'above' ? 'arrow-up' : 'arrow-down';

  const openCoin = () => {
    if (coin) {
      nav.navigate(coin.name as any, { coinId: coin.id });
      return;
    }
    nav.navigate('Alerts');
  };

  return (
    <Pressable
      onPress={openCoin}
      accessibilityRole="button"
      accessibilityLabel={`Open ${name} details`}>
      <View
        className={containerClass}
        accessibilityRole="summary"
        accessibilityLabel={`${isUnread ? 'Unread ' : ''}${name} ${
          item.direction
        } alert triggered at ${utcStamp(item.triggeredAtUtc)}`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {isUnread ? (
              <View className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
            ) : null}

            {coin?.icon ? (
              <Image
                source={{ uri: coin.icon }}
                style={{ width: 24, height: 24, borderRadius: 12 }}
              />
            ) : (
              <View className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center">
                <Ionicons name="logo-bitcoin" size={14} color={iconMuted} />
              </View>
            )}

            <Text className="ml-2 text-black dark:text-white font-semibold">{name}</Text>
          </View>

          <View className="flex-row items-center">
            {isUnread && onMarkRead ? (
              <Pressable
                onPress={onMarkRead}
                className="mr-2 p-2 rounded-lg bg-white/70 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700"
                accessibilityRole="button"
                accessibilityLabel={`Mark ${name} alert as read`}>
                <Ionicons name="checkmark-done" size={18} color={iconStrong} />
              </Pressable>
            ) : null}

            <View className={`px-2 py-1 rounded-full ${pillClass}`}>
              <View className="flex-row items-center">
                <Ionicons name={dirIcon as any} size={12} color={dirColor} />
                <Text className="text-zinc-800 dark:text-zinc-200 text-xs font-semibold ml-1">
                  {item.direction.toUpperCase()}
                </Text>
              </View>
            </View>

            <View className="ml-2">
              <Ionicons name="chevron-forward" size={16} color={chevronColor} />
            </View>
          </View>
        </View>

        <Text className="text-zinc-700 dark:text-zinc-300 mt-2 text-sm">
          Target{' '}
          <Text className="text-black dark:text-white font-semibold">
            {formatUsd(item.targetUsd)}
          </Text>{' '}
          hit at{' '}
          <Text className="text-black dark:text-white font-semibold">
            {formatUsd(item.triggerPriceUsd)}
          </Text>
        </Text>

        <View className="flex-row items-center mt-2">
          <Ionicons name="time-outline" size={14} color={iconMuted} />
          <Text className="text-zinc-500 dark:text-zinc-400 ml-2 text-xs">
            {utcStamp(item.triggeredAtUtc)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export const TriggeredAlertItem = React.memo(
  TriggeredAlertItemComponent,
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.item.read === next.item.read &&
    prev.isUnread === next.isUnread &&
    prev.item.triggeredAtUtc === next.item.triggeredAtUtc &&
    prev.item.triggerPriceUsd === next.item.triggerPriceUsd &&
    prev.item.targetUsd === next.item.targetUsd &&
    prev.item.direction === next.item.direction &&
    prev.item.coinId === next.item.coinId,
);

export default TriggeredAlertItem;
