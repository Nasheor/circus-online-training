import { useEffect, useId, useState } from 'react';
import { getResource } from '../../content/resources';
import { PHASES, SESSION_DECKS, TOOL_PATHS, cardsOfDeck } from '../../content/structure';
import type { SessionDeckId } from '../../content/structure';
import type { Locale } from '../../i18n/config';
import { fill, formatDate } from '../../i18n/format';
import { href } from '../../i18n/href';
import { getStrings } from '../../i18n/strings';
import type { Strings } from '../../i18n/strings';
import { newId, now } from '../../workspace/create';
import type { CardSession, Workspace } from '../../workspace/schema';
import { $workspace, updateWorkspace } from '../../workspace/store';
import { useWorkspace } from '../../workspace/useWorkspace';
import { PrintableTextarea } from '../shared/PrintableTextarea';
import { CardView } from './CardView';

type View = { mode: 'setup'; deck?: SessionDeckId } | { mode: 'run'; id: string } | { mode: 'summary'; id: string };

const isSessionDeck = (value: string | null): value is SessionDeckId =>
  (SESSION_DECKS as readonly string[]).includes(value ?? '');

function initialView(workspace: Workspace): View {
  const params = new URLSearchParams(window.location.search);
  const open = (session: CardSession): View =>
    session.endedAt ? { mode: 'summary', id: session.id } : { mode: 'run', id: session.id };
  const requested = workspace.cards.sessions.find((session) => session.id === params.get('session'));
  if (requested) return open(requested);
  const deck = params.get('deck');
  if (isSessionDeck(deck)) {
    // Asking for a deck that already has an unfinished session picks that session up again.
    const unfinished = workspace.cards.sessions.find((session) => session.deck === deck && !session.endedAt);
    return unfinished ? open(unfinished) : { mode: 'setup', deck };
  }
  const active = workspace.cards.sessions.find((session) => session.id === workspace.cards.activeSessionId);
  return active && !active.endedAt ? open(active) : { mode: 'setup' };
}

function patchSession(id: string, change: (session: CardSession) => void) {
  updateWorkspace((draft) => {
    const session = draft.cards.sessions.find((item) => item.id === id);
    if (session) change(session);
  });
}

const countNotes = (session: CardSession) =>
  Object.values(session.notes).filter((note) => note.text.trim() !== '').length;

/** What the group saved in the phase's tool since the session began. */
function madeDuring(session: CardSession, workspace: Workspace): string[] {
  const since = session.startedAt;
  if (session.deck === 'p1') {
    return workspace.profile.scenarios.filter((item) => item.createdAt >= since).map((item) => item.name);
  }
  if (session.deck === 'p2') return workspace.sites.filter((item) => item.createdAt >= since).map((item) => item.name);
  if (session.deck === 'p3') {
    return workspace.business.canvases.filter((item) => item.updatedAt >= since).map((item) => item.name);
  }
  return [];
}

export default function SessionApp({ locale }: { locale: Locale }) {
  const s = getStrings(locale);
  const workspace = useWorkspace();
  const [view, setView] = useState<View>(() => initialView($workspace.get()));
  const session = view.mode === 'setup' ? undefined : workspace.cards.sessions.find((item) => item.id === view.id);

  const openSession = (item: CardSession) => {
    updateWorkspace((draft) => {
      draft.cards.activeSessionId = item.id;
    });
    setView(item.endedAt ? { mode: 'summary', id: item.id } : { mode: 'run', id: item.id });
  };

  if (!session) {
    return <Setup locale={locale} s={s} workspace={workspace} deck={view.mode === 'setup' ? view.deck : undefined} onOpen={openSession} />;
  }
  if (view.mode === 'summary' || session.endedAt) {
    return (
      <Summary
        locale={locale}
        s={s}
        session={session}
        workspace={workspace}
        onReopen={() => {
          patchSession(session.id, (item) => {
            delete item.endedAt;
          });
          setView({ mode: 'run', id: session.id });
        }}
        onNew={() => setView({ mode: 'setup' })}
      />
    );
  }
  return (
    <Runner
      locale={locale}
      s={s}
      session={session}
      workspace={workspace}
      onFinish={() => {
        patchSession(session.id, (item) => {
          item.endedAt = now();
        });
        setView({ mode: 'summary', id: session.id });
      }}
      onLeave={() => setView({ mode: 'setup' })}
    />
  );
}

