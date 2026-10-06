import { z } from 'zod';

/**
 * The community workspace: everything a community enters, kept in the browser.
 * It stores inputs and notes only; results are always recomputed. Any change to
 * this shape needs a new SCHEMA_VERSION and a step in migrate.ts.
 */
export const APP_ID = 'circus-method-training';
export const SCHEMA_VERSION = 1;

const text = z.string();
const iso = z.string();
const count = z.number().min(0);
const share = z.number().min(0).max(1);

const homes = z.object({ gas: count, hybrid: count, electric: count });

export const profileInputsSchema = z.object({
  houses: z.object({
    corner: homes,
    between: homes,
    semiDetached: homes,
    detached: homes,
    apartment: homes,
  }),
  carsPerHousehold: count,
  evShare: share,
  solarPanels: count,
  wind: z.array(z.object({ name: text, count, kw: count })),
  targets: z.object({
    reduceElectricity: share,
    reduceHeating: share,
    evShareTarget: share.nullable(),
  }),
});

const profileStateSchema = z.object({
  inputs: profileInputsSchema,
  /** Sparse changes to the reference values, keyed by dotted path. */
  assumptionOverrides: z.record(z.string(), z.number()),
});

export const scenarioSchema = profileStateSchema.extend({
  id: text,
  name: text,
  note: text.optional(),
  createdAt: iso,
  updatedAt: iso,
});

export const cardSessionSchema = z.object({
  id: text,
  title: text,
  deck: z.enum(['p1', 'p2', 'p3', 'boost']),
  startedAt: iso,
  endedAt: iso.optional(),
  /** Card the group is on. */
  cursor: text,
  notes: z.record(
    z.string(),
    z.object({
      text,
      skipped: z.boolean().optional(),
    }),
  ),
  summary: text.optional(),
});

export const siteSchema = z.object({
  id: text,
  name: text,
  regionId: text.optional(),
  technology: z.enum(['ground-pv', 'agri-pv', 'rooftop-pv', 'other']).optional(),
  where: text.optional(),
  why: text.optional(),
  concerns: text.optional(),
  mapLink: text.optional(),
  createdAt: iso,
  updatedAt: iso,
});

export const canvasSchema = z.object({
  id: text,
  name: text,
  /** Text per canvas block id. */
  blocks: z.record(z.string(), z.string()),
  updatedAt: iso,
});

const checklistSchema = z.record(
  z.string(),
  z.object({
    done: z.boolean(),
    value: text.optional(),
    source: text.optional(),
    note: text.optional(),
  }),
);

const phaseStateSchema = z.object({ done: z.boolean() });

export const workspaceSchema = z.object({
  app: z.literal(APP_ID),
  schemaVersion: z.literal(SCHEMA_VERSION),
  id: text,
  createdAt: iso,
  updatedAt: iso,
  lastExportedAt: iso.optional(),
  community: z.object({ name: text, place: text, notes: text }),
  journey: z.object({
    selfCheck: z
      .object({ answers: z.record(z.string(), z.string()), recommended: z.enum(['p1', 'p2', 'p3']), at: iso })
      .optional(),
    phases: z.object({ p1: phaseStateSchema, p2: phaseStateSchema, p3: phaseStateSchema }),
  }),
  profile: z.object({
    /** What is currently in the calculator; saved as you type. */
    current: profileStateSchema,
    /** Named snapshots. */
    scenarios: z.array(scenarioSchema),
    baselineId: text.optional(),
  }),
  cards: z.object({
    sessions: z.array(cardSessionSchema),
    activeSessionId: text.optional(),
  }),
  sites: z.array(siteSchema),
  business: z.object({
    /** Interest per activity id. */
    activities: z.record(
      z.string(),
      z.object({ interest: z.enum(['no', 'maybe', 'yes']).optional(), note: text.optional() }),
    ),
    canvases: z.array(canvasSchema),
    dataChecklist: checklistSchema,
    goFurther: checklistSchema,
    planNotes: text,
  }),
});

export type Workspace = z.infer<typeof workspaceSchema>;
export type ProfileState = z.infer<typeof profileStateSchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type CardSession = z.infer<typeof cardSessionSchema>;
export type CandidateSite = z.infer<typeof siteSchema>;
export type Canvas = z.infer<typeof canvasSchema>;
export type Checklist = z.infer<typeof checklistSchema>;
