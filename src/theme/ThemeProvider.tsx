import type { Theme as NavigationTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { View } from 'react-native';

import { darkTheme, lightTheme } from './color-theme';

type AppTheme = 'light' | 'dark';

interface ThemeProviderProps {
  children: React.ReactNode;
}

type ThemeContextType = {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  toggleTheme: () => void;
  navigationTheme: NavigationTheme & {
    fonts: Record<string, { fontFamily: string; fontWeight: string }>;
  };
};

const FONTS = {
  regular: { fontFamily: 'System', fontWeight: '400' as const },
  medium: { fontFamily: 'System', fontWeight: '500' as const },
  bold: { fontFamily: 'System', fontWeight: '700' as const },
  heavy: { fontFamily: 'System', fontWeight: '900' as const },
} as const;

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();

  const [theme, _setTheme] = useState<AppTheme>(
    colorScheme === 'dark' ? 'dark' : 'light',
  );

  const setTheme = useCallback(
    (next: AppTheme) => {
      _setTheme(next);
      setColorScheme(next);
    },
    [setColorScheme],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [setTheme, theme]);

  const themeConfig = useMemo(() => {
    return theme === 'dark' ? darkTheme : lightTheme;
  }, [theme]);

  const navigationTheme = useMemo<ThemeContextType['navigationTheme']>(() => {
    return {
      dark: themeConfig.dark,
      colors: themeConfig.colors,
      fonts: FONTS,
    };
  }, [themeConfig]);

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      navigationTheme,
    }),
    [theme, setTheme, toggleTheme, navigationTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <View className="flex-1 bg-white dark:bg-black">{children}</View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
