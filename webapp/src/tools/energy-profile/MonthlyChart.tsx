import type { ProfileResults } from '../../engine/energy-profile/types';
import type { Locale } from '../../i18n/config';
import { formatMwh, monthNames } from '../../i18n/format';
import type { Strings } from '../../i18n/strings';

export type ChartView = 'today' | 'goals' | 'summer' | 'winter';

const WIDTH = 720;
const HEIGHT = 330;
const MARGIN = { top: 14, right: 12, bottom: 34, left: 52 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

/** Round a maximum up to a tidy axis end: 1, 2, 2.5, 5 or 10 times a power of ten. */
function niceMax(value: number): number {
  if (value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  const scaled = value / power;
  const step = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 2.5 ? 2.5 : scaled <= 5 ? 5 : 10;
  return step * power;
}

interface Props {
  results: ProfileResults;
  view: ChartView;
  locale: Locale;
  s: Strings;
}

/**
 * Monthly production as stacked columns with use as a line, like the charts in
 * the Excel tool. Series differ by shape and pattern as well as colour, and the
 * figures are repeated in a table by the parent component.
 */
export function MonthlyChart({ results, view, locale, s }: Props) {
  const t = s.profile;
  const months = monthNames(locale, 'short');
  const { monthly } = results;
  const added =
    view === 'summer' ? monthly.summerAddedSolar : view === 'winter' ? monthly.winterAddedSolar : null;
  const line = view === 'today' ? monthly.usage : monthly.usageTarget;
  const reference = view === 'today' ? null : monthly.usage;
  const stackTop = monthly.wind.map((wind, month) => wind + monthly.solar[month] + (added ? added[month] : 0));
  const top = niceMax(Math.max(...stackTop, ...line, ...(reference ?? [0])));
  const y = (value: number) => MARGIN.top + PLOT_H - (value / top) * PLOT_H;
  const band = PLOT_W / 12;
  const barWidth = band * 0.62;
  const centre = (month: number) => MARGIN.left + band * month + band / 2;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((share) => share * top);
  const points = (values: number[]) => values.map((value, month) => `${centre(month)},${y(value)}`).join(' ');

  return (
    <figure className="keep-together" style={{ margin: 0 }}>
      <svg className="chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={t.chart.alt}>
        <defs>
          <pattern id="hatch-added" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="var(--series-added)" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--series-hatch)" strokeWidth="2" />
          </pattern>
        </defs>
        {ticks.map((tick) => (
          <g key={tick}>
            <line className="chart__grid" x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y(tick)} y2={y(tick)} />
            <text x={MARGIN.left - 8} y={y(tick) + 4} textAnchor="end">
              {formatMwh(locale, tick)}
            </text>
          </g>
        ))}
        {months.map((month, index) => {
          const x = centre(index) - barWidth / 2;
          const wind = monthly.wind[index];
          const solar = monthly.solar[index];
          const extra = added ? added[index] : 0;
          return (
            <g key={month}>
              <rect x={x} width={barWidth} y={y(wind)} height={y(0) - y(wind)} fill="var(--series-wind)" />
              <rect x={x} width={barWidth} y={y(wind + solar)} height={y(wind) - y(wind + solar)} fill="var(--series-solar)" />
              {extra > 0 && (
                <rect
                  x={x}
                  width={barWidth}
                  y={y(wind + solar + extra)}
                  height={y(wind + solar) - y(wind + solar + extra)}
                  fill="url(#hatch-added)"
                />
              )}
              <text x={centre(index)} y={HEIGHT - 12} textAnchor="middle">
                {month}
              </text>
            </g>
          );
        })}
        {reference && (
          <polyline points={points(reference)} fill="none" stroke="var(--series-usage)" strokeWidth="2" strokeDasharray="6 5" opacity="0.6" />
        )}
        <polyline points={points(line)} fill="none" stroke="var(--series-usage)" strokeWidth="3" strokeLinejoin="round" />
        {line.map((value, month) => (
          <circle key={month} cx={centre(month)} cy={y(value)} r="4" fill="var(--surface)" stroke="var(--series-usage)" strokeWidth="2.5" />
        ))}
        <text x={12} y={MARGIN.top + PLOT_H / 2} textAnchor="middle" transform={`rotate(-90 12 ${MARGIN.top + PLOT_H / 2})`}>
          {t.chart.yAxis}
        </text>
      </svg>
      <ul className="legend" aria-hidden="true">
        <li>
          <span className="legend__swatch legend__swatch--line" />
          {view === 'today' ? t.results.series.usage : t.results.series.usageTarget}
        </li>
        {reference && (
          <li>
            <span className="legend__swatch legend__swatch--line legend__swatch--dashed" />
            {t.results.series.usage}
          </li>
        )}
        <li>
          <span className="legend__swatch print-colour" style={{ background: 'var(--series-solar)' }} />
          {t.results.series.solar}
        </li>
        <li>
          <span className="legend__swatch print-colour" style={{ background: 'var(--series-wind)' }} />
          {t.results.series.wind}
        </li>
        {added && (
          <li>
            <span
              className="legend__swatch print-colour"
              style={{ background: 'repeating-linear-gradient(45deg, var(--series-added) 0 3px, var(--series-hatch) 3px 5px)' }}
            />
            {t.results.series.added}
          </li>
        )}
      </ul>
    </figure>
  );
}

const TABLE_COLUMNS = ['electricity', 'heating', 'mobility', 'usage', 'usageTarget', 'solar', 'wind', 'production'] as const;

/** The figures behind the chart, for screen readers and anyone who prefers numbers. */
export function MonthlyTable({ results, locale, s }: { results: ProfileResults; locale: Locale; s: Strings }) {
  const t = s.profile;
  const months = monthNames(locale);
  const total = (values: number[]) => values.reduce((sum, value) => sum + value, 0);
  return (
    <div className="table-wrap">
      <table className="table small">
        <caption className="visually-hidden">{t.chart.tableCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{t.chart.month}</th>
            {TABLE_COLUMNS.map((column) => (
              <th key={column} scope="col" className="num">
                {t.results.series[column]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {months.map((month, index) => (
            <tr key={month}>
              <th scope="row">{month}</th>
              {TABLE_COLUMNS.map((column) => (
                <td key={column} className="num">
                  {formatMwh(locale, results.monthly[column][index])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">{t.chart.total}</th>
            {TABLE_COLUMNS.map((column) => (
              <td key={column} className="num">
                {formatMwh(locale, total(results.monthly[column]))}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
