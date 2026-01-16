import type { CoinId } from '@/constants/coins';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAlertsStore } from '../alertsStore';

vi.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: async (_key: string) => null,
    setItem: async (_key: string, _value: string) => null,
    removeItem: async (_key: string) => null,
  },
}));

describe('alertsStore (basic)', () => {
  beforeEach(() => {
    const s = useAlertsStore.getState();

    s.clearAllTriggered();

    const active = s.activeAlerts;
    for (const coinId of Object.keys(active) as CoinId[]) {
      for (const alert of active[coinId] ?? []) {
        s.removeAlert(coinId, alert.id);
      }
    }
  });

  it('upserts and removes an alert', () => {
    useAlertsStore.getState().upsertAlert({
      id: 'alert-1',
      coinId: 'bitcoin',
      direction: 'above',
      targetUsd: 1000,
      createdAtUtc: new Date().toISOString(),
    });

    const afterSet = useAlertsStore.getState();
    expect(afterSet.activeAlerts.bitcoin?.length ?? 0).toBe(1);
    expect(afterSet.activeAlerts.bitcoin?.[0]?.id).toBe('alert-1');

    useAlertsStore.getState().removeAlert('bitcoin', 'alert-1');

    const afterRemove = useAlertsStore.getState();
    expect(afterRemove.activeAlerts.bitcoin?.length ?? 0).toBe(0);
  });

  it('upsert updates an existing alert with the same id', () => {
    const createdAtUtc = new Date().toISOString();

    useAlertsStore.getState().upsertAlert({
      id: 'alert-1',
      coinId: 'bitcoin',
      direction: 'above',
      targetUsd: 1000,
      createdAtUtc,
    });

    useAlertsStore.getState().upsertAlert({
      id: 'alert-1',
      coinId: 'bitcoin',
      direction: 'above',
      targetUsd: 2000,
      createdAtUtc,
    });

    const s = useAlertsStore.getState();
    expect(s.activeAlerts.bitcoin?.length ?? 0).toBe(1);
    expect(s.activeAlerts.bitcoin?.[0]?.targetUsd).toBe(2000);
  });

  it('adds triggered alerts and clears them', () => {
    useAlertsStore.getState().addTriggered([
      {
        id: 'triggered-1',
        alertId: 'alert-1',
        coinId: 'bitcoin',
        direction: 'above',
        targetUsd: 1000,
        triggerPriceUsd: 1200,
        triggeredAtUtc: new Date().toISOString(),
        read: false,
      },
    ]);

    const afterAdd = useAlertsStore.getState();
    expect(afterAdd.triggeredAll.length).toBeGreaterThanOrEqual(1);
    expect(afterAdd.triggeredAll.some((a) => a.read === false)).toBe(true);

    useAlertsStore.getState().markAllTriggeredRead();

    const afterRead = useAlertsStore.getState();
    expect(afterRead.triggeredAll.every((a) => a.read === true)).toBe(true);

    useAlertsStore.getState().clearAllTriggered();

    const afterClear = useAlertsStore.getState();
    expect(afterClear.triggeredAll.length).toBe(0);
  });

  it('clearTriggeredUnread keeps only read alerts', () => {
    useAlertsStore.getState().addTriggered([
      {
        id: 't1',
        alertId: 'a1',
        coinId: 'bitcoin',
        direction: 'above',
        targetUsd: 100,
        triggerPriceUsd: 110,
        triggeredAtUtc: new Date().toISOString(),
        read: false,
      },
      {
        id: 't2',
        alertId: 'a2',
        coinId: 'ethereum',
        direction: 'below',
        targetUsd: 50,
        triggerPriceUsd: 49,
        triggeredAtUtc: new Date().toISOString(),
        read: false,
      },
    ]);

    useAlertsStore.getState().markTriggeredRead('t2');
    useAlertsStore.getState().clearTriggeredUnread();

    const s = useAlertsStore.getState();
    expect(s.triggeredAll.length).toBe(1);
    expect(s.triggeredAll[0]?.id).toBe('t2');
    expect(s.triggeredAll[0]?.read).toBe(true);
  });
});
