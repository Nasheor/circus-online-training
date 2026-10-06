import { NL_REFERENCE, readAssumption } from '../../engine/energy-profile/assumptions';
import type { AssumptionOverrides } from '../../engine/energy-profile/assumptions';
import { HOUSE_TYPES, SEASONAL_SERIES } from '../../engine/energy-profile/types';
import type { Assumptions as AssumptionValues } from '../../engine/energy-profile/types';
import type { Locale } from '../../i18n/config';
import { fill, formatNumber, monthNames } from '../../i18n/format';
import type { Strings } from '../../i18n/strings';
import { updateWorkspace } from '../../workspace/store';
import { NumberField } from '../shared/NumberField';

const SCALARS = [
  'gasKwhPerM3', 'boilerEfficiency', 'hybridHeatShare', 'electricHeatShare', 'hybridCop', 'electricCop',
  'kmPerCar', 'evKwhPerKm', 'panelWp', 'kwhPerWp', 'windFullLoadHours',
] as const;
// Values that are a fraction between 0 and 1; COPs must stay above zero to avoid dividing by nothing.
const MAX: Partial<Record<(typeof SCALARS)[number], number>> = {
  boilerEfficiency: 1, hybridHeatShare: 1, electricHeatShare: 1,
};
const MIN: Partial<Record<(typeof SCALARS)[number], number>> = { hybridCop: 0.1, electricCop: 0.1 };

interface Props {
  locale: Locale;
  s: Strings;
  assumptions: AssumptionValues;
  overrides: AssumptionOverrides;
}

/** The workbook's adjustable ("orange") cells: reference values a community can replace with its own. */
export function Assumptions({ locale, s, assumptions, overrides }: Props) {
  const t = s.profile.assumptions;
  const months = monthNames(locale);
  const changedCount = Object.keys(overrides).length;

  const set = (path: string, value: number) =>
    updateWorkspace((draft) => {
      const reference = readAssumption(NL_REFERENCE, path);
      // Only real differences are stored, so "changed" stays meaningful.
      if (Math.abs(value - reference) < 1e-12) delete draft.profile.current.assumptionOverrides[path];
      else draft.profile.current.assumptionOverrides[path] = value;
    });

  const field = (path: string, label: string, options: { min?: number; max?: number; scale?: number } = {}) => (
    <span className={path in overrides ? 'changed' : undefined}>
      <NumberField
        value={readAssumption(assumptions, path)}
        onChange={(value) => set(path, value)}
        errors={s.profile.errors}
        ariaLabel={label}
        {...options}
      />
    </span>
  );

  const columnSum = (series: (typeof SEASONAL_SERIES)[number]) =>
    assumptions.seasonality[series].reduce((total, value) => total + value, 0);
  const unbalanced = SEASONAL_SERIES.some((series) => Math.abs(columnSum(series) - 1) > 0.0005);

  return (
    <details className="disclosure no-print">
      <summary>
        {t.title}
        {changedCount > 0 && <span className="badge" style={{ marginLeft: '0.5rem' }}>{fill(t.changed, { n: changedCount })}</span>}
      </summary>
      <div className="disclosure__body stack-lg">
        <div className="stack">
          <p>{t.lead}</p>
          {changedCount > 0 && (
            <div>
              <button
                type="button"
                className="btn btn--small"
                onClick={() =>
                  updateWorkspace((draft) => {
                    draft.profile.current.assumptionOverrides = {};
                  })
                }
              >
                {t.resetAll}
              </button>
            </div>
          )}
        </div>

        <div>
          <h4>{t.housesTitle}</h4>
          <div className="table-wrap">
            <table className="table small">
              <caption className="visually-hidden">{t.housesCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{s.profile.homes.type}</th>
                  <th scope="col">{t.electricityKwh}</th>
                  <th scope="col">{t.gasM3}</th>
                </tr>
              </thead>
              <tbody>
                {HOUSE_TYPES.map((type) => (
                  <tr key={type}>
                    <th scope="row">{s.profile.houseTypes[type]}</th>
                    <td>{field(`houses.${type}.electricityKwh`, `${s.profile.houseTypes[type]}: ${t.electricityKwh}`)}</td>
                    <td>{field(`houses.${type}.gasM3`, `${s.profile.houseTypes[type]}: ${t.gasM3}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4>{t.otherTitle}</h4>
          <div className="assumption-grid">
            {SCALARS.map((key) => (
              <label key={key} className="field">
                <span className="small">{t.scalars[key]}</span>
                {field(key, t.scalars[key], { min: MIN[key] ?? 0, max: MAX[key] })}
              </label>
            ))}
          </div>
        </div>

        <div className="stack">
          <h4>{t.seasonalityTitle}</h4>
          <p>{t.seasonalityLead}</p>
          {unbalanced && (
            <p className="notice notice--warn" role="status">
              {t.sumWarning}
            </p>
          )}
          <div className="table-wrap">
            <table className="table small">
              <caption className="visually-hidden">{t.seasonalityCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{s.profile.chart.month}</th>
                  {SEASONAL_SERIES.map((series) => (
                    <th key={series} scope="col">
                      {t.seasonalSeries[series]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {months.map((month, index) => (
                  <tr key={month}>
                    <th scope="row">{month}</th>
                    {SEASONAL_SERIES.map((series) => (
                      <td key={series}>
                        {field(
                          `seasonality.${series}.${index}`,
                          fill(t.cell, { series: t.seasonalSeries[series], month }),
                          { max: 1, scale: 100 },
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">{t.sum}</th>
                  {SEASONAL_SERIES.map((series) => (
                    <td key={series} className="num">
                      {formatNumber(locale, columnSum(series) * 100, 1)}%
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </details>
  );
}
