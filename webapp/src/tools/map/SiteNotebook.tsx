import { useId, useState } from 'react';
import { REGIONS, SITE_TECHNOLOGIES } from '../../content/regions';
import type { Locale } from '../../i18n/config';
import { getStrings } from '../../i18n/strings';
import { newId, now } from '../../workspace/create';
import type { CandidateSite } from '../../workspace/schema';
import { updateWorkspace } from '../../workspace/store';
import { useWorkspace } from '../../workspace/useWorkspace';

type Draft = Omit<CandidateSite, 'id' | 'createdAt' | 'updatedAt'>;

const blank = (regionId?: string): Draft => ({ name: '', regionId, where: '', why: '', concerns: '', mapLink: '' });

/** Only http(s) links are ever rendered as links. */
const safeLink = (value?: string) => (value && /^https?:\/\//i.test(value.trim()) ? value.trim() : null);

interface Props {
  locale: Locale;
  /** Preselects the region for new sites and lists that region's sites first. */
  regionId?: string;
}

/** The group's list of candidate sites, kept in the workspace and reused by the Business Model Tool. */
export default function SiteNotebook({ locale, regionId }: Props) {
  const s = getStrings(locale);
  const t = s.map.sites;
  const id = useId();
  const workspace = useWorkspace();
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<Draft>(blank(regionId));
  const [nameError, setNameError] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);

  const sites = [...workspace.sites].sort(
    (a, b) => Number(b.regionId === regionId) - Number(a.regionId === regionId) || a.createdAt.localeCompare(b.createdAt),
  );

  const startNew = () => {
    setDraft(blank(regionId));
    setNameError(false);
    setEditing('new');
  };
  const startEdit = (site: CandidateSite) => {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = site;
    setDraft({ ...blank(), ...rest });
    setNameError(false);
    setEditing(site.id);
  };
  const save = () => {
    if (!draft.name.trim()) return setNameError(true);
    const clean = Object.fromEntries(
      Object.entries(draft).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]),
    ) as Draft;
    updateWorkspace((workspaceDraft) => {
      const timestamp = now();
      if (editing === 'new') {
        workspaceDraft.sites.push({ ...clean, id: newId(), createdAt: timestamp, updatedAt: timestamp });
      } else {
        const index = workspaceDraft.sites.findIndex((site) => site.id === editing);
        if (index >= 0) workspaceDraft.sites[index] = { ...workspaceDraft.sites[index], ...clean, updatedAt: timestamp };
      }
    });
    setEditing(null);
  };

  const textField = (key: 'where' | 'why' | 'concerns', label: string, hint?: string) => (
    <div className="field">
      <label htmlFor={`${id}-${key}`}>{label}</label>
      <textarea
        id={`${id}-${key}`}
        className="textarea"
        style={{ minHeight: '4rem' }}
        value={draft[key] ?? ''}
        onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
        aria-describedby={hint ? `${id}-${key}-hint` : undefined}
      />
      {hint && (
        <span id={`${id}-${key}-hint`} className="hint">
          {hint}
        </span>
      )}
    </div>
  );

  return (
    <section className="stack" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{t.title}</h2>
      <p>{t.lead}</p>

      {sites.length === 0 && editing === null && <p className="muted">{t.empty}</p>}
      <ul className="grid grid--wide" style={{ listStyle: 'none', padding: 0 }}>
        {sites.map((site) => {
          const link = safeLink(site.mapLink);
          const region = site.regionId && site.regionId in s.map.regions
            ? s.map.regions[site.regionId as keyof typeof s.map.regions].name
            : null;
          return (
            <li key={site.id} className="panel panel--flat stack" style={{ maxWidth: 'none', margin: 0 }}>
              <h3 style={{ fontSize: 'var(--text-lg)' }}>{site.name}</h3>
              <p className="cluster small">
                {site.technology && <span className="badge">{t.technologies[site.technology]}</span>}
                {region && <span className="badge">{region}</span>}
              </p>
              <dl className="small" style={{ margin: 0 }}>
                {site.where && (
                  <>
                    <dt><strong>{t.where}</strong></dt>
                    <dd style={{ margin: '0 0 0.5rem', whiteSpace: 'pre-wrap' }}>{site.where}</dd>
                  </>
                )}
                {site.why && (
                  <>
                    <dt><strong>{t.why}</strong></dt>
                    <dd style={{ margin: '0 0 0.5rem', whiteSpace: 'pre-wrap' }}>{site.why}</dd>
                  </>
                )}
                {site.concerns && (
                  <>
                    <dt><strong>{t.concerns}</strong></dt>
                    <dd style={{ margin: '0 0 0.5rem', whiteSpace: 'pre-wrap' }}>{site.concerns}</dd>
                  </>
                )}
              </dl>
              {link && (
                <p className="small">
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {t.openMapLink}
                  </a>{' '}
                  <span className="muted">({s.common.newTab})</span>
                </p>
              )}
              {confirming === site.id ? (
                <div className="cluster no-print" role="group" aria-label={t.deleteConfirm}>
                  <span className="small">{t.deleteConfirm}</span>
                  <button
                    type="button"
                    className="btn btn--small btn--danger"
                    onClick={() => {
                      updateWorkspace((workspaceDraft) => {
                        workspaceDraft.sites = workspaceDraft.sites.filter((item) => item.id !== site.id);
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
                <div className="cluster no-print">
                  <button type="button" className="btn btn--small" onClick={() => startEdit(site)}>
                    {t.edit}
                    <span className="visually-hidden">: {site.name}</span>
                  </button>
                  <button type="button" className="btn btn--small" onClick={() => setConfirming(site.id)}>
                    {t.delete}
                    <span className="visually-hidden">: {site.name}</span>
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {editing === null ? (
        <div className="no-print">
          <button type="button" className="btn btn--primary" onClick={startNew}>
            + {t.add}
          </button>
        </div>
      ) : (
        <form
          className="panel stack no-print"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <h3>{editing === 'new' ? t.addTitle : t.editTitle}</h3>
          <div className="field">
            <label htmlFor={`${id}-name`}>{t.name}</label>
            <input
              id={`${id}-name`}
              className="input"
              value={draft.name}
              autoFocus
              required
              aria-invalid={nameError || undefined}
              aria-describedby={`${id}-name-hint`}
              onChange={(event) => {
                setDraft({ ...draft, name: event.target.value });
                setNameError(false);
              }}
            />
            <span id={`${id}-name-hint`} className={nameError ? 'error' : 'hint'} role={nameError ? 'alert' : undefined}>
              {nameError ? t.nameRequired : t.nameHint}
            </span>
          </div>
          <div className="grid">
            <div className="field">
              <label htmlFor={`${id}-technology`}>{t.technology}</label>
              <select
                id={`${id}-technology`}
                className="select"
                value={draft.technology ?? ''}
                onChange={(event) =>
                  setDraft({ ...draft, technology: (event.target.value || undefined) as Draft['technology'] })
                }
              >
                <option value="">{t.noTechnology}</option>
                {SITE_TECHNOLOGIES.map((technology) => (
                  <option key={technology} value={technology}>
                    {t.technologies[technology]}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor={`${id}-region`}>{t.region}</label>
              <select
                id={`${id}-region`}
                className="select"
                value={draft.regionId ?? ''}
                onChange={(event) => setDraft({ ...draft, regionId: event.target.value || undefined })}
              >
                <option value="">{t.noRegion}</option>
                {REGIONS.map((region) => (
                  <option key={region.id} value={region.id}>
                    {s.map.regions[region.id as keyof typeof s.map.regions].name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {textField('where', t.where, t.whereHint)}
          {textField('why', t.why)}
          {textField('concerns', t.concerns)}
          <div className="field">
            <label htmlFor={`${id}-link`}>
              {t.mapLink} <span className="muted small">({s.common.optional})</span>
            </label>
            <input
              id={`${id}-link`}
              className="input"
              type="url"
              inputMode="url"
              value={draft.mapLink ?? ''}
              onChange={(event) => setDraft({ ...draft, mapLink: event.target.value })}
              aria-describedby={`${id}-link-hint`}
            />
            <span id={`${id}-link-hint`} className="hint">
              {t.mapLinkHint}
            </span>
          </div>
          <div className="cluster">
            <button type="submit" className="btn btn--primary">
              {s.common.save}
            </button>
            <button type="button" className="btn" onClick={() => setEditing(null)}>
              {s.common.cancel}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
