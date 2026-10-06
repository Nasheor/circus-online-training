import { useId } from 'react';
import { ACTIVITIES, ACTIVITY_GROUPS } from '../../content/business';
import type { ActivityId } from '../../content/business';
import { fill } from '../../i18n/format';
import type { Strings } from '../../i18n/strings';
import type { Workspace } from '../../workspace/schema';
import { updateWorkspace } from '../../workspace/store';
import { ResourceA } from '../shared/ResourceA';

const INTERESTS = ['no', 'maybe', 'yes'] as const;
type Interest = (typeof INTERESTS)[number];

/** Step 01: the tree of possible activities, with the group's interest and notes for each. */
export function ActivityExplorer({ s, workspace }: { s: Strings; workspace: Workspace }) {
  const t = s.business.explore;
  const id = useId();
  const saved = workspace.business.activities;

  // An activity with neither an interest nor a note is not stored at all.
  const change = (activity: ActivityId, next: { interest?: Interest | null; note?: string }) =>
    updateWorkspace((draft) => {
      const current = { ...draft.business.activities[activity] };
      if (next.interest === null) delete current.interest;
      else if (next.interest) current.interest = next.interest;
      if (next.note !== undefined) {
        if (next.note) current.note = next.note;
        else delete current.note;
      }
      if (current.interest || current.note) draft.business.activities[activity] = current;
      else delete draft.business.activities[activity];
    });
  const setInterest = (activity: ActivityId, interest: Interest | null) => change(activity, { interest });
  const setNote = (activity: ActivityId, note: string) => change(activity, { note });

  const chosen = ACTIVITIES.filter((activity) => saved[activity.id]?.interest === 'yes')
    .map((activity) => t.activities[activity.id]);

  return (
    <div className="stack-lg">
      <p className="notice notice--ok" role="status">
        {chosen.length > 0 ? fill(t.chosen, { list: chosen.join(', ') }) : t.chosenNone}
      </p>
      {ACTIVITY_GROUPS.map((group) => (
        <section key={group.id} className="activity-group stack" aria-labelledby={`${id}-${group.id}`}>
          <h2 id={`${id}-${group.id}`}>{t.groups[group.id]}</h2>
          <div className="grid grid--wide">
            {group.activities.map((activity) => {
              const name = t.activities[activity.id];
              const state = saved[activity.id];
              const resource = activity.resource;
              return (
                <div key={activity.id} className="panel panel--flat activity">
                  <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>{name}</h3>
                  <fieldset className="segmented">
                    <legend className="visually-hidden">{fill(t.interestLabel, { activity: name })}</legend>
                    <label>
                      <input
                        type="radio"
                        name={`${id}-${activity.id}`}
                        checked={!state?.interest}
                        onChange={() => setInterest(activity.id, null)}
                      />
                      <span>{t.unset}</span>
                    </label>
                    {INTERESTS.map((interest) => (
                      <label key={interest}>
                        <input
                          type="radio"
                          name={`${id}-${activity.id}`}
                          checked={state?.interest === interest}
                          onChange={() => setInterest(activity.id, interest)}
                        />
                        <span>{t.interest[interest]}</span>
                      </label>
                    ))}
                  </fieldset>
                  <div className="field">
                    <label htmlFor={`${id}-${activity.id}-note`} className="small">
                      {t.note}
                      <span className="visually-hidden">: {name}</span>
                    </label>
                    <textarea
                      id={`${id}-${activity.id}-note`}
                      className="textarea"
                      style={{ minHeight: '3.5rem' }}
                      value={state?.note ?? ''}
                      onChange={(event) => setNote(activity.id, event.target.value)}
                    />
                  </div>
                  <p className="small" style={{ margin: 0 }}>
                    {resource ? (
                      <ResourceA id={resource} label={`${t.feedback}: ${name}`} s={s} />
                    ) : (
                      <span className="muted">{t.noFeedback}</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <p className="small">
        <ResourceA id="business-disclaimer" label={s.business.disclaimer} s={s} />
      </p>
    </div>
  );
}
