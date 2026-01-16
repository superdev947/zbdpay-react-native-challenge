import React from 'react';
import { View, type ViewProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export function Screen({ children, ...props }: ViewProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      className="flex-1 bg-white dark:bg-black">
      <View className="px-4 py-6 max-w-3xl mx-auto w-full" {...props}>
        {children}
      </View>
    </ScrollView>
  );
}
