import { useId } from 'react';
import { DATA_CATEGORIES, GO_FURTHER } from '../../content/business';
import type { Locale } from '../../i18n/config';
import { fill } from '../../i18n/format';
import { href } from '../../i18n/href';
import type { Strings } from '../../i18n/strings';
import type { Checklist, Workspace } from '../../workspace/schema';
import { updateWorkspace } from '../../workspace/store';
import { ResourceA } from '../shared/ResourceA';

type ListKey = 'dataChecklist' | 'goFurther';
type Field = 'value' | 'source' | 'note';

function patchItem(list: ListKey, item: string, change: (entry: Checklist[string]) => void) {
  updateWorkspace((draft) => {
    const entry = draft.business[list][item] ?? { done: false };
    change(entry);
    draft.business[list][item] = entry;
  });
}

export const DATA_ITEM_COUNT = DATA_CATEGORIES.reduce((total, category) => total + category.items.length, 0);
export const countCollected = (workspace: Workspace) =>
  DATA_CATEGORIES.flatMap((category) => category.items as readonly string[]).filter(
    (item) => workspace.business.dataChecklist[item]?.done,
  ).length;

/** Step 03: the four data categories, each item with a tick, the figure and its source. */
export function DataChecklist({ s, workspace }: { s: Strings; workspace: Workspace }) {
  const t = s.business.collect;
  const id = useId();
  const saved = workspace.business.dataChecklist;

  const input = (item: string, field: Field, label: string, name: string) => (
    <div className="field">
      <label htmlFor={`${id}-${item}-${field}`} className="small">
        {label}
        <span className="visually-hidden">: {name}</span>
      </label>
      <input
        id={`${id}-${item}-${field}`}
        className="input"
        value={saved[item]?.[field] ?? ''}
        onChange={(event) =>
          patchItem('dataChecklist', item, (entry) => {
            entry[field] = event.target.value;
          })
        }
      />
    </div>
  );

  return (
    <div className="stack-lg">
      <p className="notice notice--ok" role="status">
        {fill(t.progress, { done: countCollected(workspace), total: DATA_ITEM_COUNT })}
      </p>
      {DATA_CATEGORIES.map((category) => (
        <section key={category.id} className="data-category stack" aria-labelledby={`${id}-${category.id}`}>
          <div>
            <h2 id={`${id}-${category.id}`} style={{ fontSize: 'var(--text-xl)' }}>
              {t.categories[category.id].name}
            </h2>
            <p>{t.categories[category.id].text}</p>
            {'resource' in category && (
              <p className="small">
                <ResourceA id={category.resource} label={t.supportMechanisms} s={s} />
              </p>
            )}
          </div>
          <ul className="checklist">
            {category.items.map((item) => {
              const name = t.items[item];
              return (
                <li key={item}>
                  <label className="cluster" style={{ flexWrap: 'nowrap' }}>
                    <input
                      type="checkbox"
                      checked={saved[item]?.done ?? false}
                      onChange={(event) =>
                        patchItem('dataChecklist', item, (entry) => {
                          entry.done = event.target.checked;
                        })
                      }
                    />
                    <strong>{name}</strong>
                    <span className="visually-hidden"> – {t.have}</span>
                  </label>
                  <div className="checklist__fields">
                    {input(item, 'value', t.value, name)}
                    {input(item, 'source', t.source, name)}
                    {input(item, 'note', t.note, name)}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <p className="small muted">{t.examplesNote}</p>
      <p>
        <ResourceA id="data-template" label={t.template} s={s} className="btn" />
      </p>
    </div>
  );
}

/** Step 05: additional benefits, legal entity, risk analysis. */
export function GoFurther({ locale, s, workspace }: { locale: Locale; s: Strings; workspace: Workspace }) {
  const t = s.business.goFurther;
  const id = useId();
  const saved = workspace.business.goFurther;

  return (
    <div className="stack-lg">
      <div className="further-grid">
        {GO_FURTHER.map((item) => {
          const text = t.items[item.id];
          return (
            <section key={item.id} className="further stack" aria-labelledby={`${id}-${item.id}`}>
              <h2 id={`${id}-${item.id}`} style={{ fontSize: 'var(--text-xl)' }}>
                {text.name}
              </h2>
              <p>{text.text}</p>
              <p>
                <ResourceA id={item.resource} label={text.link} s={s} />
              </p>
              <label className="choice">
                <input
                  type="checkbox"
                  checked={saved[item.id]?.done ?? false}
                  onChange={(event) =>
                    patchItem('goFurther', item.id, (entry) => {
                      entry.done = event.target.checked;
                    })
                  }
                />
                <span>{t.done}</span>
              </label>
              <div className="field">
                <label htmlFor={`${id}-${item.id}-note`}>
                  {t.note}
                  <span className="visually-hidden">: {text.name}</span>
                </label>
                <textarea
                  id={`${id}-${item.id}-note`}
                  className="textarea"
                  value={saved[item.id]?.note ?? ''}
                  onChange={(event) =>
                    patchItem('goFurther', item.id, (entry) => {
                      entry.note = event.target.value;
                    })
                  }
                />
              </div>
            </section>
          );
        })}
      </div>
      <p className="notice">
        {t.cardsHint} <a href={href(locale, 'tools/cards/session', '?deck=p3')}>{t.cardsLink}</a>
      </p>
    </div>
  );
}
