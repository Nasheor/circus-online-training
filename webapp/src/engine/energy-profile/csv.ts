import type { ProfileResults } from './types';

export interface CsvLabels {
  month: string;
  months: string[];
  columns: Record<
    'electricity' | 'heating' | 'mobility' | 'usage' | 'usageTarget' | 'solar' | 'wind' | 'production',
    string
  >;
  total: string;
}

const COLUMNS = ['electricity', 'heating', 'mobility', 'usage', 'usageTarget', 'solar', 'wind', 'production'] as const;

const cell = (value: string | number) => {
  const text = typeof value === 'number' ? String(Math.round(value * 1000) / 1000) : value;
  return /[",;\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

/** Monthly results as CSV (MWh), with a totals row. Numbers use a dot so spreadsheets in any locale can import them. */
export function resultsToCsv(results: ProfileResults, labels: CsvLabels): string {
  const header = [labels.month, ...COLUMNS.map((column) => labels.columns[column])];
  const rows = labels.months.map((month, index) => [
    month,
    ...COLUMNS.map((column) => results.monthly[column][index]),
  ]);
  const totals = [
    labels.total,
    ...COLUMNS.map((column) => results.monthly[column].reduce((total, value) => total + value, 0)),
  ];
  return [header, ...rows, totals].map((row) => row.map(cell).join(',')).join('\r\n') + '\r\n';
}
