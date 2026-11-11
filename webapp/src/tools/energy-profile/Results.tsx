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
  /** 'summary': the headline figures, kept in view beside the inputs. 'detail': chart, month matching, keep. */
  part: 'summary' | 'detail';
}

export function Results({ locale, s, results, part }: Props) {
  const t = s.profile;
  const id = useId();
  const [view, setView] = useState<ChartView>('goals');
  const [large, setLarge] = useState(false);
  const { annual } = results;

  useEffect(() => {
    if (part !== 'detail') return;
    document.body.classList.toggle('present-large', large);
    return () => document.body.classList.remove('present-large');
  }, [large, part]);

  if (results.households === 0) {
    return part === 'summary' ? (
      <div className="panel profile__card" data-phase="p1">
        <h2>{t.results.title}</h2>
        <p>{t.results.empty}</p>
      </div>
    ) : null;
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

  if (part === 'summary') {
    return (
      <section className="panel profile__card profile__headline stack" aria-labelledby={`${id}-title`}>
        <h2 id={`${id}-title`}>{t.results.title}</h2>
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
        {/* how much of the year's use local production covers, as a bar (the figure itself is in the stat above) */}
        <div className="coverage-meter print-colour" aria-hidden="true">
          <span style={{ width: `${Math.min(1, results.coverage ?? 0) * 100}%` }} />
        </div>
        <div className="stats stats--minor">
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
    );
  }

  // 'detail': a full-width band below the inputs, the chart beside the month matching and the keep buttons
  return (
    <div className="profile__detail">
      <section className="panel profile__card stack" aria-labelledby={`${id}-chart`}>
        <h2 id={`${id}-chart`}>{t.chart.title}</h2>
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

      <div className="stack-lg">
        <section className="panel profile__card stack" aria-labelledby={`${id}-match`}>
          <h2 id={`${id}-match`}>{t.match.title}</h2>
          <p>{t.match.lead}</p>
          <Match title={t.match.lowest} match={results.summerMatch} locale={locale} s={s} />
          <Match title={t.match.highest} match={results.winterMatch} locale={locale} s={s} />
          <p className="small muted">{t.match.explain}</p>
        </section>

        <section className="profile__keep stack no-print" aria-labelledby={`${id}-keep`}>
          <h2 id={`${id}-keep`}>{t.keep.title}</h2>
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
    </div>
  );
}
