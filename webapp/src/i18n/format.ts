import type { Locale } from './config';

/** Fill {placeholders} in a UI string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}

export function formatNumber(locale: Locale, value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
}

/** Energy in MWh with a sensible number of decimals for its size. */
export function formatMwh(locale: Locale, value: number): string {
  const digits = Math.abs(value) >= 100 ? 0 : Math.abs(value) >= 10 ? 1 : 2;
  return formatNumber(locale, value, digits);
}

export function formatPercent(locale: Locale, share: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits }).format(share);
}

export function formatDate(locale: Locale, iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}

/** Parse what people type: accepts both decimal comma and decimal point. Returns null when not a number. */
export function parseNumber(text: string): number | null {
  const cleaned = text.trim().replace(/\s/g, '').replace(',', '.');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function monthNames(locale: Locale, style: 'long' | 'short' = 'long'): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: style, timeZone: 'UTC' });
  return Array.from({ length: 12 }, (_, month) => formatter.format(new Date(Date.UTC(2024, month, 15))));
}
