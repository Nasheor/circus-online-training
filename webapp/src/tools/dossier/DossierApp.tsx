import { useStore } from '@nanostores/react';
import { useId, useRef, useState } from 'react';
import { ACTIVITIES, CANVAS_BLOCKS, DATA_CATEGORIES, GO_FURTHER } from '../../content/business';
import { PHASES, cardsOfDeck } from '../../content/structure';
import { resolveAssumptions } from '../../engine/energy-profile/assumptions';
import { compute } from '../../engine/energy-profile/compute';
import type { Locale } from '../../i18n/config';
import { fill, formatDate, formatMwh, formatNumber, formatPercent } from '../../i18n/format';
import { href } from '../../i18n/href';
import { getStrings } from '../../i18n/strings';
import type { Strings } from '../../i18n/strings';
import { createWorkspace, isPristine, now } from '../../workspace/create';
import { loadWorkspace, serializeWorkspace } from '../../workspace/migrate';
import type { LoadFailure } from '../../workspace/migrate';
import type { Workspace } from '../../workspace/schema';
import {
  $loadProblem, $storageAvailable, $workspace, hasBackup, replaceWorkspace, restoreBackup, updateWorkspace,
} from '../../workspace/store';
import { useWorkspace } from '../../workspace/useWorkspace';
import { DATA_ITEM_COUNT, countCollected } from '../business/Checklists';
import { PrintableTextarea } from '../shared/PrintableTextarea';

const slug = (text: string) =>
  text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

/** Saving a file touches the workspace itself, so "changed since" allows for that moment. */
const changedSinceExport = (workspace: Workspace) =>
  !workspace.lastExportedAt ||
  new Date(workspace.updatedAt).getTime() - new Date(workspace.lastExportedAt).getTime() > 2000;

