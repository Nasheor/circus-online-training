import { useId, useState } from 'react';
import { CANVAS_BLOCKS } from '../../content/business';
import { fill } from '../../i18n/format';
import type { Strings } from '../../i18n/strings';
import { newId, now } from '../../workspace/create';
import type { Canvas, Workspace } from '../../workspace/schema';
import { updateWorkspace } from '../../workspace/store';
import { PrintableTextarea } from '../shared/PrintableTextarea';
import { ResourceA } from '../shared/ResourceA';

/** Step 02: the Business Model Canvas. A community can keep several, for example one per idea. */
export function CanvasBoard({ s, workspace }: { s: Strings; workspace: Workspace }) {
  const t = s.business.draw;
  const id = useId();
  const canvases = workspace.business.canvases;
  const [selectedId, setSelectedId] = useState<string | undefined>(canvases[0]?.id);
  const [confirming, setConfirming] = useState(false);
  const canvas = canvases.find((item) => item.id === selectedId) ?? canvases[0];

  const add = () => {
    const created: Canvas = {
      id: newId(),
      name: fill(t.defaultName, { n: canvases.length + 1 }),
      blocks: {},
      updatedAt: now(),
    };
    updateWorkspace((draft) => {
      draft.business.canvases.push(created);
    });
    setSelectedId(created.id);
  };
  const patch = (change: (canvas: Canvas) => void) =>
    updateWorkspace((draft) => {
      const target = draft.business.canvases.find((item) => item.id === canvas?.id);
      if (!target) return;
      change(target);
      target.updatedAt = now();
    });

  if (!canvas) {
    return (
      <div className="panel panel--soft stack">
        <p>{t.empty}</p>
        <div>
          <button type="button" className="btn btn--primary" onClick={add}>
            {t.start}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <div className="cluster no-print" style={{ alignItems: 'flex-end' }}>
        {canvases.length > 1 && (
          <div className="field">
            <label htmlFor={`${id}-select`}>{t.select}</label>
            <select
              id={`${id}-select`}
              className="select"
              value={canvas.id}
              onChange={(event) => {
                setSelectedId(event.target.value);
                setConfirming(false);
              }}
            >
              {canvases.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="field" style={{ flex: '1 1 14rem' }}>
          <label htmlFor={`${id}-name`}>{t.canvasName}</label>
          <input
            id={`${id}-name`}
            className="input"
            value={canvas.name}
            onChange={(event) =>
              patch((target) => {
                target.name = event.target.value;
              })
            }
          />
        </div>
        <button type="button" className="btn" onClick={add}>
          + {t.add}
        </button>
        <button type="button" className="btn btn--primary" onClick={() => window.print()}>
          {t.print}
        </button>
      </div>
      <p className="small muted no-print">{t.order}</p>

      <div className="print-landscape">
        {/* While a canvas is on the page, the whole printout is one landscape sheet. */}
        <style>{'@media print { @page { size: A4 landscape; margin: 10mm; } }'}</style>
        <p className="print-only canvas-print-title">
          <strong>
            {canvas.name}
            {workspace.community.name ? ` — ${workspace.community.name}` : ''}
          </strong>
        </p>
        <div className="canvas">
          {CANVAS_BLOCKS.map((block) => (
            <div key={block} className={`canvas__block canvas__block--${block}`}>
              <label htmlFor={`${id}-${block}`}>{t.blocks[block].name}</label>
              <span id={`${id}-${block}-hint`} className="hint">
                {t.blocks[block].prompt}
              </span>
              <PrintableTextarea
                id={`${id}-${block}`}
                value={canvas.blocks[block] ?? ''}
                aria-describedby={`${id}-${block}-hint`}
                onChange={(event) =>
                  patch((target) => {
                    target.blocks[block] = event.target.value;
                  })
                }
              />
            </div>
          ))}
        </div>
        <p className="print-only canvas-print-funding">
          {s.business.title} · {s.site.name} · {s.site.fundingLong}
        </p>
      </div>

      <div className="cluster no-print">
        <ResourceA id="data-template-by-activity" label={t.template} s={s} />
        <span className="small muted">{t.printHint}</span>
      </div>
      <div className="no-print">
        {confirming ? (
          <div className="cluster" role="group" aria-label={fill(t.deleteConfirm, { name: canvas.name })}>
            <span>{fill(t.deleteConfirm, { name: canvas.name })}</span>
            <button
              type="button"
              className="btn btn--small btn--danger"
              onClick={() => {
                updateWorkspace((draft) => {
                  draft.business.canvases = draft.business.canvases.filter((item) => item.id !== canvas.id);
                });
                setSelectedId(undefined);
                setConfirming(false);
              }}
            >
              {t.confirmDelete}
            </button>
            <button type="button" className="btn btn--small" onClick={() => setConfirming(false)}>
              {s.common.cancel}
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn--quiet" onClick={() => setConfirming(true)}>
            {t.delete}
          </button>
        )}
      </div>
    </div>
  );
}
