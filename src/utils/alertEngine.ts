import type { PriceAlert, TriggeredAlert } from '@/types/alerts';

export function evaluateAlerts(
  activeAlerts: PriceAlert[],
  latestPricesUsd: Record<string, number>,
): { triggered: TriggeredAlert[]; remainingActive: PriceAlert[] } {
  const triggered: TriggeredAlert[] = [];
  const remainingActive: PriceAlert[] = [];

  for (const alert of activeAlerts) {
    const price = latestPricesUsd[alert.coinId];

    if (typeof price !== 'number') {
      remainingActive.push(alert);
      continue;
    }

    const isHit =
      alert.direction === 'above' ? price >= alert.targetUsd : price <= alert.targetUsd;

    if (isHit) {
      triggered.push({
        id: `${alert.coinId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        alertId: alert.id,
        coinId: alert.coinId,
        direction: alert.direction,
        targetUsd: alert.targetUsd,
        triggerPriceUsd: price,
        triggeredAtUtc: new Date().toISOString(),
        read: false,
      });
    } else {
      remainingActive.push(alert);
    }
  }

  return { triggered, remainingActive };
}
