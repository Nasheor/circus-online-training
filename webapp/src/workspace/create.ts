import { emptyInputs } from '../engine/energy-profile/assumptions';
import { APP_ID, SCHEMA_VERSION } from './schema';
import type { Workspace } from './schema';

export function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const now = () => new Date().toISOString();

export function createWorkspace(): Workspace {
  const timestamp = now();
  return {
    app: APP_ID,
    schemaVersion: SCHEMA_VERSION,
    id: newId(),
    createdAt: timestamp,
    updatedAt: timestamp,
    community: { name: '', place: '', notes: '' },
    journey: { phases: { p1: { done: false }, p2: { done: false }, p3: { done: false } } },
    profile: { current: { inputs: emptyInputs(), assumptionOverrides: {} }, scenarios: [] },
    cards: { sessions: [] },
    sites: [],
    business: { activities: {}, canvases: [], dataChecklist: {}, goFurther: {}, planNotes: '' },
  };
}

/** True when nothing has been entered yet, so there is nothing worth exporting or protecting. */
export function isPristine(workspace: Workspace): boolean {
  const { community, journey, profile, cards, sites, business } = workspace;
  const profileTouched =
    profile.scenarios.length > 0 ||
    Object.keys(profile.current.assumptionOverrides).length > 0 ||
    JSON.stringify(profile.current.inputs) !== JSON.stringify(emptyInputs());
  return (
    !community.name && !community.place && !community.notes &&
    !journey.selfCheck && !Object.values(journey.phases).some((phase) => phase.done) &&
    !profileTouched &&
    cards.sessions.length === 0 &&
    sites.length === 0 &&
    Object.keys(business.activities).length === 0 &&
    business.canvases.length === 0 &&
    Object.keys(business.dataChecklist).length === 0 &&
    Object.keys(business.goFurther).length === 0 &&
    !business.planNotes
  );
}
