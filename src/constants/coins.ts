export const TOP_COINS = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    icon: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400',
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
  },
  {
    id: 'tether',
    symbol: 'usdt',
    name: 'Tether',
    icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png?1696501661',
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    icon: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970',
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1718769756',
  },
  {
    id: 'usd-coin',
    symbol: 'usdc',
    name: 'USD Coin',
    icon: 'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    icon: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1696501442',
  },
  {
    id: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    icon: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1696501409',
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    icon: 'https://assets.coingecko.com/coins/images/975/large/cardano.png?1696502090',
  },
  {
    id: 'tron',
    symbol: 'trx',
    name: 'TRON',
    icon: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png?1696502193',
  },
] as const;

export type CoinId = (typeof TOP_COINS)[number]['id'];
