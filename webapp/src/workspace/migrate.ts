import { APP_ID, SCHEMA_VERSION, workspaceSchema } from './schema';
import type { Workspace } from './schema';

/**
 * One step per schema version: MIGRATIONS[n] turns a version-n document into
 * version n + 1. Add a step whenever SCHEMA_VERSION goes up; never edit old ones.
 */
const MIGRATIONS: Record<number, (document: Record<string, unknown>) => Record<string, unknown>> = {};

export type LoadFailure =
  /** Not valid JSON or not an object. */
  | 'unreadable'
  /** A JSON file, but not a CIRCUS workspace. */
  | 'not-a-workspace'
  /** Saved by a newer version of the app than this one. */
  | 'newer-version'
  /** A workspace whose content does not match its schema. */
  | 'invalid';

export type LoadResult = { ok: true; workspace: Workspace } | { ok: false; reason: LoadFailure };

/** Parse, migrate and validate a stored or imported workspace. Never throws. */
export function loadWorkspace(json: string): LoadResult {
  let document: unknown;
  try {
    document = JSON.parse(json);
  } catch {
    return { ok: false, reason: 'unreadable' };
  }
  if (typeof document !== 'object' || document === null || Array.isArray(document)) {
    return { ok: false, reason: 'unreadable' };
  }
  let current = document as Record<string, unknown>;
  if (current.app !== APP_ID || typeof current.schemaVersion !== 'number') {
    return { ok: false, reason: 'not-a-workspace' };
  }
  if (current.schemaVersion > SCHEMA_VERSION) return { ok: false, reason: 'newer-version' };

  while ((current.schemaVersion as number) < SCHEMA_VERSION) {
    const step = MIGRATIONS[current.schemaVersion as number];
    if (!step) return { ok: false, reason: 'invalid' };
    current = step(current);
  }
  const parsed = workspaceSchema.safeParse(current);
  return parsed.success ? { ok: true, workspace: parsed.data } : { ok: false, reason: 'invalid' };
}

export const serializeWorkspace = (workspace: Workspace): string => JSON.stringify(workspace, null, 2);
