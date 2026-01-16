import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { IconButton } from './IconButton';

export function CardHeader({
  title,
  subtitle,
  isEditing,
  onCancelEdit,
}: {
  title: string;
  subtitle: string;
  isEditing: boolean;
  onCancelEdit: () => void;
}) {
  return (
    <View className="flex-row items-start justify-between mb-3">
      <View className="flex-row items-center">
        <View className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900/15 border border-indigo-100 dark:border-indigo-800 items-center justify-center mr-2">
          <Feather name="bell" size={18} color="#4f46e5" />
        </View>
        <View className="items-center">
          <Text className="text-zinc-900 dark:text-white font-semibold text-base">
            {title}
          </Text>
          <Text className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            {subtitle}
          </Text>
        </View>
      </View>

      {isEditing ? (
        <View className="flex-row items-center">
          <View className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 mr-2">
            <Text className="text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              Editing
            </Text>
          </View>

          <IconButton
            icon="x"
            accessibilityLabel="Cancel editing"
            onPress={onCancelEdit}
            color="#52525b"
            bgClassName="bg-transparent"
          />
        </View>
      ) : null}
    </View>
  );
}
