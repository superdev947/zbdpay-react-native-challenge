import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View, useColorScheme } from 'react-native';

import type { PriceAlert } from '@/types/alerts';
import { formatUsd } from '@/utils/format';
import { IconButton } from './IconButton';

export function AlertRow({
  alert,
  isEditingRow,
  onEdit,
  onDelete,
}: {
  alert: PriceAlert;
  isEditingRow: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isAbove = alert.direction === 'above';

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const editIconColor = isEditingRow ? '#ffffff' : isDark ? '#e4e4e7' : '#52525b';

  const trashIconColor = isDark ? '#fb7185' : '#ef4444';

  return (
    <View
      className={`rounded-lg p-4 mb-2 border ${
        isEditingRow
          ? 'bg-indigo-50/60 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
      }`}>
      <View className="flex-row items-center justify-between">
        <View className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center mr-2">
          <Feather
            name={isAbove ? 'arrow-up-right' : 'arrow-down-right'}
            size={16}
            color={isAbove ? '#059669' : '#e11d48'}
          />
        </View>

        <View className="flex-row items-center" style={{ flex: 1, paddingRight: 12 }}>
          <View>
            <Text className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
              {alert.direction.toUpperCase()} • {formatUsd(alert.targetUsd)}
            </Text>
            <Text className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
              Created {new Date(alert.createdAtUtc).toLocaleString()}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <IconButton
            icon="edit-2"
            accessibilityLabel="Edit alert"
            onPress={onEdit}
            bgClassName={
              isEditingRow ? 'bg-indigo-600 border-indigo-600' : 'bg-transparent'
            }
            color={editIconColor}
          />

          <View style={{ width: 10 }} />

          <IconButton
            icon="trash-2"
            accessibilityLabel="Delete alert"
            onPress={onDelete}
            color={trashIconColor}
            bgClassName="bg-transparent"
          />
        </View>
      </View>
    </View>
  );
}