function KeepSafe({ locale, s, workspace }: { locale: Locale; s: Strings; workspace: Workspace }) {
  const t = s.community;
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<LoadFailure | null>(null);
  const [pending, setPending] = useState<{ file: string; workspace: Workspace } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [backup, setBackup] = useState(hasBackup);

  const say = (text: string) => {
    setMessage(text);
    setError(null);
  };
  const replace = (next: Workspace, text: string) => {
    replaceWorkspace(next);
    setBackup(hasBackup());
    setPending(null);
    setConfirmReset(false);
    say(text);
  };

  const exportFile = () => {
    updateWorkspace((draft) => {
      draft.lastExportedAt = now();
    });
    const current = $workspace.get();
    const name = [t.fileName, slug(current.community.name), current.lastExportedAt?.slice(0, 10)]
      .filter(Boolean)
      .join('-');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([serializeWorkspace(current)], { type: 'application/json' }));
    link.download = `${name}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    say(fill(t.exported, { file: link.download }));
  };

  const importFile = async (file: File) => {
    const result = loadWorkspace(await file.text());
    if (fileInput.current) fileInput.current.value = '';
    if (!result.ok) {
      setMessage('');
      setPending(null);
      return setError(result.reason);
    }
    // Nothing to lose: open straight away. Otherwise ask first.
    if (isPristine($workspace.get())) replace(result.workspace, fill(t.imported, { file: file.name }));
    else {
      setError(null);
      setMessage('');
      setPending({ file: file.name, workspace: result.workspace });
    }
  };

  return (
    <section className="dossier-top stack no-print" aria-labelledby={`${id}-keep`}>
      <h2 id={`${id}-keep`}>{t.keepTitle}</h2>
      <p>{t.keepLead}</p>
      <p className={changedSinceExport(workspace) && !isPristine(workspace) ? 'notice notice--warn' : 'notice notice--ok'}>
        {workspace.lastExportedAt
          ? fill(t.lastExported, { date: formatDate(locale, workspace.lastExportedAt) })
          : t.neverExported}
        {workspace.lastExportedAt && changedSinceExport(workspace) ? ` ${t.changedSince}` : ''}
      </p>
      <div className="cluster">
        <button type="button" className="btn btn--primary" onClick={exportFile}>
          {t.export}
        </button>
        <button type="button" className="btn" onClick={() => fileInput.current?.click()}>
          {t.import}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importFile(file);
          }}
        />
        <button type="button" className="btn" onClick={() => window.print()}>
          {t.print}
        </button>
      </div>
      <p className="small muted">{t.importHint}</p>

      {pending && (
        <div className="notice notice--warn cluster" role="alert">
          <span>{fill(t.importConfirm, { file: pending.file })}</span>
          <button
            type="button"
            className="btn btn--small btn--primary"
            onClick={() => replace(pending.workspace, fill(t.imported, { file: pending.file }))}
          >
            {t.confirmImport}
          </button>
          <button type="button" className="btn btn--small" onClick={() => setPending(null)}>
            {s.common.cancel}
          </button>
        </div>
      )}
      {error && (
        <p className="notice notice--danger" role="alert">
          {t.importErrors[error]}
        </p>
      )}
      <p role="status">{message}</p>

      <div className="cluster">
        {backup && (
          <button
            type="button"
            className="btn btn--small"
            onClick={() => {
              if (restoreBackup()) {
                setBackup(hasBackup());
                say(t.restored);
              }
            }}
          >
            {t.restore}
          </button>
        )}
        {confirmReset ? (
          <span className="cluster" role="group" aria-label={t.resetConfirm}>
            <span className="small">{t.resetConfirm}</span>
            <button type="button" className="btn btn--small btn--danger" onClick={() => replace(createWorkspace(), t.resetDone)}>
              {t.confirmReset}
            </button>
            <button type="button" className="btn btn--small" onClick={() => setConfirmReset(false)}>
              {s.common.cancel}
            </button>
          </span>
        ) : (
          <button type="button" className="btn btn--small btn--quiet" onClick={() => setConfirmReset(true)}>
            {t.reset}
          </button>
        )}
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}

/** "My community": the whole workspace on one page, which is also the printable dossier. */
export default function DossierApp({ locale }: { locale: Locale }) {
  const s = getStrings(locale);
  const t = s.community;
  const id = useId();
  const workspace = useWorkspace();
  const storageAvailable = useStore($storageAvailable);
  const loadProblem = useStore($loadProblem);
  const { community, journey, profile, cards, sites, business } = workspace;

  const results = compute(profile.current.inputs, resolveAssumptions(profile.current.assumptionOverrides));
  const overrides = Object.keys(profile.current.assumptionOverrides).length;
  const activities = ACTIVITIES.filter((activity) => business.activities[activity.id]);
  const collected = countCollected(workspace);
  const goFurtherDone = GO_FURTHER.filter((item) => business.goFurther[item.id]?.done || business.goFurther[item.id]?.note);
  const businessEmpty =
    activities.length === 0 && business.canvases.length === 0 && collected === 0 && goFurtherDone.length === 0 && !business.planNotes;
  const setDetail = (key: 'name' | 'place' | 'notes', value: string) =>
    updateWorkspace((draft) => {
      draft.community[key] = value;
    });
  const mwh = (value: number) => `${formatMwh(locale, value)} ${s.common.unit.mwhYear}`;

  return (
    <div className="stack-lg">
      {!storageAvailable && <p className="notice notice--warn">{s.common.storageOff}</p>}
      {loadProblem && <p className="notice notice--warn">{s.common.loadProblem}</p>}

      <p className="print-only">
        <strong>
          {t.printHeading}
          {community.name ? `: ${community.name}` : ''}
        </strong>
        <br />
        {fill(t.printedOn, { date: formatDate(locale, now()) })}
      </p>

      <div className="split">
        <section className="dossier-top stack" aria-labelledby={`${id}-details`}>
          <h2 id={`${id}-details`}>{t.detailsTitle}</h2>
          <div className="field">
            <label htmlFor={`${id}-name`}>{t.name}</label>
            <input id={`${id}-name`} className="input" value={community.name} onChange={(event) => setDetail('name', event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor={`${id}-place`}>{t.place}</label>
            <input id={`${id}-place`} className="input" value={community.place} onChange={(event) => setDetail('place', event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor={`${id}-notes`}>{t.notes}</label>
            <PrintableTextarea
              id={`${id}-notes`}
              className="textarea"
              value={community.notes}
              aria-describedby={`${id}-notes-hint`}
              onChange={(event) => setDetail('notes', event.target.value)}
            />
            <span id={`${id}-notes-hint`} className="hint no-print">
              {t.notesHint}
            </span>
          </div>
        </section>
        <KeepSafe locale={locale} s={s} workspace={workspace} />
      </div>

      {isPristine(workspace) && (
        <div className="notice no-print">
          <p>{t.empty}</p>
          <p>
            <a className="btn btn--primary" href={href(locale, 'journey')}>
              {t.startJourney}
            </a>
          </p>
        </div>
      )}

      <section className="stack" aria-labelledby={`${id}-journey`}>
        <h2 id={`${id}-journey`}>{t.journeyTitle}</h2>
        <ul className="dossier-journey">
          {PHASES.map((phase) => (
            <li key={phase.id} className={journey.phases[phase.id].done ? 'dossier-phase is-done' : 'dossier-phase'} data-phase={phase.id}>
              <a href={href(locale, `journey/${phase.slug}`)}>
                <strong>
                  {fill(s.common.phase, { n: phase.order })} – {s.phases[phase.id].name}
                </strong>
              </a>
              <br />
              <span className={journey.phases[phase.id].done ? 'badge badge--solid' : 'small muted'}>
                {journey.phases[phase.id].done ? t.phaseDone : t.phaseOpen}
              </span>
            </li>
          ))}
        </ul>
        {journey.selfCheck && (
          <p className="small muted">
            {fill(t.selfCheck, { n: PHASES.find((phase) => phase.id === journey.selfCheck?.recommended)?.order ?? '' })}
          </p>
        )}
      </section>

      <section className="dossier__part keep-together" aria-labelledby={`${id}-profile`} data-phase="p1">
        <h2 id={`${id}-profile`}>{t.profileTitle}</h2>
        {results.households === 0 ? (
          <p className="muted">{t.profileEmpty}</p>
        ) : (
          <>
            <div className="stats">
              <Fact label={t.profileFacts.homes} value={formatNumber(locale, results.households)} />
              <Fact label={t.profileFacts.usageToday} value={mwh(results.annual.usage)} />
              <Fact label={t.profileFacts.usage} value={mwh(results.annual.usageTarget)} />
              <Fact label={t.profileFacts.production} value={mwh(results.annual.production)} />
              <Fact
                label={t.profileFacts.coverage}
                value={results.coverage === null ? '–' : formatPercent(locale, results.coverage)}
              />
              <Fact label={t.profileFacts.summer} value={formatNumber(locale, results.summerMatch.panels)} />
              <Fact label={t.profileFacts.winter} value={formatNumber(locale, results.winterMatch.panels)} />
            </div>
            {overrides > 0 && <p className="small muted">{fill(t.changedAssumptions, { n: overrides })}</p>}
          </>
        )}
        {profile.scenarios.length > 0 && (
          <div>
            <h3 style={{ fontSize: 'var(--text-base)' }}>{t.scenarios}</h3>
            <ul>
              {profile.scenarios.map((scenario) => {
                const scenarioResults = compute(scenario.inputs, resolveAssumptions(scenario.assumptionOverrides));
                return (
                  <li key={scenario.id}>
                    <strong>{scenario.name}</strong>: {mwh(scenarioResults.annual.usageTarget)},{' '}
                    {scenarioResults.coverage === null ? '–' : formatPercent(locale, scenarioResults.coverage)}{' '}
                    {t.profileFacts.coverage.toLowerCase()}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <p className="no-print">
          <a href={href(locale, 'tools/energy-profile')}>{t.openProfile}</a>
        </p>
      </section>

      <section className="dossier__part" aria-labelledby={`${id}-sessions`}>
        <h2 id={`${id}-sessions`}>{t.sessionsTitle}</h2>
        {cards.sessions.length === 0 && <p className="muted">{t.sessionsEmpty}</p>}
        {cards.sessions.map((session) => {
          const noted = cardsOfDeck(session.deck).filter((card) => session.notes[card.id]?.text.trim());
          return (
            <div key={session.id} data-phase={session.deck} className="keep-together">
              <h3 style={{ fontSize: 'var(--text-lg)' }}>
                {session.title}{' '}
                <span className="badge">
                  {session.endedAt
                    ? fill(s.wattworks.session.finished, { date: formatDate(locale, session.endedAt) })
                    : s.wattworks.session.inProgress}
                </span>
              </h3>
              {session.summary && <p style={{ whiteSpace: 'pre-wrap' }}>{session.summary}</p>}
              <p className="small muted no-print">
                {fill(s.wattworks.session.notesCount, { n: noted.length })} ·{' '}
                <a href={href(locale, 'tools/cards/session', `?session=${session.id}`)}>
                  {t.openSession}
                  <span className="visually-hidden">: {session.title}</span>
                </a>
              </p>
              <dl className="print-only small">
                {noted.map((card) => (
                  <div key={card.id}>
                    <dt>
                      <strong>
                        {s.cardCategories[card.category]} {card.number}: {s.cards[card.id].lines.join(' ')}
                      </strong>
                    </dt>
                    <dd style={{ margin: '0 0 0.5rem', whiteSpace: 'pre-wrap' }}>{session.notes[card.id].text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
        <p className="no-print">
          <a href={href(locale, 'tools/cards/session')}>{t.startSession}</a>
        </p>
      </section>

      <section className="dossier__part" aria-labelledby={`${id}-sites`} data-phase="p2">
        <h2 id={`${id}-sites`}>{t.sitesTitle}</h2>
        {sites.length === 0 ? (
          <p className="muted">{t.sitesEmpty}</p>
        ) : (
          <ul>
            {sites.map((site) => (
              <li key={site.id} className="keep-together">
                <strong>{site.name}</strong>
                {site.technology ? ` – ${s.map.sites.technologies[site.technology]}` : ''}
                {site.where ? ` · ${site.where}` : ''}
                {site.why && (
                  <>
                    <br />
                    <span className="small">
                      <strong>{s.map.sites.why}</strong> {site.why}
                    </span>
                  </>
                )}
                {site.concerns && (
                  <>
                    <br />
                    <span className="small">
                      <strong>{s.map.sites.concerns}</strong> {site.concerns}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="no-print">
          <a href={href(locale, 'tools/map')}>{t.openMap}</a>
        </p>
      </section>

      <section className="dossier__part" aria-labelledby={`${id}-business`} data-phase="p3">
        <h2 id={`${id}-business`}>{t.businessTitle}</h2>
        {businessEmpty && <p className="muted">{t.businessEmpty}</p>}
        {activities.length > 0 && (
          <div>
            <h3 style={{ fontSize: 'var(--text-base)' }}>{t.activities}</h3>
            <ul>
              {activities.map((activity) => {
                const state = business.activities[activity.id];
                return (
                  <li key={activity.id}>
                    <strong>{s.business.explore.activities[activity.id]}</strong>
                    {state.interest ? `: ${s.business.explore.interest[state.interest]}` : ''}
                    {state.note ? ` — ${state.note}` : ''}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {business.canvases.length > 0 && (
          <div>
            <h3 style={{ fontSize: 'var(--text-base)' }}>{t.canvases}</h3>
            {business.canvases.map((canvas) => (
              <div key={canvas.id} className="keep-together">
                <p>
                  <strong>{canvas.name}</strong>
                </p>
                <dl className="small">
                  {CANVAS_BLOCKS.filter((block) => canvas.blocks[block]?.trim()).map((block) => (
                    <div key={block}>
                      <dt>
                        <strong>{s.business.draw.blocks[block].name}</strong>
                      </dt>
                      <dd style={{ margin: '0 0 0.5rem', whiteSpace: 'pre-wrap' }}>{canvas.blocks[block]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        )}
        {collected > 0 && (
          <div>
            <h3 style={{ fontSize: 'var(--text-base)' }}>{fill(t.dataCollected, { done: collected, total: DATA_ITEM_COUNT })}</h3>
            <ul className="small">
              {DATA_CATEGORIES.flatMap((category) => category.items as readonly string[])
                .filter((item) => business.dataChecklist[item]?.done)
                .map((item) => {
                  const entry = business.dataChecklist[item];
                  return (
                    <li key={item}>
                      <strong>{s.business.collect.items[item as keyof typeof s.business.collect.items]}</strong>
                      {entry.value ? `: ${entry.value}` : ''}
                      {entry.source ? ` (${entry.source})` : ''}
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
        {goFurtherDone.length > 0 && (
          <div>
            <h3 style={{ fontSize: 'var(--text-base)' }}>{t.goFurther}</h3>
            <ul className="small">
              {goFurtherDone.map((item) => (
                <li key={item.id}>
                  <strong>{s.business.goFurther.items[item.id].name}</strong>
                  {business.goFurther[item.id]?.note ? `: ${business.goFurther[item.id].note}` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
        {business.planNotes && (
          <div>
            <h3 style={{ fontSize: 'var(--text-base)' }}>{t.planNotes}</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{business.planNotes}</p>
          </div>
        )}
        <p className="no-print">
          <a href={href(locale, 'tools/business-model')}>{t.openBusiness}</a>
        </p>
      </section>
    </div>
  );
}
