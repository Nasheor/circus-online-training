import type { ToolId } from './structure';
import { TOOL_PATHS } from './structure';

/** The lessons in their suggested order, with the tool page and manual each belongs to. */
export const LESSONS = [
  { id: 'cards', toolPath: 'tools/cards', manual: 'manual-wattworks', phase: undefined },
  { id: 'energy-profile', toolPath: TOOL_PATHS['energy-profile'], manual: 'manual-energy-profile-tool', phase: 'p1' },
  { id: 'map', toolPath: TOOL_PATHS.map, manual: 'manual-gis-tool', phase: 'p2' },
  { id: 'business-model', toolPath: TOOL_PATHS['business-model'], manual: 'manual-business-tool', phase: 'p3' },
] as const satisfies readonly { id: 'cards' | ToolId; toolPath: string; manual: string; phase?: string }[];

export type LessonId = (typeof LESSONS)[number]['id'];
