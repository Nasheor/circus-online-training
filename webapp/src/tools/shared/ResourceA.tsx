import { getResource, resourceTarget } from '../../content/resources';
import { fill } from '../../i18n/format';
import { asset } from '../../i18n/href';
import type { Strings } from '../../i18n/strings';

/** Link to a resource from the manifest; the React twin of components/ResourceLink.astro. */
export function ResourceA({ id, label, s, className }: { id: string; label: string; s: Strings; className?: string }) {
  const resource = getResource(id);
  const target = resourceTarget(resource);
  if (target.isLocal) {
    return (
      <a className={className} href={asset(target.path)} download>
        {label}
        {resource.format && <span className="small"> ({resource.format.toUpperCase()})</span>}
      </a>
    );
  }
  return (
    <a className={className} href={target.path} target="_blank" rel="noopener noreferrer">
      {label}
      <span className="small" style={{ fontWeight: 400 }}>
        {' '}
        ({fill(s.common.hostedBy, { holder: resource.holder })}, {s.common.newTab})
      </span>
    </a>
  );
}
