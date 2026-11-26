// Tallyhome — hand-in program (Node 22, standard library only).
//
// The site itself is the static folder app/ beside this file: plain HTML, CSS
// and ES modules with no build step and no network loads. This program hands
// it in: it copies app/ and screenshots/ into the output directory and writes
// dossier.json there with buildDossier from vendor/makefun-frontend.ts, the
// kit's library, kept unchanged so the scorer's rebuild matches byte for byte.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The caps are the scorer's own: at most 4 screenshots of 256 KiB, at most 993
// files and directories and 16 MiB in app/, and the dossier text capped at
// 163,840 bytes. Passing them here means the dossier is written exactly as
// the gate would write it, or the build refuses the way the gate would.
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(out, 'dossier.json'), dossier);
console.log(`handed in: app/ + screenshots/ copied, dossier.json written (${dossier.length} bytes)`);
