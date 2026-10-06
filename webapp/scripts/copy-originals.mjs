// Copies the original tool files from the project folder into public/downloads
// under clean names. The source folders are only read. Runs before dev and build.
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const webapp = join(dirname(fileURLToPath(import.meta.url)), '..');
const project = join(webapp, '..');
const target = join(webapp, 'public', 'downloads');

// Keep in step with ORIGINALS in src/content/resources.ts.
const ORIGINALS = {
  'energy_profile_tool/NWE0200304_CIRCUS_ A.1.1_Energy profile tool 1A (Excel version 1.03) unlocked.xlsx':
    'energy-profile-tool-1a-v1.03.xlsx',
  'watt_works/MANUALS/WattWorks_TOOLS_ENG.pdf': 'manual-wattworks.pdf',
  'watt_works/MANUALS/EnergyProfile_TOOLS_ENG.pdf': 'manual-energy-profile-tool.pdf',
  'watt_works/MANUALS/GIS_TOOLS_ENG.pdf': 'manual-gis-tool.pdf',
  'watt_works/MANUALS/Business_TOOLS_ENG.pdf': 'manual-business-tool.pdf',
  'watt_works/CARDS/WattWorks_Intro_Outro_ENG.pdf': 'cards-intro-outro.pdf',
  'watt_works/CARDS/WattWorks_Awareness_ENG.pdf': 'cards-phase-1-awareness.pdf',
  'watt_works/CARDS/WattWorks_Exploring Renewable Energy Opportunities_ENG.pdf': 'cards-phase-2-exploring.pdf',
  'watt_works/CARDS/WattWorks_Collaboration_ENG.pdf': 'cards-phase-3-collaboration.pdf',
  'business_tool/CIRCUS TOOL 3 EN-20251013.pdf': 'business-tool.pdf',
};

mkdirSync(target, { recursive: true });
let copied = 0;
for (const [source, name] of Object.entries(ORIGINALS)) {
  const from = join(project, source);
  const to = join(target, name);
  if (!existsSync(from)) {
    console.warn(`[copy-originals] missing source file: ${source}`);
    continue;
  }
  const upToDate =
    existsSync(to) && statSync(to).size === statSync(from).size && statSync(to).mtimeMs >= statSync(from).mtimeMs;
  if (!upToDate) {
    copyFileSync(from, to);
    copied += 1;
  }
}
console.log(`[copy-originals] ${copied} file(s) copied, ${Object.keys(ORIGINALS).length - copied} already up to date`);