interface SetupProps {
  locale: Locale;
  s: Strings;
  workspace: Workspace;
  deck?: SessionDeckId;
  onOpen: (session: CardSession) => void;
}

function Setup({ locale, s, workspace, deck: initialDeck, onOpen }: SetupProps) {
  const t = s.wattworks.session;
  const formId = useId();
  const [deck, setDeck] = useState<SessionDeckId>(initialDeck ?? 'p1');
  const defaultTitle = (id: SessionDeckId) => `${s.decks[id]} – ${formatDate(locale, now())}`;
  const [title, setTitle] = useState('');
  const [confirming, setConfirming] = useState<string | null>(null);

  const begin = () => {
    const cards = cardsOfDeck(deck);
    const session: CardSession = {
      id: newId(),
      title: title.trim() || defaultTitle(deck),
      deck,
      startedAt: now(),
      cursor: cards[0].id,
      notes: {},
    };
    updateWorkspace((draft) => {
      draft.cards.sessions.push(session);
      draft.cards.activeSessionId = session.id;
    });
    onOpen(session);
  };

  const sessions = [...workspace.cards.sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt));

  return (
    <div className="split session-setup">
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault();
          begin();
        }}
      >
        <h2>{t.setupTitle}</h2>
        <p>{t.setupLead}</p>
        <fieldset className="deck-choices">
          <legend>{t.chooseDeck}</legend>
          {SESSION_DECKS.map((id) => (
            <label key={id} className="choice deck-choice" data-phase={id}>
              <input type="radio" name={`${formId}-deck`} checked={deck === id} onChange={() => setDeck(id)} />
              <span>
                <strong>{s.decks[id]}</strong>
                <br />
                <span className="small muted">{fill(s.common.cards, { n: cardsOfDeck(id).length })}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <div className="field">
          <label htmlFor={`${formId}-title`}>
            {t.name} <span className="muted small">({s.common.optional})</span>
          </label>
          <input
            id={`${formId}-title`}
            className="input"
            value={title}
            placeholder={defaultTitle(deck)}
            onChange={(event) => setTitle(event.target.value)}
            aria-describedby={`${formId}-title-hint`}
          />
          <span id={`${formId}-title-hint`} className="hint">
            {t.nameHint}
          </span>
        </div>
        <div>
          <button type="submit" className="btn btn--primary">
            {t.begin}
          </button>
        </div>
      </form>

      <section className="stack" aria-labelledby={`${formId}-previous`}>
        <h2 id={`${formId}-previous`}>{t.previousSessions}</h2>
        {sessions.length === 0 && <p className="muted">{s.common.none}</p>}
        <ul className="stack" style={{ listStyle: 'none', padding: 0 }}>
          {sessions.map((item) => (
            <li key={item.id} className="panel panel--flat stack" data-phase={item.deck}>
              <div>
                <strong>{item.title}</strong>
                <br />
                <span className="small muted">
                  {item.endedAt
                    ? fill(t.finished, { date: formatDate(locale, item.endedAt) })
                    : `${t.inProgress} · ${fill(t.started, { date: formatDate(locale, item.startedAt) })}`}
                  {' · '}
                  {fill(t.notesCount, { n: countNotes(item) })}
                </span>
              </div>
              {confirming === item.id ? (
                <div className="cluster" role="group" aria-label={t.deleteConfirm}>
                  <span>{t.deleteConfirm}</span>
                  <button
                    type="button"
                    className="btn btn--small btn--danger"
                    onClick={() => {
                      updateWorkspace((draft) => {
                        draft.cards.sessions = draft.cards.sessions.filter((other) => other.id !== item.id);
                        if (draft.cards.activeSessionId === item.id) delete draft.cards.activeSessionId;
                      });
                      setConfirming(null);
                    }}
                  >
                    {t.confirmDelete}
                  </button>
                  <button type="button" className="btn btn--small" onClick={() => setConfirming(null)}>
                    {s.common.cancel}
                  </button>
                </div>
              ) : (
                <div className="cluster">
                  <button type="button" className="btn btn--small btn--primary" onClick={() => onOpen(item)}>
                    {item.endedAt ? t.view : t.resume}
                  </button>
                  <button type="button" className="btn btn--small" onClick={() => setConfirming(item.id)}>
                    {t.deleteSession}
                    <span className="visually-hidden">: {item.title}</span>
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

interface RunnerProps {
  locale: Locale;
  s: Strings;
  session: CardSession;
  workspace: Workspace;
  onFinish: () => void;
  onLeave: () => void;
}

function Runner({ locale, s, session, workspace, onFinish, onLeave }: RunnerProps) {
  const t = s.wattworks.session;
  const fieldId = useId();
  const cards = cardsOfDeck(session.deck);
  const index = Math.max(0, cards.findIndex((card) => card.id === session.cursor));
  const card = cards[index];
  const note = session.notes[card.id];
  const [presenting, setPresenting] = useState(false);
  const phase = PHASES.find((item) => item.id === session.deck);
  const made = card.kind === 'tool' ? madeDuring(session, workspace) : [];

  const goTo = (target: number) => {
    if (target < 0 || target >= cards.length) return;
    patchSession(session.id, (item) => {
      item.cursor = cards[target].id;
    });
  };

  useEffect(() => {
    document.body.classList.toggle('presenting', presenting);
    return () => document.body.classList.remove('presenting');
  }, [presenting]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      if (event.key === 'ArrowRight') goTo(index + 1);
      if (event.key === 'ArrowLeft') goTo(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const setNote = (text: string) =>
    patchSession(session.id, (item) => {
      item.notes[card.id] = { ...item.notes[card.id], text };
    });
  const toggleSkip = () =>
    patchSession(session.id, (item) => {
      const current = item.notes[card.id] ?? { text: '' };
      item.notes[card.id] = { ...current, skipped: !current.skipped };
    });

  return (
    <div className="session" data-phase={session.deck}>
      <div className="session__bar no-print">
        <div>
          <strong>{session.title}</strong>
          <br />
          <span className="small" aria-live="polite">
            {fill(t.cardOf, { n: index + 1, total: cards.length })}
          </span>
        </div>
        <progress max={cards.length} value={index + 1} aria-label={fill(t.cardOf, { n: index + 1, total: cards.length })} />
        <div className="cluster">
          <button type="button" className="btn btn--small" aria-pressed={presenting} onClick={() => setPresenting(!presenting)}>
            {presenting ? t.exitPresent : t.present}
          </button>
          <button type="button" className="btn btn--small" onClick={onLeave}>
            {t.previousSessions}
          </button>
        </div>
      </div>

      <div className={presenting ? 'session__stage session__stage--present' : 'session__stage'}>
        <div className="stack">
          <div className="theme-light session__card">
            <CardView card={card} s={s} large />
          </div>
          {card.kind === 'tool' && card.toolId && (
            <div className="panel panel--soft stack">
              <a className="btn btn--primary" href={href(locale, TOOL_PATHS[card.toolId])}>
                {fill(t.applyTool, { tool: s.tools[card.toolId].name })}
              </a>
              <p className="small">{t.toolHint}</p>
              <div>
                <strong>{t.madeHere}</strong>
                {made.length === 0 ? (
                  <p className="small muted">{t.madeNothing}</p>
                ) : (
                  <ul>
                    {made.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          {card.methodologyId && (
            <p>
              <a href={getResource('drive-methodologies').external} target="_blank" rel="noopener noreferrer">
                {t.methodology}
              </a>{' '}
              <span className="small muted">({s.common.newTab})</span>
            </p>
          )}
          <div className="cluster session__nav">
            <button type="button" className="btn" onClick={() => goTo(index - 1)} disabled={index === 0}>
              ← {s.common.previous}
            </button>
            {index < cards.length - 1 ? (
              <button type="button" className="btn btn--primary" onClick={() => goTo(index + 1)}>
                {s.common.next} →
              </button>
            ) : (
              <button type="button" className="btn btn--primary" onClick={onFinish}>
                {t.finish}
              </button>
            )}
          </div>
        </div>

        {!presenting && (
          <div className="stack">
            <div className="field">
              <label htmlFor={`${fieldId}-note`}>{t.notesLabel}</label>
              <textarea
                id={`${fieldId}-note`}
                className="textarea session__note"
                value={note?.text ?? ''}
                onChange={(event) => setNote(event.target.value)}
                aria-describedby={`${fieldId}-note-hint`}
              />
              <span id={`${fieldId}-note-hint`} className="hint">
                {t.notesHint}
              </span>
            </div>
            <div className="cluster">
              <button type="button" className="btn btn--small" aria-pressed={Boolean(note?.skipped)} onClick={toggleSkip}>
                {note?.skipped ? t.unskip : t.skip}
              </button>
              {index < cards.length - 1 && (
                <button type="button" className="btn btn--small" onClick={onFinish}>
                  {t.finish}
                </button>
              )}
            </div>
            <details className="disclosure">
              <summary>{t.overview}</summary>
              <ol className="disclosure__body session__overview">
                {cards.map((item, position) => {
                  const itemNote = session.notes[item.id];
                  const state = [
                    position === index && t.current,
                    itemNote?.text.trim() && t.hasNote,
                    itemNote?.skipped && t.skipped,
                  ].filter(Boolean);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="session__jump"
                        aria-current={position === index ? 'step' : undefined}
                        onClick={() => goTo(position)}
                      >
                        <span>
                          {item.number !== null ? `${item.number}. ` : ''}
                          {s.cardCategories[item.category]}
                        </span>
                        {state.length > 0 && <span className="small muted"> — {state.join(', ')}</span>}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </details>
            {phase && (
              <p className="small">
                <a href={href(locale, `journey/${phase.slug}`)}>
                  {fill(s.common.phase, { n: phase.order })} – {s.phases[phase.id].name}
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface SummaryProps {
  locale: Locale;
  s: Strings;
  session: CardSession;
  workspace: Workspace;
  onReopen: () => void;
  onNew: () => void;
}

function Summary({ locale, s, session, workspace, onReopen, onNew }: SummaryProps) {
  const t = s.wattworks.session;
  const fieldId = useId();
  const cards = cardsOfDeck(session.deck);
  const phase = PHASES.find((item) => item.id === session.deck);
  const next = phase && PHASES.find((item) => item.order === phase.order + 1);
  const made = madeDuring(session, workspace);

  return (
    <div className="stack-lg" data-phase={session.deck}>
      <div className="stack">
        <h2>
          {t.summaryTitle}: {session.title}
        </h2>
        <p className="muted">
          {fill(t.started, { date: formatDate(locale, session.startedAt) })}
          {session.endedAt ? ` · ${fill(t.finished, { date: formatDate(locale, session.endedAt) })}` : ''}
          {workspace.community.name ? ` · ${workspace.community.name}` : ''}
        </p>
        <div className="cluster no-print">
          <button type="button" className="btn btn--primary" onClick={() => window.print()}>
            {t.printSummary}
          </button>
          <button type="button" className="btn" onClick={onReopen}>
            {t.reopen}
          </button>
          <button type="button" className="btn" onClick={onNew}>
            {t.newSession}
          </button>
          {next && (
            <a className="btn" href={href(locale, `journey/${next.slug}`)}>
              {fill(s.journey.nextPhase, { n: next.order, name: s.phases[next.id].name })}
            </a>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor={`${fieldId}-summary`}>{t.overall}</label>
        <PrintableTextarea
          id={`${fieldId}-summary`}
          className="textarea"
          value={session.summary ?? ''}
          onChange={(event) =>
            patchSession(session.id, (item) => {
              item.summary = event.target.value;
            })
          }
          aria-describedby={`${fieldId}-summary-hint`}
        />
        <span id={`${fieldId}-summary-hint`} className="hint no-print">
          {t.overallHint}
        </span>
      </div>

      {made.length > 0 && (
        <div className="panel panel--soft">
          <strong>{t.madeHere}</strong>
          <ul>
            {made.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      )}

      <ol className="session__summary">
        {cards
          .filter((card) => card.kind !== 'info')
          .map((card) => {
            const note = session.notes[card.id];
            return (
              <li key={card.id} className="keep-together">
                <p className="session__summary-card">
                  <span className="badge">
                    {s.cardCategories[card.category]}
                    {card.number !== null ? ` ${card.number}` : ''}
                  </span>{' '}
                  {s.cards[card.id].lines.join(' ')}
                </p>
                <p className={note?.text.trim() ? 'session__summary-note' : 'session__summary-note muted'}>
                  {note?.skipped ? `${t.skipped}. ` : ''}
                  {note?.text.trim() || (note?.skipped ? '' : t.noNote)}
                </p>
              </li>
            );
          })}
      </ol>
      <p className="small muted no-print">
        {t.endedNote} <a href={href(locale, 'my-community')}>{t.toCommunity}</a>
      </p>
    </div>
  );
}
