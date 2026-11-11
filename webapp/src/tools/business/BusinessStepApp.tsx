import { useId } from 'react';
import type { BusinessStep } from '../../content/business';
import type { Locale } from '../../i18n/config';
import { fill } from '../../i18n/format';
import { getStrings } from '../../i18n/strings';
import type { Strings } from '../../i18n/strings';
import type { Workspace } from '../../workspace/schema';
import { updateWorkspace } from '../../workspace/store';
import { useWorkspace } from '../../workspace/useWorkspace';
import { ResourceA } from '../shared/ResourceA';
import { ActivityExplorer } from './ActivityExplorer';
import { BusinessContext } from './BusinessContext';
import { CanvasBoard } from './CanvasBoard';
import { DATA_ITEM_COUNT, DataChecklist, GoFurther, countCollected } from './Checklists';

/** Step 04: guidance and the partner documents. Deliberately no calculation - see the "Build your own" text. */
function BuildUp({ s, workspace }: { s: Strings; workspace: Workspace }) {
  const t = s.business.build;
  const id = useId();
  return (
    <div className="stack-lg">
      <div className="split">
        <div className="build-own stack">
          <h2>{t.ownTitle}</h2>
          {t.own.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="small muted">{t.why}</p>
        </div>
        <div className="stack">
          {t.resources.map((resource) => (
            <div key={resource.id} className="build-link">
              <h2 style={{ fontSize: 'var(--text-lg)' }}>{resource.title}</h2>
              <p>{resource.text}</p>
              <p>
                <ResourceA id={resource.id} label={resource.title} s={s} />
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="notice">
        <h2 style={{ fontSize: 'var(--text-lg)' }}>{t.progressTitle}</h2>
        <p>{t.progress}</p>
      </div>
      <p className="small muted">{fill(t.dataReady, { done: countCollected(workspace), total: DATA_ITEM_COUNT })}</p>
      <div className="field">
        <label htmlFor={`${id}-notes`}>{t.notesLabel}</label>
        <textarea
          id={`${id}-notes`}
          className="textarea"
          value={workspace.business.planNotes}
          aria-describedby={`${id}-notes-hint`}
          onChange={(event) =>
            updateWorkspace((draft) => {
              draft.business.planNotes = event.target.value;
            })
          }
        />
        <span id={`${id}-notes-hint`} className="hint">
          {t.notesHint}
        </span>
      </div>
    </div>
  );
}

/** One island for all five steps of the Business Model Tool; the page chooses the step. */
export default function BusinessStepApp({ locale, step }: { locale: Locale; step: BusinessStep }) {
  const s = getStrings(locale);
  const workspace = useWorkspace();
  switch (step) {
    case 'explore':
      return (
        <div className="split split--aside">
          <ActivityExplorer s={s} workspace={workspace} />
          <BusinessContext locale={locale} s={s} workspace={workspace} />
        </div>
      );
    case 'draw':
      return <CanvasBoard s={s} workspace={workspace} />;
    case 'collect':
      return <DataChecklist s={s} workspace={workspace} />;
    case 'build':
      return <BuildUp s={s} workspace={workspace} />;
    case 'go-further':
      return <GoFurther locale={locale} s={s} workspace={workspace} />;
  }
}
