import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { formatUsd } from '@/utils/format';

interface PriceSummaryCardProps {
  currentPrice?: number;
  lastPriceUpdateIso?: string | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function PriceSummaryCard({
  currentPrice,
  lastPriceUpdateIso,
  isLoading,
  isError,
  onRetry,
}: PriceSummaryCardProps) {
  return (
    <View className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-2xl p-4 mb-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-zinc-600 dark:text-zinc-400">Current price</Text>
        {lastPriceUpdateIso ? (
          <Text className="text-zinc-500 text-xs">Updated just now</Text>
        ) : (
          <Text className="text-zinc-500 text-xs">—</Text>
        )}
      </View>

      {isLoading ? (
        <View className="mt-3 items-start">
          <Text className="text-zinc-900 dark:text-white text-3xl font-semibold">—</Text>
          <Text className="text-zinc-500 mt-2">Loading price…</Text>
        </View>
      ) : isError ? (
        <View className="mt-3">
          <Text className="text-red-400">Failed to load price.</Text>
          <Pressable
            onPress={onRetry}
            className="mt-3 bg-indigo-600 rounded-xl py-2 px-4">
            <Text className="text-white text-center font-semibold">Retry</Text>
          </Pressable>
        </View>
      ) : (
        <View className="mt-2">
          <Text className="text-black dark:text-white text-3xl font-semibold">
            {typeof currentPrice === 'number' ? formatUsd(currentPrice) : '—'}
          </Text>
          <Text className="text-zinc-500 mt-2">
            Polling every ~15s. Time shown in UTC.
          </Text>
        </View>
      )}
    </View>
  );
}
