import { useStore } from '@nanostores/react';
import { $workspace, startWorkspace } from './store';
import type { Workspace } from './schema';

/** The community workspace for React islands (mount them with client:only="react"). */
export function useWorkspace(): Workspace {
  startWorkspace();
  return useStore($workspace);
}
