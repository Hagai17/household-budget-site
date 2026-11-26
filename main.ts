// Tallyhome hand-in (Node 22, standard library only).
// The site is this directory's app/ folder — plain static files a browser opens
// at app/index.html, with no build step and nothing loaded over the network.
// This program hands it in: it copies app/ and screenshots/ from beside this
// file into the hand-in directory and writes dossier.json, the summary the
// judge reads (the screenshots, the first load's files and bytes, and the
// source), with the vendored make.fun library. Leave vendor/makefun-frontend.ts
// as it is: the scorer requires dossier.json to be byte for byte what its own
// copy of that library writes.
//
// Run it from this directory:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader's container MAKEFUN_OUTPUT_DIR stands in for /output.
// Serve the site locally with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(here, 'app');
const shotsDir = join(here, 'screenshots');

function fail(message) {
  console.error('tallyhome: ' + message);
  process.exit(1);
}

if (!existsSync(join(appDir, 'index.html'))) fail('app/index.html is missing');
if (statSync(join(appDir, 'index.html')).size > 1048576) {
  fail('app/index.html is over the 1 MiB cap');
}
if (!existsSync(shotsDir)) fail('screenshots/ is missing');

// Start from a clean hand-in directory so a stale file from an earlier run
// can never ride along into the dossier.
mkdirSync(out, { recursive: true });
for (const name of ['app', 'screenshots', 'dossier.json']) {
  const target = join(out, name);
  if (existsSync(target)) rmSync(target, { recursive: true, force: true });
}
cpSync(appDir, join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

// The scorer's own caps: only text_max_bytes shapes the bytes; the others
// refuse an entry the scorer would refuse (more than 4 screenshots or one
// over 256 KiB; more than 993 files and directories in app/ or 16 MiB of
// app files: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
const shots = readdirSync(join(out, 'screenshots'))
  .filter((name) => !name.startsWith('.'))
  .map((name) => ({ name, bytes: statSync(join(out, 'screenshots', name)).size }));
if (shots.length < 3 || shots.length > 4) {
  fail('expected 3 or 4 screenshots, found ' + shots.length);
}
for (const shot of shots) {
  if (shot.bytes > 262144) fail('screenshot ' + shot.name + ' is ' + shot.bytes + ' bytes, over the 256 KiB cap');
}

const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(out, 'dossier.json'), dossier);
const dossierBytes = Buffer.byteLength(dossier);
if (dossierBytes === 0) fail('dossier.json came out empty');
if (dossierBytes > 1572864) fail('dossier.json is ' + dossierBytes + ' bytes, over the 1.5 MiB cap');

// Count the app files that went in, so the hand-in log shows the shape of
// what the judge will see.
let appFiles = 0;
let appBytes = 0;
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile()) {
      appFiles += 1;
      appBytes += statSync(full).size;
    }
  }
})(join(out, 'app'));

console.log('tallyhome handed in:');
console.log('  app/ (' + appFiles + ' files, ' + appBytes + ' bytes) + ' + shots.length + ' screenshots -> ' + out);
console.log('  screenshots: ' + shots.map((s) => s.name + ' (' + s.bytes + ' B)').join(', '));
console.log('  dossier.json: ' + dossierBytes + ' bytes');
