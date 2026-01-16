import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface AlertsFooterProps {
  allLength: number;
  onClearAll: () => void;
}

export function AlertsFooter({ allLength, onClearAll }: AlertsFooterProps) {
  if (!allLength) return null;

  return (
    <View className="mt-4">
      <Pressable
        onPress={onClearAll}
        className="bg-rose-600 rounded-xl py-3 flex-row items-center justify-center"
        accessibilityRole="button"
        accessibilityLabel="Clear alert history">
        <Ionicons name="trash-outline" size={18} color="#ffffff" />
        <Text className="text-white text-center font-semibold ml-2">Clear history</Text>
      </Pressable>

      <View className="flex-row items-center mt-2">
        <Ionicons name="lock-closed-outline" size={14} color="#71717a" />
        <Text className="text-zinc-500 ml-2 text-sm">
          Alerts are stored locally. Unread alerts clear when you open this screen.
        </Text>
      </View>
    </View>
  );
}
