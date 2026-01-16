import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';

export function IconButton({
  icon,
  onPress,
  disabled,
  color = '#52525b',
  bgClassName = 'bg-transparent',
  accessibilityLabel,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  bgClassName?: string;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={10}
      className={`w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 items-center justify-center ${bgClassName} ${
        disabled ? 'opacity-50' : ''
      }`}>
      <Feather name={icon} size={18} color={color} />
    </Pressable>
  );
}
