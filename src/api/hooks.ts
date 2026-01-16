import {
  fetchMarketChart,
  fetchSimplePrices,
  MarketChartResponse,
  SimplePriceResponse,
} from '@/api/coingecko';
import type { CoinId } from '@/constants/coins';
import { useQuery } from '@tanstack/react-query';

export function useSimplePrices(coinIds: CoinId[]) {
  return useQuery<SimplePriceResponse, Error>({
    queryKey: ['simplePrices', coinIds],
    queryFn: () => fetchSimplePrices(coinIds),
    staleTime: 15_000, // 15s
    refetchInterval: 60_000, // 1m
    retry: 2,
  });
}

export function useMarketChart(coinId: CoinId, days: 1 | 7 | 30 | 365) {
  return useQuery<MarketChartResponse, Error>({
    queryKey: ['marketChart', coinId, days],
    queryFn: () => fetchMarketChart(coinId, days),
    staleTime: 60_000 * 5, // 5m
    refetchInterval: 1000 * 60 * 10, // 10m
    retry: 1,
  });
}
