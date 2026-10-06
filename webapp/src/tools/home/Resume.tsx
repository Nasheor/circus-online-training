import { HOUSE_TYPES } from '../../engine/energy-profile/types';
import type { Locale } from '../../i18n/config';
import { fill } from '../../i18n/format';
import { href } from '../../i18n/href';
import { getStrings } from '../../i18n/strings';
import { isPristine } from '../../workspace/create';
import { useWorkspace } from '../../workspace/useWorkspace';

/** Home page reminder of what this browser already holds. Renders nothing for a new visitor. */
export default function Resume({ locale }: { locale: Locale }) {
  const s = getStrings(locale);
  const t = s.resume;
  const workspace = useWorkspace();
  if (isPristine(workspace)) return null;

  const houses = workspace.profile.current.inputs.houses;
  const homes = HOUSE_TYPES.reduce(
    (total, type) => total + houses[type].gas + houses[type].hybrid + houses[type].electric,
    0,
  );
  const active = workspace.cards.sessions.find((session) => session.id === workspace.cards.activeSessionId);
  const facts = [
    homes > 0 && fill(t.profile, { n: homes }),
    workspace.profile.scenarios.length > 0 && fill(t.scenarios, { n: workspace.profile.scenarios.length }),
    workspace.cards.sessions.length > 0 && fill(t.sessions, { n: workspace.cards.sessions.length }),
    workspace.sites.length > 0 && fill(t.sites, { n: workspace.sites.length }),
    workspace.business.canvases.length > 0 && fill(t.canvases, { n: workspace.business.canvases.length }),
  ].filter(Boolean) as string[];

  return (
    <section className="section--tight">
      <div className="container">
        <div className="notice notice--ok stack">
          <h2 className="wcard__title">
            {t.title}
            {workspace.community.name ? ` — ${workspace.community.name}` : ''}
          </h2>
          {facts.length > 0 && (
            <ul className="cluster" style={{ listStyle: 'none', padding: 0 }}>
              {facts.map((fact) => (
                <li key={fact} className="badge">
                  {fact}
                </li>
              ))}
            </ul>
          )}
          <div className="cluster">
            {active && !active.endedAt && (
              <a className="btn btn--primary" href={href(locale, 'tools/cards/session')}>
                {t.resumeSession}: {active.title}
              </a>
            )}
            <a className="btn" href={href(locale, 'my-community')}>
              {t.open}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
