import { describe, expect, it } from 'vitest';
import { createWorkspace, isPristine } from '~/workspace/create';
import { loadWorkspace, serializeWorkspace } from '~/workspace/migrate';
import { APP_ID, SCHEMA_VERSION, workspaceSchema } from '~/workspace/schema';

describe('workspace', () => {
  it('creates a valid, pristine workspace', () => {
    const workspace = createWorkspace();
    expect(workspaceSchema.safeParse(workspace).success).toBe(true);
    expect(isPristine(workspace)).toBe(true);
  });

  it('survives an export / import round trip unchanged', () => {
    const workspace = createWorkspace();
    workspace.community.name = 'Sneem';
    workspace.profile.current.inputs.houses.detached.gas = 40;
    workspace.profile.current.inputs.targets.evShareTarget = 0.5;
    workspace.profile.current.assumptionOverrides['houses.detached.gasM3'] = 2100;
    workspace.sites.push({ id: 's1', name: 'Old quarry', technology: 'ground-pv', createdAt: 'a', updatedAt: 'a' });
    workspace.cards.sessions.push({
      id: 'c1', title: 'First evening', deck: 'p1', startedAt: 'a', cursor: 'p1-3',
      notes: { 'p1-1': { text: 'We want lower bills' }, 'p1-2': { text: '', skipped: true } },
    });
    const result = loadWorkspace(serializeWorkspace(workspace));
    expect(result).toEqual({ ok: true, workspace });
    expect(isPristine(workspace)).toBe(false);
  });

  it('refuses files that are not a workspace', () => {
    expect(loadWorkspace('not json')).toEqual({ ok: false, reason: 'unreadable' });
    expect(loadWorkspace('[1, 2]')).toEqual({ ok: false, reason: 'unreadable' });
    expect(loadWorkspace('{"hello": "world"}')).toEqual({ ok: false, reason: 'not-a-workspace' });
  });

  it('refuses a workspace saved by a newer version of the app', () => {
    const newer = { ...createWorkspace(), schemaVersion: SCHEMA_VERSION + 1 };
    expect(loadWorkspace(JSON.stringify(newer))).toEqual({ ok: false, reason: 'newer-version' });
  });

  it('refuses a workspace with damaged content', () => {
    const damaged = { ...createWorkspace(), sites: 'none' };
    expect(loadWorkspace(JSON.stringify(damaged))).toEqual({ ok: false, reason: 'invalid' });
    const negative = createWorkspace();
    negative.profile.current.inputs.solarPanels = -5;
    expect(loadWorkspace(JSON.stringify(negative))).toEqual({ ok: false, reason: 'invalid' });
    expect(loadWorkspace(JSON.stringify({ app: APP_ID, schemaVersion: 0 }))).toEqual({ ok: false, reason: 'invalid' });
  });
});
