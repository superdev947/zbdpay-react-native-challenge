import React from 'react';
import { View } from 'react-native';

export function SkeletonLine({ w = 'w-40' }: { w?: string }) {
  return <View className={`bg-zinc-200 dark:bg-zinc-800 rounded-full h-3 ${w}`} />;
}

export function SkeletonBlock({ height = 160 }: { height?: number }) {
  return (
    <View className="bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full" style={{ height }} />
  );
}

export function SkeletonCard({ height = 160 }: { height?: number }) {
  return (
    <View className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
      <SkeletonLine />
      <View className="h-3" />
      <SkeletonBlock height={height} />
    </View>
  );
}
