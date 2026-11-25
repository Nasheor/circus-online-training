import type { SourceKind } from '../engine/energy-profile/countries';

/**
 * Public data behind the Energy Profile's country reference values
 * (page tools/energy-profile/sources). Not partner-hosted, so not in
 * resources.ts. Texts: `profile.sourcesPage.kinds`.
 */
export const DATA_SOURCE_LINKS: Partial<Record<SourceKind, string[]>> = {
  roof: [
    'https://pbl.nl/downloads/pbl-2014-dnv-gl-het-potentieel-van-zonnestroom-in-de-gebouwde-omgeving-van-nederland-01400-0pdf',
    'https://www.milieucentraal.nl/energie-besparen/zonnepanelen/zonnepanelen-hoe-geschikt-is-je-dak/',
  ],
  'eurostat-electricity': [
    'https://ec.europa.eu/eurostat/databrowser/view/nrg_d_hhq/default/table',
    'https://ec.europa.eu/eurostat/databrowser/view/lfst_hhnhtych/default/table',
  ],
  'eurostat-heat': ['https://ec.europa.eu/eurostat/databrowser/view/nrg_d_hhq/default/table'],
  pvgis: ['https://re.jrc.ec.europa.eu/pvg_tools/en/'],
  'degree-days': ['https://ec.europa.eu/eurostat/databrowser/view/nrg_chdd_m/default/table'],
  'wind-monthly': ['https://ec.europa.eu/eurostat/databrowser/view/nrg_cb_pem/default/table'],
};

export const PVGIS_TOOL = 'https://re.jrc.ec.europa.eu/pvg_tools/en/';
