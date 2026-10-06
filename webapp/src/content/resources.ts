/**
 * The single list of every file and partner-hosted resource the app points to.
 * `local` is a path under public/ (copied in by scripts/copy-originals.mjs);
 * `external` is where the partner hosts it. When both exist the local copy is
 * used, so bundling a partner file later means adding one `local` line here.
 */

export type ResourceRights =
  /** Produced by the CIRCUS consortium. */
  | 'consortium'
  /** Hosted by a partner; reuse rights not yet confirmed. */
  | 'unconfirmed';

export interface Resource {
  id: string;
  kind: 'file' | 'folder' | 'map' | 'page';
  format?: 'pdf' | 'xlsx';
  local?: string;
  external?: string;
  /** Partner that holds or hosts the resource. */
  holder: string;
  rights: ResourceRights;
}

const NUAGE = 'https://nuage.recitpdl.fr/s/';
const DRIVE = 'https://drive.google.com/drive/folders/';
const QGIS = 'https://qgiscloud.com/KIT_ITAS_Bioeconomy/';
const SITE = 'https://circus.nweurope.eu/';

const local = (id: string, format: 'pdf' | 'xlsx', holder: string): Resource => ({
  id, kind: 'file', format, local: `downloads/${id}.${format}`, holder, rights: 'consortium',
});
const nuage = (id: string, share: string): Resource => ({
  id, kind: 'folder', external: NUAGE + share, holder: 'RECIT / EPV', rights: 'unconfirmed',
});
const map = (id: string, path: string): Resource => ({
  id, kind: 'map', external: QGIS + path, holder: 'KIT', rights: 'unconfirmed',
});

export const RESOURCES: readonly Resource[] = [
  // Originals shipped with the app.
  local('energy-profile-tool-1a-v1.03', 'xlsx', 'LochemEnergie'),
  local('manual-wattworks', 'pdf', 'Landelijke Gilden'),
  local('manual-energy-profile-tool', 'pdf', 'LochemEnergie'),
  local('manual-gis-tool', 'pdf', 'KIT'),
  local('manual-business-tool', 'pdf', 'EPV'),
  local('cards-intro-outro', 'pdf', 'Landelijke Gilden'),
  local('cards-phase-1-awareness', 'pdf', 'Landelijke Gilden'),
  local('cards-phase-2-exploring', 'pdf', 'Landelijke Gilden'),
  local('cards-phase-3-collaboration', 'pdf', 'Landelijke Gilden'),
  local('business-tool', 'pdf', 'EPV'),

  // Partner-hosted folders on the project website.
  { id: 'drive-energy-profile', kind: 'folder', external: DRIVE + '1uK-1V97qiGyGybryDRrrurUTlShIuegB', holder: 'LochemEnergie', rights: 'unconfirmed' },
  { id: 'drive-business-tool', kind: 'folder', external: DRIVE + '16nc2QozZhPwaKtd5ZAc8Rz57IvWDN29G', holder: 'EPV', rights: 'unconfirmed' },
  { id: 'drive-wattworks', kind: 'folder', external: DRIVE + '14wa8BAJfyQP4Rrtnf1I4IYSM-308GyIz', holder: 'Landelijke Gilden', rights: 'unconfirmed' },
  { id: 'drive-methodologies', kind: 'folder', external: DRIVE + '1a1S9ImKXAT5XQhKh4NRjPzp8RElulOHF', holder: 'Landelijke Gilden', rights: 'unconfirmed' },
  { id: 'circus-website', kind: 'page', external: SITE, holder: 'Landelijke Gilden', rights: 'consortium' },
  { id: 'circus-website-tools', kind: 'page', external: SITE + 'tools', holder: 'Landelijke Gilden', rights: 'consortium' },
  { id: 'circus-website-contact', kind: 'page', external: SITE + 'contactus', holder: 'Landelijke Gilden', rights: 'consortium' },

  // Tool 2: the six pilot-region maps.
  map('map-fr', 'France_GMPV_Agri-PV/'),
  map('map-be', 'BelgiumQGIS_Cloud/'),
  map('map-nl-altena', 'Altena_SuitabilityCloud/'),
  map('map-ie', 'Irland_WebCQ/'),
  map('map-de-emmendingen', 'Emmendingen_WebCQ/'),
  map('map-de-bad-bergzabern', 'BadBergzabern_QGISCloud/'),

  // Tool 3: documents behind the clickable PDF.
  nuage('feedback-flexibility', 'F7sdMBGr9ZRgEpi'),
  nuage('feedback-heat-saving', 'LdcdmsgSJRD85xi'),
  nuage('feedback-biomass', 'FMkzr6Jkip23oJj'),
  nuage('feedback-solar-heat', '22RNjAfDGJmQ4gE'),
  nuage('feedback-geothermy', 'kSLQQQiqt3aAYqt'),
  nuage('feedback-wind', 'f6nP9s7fA3FnNgd'),
  nuage('feedback-rooftop-solar', 'GmMZ2WQC4TKt6Rp'),
  nuage('feedback-solar-shade', 'qRrXcXTeW8qzCWW'),
  nuage('feedback-ground-mounted', 'PFeEG3EYWZKMEJb'),
  nuage('business-disclaimer', '6SKeTr5NqmPcdXq'),
  nuage('data-template-by-activity', 'RL2pdKLyobXmbY5'),
  nuage('data-template', 'pf9t8BeykXCFsN4'),
  nuage('support-mechanisms', 'iBYmsGTcc4wcYGi'),
  nuage('business-plan-step-by-step', 'TgrKEzRXYbYGi2i'),
  nuage('business-plan-examples', 'x536x2YdoKFtDQy'),
  nuage('additional-benefits', '2AkNPiktrSxnEmi'),
  nuage('legal-entity', 'azYgPYRa88KjpyR'),
  nuage('risk-analysis', 'kqesF7S4qCPj5sY'),
];

const BY_ID = new Map(RESOURCES.map((resource) => [resource.id, resource]));

export type ResourceId = string;

export function getResource(id: ResourceId): Resource {
  const resource = BY_ID.get(id);
  if (!resource) throw new Error(`Unknown resource "${id}" - add it to src/content/resources.ts`);
  return resource;
}

/** Where a resource should be opened from: the bundled copy when there is one, else the partner's link. */
export function resourceTarget(resource: Resource): { path: string; isLocal: boolean } {
  return resource.local
    ? { path: resource.local, isLocal: true }
    : { path: resource.external ?? '', isLocal: false };
}
