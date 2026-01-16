import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text } from 'react-native';

export function PrimaryButton({
  label,
  disabled,
  onPress,
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`will-change-variable w-full rounded-md py-3 mt-4 flex-row items-center justify-center ${
        disabled
          ? 'bg-zinc-100 dark:bg-zinc-800/30 opacity-60 border border-zinc-200 dark:border-zinc-700'
          : 'bg-indigo-600 shadow-sm'
      }`}
      accessibilityRole="button">
      <Feather
        name={disabled ? 'lock' : 'check'}
        size={16}
        color={disabled ? '#52525b' : '#fff'}
      />
      <Text
        className={`ml-2 text-center font-semibold ${
          disabled ? 'text-zinc-600 dark:text-zinc-300' : 'text-white'
        }`}>
        {label}
      </Text>
    </Pressable>
  );
}
