import { TOP_COINS } from '@/constants/coins';
import { useAlertsStore } from '@/store/alertsStore';
import { useTheme } from '@/theme/ThemeProvider';
import type { TriggeredAlert } from '@/types/alerts';
import { firePriceAlertNotification } from '@/utils/notifications';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';

export default function TestIconButton() {
  const { navigationTheme } = useTheme();
  const addTriggered = useAlertsStore((s) => s.addTriggered);

  const handlePress = async () => {
    const coin = TOP_COINS[Math.floor(Math.random() * TOP_COINS.length)];

    const BASE_PRICE: Record<string, number> = {
      btc: 45000,
      eth: 3000,
      bnb: 350,
      sol: 150,
      ada: 0.5,
      doge: 0.08,
      xrp: 0.6,
      usdt: 1,
      'usd-coin': 1,
      trx: 0.07,
    };

    const symbol = coin.symbol;
    const base = BASE_PRICE[symbol] ?? 100;

    const direction = Math.random() > 0.5 ? ('above' as const) : ('below' as const);

    const randFactor = 0.2 + Math.random() * 0.8;
    const targetUsd = Math.round(base * (1 + randFactor) * 100) / 100;

    const triggerDelta = Math.random() * 0.02 * (Math.random() > 0.5 ? 1 : -1);
    const triggerPriceUsd = Math.round(targetUsd * (1 + triggerDelta) * 100) / 100;

    const now = Date.now();

    const sample: TriggeredAlert = {
      id: `${now}-test-${Math.random().toString(36).slice(2, 8)}`,
      alertId: `test-alert-${coin.id}-${now}`,
      coinId: coin.id,
      direction,
      targetUsd,
      triggerPriceUsd,
      triggeredAtUtc: new Date().toISOString(),
      read: false,
    };

    addTriggered([sample]);

    const label = `${coin.name} (${coin.symbol.toUpperCase()})`;

    await firePriceAlertNotification({
      title: 'Price Alert Triggered',
      body: `${label} is ${sample.direction} $${sample.targetUsd} (now $${sample.triggerPriceUsd})`,
      data: {
        screen: 'Alerts',
        coinId: sample.coinId,
      },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
      <Ionicons name="bug-outline" size={20} color={navigationTheme.colors.text} />
    </Pressable>
  );
}
