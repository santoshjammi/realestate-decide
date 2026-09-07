// Formatting helpers for USD and percentages.

export function formatUSD(value: number, decimals = 0): string {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  return `${sign}$${abs.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatMonths(value: number): string {
  if (!isFinite(value)) return '∞';
  if (value < 1) return `${Math.round(value * 30)} days`;
  return `${Math.round(value)} months`;
}
