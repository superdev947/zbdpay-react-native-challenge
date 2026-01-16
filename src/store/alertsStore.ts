import type { CoinId } from '@/constants/coins';
import type { PriceAlert, TriggeredAlert } from '@/types/alerts';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AlertsState = {
  activeAlerts: Record<CoinId, PriceAlert[]>;
  triggeredAll: TriggeredAlert[];

  upsertAlert: (alert: PriceAlert) => void;
  removeAlert: (coinId: CoinId, alertId: string) => void;

  addTriggered: (alerts: TriggeredAlert[]) => void;

  markAllTriggeredRead: () => void;
  markTriggeredRead: (id: string) => void;

  clearAllTriggered: () => void;
  clearTriggeredUnread: () => void;
};

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set, get) => ({
      activeAlerts: {} as Record<CoinId, PriceAlert[]>,
      triggeredAll: [],

      upsertAlert: (alert) =>
        set((s) => {
          const prev = s.activeAlerts[alert.coinId] ?? [];

          const filtered = prev.filter(
            (a) => a.id !== alert.id && a.direction !== alert.direction,
          );

          const nextForCoin = [alert, ...filtered];

          return {
            activeAlerts: { ...s.activeAlerts, [alert.coinId]: nextForCoin },
          };
        }),

      removeAlert: (coinId, alertId) =>
        set((s) => {
          const prev = s.activeAlerts[coinId] ?? [];
          const next = prev.filter((a) => a.id !== alertId);
          return { activeAlerts: { ...s.activeAlerts, [coinId]: next } };
        }),

      addTriggered: (alerts) =>
        set((s) => ({
          triggeredAll: [
            ...alerts.map((a, index) => ({
              ...a,
              read: false,
              id: a.id ?? `${Date.now()}-${index}`,
            })),
            ...s.triggeredAll,
          ],
        })),

      markAllTriggeredRead: () =>
        set((s) => ({
          triggeredAll: s.triggeredAll.map((a) => ({ ...a, read: true })),
        })),

      markTriggeredRead: (id) =>
        set((s) => ({
          triggeredAll: s.triggeredAll.map((a) =>
            a.id === id ? { ...a, read: true } : a,
          ),
        })),

      clearTriggeredUnread: () =>
        set((s) => ({
          triggeredAll: s.triggeredAll.filter((a) => a.read),
        })),

      clearAllTriggered: () => set({ triggeredAll: [] }),
    }),
    {
      name: 'alerts-store-v4',
      storage: createJSONStorage(() => AsyncStorage),
      version: 4,
      migrate: (persistedState: any, version: number) => {
        if (!persistedState) return persistedState;

        if (version < 4) {
          const oldActive = persistedState.activeAlerts ?? {};
          const nextActive: Record<string, PriceAlert[]> = {};

          for (const coinId of Object.keys(oldActive)) {
            const raw = oldActive[coinId];

            const arr: any[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

            const byDir: Partial<Record<'above' | 'below', PriceAlert>> = {};

            for (const item of arr) {
              if (!item) continue;

              const normalized: PriceAlert = {
                ...item,
                id: item.id ?? `migrated-${coinId}-${Date.now()}`,
              };

              const dir = normalized.direction;
              if (dir !== 'above' && dir !== 'below') continue;

              const prev = byDir[dir];
              if (!prev) {
                byDir[dir] = normalized;
              } else {
                const prevT = Date.parse(prev.createdAtUtc ?? '') || 0;
                const nextT = Date.parse(normalized.createdAtUtc ?? '') || 0;
                if (nextT >= prevT) byDir[dir] = normalized;
              }
            }

            nextActive[coinId] = Object.values(byDir) as PriceAlert[];
          }

          persistedState.activeAlerts = nextActive;
        }

        return persistedState;
      },
    },
  ),
);
