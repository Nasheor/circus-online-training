/**
 * Structure of the Business Model Tool (Tool 3), after the clickable PDF
 * "CIRCUS TOOL 3 EN" (EPV, 2025-10-13). Ids are permanent: saved workspaces
 * refer to them. Texts are in src/content/locales/<locale>/business.ts.
 */

export const BUSINESS_STEPS = ['explore', 'draw', 'collect', 'build', 'go-further'] as const;
export type BusinessStep = (typeof BUSINESS_STEPS)[number];

/**
 * Page 01 of the PDF is a tree of activities. Its four branches carry icons
 * but no names; the group ids below are our reading of those icons.
 * `resource` is the "project feedback" document linked from the node, if any.
 */
export type ActivityGroupId = 'demand' | 'electricity' | 'heat' | 'storage';
export type ActivityId =
  | 'flexibility' | 'awareness' | 'heat-saving'
  | 'wind' | 'rooftop-solar' | 'solar-shade' | 'ground-mounted' | 'hydro'
  | 'biomass' | 'solar-heat' | 'geothermy'
  | 'energy-storing';

export interface Activity {
  id: ActivityId;
  resource?: string;
}

export const ACTIVITY_GROUPS: readonly { id: ActivityGroupId; activities: readonly Activity[] }[] = [
  {
    id: 'demand',
    activities: [
      { id: 'flexibility', resource: 'feedback-flexibility' },
      { id: 'awareness' },
      { id: 'heat-saving', resource: 'feedback-heat-saving' },
    ],
  },
  {
    id: 'electricity',
    activities: [
      { id: 'wind', resource: 'feedback-wind' },
      { id: 'rooftop-solar', resource: 'feedback-rooftop-solar' },
      { id: 'solar-shade', resource: 'feedback-solar-shade' },
      { id: 'ground-mounted', resource: 'feedback-ground-mounted' },
      { id: 'hydro' },
    ],
  },
  {
    id: 'heat',
    activities: [
      { id: 'biomass', resource: 'feedback-biomass' },
      { id: 'solar-heat', resource: 'feedback-solar-heat' },
      { id: 'geothermy', resource: 'feedback-geothermy' },
    ],
  },
  {
    id: 'storage',
    activities: [{ id: 'energy-storing' }],
  },
];

export const ACTIVITIES: readonly Activity[] = ACTIVITY_GROUPS.flatMap((group) => group.activities);

/** The nine blocks of the Business Model Canvas, in reading order of the canvas layout (also the tab order). */
export const CANVAS_BLOCKS = [
  'partners', 'activities', 'resources', 'value', 'relationships', 'channels', 'segments', 'costs', 'revenues',
] as const;
export type CanvasBlockId = (typeof CANVAS_BLOCKS)[number];

/** Page 03: the four kinds of data, each with the examples the PDF names. */
export const DATA_CATEGORIES = [
  { id: 'development', items: ['studies', 'materials', 'grid-connection'] },
  { id: 'operating', items: ['running', 'loans', 'taxes', 'stakeholder-revenue'] },
  { id: 'revenues', items: ['feed-in-tariff', 'tender', 'ppa', 'self-consumption'], resource: 'support-mechanisms' },
  { id: 'other', items: ['development-services', 'buying-groups'] },
] as const;
export type DataCategoryId = (typeof DATA_CATEGORIES)[number]['id'];

/** Page 05. */
export const GO_FURTHER = [
  { id: 'benefits', resource: 'additional-benefits' },
  { id: 'legal', resource: 'legal-entity' },
  { id: 'risk', resource: 'risk-analysis' },
] as const;
export type GoFurtherId = (typeof GO_FURTHER)[number]['id'];
