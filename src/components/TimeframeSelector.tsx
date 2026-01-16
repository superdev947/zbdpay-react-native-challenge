import React from 'react';
import { Pressable, Text, View } from 'react-native';

type TimeframeDays = 1 | 7 | 30 | 365;

interface TimeframeOption {
  days: TimeframeDays;
  label: string;
  accessibilityLabel: string;
}

interface TimeframeSelectorProps {
  days: TimeframeDays;
  onChange: (days: TimeframeDays) => void;
}

const TIMEFRAME_OPTIONS: TimeframeOption[] = [
  { days: 1, label: '24H', accessibilityLabel: 'Show 24 hour chart' },
  { days: 7, label: '7D', accessibilityLabel: 'Show 7 day chart' },
  { days: 30, label: '30D', accessibilityLabel: 'Show 30 day chart' },
  { days: 365, label: '1Y', accessibilityLabel: 'Show 1 year chart' },
];

export function TimeframeSelector({ days, onChange }: TimeframeSelectorProps) {
  return (
    <View className="flex-row items-center justify-center p-2 bg-transparent rounded-2xl mb-4">
      {TIMEFRAME_OPTIONS.map((option, index) => {
        const isActive = days === option.days;
        const isLast = index === TIMEFRAME_OPTIONS.length - 1;

        return (
          <Pressable
            key={option.days}
            onPress={() => onChange(option.days)}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              isActive
                ? 'bg-indigo-50 dark:bg-indigo-900/20 shadow-sm border border-indigo-100 dark:border-indigo-700'
                : 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
            } ${!isLast ? 'mr-2' : ''}`}
            accessibilityRole="button"
            accessibilityLabel={option.accessibilityLabel}
            accessibilityState={{ selected: isActive }}>
            <Text
              className={`text-sm font-semibold transition-colors duration-200 ${
                isActive
                  ? 'text-indigo-700 dark:text-indigo-200'
                  : 'text-zinc-600 dark:text-zinc-300'
              }`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
