import React from 'react';
import { FlatList, View } from 'react-native';

import { AlertsFooter, AlertsHeader, TriggeredAlertItem } from '@/components';
import { useAlertsStore } from '@/store/alertsStore';

export function AlertsScreen() {
  const all = useAlertsStore((s) => s.triggeredAll ?? []);
  const unread = all.filter((a) => !a.read);

  const markAllRead = useAlertsStore((s) => s.markAllTriggeredRead);
  const markRead = useAlertsStore((s) => s.markTriggeredRead);
  const clearAll = useAlertsStore((s) => s.clearAllTriggered);

  return (
    <FlatList
      data={all}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, idx) => `${item.coinId}-${item.triggeredAtUtc}-${idx}`}
      ItemSeparatorComponent={() => <View className="h-3" />}
      contentContainerStyle={{ padding: 16 }}
      ListHeaderComponent={
        <AlertsHeader
          allLength={all.length}
          unreadLength={unread.length}
          onMarkAllRead={markAllRead}
        />
      }
      renderItem={({ item }) => (
        <TriggeredAlertItem
          item={item}
          isUnread={!item.read}
          onMarkRead={() => markRead(item.id)}
        />
      )}
      ListFooterComponent={<AlertsFooter allLength={all.length} onClearAll={clearAll} />}
    />
  );
}
