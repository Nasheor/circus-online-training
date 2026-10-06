// Stop hook: blocks the end of a turn when project files changed in this session
// are newer than CONTEXT.md, so the context file is updated with every change.
// Fails open on any error. Disable for one session with CIRCUS_CONTEXT_GUARD=off.
import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WATCH = [
  'webapp/src',
  'webapp/tests',
  'webapp/scripts',
  'webapp/package.json',
  'webapp/astro.config.mjs',
  '.claude/hooks',
  '.claude/settings.json',
  'CLAUDE.md',
];
const SKIP = new Set(['node_modules', 'dist', '.astro', '.git', 'coverage', '__pycache__']);
// exFAT timestamps have 2 s resolution
const TOLERANCE_MS = 2000;

try {
  let input = {};
  try {
    input = JSON.parse(readFileSync(0, 'utf8') || '{}');
  } catch {}
  if (
    input.stop_hook_active === true ||
    input.permission_mode === 'plan' ||
    process.env.CIRCUS_CONTEXT_GUARD === 'off'
  ) {
    process.exit(0);
  }

  const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
  let contextTime;
  try {
    contextTime = statSync(join(root, 'CONTEXT.md')).mtimeMs;
  } catch {
    process.exit(0);
  }
  // Only files touched since this session started count, so a checkout or a
  // manual edit made before the session does not trigger the guard.
  let sessionStart = 0;
  try {
    sessionStart = statSync(input.transcript_path).birthtimeMs || 0;
  } catch {}

  const stale = [];
  const visit = (path) => {
    let stat;
    try {
      stat = statSync(path);
    } catch {
      return;
    }
    if (stat.isDirectory()) {
      for (const entry of readdirSync(path)) if (!SKIP.has(entry)) visit(join(path, entry));
    } else if (stat.mtimeMs > contextTime + TOLERANCE_MS && stat.mtimeMs >= sessionStart) {
      stale.push([stat.mtimeMs, relative(root, path).replaceAll('\\', '/')]);
    }
  };
  for (const watched of WATCH) visit(join(root, watched));
  if (!stale.length) process.exit(0);

  stale.sort((a, b) => b[0] - a[0]);
  const listed = stale.slice(0, 8).map((entry) => '- ' + entry[1]).join('\n');
  const more = stale.length > 8 ? `\n- ...and ${stale.length - 8} more` : '';
  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason:
        `CONTEXT.md is older than ${stale.length} file(s) changed in this session:\n${listed}${more}\n` +
        'Update CONTEXT.md (changelog entry plus any section the change affects), then finish.',
    }),
  );
} catch {
  process.exit(0);
}
