import type { CoinId } from '@/constants/coins';

const BASE = 'https://api.coingecko.com/api/v3';

export type SimplePriceResponse = Record<string, { usd: number }>;

async function fetchJson<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url);
    const text = await res.text();
    if (!res.ok) {
      let body = text;
      try {
        body = JSON.parse(text);
      } catch {
        /* ignore */
      }
      throw new Error(
        `Fetch failed ${res.status} ${res.statusText} - ${url} - ${JSON.stringify(body)}`,
      );
    }
    return JSON.parse(text) as T;
  } catch (err) {
    throw new Error(`Network error fetching ${url}: ${String(err)}`);
  }
}

export async function fetchSimplePrices(coinIds: CoinId[]) {
  const ids = coinIds.join(',');
  const url = `${BASE}/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`;
  return fetchJson<SimplePriceResponse>(url);
}

export type MarketChartResponse = {
  prices: [number, number][];
};

export async function fetchMarketChart(coinId: CoinId, days: 1 | 7 | 30 | 365) {
  const url = `${BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
  return fetchJson<MarketChartResponse>(url);
}
