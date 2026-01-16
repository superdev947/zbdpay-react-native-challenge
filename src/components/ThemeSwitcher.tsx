import { useTheme } from '@/theme/ThemeProvider';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
      className="px-2 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
      <Text className="text-base">{isDark ? '☀️' : '🌙'}</Text>
    </TouchableOpacity>
  );
};
