/**
 * The six pilot-region maps of the GIS Tool (Tool 2), hosted by KIT on QGIS Cloud.
 * Layer names are exactly as they appear in each map's layer list (read from the
 * maps' public themes.json on 2026-10-06). `kind` only groups layers whose
 * meaning is clear from the tool manual; anything else is 'other' and is shown
 * by name without an explanation.
 */
export type LayerKind = 'ground-pv' | 'agri-pv' | 'rooftop' | 'existing' | 'other';

export interface RegionLayer {
  name: string;
  kind: LayerKind;
}

export interface Region {
  id: string;
  /** Id of the map in src/content/resources.ts. */
  resourceId: string;
  /** Whether the map has feedback layers that visitors can draw on (entries go to KIT). */
  hasFeedback: boolean;
  layers: RegionLayer[];
}

export const REGIONS: readonly Region[] = [
  {
    id: 'fr',
    resourceId: 'map-fr',
    hasFeedback: true,
    layers: [
      { name: 'GM-PV', kind: 'ground-pv' },
      { name: 'AGRI-PV', kind: 'agri-pv' },
      { name: 'Rooftop_PV_Potential_KWp', kind: 'rooftop' },
      { name: 'France_Solar_Potential_Law2023-175', kind: 'other' },
    ],
  },
  {
    id: 'be',
    resourceId: 'map-be',
    hasFeedback: true,
    layers: [
      { name: 'GM-PV', kind: 'ground-pv' },
      { name: 'Agri-PV', kind: 'agri-pv' },
      { name: 'Rooftop_PV_Potential_KWp', kind: 'rooftop' },
    ],
  },
  {
    id: 'nl-altena',
    resourceId: 'map-nl-altena',
    hasFeedback: true,
    layers: [
      { name: 'Agri-PV_Potentieel', kind: 'agri-pv' },
      { name: 'RoofTop_PV_Potential_KWp', kind: 'rooftop' },
    ],
  },
  {
    id: 'ie',
    resourceId: 'map-ie',
    hasFeedback: true,
    layers: [
      { name: 'AGRI-PV_EC1', kind: 'agri-pv' },
      { name: 'AGRI-PV_EC2', kind: 'agri-pv' },
      { name: 'RoofTopPotential_KWp', kind: 'rooftop' },
      { name: 'Energy Comunities_1', kind: 'other' },
      { name: 'Energy Comunities_2', kind: 'other' },
    ],
  },
  {
    id: 'de-emmendingen',
    resourceId: 'map-de-emmendingen',
    hasFeedback: true,
    layers: [
      { name: 'AGRI-PV', kind: 'agri-pv' },
      { name: 'FF-PV', kind: 'ground-pv' },
      { name: 'FF-PV_TrinkWasseschutzgebitZoneIIB&III', kind: 'other' },
      { name: 'AGRI-PV_TrinkWasseschutzgebitZoneIIB&III', kind: 'other' },
      { name: 'FF-PV-OhneFlorstueck', kind: 'other' },
      { name: 'AGRI-PV-OhneFlorstueck', kind: 'other' },
      { name: 'FF-PV-Ohne_Entfernung_Transformator', kind: 'other' },
      { name: 'AGRI-PV-Ohne_Entfernung_Transformator', kind: 'other' },
      { name: 'Dach_PV_KWp', kind: 'rooftop' },
      { name: 'Shape_Solar_Stand052025_Emmendingen', kind: 'existing' },
    ],
  },
  {
    id: 'de-bad-bergzabern',
    resourceId: 'map-de-bad-bergzabern',
    hasFeedback: false,
    layers: [
      { name: 'APV_greater2_5', kind: 'agri-pv' },
      { name: 'APV_less2_5', kind: 'agri-pv' },
      { name: 'gmpv1_intersect', kind: 'ground-pv' },
      { name: 'gmpv2_intersect', kind: 'ground-pv' },
      { name: 'Flächenwünsche_FFPV_aus_1_OL', kind: 'other' },
      { name: 'Entwurfsflächen_FFPV_1_OL', kind: 'other' },
    ],
  },
];

export const REGION_BY_ID: ReadonlyMap<string, Region> = new Map(REGIONS.map((region) => [region.id, region]));

export const SITE_TECHNOLOGIES = ['ground-pv', 'agri-pv', 'rooftop-pv', 'other'] as const;
