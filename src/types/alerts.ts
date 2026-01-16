import { CoinId } from '@/constants/coins';

export type AlertDirection = 'above' | 'below';

export type PriceAlert = {
  id: string;
  coinId: CoinId;
  direction: AlertDirection;
  targetUsd: number;
  createdAtUtc: string;
};

export type TriggeredAlert = {
  id: string;
  alertId: string;
  coinId: CoinId;
  direction: AlertDirection;
  targetUsd: number;
  triggerPriceUsd: number;
  triggeredAtUtc: string;
  read: boolean;
};
