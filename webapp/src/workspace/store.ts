import { atom } from 'nanostores';
import { createWorkspace, now } from './create';
import { loadWorkspace, serializeWorkspace } from './migrate';
import type { LoadFailure } from './migrate';
import type { Workspace } from './schema';

const STORAGE_KEY = 'circus.workspace';
/** Previous workspace, kept when an import or reset replaces it. */
const BACKUP_KEY = 'circus.workspace.backup';
/** Raw content that could not be read, kept so nothing is lost silently. */
const CORRUPT_KEY = 'circus.workspace.unreadable';
const SAVE_DELAY_MS = 300;

export const $workspace = atom<Workspace>(createWorkspace());
/** Set when stored data could not be read and a fresh workspace was started instead. */
export const $loadProblem = atom<LoadFailure | null>(null);
/** False when the browser refuses storage (private mode, blocked site data): work is then kept for this visit only. */
export const $storageAvailable = atom(true);

let started = false;
let saveTimer: ReturnType<typeof setTimeout> | undefined;

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function flush() {
  if (saveTimer === undefined) return;
  clearTimeout(saveTimer);
  saveTimer = undefined;
  try {
    storage()?.setItem(STORAGE_KEY, serializeWorkspace($workspace.get()));
  } catch {
    $storageAvailable.set(false);
  }
}

function scheduleSave() {
  if (saveTimer !== undefined) clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, SAVE_DELAY_MS);
}

/** Load the stored workspace once per page. Safe to call from every island. */
export function startWorkspace() {
  if (started || typeof window === 'undefined') return;
  started = true;
  const store = storage();
  if (!store) {
    $storageAvailable.set(false);
    return;
  }
  const stored = store.getItem(STORAGE_KEY);
  if (stored) {
    const result = loadWorkspace(stored);
    if (result.ok) {
      $workspace.set(result.workspace);
    } else {
      store.setItem(CORRUPT_KEY, stored);
      $loadProblem.set(result.reason);
    }
  }
  // Another tab changed the workspace: follow it.
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    const result = loadWorkspace(event.newValue);
    if (result.ok) $workspace.set(result.workspace);
  });
  // Leaving the page must not lose the last keystrokes.
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}

/** Change the workspace. The mutator receives a private copy it may modify freely. */
export function updateWorkspace(mutate: (draft: Workspace) => void) {
  const draft = structuredClone($workspace.get());
  mutate(draft);
  draft.updatedAt = now();
  $workspace.set(draft);
  scheduleSave();
}

/** Replace the whole workspace (import or reset), keeping the old one as a backup. */
export function replaceWorkspace(next: Workspace) {
  try {
    storage()?.setItem(BACKUP_KEY, serializeWorkspace($workspace.get()));
  } catch {
    $storageAvailable.set(false);
  }
  $workspace.set(next);
  $loadProblem.set(null);
  scheduleSave();
  flush();
}

export function hasBackup(): boolean {
  return Boolean(storage()?.getItem(BACKUP_KEY));
}

/** Swap the current workspace with the backup made by the last import or reset. */
export function restoreBackup(): boolean {
  const backup = storage()?.getItem(BACKUP_KEY);
  if (!backup) return false;
  const result = loadWorkspace(backup);
  if (!result.ok) return false;
  replaceWorkspace(result.workspace);
  return true;
}
