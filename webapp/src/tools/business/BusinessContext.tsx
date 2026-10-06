import { resolveAssumptions } from '../../engine/energy-profile/assumptions';
import { compute } from '../../engine/energy-profile/compute';
import type { Locale } from '../../i18n/config';
import { fill, formatMwh, formatNumber, formatPercent } from '../../i18n/format';
import { href } from '../../i18n/href';
import type { Strings } from '../../i18n/strings';
import type { Workspace } from '../../workspace/schema';

/**
 * What the community already produced in phases 1 and 2, shown beside the
 * business model as context. It informs the discussion; it recommends nothing.
 */
export function BusinessContext({ locale, s, workspace }: { locale: Locale; s: Strings; workspace: Workspace }) {
  const t = s.business.context;
  const { inputs, assumptionOverrides } = workspace.profile.current;
  const results = compute(inputs, resolveAssumptions(assumptionOverrides));

  return (
    <aside className="panel panel--soft stack">
      <div>
        <h2 style={{ fontSize: 'var(--text-lg)' }}>{t.title}</h2>
        <p className="small muted">{t.lead}</p>
      </div>
      <div>
        <h3 style={{ fontSize: 'var(--text-base)' }}>{t.profile}</h3>
        {results.households === 0 ? (
          <p className="small muted">{t.profileNone}</p>
        ) : (
          <p className="small">
            {fill(t.profileFacts, {
              homes: formatNumber(locale, results.households),
              usage: formatMwh(locale, results.annual.usageTarget),
              production: formatMwh(locale, results.annual.production),
              coverage: results.coverage === null ? '–' : formatPercent(locale, results.coverage),
            })}
          </p>
        )}
        <p className="small">
          <a href={href(locale, 'tools/energy-profile')}>{t.profileOpen}</a>
        </p>
      </div>
      <div>
        <h3 style={{ fontSize: 'var(--text-base)' }}>{t.sites}</h3>
        {workspace.sites.length === 0 ? (
          <p className="small muted">{t.sitesNone}</p>
        ) : (
          <ul className="small">
            {workspace.sites.map((site) => (
              <li key={site.id}>
                <strong>{site.name}</strong>
                {site.technology ? ` – ${s.map.sites.technologies[site.technology]}` : ''}
              </li>
            ))}
          </ul>
        )}
        <p className="small">
          <a href={href(locale, 'tools/map')}>{t.sitesOpen}</a>
        </p>
      </div>
    </aside>
  );
}
