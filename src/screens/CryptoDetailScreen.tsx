import type { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { useMarketChart, useSimplePrices } from '@/api/hooks';
import {
  PriceAlertCard,
  PriceChart,
  PriceSummaryCard,
  Screen,
  SkeletonCard,
  TimeframeSelector,
} from '@/components';
import { TOP_COINS, type CoinId } from '@/constants/coins';
import type { RootDrawerParamList } from '@/navigation/RootNavigator';
import { useAlertsStore } from '@/store/alertsStore';
import type { PriceAlert } from '@/types/alerts';
import { evaluateAlerts } from '@/utils/alertEngine';
import { firePriceAlertNotification } from '@/utils/notifications';

type Props = DrawerScreenProps<RootDrawerParamList, any>;

export function CryptoDetailScreen({ route, navigation }: Props) {
  const coinId = (route.params?.coinId ?? 'bitcoin') as CoinId;

  const coinMeta = useMemo(
    () => TOP_COINS.find((c) => c.id === coinId) ?? TOP_COINS[0],
    [coinId],
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View className="flex-row items-center">
          {coinMeta.icon ? (
            <Image
              source={{ uri: coinMeta.icon }}
              style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }}
            />
          ) : null}
          <Text className="text-base font-semibold text-black dark:text-white">
            {coinMeta.name} ({coinMeta.symbol.toUpperCase()})
          </Text>
        </View>
      ),
    });
  }, [coinMeta, navigation]);

  const [days, setDays] = useState<1 | 7 | 30 | 365>(7);

  const priceQuery = useSimplePrices(TOP_COINS.map((c) => c.id));
  const currentPrice = priceQuery.data?.[coinId]?.usd;

  const lastPriceUpdateIso = useMemo(() => {
    if (!priceQuery.data) return null;
    return new Date().toISOString();
  }, [priceQuery.data]);

  const chartQuery = useMarketChart(coinId, days);

  const removeAlert = useAlertsStore((s) => s.removeAlert);
  const addTriggered = useAlertsStore((s) => s.addTriggered);

  const lastProcessedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const prices = priceQuery.data;
    if (!prices) return;

    const latest: Record<string, number> = {};
    for (const id of Object.keys(prices)) {
      const usd = prices[id]?.usd;
      if (typeof usd === 'number') latest[id] = usd;
    }

    const key = JSON.stringify(latest);
    if (lastProcessedKeyRef.current === key) return;
    lastProcessedKeyRef.current = key;

    const store = useAlertsStore.getState();
    const active: PriceAlert[] = Object.values(store.activeAlerts).flat();

    if (!active.length) return;

    const { triggered } = evaluateAlerts(active, latest);
    if (!triggered.length) return;

    addTriggered(triggered);

    for (const t of triggered) {
      removeAlert(t.coinId as CoinId, t.alertId);
    }

    (async () => {
      for (const t of triggered) {
        const meta = TOP_COINS.find((c) => c.id === t.coinId);
        const label = meta ? `${meta.name} (${meta.symbol.toUpperCase()})` : t.coinId;

        await firePriceAlertNotification({
          title: 'Price Alert Triggered',
          body: `${label} is ${t.direction} $${t.targetUsd} (now $${t.triggerPriceUsd})`,
          data: { screen: 'Alerts', coinId: t.coinId },
        });
      }
    })();
  }, [priceQuery.data, addTriggered, removeAlert]);

  return (
    <Screen>
      <PriceSummaryCard
        currentPrice={currentPrice}
        lastPriceUpdateIso={lastPriceUpdateIso}
        isLoading={priceQuery.isLoading}
        isError={priceQuery.isError}
        onRetry={() => priceQuery.refetch()}
      />

      <TimeframeSelector days={days} onChange={setDays} />

      <View className="mb-4">
        {chartQuery.isLoading ? (
          <SkeletonCard height={200} />
        ) : chartQuery.isError ? (
          <View className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-2xl p-4">
            <Text className="text-black dark:text-white font-semibold">
              {days === 1 ? '24H Price' : days === 7 ? '7D Price' : `${days}D Price`}
            </Text>
            <Text className="text-red-400 mt-2">Failed to load chart.</Text>
            <Pressable
              onPress={() => chartQuery.refetch()}
              className="mt-3 bg-indigo-600 rounded-xl py-2 px-4">
              <Text className="text-white text-center font-semibold">Retry</Text>
            </Pressable>
          </View>
        ) : (
          <PriceChart
            title={days === 1 ? '24H Price' : days === 7 ? '7D Price' : `${days}D Price`}
            subtitle={`Source: CoinGecko • ${coinMeta.symbol.toUpperCase()}/USD`}
            prices={chartQuery.data?.prices ?? []}
            color="#22c55e"
          />
        )}
      </View>

      <PriceAlertCard coinId={coinId} coinMeta={coinMeta} />
    </Screen>
  );
}
