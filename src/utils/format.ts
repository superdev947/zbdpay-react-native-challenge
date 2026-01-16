export function formatUsd(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export function utcStamp(iso: string) {
  const d = new Date(iso);
  return `${d.toISOString().replace('T', ' ').replace('Z', ' UTC')}`;
}

export function parseMoney(input: string): number {
  if (!input) return NaN;
  const cleaned = String(input).trim().replace(/,/g, '');
  const normalized = cleaned.replace(/[^(\d|\.|\-|e|E)]/g, '');
  const num = Number(normalized);
  return Number.isFinite(num) ? num : NaN;
}
