import type { PriceAlert } from '@/types/alerts';
import { describe, expect, it } from 'vitest';
import { evaluateAlerts } from '../alertEngine';

describe('evaluateAlerts', () => {
  it('triggers above target', () => {
    const alertId = 'a1';

    const active: PriceAlert[] = [
      {
        id: alertId,
        coinId: 'bitcoin',
        direction: 'above',
        targetUsd: 100,
        createdAtUtc: new Date('2025-01-01T00:00:00.000Z').toISOString(),
      },
    ];

    const prices: Record<string, number> = { bitcoin: 150 };

    const { triggered, remainingActive } = evaluateAlerts(active, prices);

    expect(triggered.length).toBe(1);
    expect(remainingActive.length).toBe(0);

    expect(triggered[0]?.coinId).toBe('bitcoin');
    expect(triggered[0]?.triggerPriceUsd).toBe(150);
    expect(triggered[0]?.alertId).toBe(alertId);
  });

  it('does not trigger when not hit', () => {
    const active: PriceAlert[] = [
      {
        id: 'a2',
        coinId: 'ethereum',
        direction: 'below',
        targetUsd: 50,
        createdAtUtc: new Date('2025-01-01T00:00:00.000Z').toISOString(),
      },
    ];

    const prices: Record<string, number> = { ethereum: 200 };

    const { triggered, remainingActive } = evaluateAlerts(active, prices);

    expect(triggered.length).toBe(0);
    expect(remainingActive.length).toBe(1);
    expect(remainingActive[0]?.id).toBe('a2');
  });
});
