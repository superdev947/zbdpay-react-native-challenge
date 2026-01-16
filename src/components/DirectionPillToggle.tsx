import { Feather } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { Pressable, Text, View, useColorScheme } from 'react-native';

import type { AlertDirection } from '@/types/alerts';

type Props = {
  value: AlertDirection;
  onChange: (d: AlertDirection) => void;
};

export function DirectionPillToggle({ value, onChange }: Props) {
  const isDark = useColorScheme() === 'dark';

  const { aboveActive, belowActive } = useMemo(
    () => ({
      aboveActive: value === 'above',
      belowActive: value === 'below',
    }),
    [value],
  );

  const inactiveIconColor = useMemo(() => (isDark ? '#e4e4e7' : '#52525b'), [isDark]);

  const onAbove = useCallback(() => onChange('above'), [onChange]);
  const onBelow = useCallback(() => onChange('below'), [onChange]);

  const rootClass =
    'flex-row mb-4 bg-transparent p-1 rounded-full border border-zinc-100 dark:border-zinc-800 shadow-sm';

  const baseBtnClass =
    'will-change-variable flex-1 px-3 py-2 flex-row items-center justify-center';

  const aboveBtnClass = useMemo(
    () =>
      `${baseBtnClass} mr-2 ${
        aboveActive
          ? 'bg-emerald-100 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-full shadow-sm'
          : 'bg-transparent rounded-md'
      }`,
    [aboveActive],
  );

  const belowBtnClass = useMemo(
    () =>
      `${baseBtnClass} ${
        belowActive
          ? 'bg-rose-100 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-800 rounded-full shadow-sm'
          : 'bg-transparent rounded-md'
      }`,
    [belowActive],
  );

  const aboveTextClass = useMemo(
    () =>
      `ml-2 font-medium text-center ${
        aboveActive
          ? 'text-emerald-700 dark:text-emerald-300'
          : 'text-zinc-700 dark:text-zinc-300'
      }`,
    [aboveActive],
  );

  const belowTextClass = useMemo(
    () =>
      `ml-2 font-medium text-center ${
        belowActive
          ? 'text-rose-700 dark:text-rose-300'
          : 'text-zinc-700 dark:text-zinc-300'
      }`,
    [belowActive],
  );

  return (
    <View className={rootClass}>
      <Pressable
        onPress={onAbove}
        className={aboveBtnClass}
        accessibilityRole="button"
        accessibilityState={{ selected: aboveActive }}>
        <Feather
          name="trending-up"
          size={16}
          color={aboveActive ? '#047857' : inactiveIconColor}
        />
        <Text className={aboveTextClass}>Above</Text>
      </Pressable>

      <Pressable
        onPress={onBelow}
        className={belowBtnClass}
        accessibilityRole="button"
        accessibilityState={{ selected: belowActive }}>
        <Feather
          name="trending-down"
          size={16}
          color={belowActive ? '#be123c' : inactiveIconColor}
        />
        <Text className={belowTextClass}>Below</Text>
      </Pressable>
    </View>
  );
}
