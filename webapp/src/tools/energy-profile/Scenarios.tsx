import { useId, useState } from 'react';
import { emptyInputs, resolveAssumptions } from '../../engine/energy-profile/assumptions';
import { compute } from '../../engine/energy-profile/compute';
import type { ProfileResults } from '../../engine/energy-profile/types';
import type { Locale } from '../../i18n/config';
import { fill, formatMwh, formatNumber, formatPercent } from '../../i18n/format';
import type { Strings } from '../../i18n/strings';
import { newId, now } from '../../workspace/create';
import type { Workspace } from '../../workspace/schema';
import { updateWorkspace } from '../../workspace/store';

interface Props {
  locale: Locale;
  s: Strings;
  workspace: Workspace;
  results: ProfileResults;
}

type Metric = 'usage' | 'production' | 'coverage' | 'summerPanels' | 'winterPanels';
const METRICS: Metric[] = ['usage', 'production', 'coverage', 'summerPanels', 'winterPanels'];

function metricValue(metric: Metric, results: ProfileResults): number | null {
  switch (metric) {
    case 'usage':
      return results.annual.usageTarget;
    case 'production':
      return results.annual.production;
    case 'coverage':
      return results.coverage;
    case 'summerPanels':
      return results.summerMatch.panels;
    case 'winterPanels':
      return results.winterMatch.panels;
  }
}

export function Scenarios({ locale, s, workspace, results }: Props) {
  const t = s.profile.scenarios;
  const id = useId();
  const { scenarios, baselineId } = workspace.profile;
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const baseline = scenarios.find((scenario) => scenario.id === baselineId);
  const baselineResults = baseline
    ? compute(baseline.inputs, resolveAssumptions(baseline.assumptionOverrides))
    : null;

  const format = (metric: Metric, value: number | null) => {
    if (value === null) return '–';
    if (metric === 'coverage') return formatPercent(locale, value);
    return metric === 'usage' || metric === 'production' ? formatMwh(locale, value) : formatNumber(locale, value);
  };
  const difference = (metric: Metric, from: number | null, to: number | null) => {
    if (from === null || to === null) return '–';
    const delta = to - from;
    const sign = delta > 0 ? '+' : delta < 0 ? '−' : '';
    if (metric === 'coverage') return `${sign}${formatNumber(locale, Math.abs(delta) * 100, 0)} %-pt`;
    return sign + format(metric, Math.abs(delta));
  };

  const save = () => {
    const title = name.trim() || fill(t.defaultName, { n: scenarios.length + 1 });
    const timestamp = now();
    updateWorkspace((draft) => {
      draft.profile.scenarios.push({
        id: newId(),
        name: title,
        createdAt: timestamp,
        updatedAt: timestamp,
        inputs: structuredClone(draft.profile.current.inputs),
        assumptionOverrides: { ...draft.profile.current.assumptionOverrides },
      });
    });
    setName('');
    setMessage(fill(t.saved, { name: title }));
  };

  return (
    <section className="panel stack no-print" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>{t.title}</h3>
      <p>{t.lead}</p>
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <div className="field">
          <label htmlFor={`${id}-name`}>{t.name}</label>
          <input
            id={`${id}-name`}
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-describedby={`${id}-name-hint`}
          />
          <span id={`${id}-name-hint`} className="hint">
            {t.nameHint}
          </span>
        </div>
        <div className="cluster">
          <button type="submit" className="btn btn--primary">
            {t.save}
          </button>
          {confirmReset ? (
            <span className="cluster" role="group" aria-label={t.resetConfirm}>
              <span className="small">{t.resetConfirm}</span>
              <button
                type="button"
                className="btn btn--small btn--danger"
                onClick={() => {
                  updateWorkspace((draft) => {
                    draft.profile.current = { inputs: emptyInputs(), assumptionOverrides: {} };
                  });
                  setConfirmReset(false);
                }}
              >
                {t.confirmReset}
              </button>
              <button type="button" className="btn btn--small" onClick={() => setConfirmReset(false)}>
                {s.common.cancel}
              </button>
            </span>
          ) : (
            <button type="button" className="btn btn--quiet" onClick={() => setConfirmReset(true)}>
              {t.reset}
            </button>
          )}
        </div>
        <p className="small" role="status">
          {message}
        </p>
      </form>

      <h4>{t.list}</h4>
      {scenarios.length === 0 ? (
        <p className="muted">{t.none}</p>
      ) : (
        <ul className="stack" style={{ listStyle: 'none', padding: 0 }}>
          {scenarios.map((scenario) => (
            <li key={scenario.id} className="cluster" style={{ maxWidth: 'none' }}>
              <strong style={{ flex: '1 1 10rem' }}>
                {scenario.name}
                {scenario.id === baselineId && <span className="badge" style={{ marginLeft: '0.5rem' }}>{t.isBaseline}</span>}
              </strong>
              <button
                type="button"
                className="btn btn--small"
                onClick={() => {
                  updateWorkspace((draft) => {
                    draft.profile.current = {
                      inputs: structuredClone(scenario.inputs),
                      assumptionOverrides: { ...scenario.assumptionOverrides },
                    };
                  });
                  setMessage(fill(t.loaded, { name: scenario.name }));
                }}
              >
                {t.load}
                <span className="visually-hidden">: {scenario.name}</span>
              </button>
              <button
                type="button"
                className="btn btn--small"
                aria-pressed={scenario.id === baselineId}
                onClick={() =>
                  updateWorkspace((draft) => {
                    if (draft.profile.baselineId === scenario.id) delete draft.profile.baselineId;
                    else draft.profile.baselineId = scenario.id;
                  })
                }
              >
                {scenario.id === baselineId ? t.stopCompare : t.baseline}
                <span className="visually-hidden">: {scenario.name}</span>
              </button>
              <button
                type="button"
                className="btn btn--small"
                onClick={() =>
                  updateWorkspace((draft) => {
                    draft.profile.scenarios = draft.profile.scenarios.filter((item) => item.id !== scenario.id);
                    if (draft.profile.baselineId === scenario.id) delete draft.profile.baselineId;
                  })
                }
              >
                {t.delete}
                <span className="visually-hidden">: {scenario.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {baseline && baselineResults && (
        <div className="table-wrap">
          <table className="table small">
            <caption style={{ textAlign: 'left', fontWeight: 700, paddingBottom: '0.5rem' }}>
              {fill(t.compareTitle, { name: baseline.name })}
            </caption>
            <thead>
              <tr>
                <th scope="col">{t.metric}</th>
                <th scope="col" className="num">
                  {fill(t.baselineColumn, { name: baseline.name })}
                </th>
                <th scope="col" className="num">
                  {t.currentColumn}
                </th>
                <th scope="col" className="num">
                  {t.difference}
                </th>
              </tr>
            </thead>
            <tbody>
              {METRICS.map((metric) => {
                const from = metricValue(metric, baselineResults);
                const to = metricValue(metric, results);
                return (
                  <tr key={metric}>
                    <th scope="row">{t.metrics[metric]}</th>
                    <td className="num">{format(metric, from)}</td>
                    <td className="num">{format(metric, to)}</td>
                    <td className="num">{difference(metric, from, to)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
