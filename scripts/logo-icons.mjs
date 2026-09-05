#!/usr/bin/env node
/**
 * Cuts the favicon and app icons from the logo square (brief §4a): 16, 32,
 * 180, 512 and 1024, plus the SVG favicon and favicon.ico.
 *
 *   node scripts/logo-icons.mjs
 */
import { mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const sharpDir = readdirSync(join(root, 'node_modules/.pnpm')).find((d) => d.startsWith('sharp@'));
const sharp = require(join(root, 'node_modules/.pnpm', sharpDir, 'node_modules/sharp'));
// Logo.tsx is a React module, so the square is rebuilt here from the same path data (keep the two in step).
const { logoPaths: P } = await import('../src/components/Logo/paths.ts');
const squares = {
  marine: { tile: '#16324f', text: '#ffffff', disc: '#f2694b', spokes: '#16324f' },
  paper: { tile: '#f7f5f0', text: '#16324f', disc: '#f2694b', spokes: '#16324f' },
  coral: { tile: '#f2694b', text: '#0f2438', disc: '#0f2438', spokes: '#f2694b' },
};
function square(tone, size, markOnly = false) {
  const s = squares[tone];
  const U = 1000, radius = U * 0.125;
  const d = markOnly ? U * 0.56 : U * 0.38, cy = markOnly ? U / 2 : U * 0.36;
  const r = d / 2, stroke = d * 0.09, hub = d * 0.11, reach = r * 0.7;
  const spokes = [0, 45, 90, 135].map((a) => { const rad = (a * Math.PI) / 180, dx = Math.cos(rad) * reach, dy = Math.sin(rad) * reach; return `<line x1="${(U / 2 - dx).toFixed(1)}" y1="${(cy - dy).toFixed(1)}" x2="${(U / 2 + dx).toFixed(1)}" y2="${(cy + dy).toFixed(1)}"/>`; }).join('');
  const mcdScale = (U * 0.56) / P.mcd.width;
  const mcd = markOnly ? '' : `<g fill="${s.text}" transform="translate(${((U - P.mcd.width * mcdScale) / 2).toFixed(1)} ${U * 0.82}) scale(${mcdScale.toFixed(4)})">${P.mcd.paths.map((g) => `<path d="${g.d}"/>`).join('')}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${U} ${U}" width="${size}" height="${size}"><title>MCD</title><rect width="${U}" height="${U}" rx="${radius}" fill="${s.tile}"/><circle cx="${U / 2}" cy="${cy}" r="${r}" fill="${s.disc}"/><g stroke="${s.spokes}" stroke-width="${stroke.toFixed(1)}" stroke-linecap="round">${spokes}</g><circle cx="${U / 2}" cy="${cy}" r="${hub.toFixed(1)}" fill="${s.spokes}"/>${mcd}</svg>`;
}
const out = join(root, 'public', 'icons');
mkdirSync(out, { recursive: true });
const svg = square('marine', 1024);
writeFileSync(join(root, 'src', 'app', 'icon.svg'), svg);
for (const tone of ['marine', 'paper', 'coral']) writeFileSync(join(out, `square-${tone}.svg`), square(tone, 1024));
writeFileSync(join(out, 'mark-marine.svg'), square('marine', 1024, true));

const png = (size, markOnly = false) => sharp(Buffer.from(square('marine', size, markOnly))).resize(size, size).png().toBuffer();
// Small sizes use the mark alone (allowed for favicons, §4a); 180 and up carry the MCD square.
for (const [size, markOnly] of [[16, true], [32, true], [180, false], [512, false], [1024, false]]) {
  writeFileSync(join(out, `icon-${size}.png`), await png(size, markOnly));
}
writeFileSync(join(root, 'src', 'app', 'apple-icon.png'), await png(180));
// favicon.ico: a 32px PNG wrapped in an ICO container
const p32 = await png(32, true);
const ico = Buffer.concat([Buffer.from([0, 0, 1, 0, 1, 0, 32, 32, 0, 0, 1, 0, 32, 0]), Buffer.from(new Uint8Array(new Uint32Array([p32.length, 22]).buffer)), p32]);
writeFileSync(join(root, 'src', 'app', 'favicon.ico'), ico);
console.log('icons written: icon.svg, apple-icon.png, favicon.ico, public/icons/{16,32,180,512,1024}.png + squares');
