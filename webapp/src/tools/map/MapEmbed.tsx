import { useState } from 'react';
import type { Locale } from '../../i18n/config';
import { fill } from '../../i18n/format';
import { getStrings } from '../../i18n/strings';

interface Props {
  locale: Locale;
  url: string;
  regionName: string;
}

/**
 * The partner-hosted map, loaded only after a click: the QGIS Cloud page sets
 * a cookie and runs its own analytics, which this site otherwise never does.
 */
export default function MapEmbed({ locale, url, regionName }: Props) {
  const s = getStrings(locale);
  const t = s.map.region;
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <div className="map-consent stack">
        <p>{t.embedLead}</p>
        <button type="button" className="btn" onClick={() => setLoaded(true)}>
          {t.embedButton}
        </button>
      </div>
    );
  }
  return (
    <div className="stack">
      <iframe
        className="map-frame"
        src={url}
        title={fill(t.embedFrameTitle, { region: regionName })}
        loading="lazy"
        referrerPolicy="no-referrer"
        allow="geolocation"
      />
      <p className="small cluster">
        <span>
          {t.embedBlank}{' '}
          <a href={url} target="_blank" rel="noopener noreferrer">
            {t.openMap}
          </a>
        </span>
        <button type="button" className="btn btn--small" onClick={() => setLoaded(false)}>
          {t.embedHide}
        </button>
      </p>
    </div>
  );
}
