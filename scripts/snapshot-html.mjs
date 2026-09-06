#!/usr/bin/env node
/**
 * Snapshot the server-rendered HTML of every route for a build-to-build
 * comparison, e.g. to assert that a 2.0 build is unchanged by the theme
 * mechanism when NEXT_PUBLIC_THEME is unset:
 *
 *   pnpm build && pnpm start -p 3100 &   # baseline checkout
 *   node scripts/snapshot-html.mjs out/before 3100
 *   pnpm build && pnpm start -p 3100 &   # candidate checkout
 *   node scripts/snapshot-html.mjs out/after 3100
 *   diff -r out/before out/after
 *
 * Build ids, hashed asset names, React ids and other per-build noise are
 * normalised so only real markup differences remain. The rulebook fixtures
 * (data-icon-circle, data-card-row, data-cta-pair, …) are markup and are kept:
 * pass --strip-rulebook to ignore them when comparing against a build that
 * predates them.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const stripRulebook = args.includes('--strip-rulebook');
const [outDir = 'out/snapshot', port = '3100'] = args.filter((a) => !a.startsWith('--'));
const base = `http://localhost:${port}`;

function normalise(html) {
  if (stripRulebook) html = html.replace(/ data-(icon-circle|icon|size|card-row|cta-pair|content-section|fold-locked|fold-copy|flex-gap|chip)(="[^"]*")?/g, '');
  return html
    .replace(/\/_next\/static\/(chunks|css|media)\/[^"']+/g, '/_next/static/$1/HASH')
    .replace(/\/_next\/static\/[A-Za-z0-9_-]{16,}\//g, '/_next/static/BUILD/')
    .replace(/"buildId":"[^"]+"/g, '"buildId":"BUILD"')
    .replace(/\/_next\/image\?url=[^"'&]+/g, '/_next/image?url=IMG')
    .replace(/(hero-placeholder(?:-mobile)?)\.[a-f0-9]{8,}\./g, '$1.HASH.')
    .replace(/__className_[a-f0-9]+/g, '__className_HASH')
    .replace(/__variable_[a-f0-9]+/g, '__variable_HASH')
    .replace(/\s+id="[^"]*[«»:]R[^"]*"/g, '')
    .replace(/nonce="[^"]+"/g, 'nonce="NONCE"')
    .replace(/_R_[a-z0-9]+_/g, '_R_ID_');
}

async function routes() {
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  const fromSitemap = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => new URL(m[1]).pathname);
  const extra = ['/claim/goskippy/', '/claim/no-fault-accident/', '/claim-now/', '/claim-now/thank-you/?ref=TEST', '/styleguide/', '/does-not-exist/'];
  return Array.from(new Set([...fromSitemap, ...extra]));
}

mkdirSync(outDir, { recursive: true });
const list = await routes();
let n = 0;
for (const path of list) {
  const res = await fetch(base + path);
  const html = normalise(await res.text());
  const name = path.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'index';
  writeFileSync(join(outDir, `${name}.html`), `<!-- ${res.status} ${path} -->\n${html}`);
  n++;
}
console.log(`snapshot: ${n} routes written to ${outDir}`);
