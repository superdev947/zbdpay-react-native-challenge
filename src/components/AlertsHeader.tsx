import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface AlertsHeaderProps {
  allLength: number;
  unreadLength: number;
  onMarkAllRead: () => void;
}

export function AlertsHeader({
  allLength,
  unreadLength,
  onMarkAllRead,
}: AlertsHeaderProps) {
  return (
    <View>
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/15 border border-indigo-100 dark:border-indigo-800 items-center justify-center mr-3">
          <Ionicons name="notifications" size={18} color="#4f46e5" />
        </View>

        <Text className="text-black dark:text-white text-xl font-semibold">Alerts</Text>
      </View>

      {allLength === 0 ? (
        <View className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-300 dark:border-zinc-800">
          <View className="flex-row items-center mb-2">
            <Ionicons name="notifications-off" size={18} color="#71717a" />
            <Text className="text-black dark:text-white font-semibold text-lg ml-2">
              No alerts yet
            </Text>
          </View>

          <Text className="text-zinc-600 dark:text-zinc-400">
            Set a price alert from any coin screen. When it triggers, it will show up here
            with a UTC timestamp.
          </Text>
        </View>
      ) : null}

      {unreadLength ? (
        <View className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-300 dark:border-zinc-800 mb-3 mt-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="mail-unread" size={16} color="#4f46e5" />
              <Text className="text-black dark:text-white font-semibold ml-2">
                {unreadLength} unread {unreadLength === 1 ? 'alert' : 'alerts'}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={onMarkAllRead}
            className="mt-3 bg-indigo-600 rounded-xl py-3 flex-row items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Mark all alerts as read">
            <Ionicons name="checkmark-done" size={18} color="#ffffff" />
            <Text className="text-white text-center font-semibold ml-2">
              Mark all as read
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
