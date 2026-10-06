import { useEffect, useId, useState } from 'react';
import { resultsToCsv } from '../../engine/energy-profile/csv';
import type { ProfileResults, SeasonMatch } from '../../engine/energy-profile/types';
import type { Locale } from '../../i18n/config';
import { fill, formatMwh, formatNumber, formatPercent, monthNames } from '../../i18n/format';
import type { Strings } from '../../i18n/strings';
import { MonthlyChart, MonthlyTable } from './MonthlyChart';
import type { ChartView } from './MonthlyChart';

const VIEWS: ChartView[] = ['today', 'goals', 'summer', 'winter'];

function Stat({ value, unit, label, note }: { value: string; unit?: string; label: string; note?: string }) {
  return (
    <div className="stat">
      <span className="stat__value">
        {value}
        {unit && <span className="small"> {unit}</span>}
      </span>
      <span className="stat__label">
        {label}
        {note ? ` (${note})` : ''}
      </span>
    </div>
  );
}

function Match({ title, match, locale, s }: { title: string; match: SeasonMatch; locale: Locale; s: Strings }) {
  const t = s.profile.match;
  const values = {
    month: monthNames(locale)[match.monthIndex],
    usage: formatMwh(locale, match.usage),
    production: formatMwh(locale, match.production),
    panels: formatNumber(locale, match.panels),
  };
  return (
    <div className="match">
      <p>
        <strong>{fill(title, values)}</strong>
      </p>
      <p>{fill(match.needed ? t.needed : t.notNeeded, values)}</p>
    </div>
  );
}

interface Props {
  locale: Locale;
  s: Strings;
  results: ProfileResults;
}

export function Results({ locale, s, results }: Props) {
  const t = s.profile;
  const id = useId();
  const [view, setView] = useState<ChartView>('goals');
  const [large, setLarge] = useState(false);
  const { annual } = results;

  useEffect(() => {
    document.body.classList.toggle('present-large', large);
    return () => document.body.classList.remove('present-large');
  }, [large]);

  if (results.households === 0) {
    return (
      <div className="panel panel--soft" data-phase="p1">
        <h3>{t.results.title}</h3>
        <p>{t.results.empty}</p>
      </div>
    );
  }

  const parts = [
    { key: 'electricity', value: annual.electricityTarget, colour: 'var(--series-electricity)' },
    { key: 'heating', value: annual.heatingTarget, colour: 'var(--series-heating)' },
    { key: 'mobility', value: annual.mobilityTarget, colour: 'var(--series-mobility)' },
  ] as const;
  const partsTotal = parts.reduce((total, part) => total + part.value, 0);

  const downloadCsv = () => {
    const csv = resultsToCsv(results, {
      month: t.chart.month,
      months: monthNames(locale),
      total: t.chart.total,
      columns: t.results.series,
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `${t.keep.csvFile}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="stack-lg">
      <section className="panel stack" aria-labelledby={`${id}-title`}>
        <h3 id={`${id}-title`}>{t.results.title}</h3>
        {/* Announces the headline figures once typing pauses. */}
        <div className="stats" aria-live="polite" aria-atomic="true">
          <Stat value={formatMwh(locale, annual.usageTarget)} unit={s.common.unit.mwh} label={t.results.usageGoal} note={t.results.perYear} />
          <Stat value={formatMwh(locale, annual.production)} unit={s.common.unit.mwh} label={t.results.production} note={t.results.perYear} />
          <Stat
            value={results.coverage === null ? '–' : formatPercent(locale, results.coverage)}
            label={t.results.coverage}
            note={t.results.coverageNote}
          />
        </div>
        <div className="stats">
          <Stat value={formatMwh(locale, annual.usage)} unit={s.common.unit.mwh} label={t.results.usageToday} note={t.results.perYear} />
          <Stat value={formatNumber(locale, results.households)} label={t.results.homes} />
          <Stat
            value={formatNumber(locale, results.evCars.target)}
            label={t.results.evs}
            note={fill(t.results.evsValue, {
              now: formatNumber(locale, results.evCars.current),
              goal: formatNumber(locale, results.evCars.target),
            })}
          />
        </div>
        <div>
          <p className="label">{t.results.breakdownTitle}</p>
          <div className="breakdown print-colour" aria-hidden="true">
            {parts.map((part) => (
              <span key={part.key} style={{ width: `${partsTotal ? (part.value / partsTotal) * 100 : 0}%`, background: part.colour }} />
            ))}
          </div>
          <ul className="legend">
            {parts.map((part) => (
              <li key={part.key}>
                <span className="legend__swatch print-colour" style={{ background: part.colour }} aria-hidden="true" />
                {t.results.series[part.key]}: {formatMwh(locale, part.value)} {s.common.unit.mwh}
                {partsTotal > 0 && ` (${formatPercent(locale, part.value / partsTotal)})`}
              </li>
            ))}
          </ul>
          <p className="small muted" style={{ marginTop: 'var(--space-3)' }}>
            {t.results.gasNote}
          </p>
        </div>
      </section>

      <section className="panel stack" aria-labelledby={`${id}-chart`}>
        <h3 id={`${id}-chart`}>{t.chart.title}</h3>
        <fieldset className="segmented no-print">
          <legend className="visually-hidden">{t.chart.viewLabel}</legend>
          {VIEWS.map((item) => (
            <label key={item}>
              <input type="radio" name={`${id}-view`} checked={view === item} onChange={() => setView(item)} />
              <span>{t.chart.views[item]}</span>
            </label>
          ))}
        </fieldset>
        <p className="print-only">
          <strong>{t.chart.views[view]}</strong>
        </p>
        <MonthlyChart results={results} view={view} locale={locale} s={s} />
        <details className="disclosure">
          <summary>{t.chart.table}</summary>
          <div className="disclosure__body">
            <MonthlyTable results={results} locale={locale} s={s} />
          </div>
        </details>
      </section>

      <section className="panel stack" aria-labelledby={`${id}-match`}>
        <h3 id={`${id}-match`}>{t.match.title}</h3>
        <p>{t.match.lead}</p>
        <Match title={t.match.lowest} match={results.summerMatch} locale={locale} s={s} />
        <Match title={t.match.highest} match={results.winterMatch} locale={locale} s={s} />
        <p className="small muted">{t.match.explain}</p>
      </section>

      <section className="panel panel--flat stack no-print" aria-labelledby={`${id}-keep`}>
        <h3 id={`${id}-keep`}>{t.keep.title}</h3>
        <div className="cluster">
          <button type="button" className="btn" onClick={() => window.print()}>
            {t.keep.print}
          </button>
          <button type="button" className="btn" onClick={downloadCsv}>
            {t.keep.csv}
          </button>
          <button type="button" className="btn" aria-pressed={large} onClick={() => setLarge(!large)}>
            {large ? t.keep.presentOff : t.keep.presentOn}
          </button>
        </div>
      </section>
    </div>
  );
}
