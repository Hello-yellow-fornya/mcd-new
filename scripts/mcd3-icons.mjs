#!/usr/bin/env node
/**
 * The MCD 3.0 favicon and app-icon set: "mcd" in Quicksand Bold, lowercase,
 * ink on the Safety Yellow tile (brand guidelines v1 §02: "MCD" is the
 * favicon / app-icon shorthand). Outlines come from the shipped Quicksand
 * variable font at wght 700 (src/themes/mcd3/icons/mcd-paths.json, written by
 * fontTools). 16px carries the "m" alone.
 *
 *   node scripts/mcd3-icons.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const sharpDir = readdirSync(join(root, 'node_modules/.pnpm')).find((d) => d.startsWith('sharp@'));
const sharp = require(join(root, 'node_modules/.pnpm', sharpDir, 'node_modules/sharp'));
const out = join(root, 'src', 'themes', 'mcd3', 'icons');
const P = JSON.parse(readFileSync(join(out, 'mcd-paths.json'), 'utf8'));

const YELLOW = '#ffd400';
const INK = '#19180f';
const U = 1000;

function tile(size, mOnly = false) {
  const glyphs = mOnly ? P.glyphs.slice(0, 1) : P.glyphs;
  const width = mOnly ? glyphs[0].adv : P.width;
  const s = (mOnly ? U * 0.62 : U * 0.76) / width;
  const ascender = (mOnly ? P.xHeight : P.ascender * 0.75) * s; // the block the eye centres: x-height alone for the m, the d's ascender otherwise
  const baseline = U / 2 + ascender / 2;
  const tx = (U - width * s) / 2;
  const paths = glyphs.map((g) => `<path transform="translate(${g.x} 0)" d="${g.d}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${U} ${U}" width="${size}" height="${size}"><title>mcd</title><rect width="${U}" height="${U}" rx="${U * 0.125}" fill="${YELLOW}"/><g fill="${INK}" transform="translate(${tx.toFixed(1)} ${baseline.toFixed(1)}) scale(${s.toFixed(4)} ${(-s).toFixed(4)})">${paths}</g></svg>`;
}

const png = (size, mOnly = false) => sharp(Buffer.from(tile(size, mOnly))).resize(size, size).png().toBuffer();

writeFileSync(join(out, 'icon.svg'), tile(1024));
for (const [size, mOnly] of [[16, true], [32, false], [180, false], [512, false], [1024, false]]) {
  writeFileSync(join(out, `icon-${size}.png`), await png(size, mOnly));
}
writeFileSync(join(out, 'apple-icon.png'), await png(180));
const p32 = await png(32);
const ico = Buffer.concat([Buffer.from([0, 0, 1, 0, 1, 0, 32, 32, 0, 0, 1, 0, 32, 0]), Buffer.from(new Uint8Array(new Uint32Array([p32.length, 22]).buffer)), p32]);
writeFileSync(join(out, 'favicon.ico'), ico);
// A preview sheet for review
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="200" viewBox="0 0 560 200"><rect width="560" height="200" fill="#fff"/><svg x="20" y="20" width="160" height="160">${tile(160).replace(/^<svg[^>]*>/, '').replace('</svg>', '')}</svg><svg x="200" y="80" width="64" height="64">${tile(64).replace(/^<svg[^>]*>/, '').replace('</svg>', '')}</svg><svg x="284" y="112" width="32" height="32">${tile(32).replace(/^<svg[^>]*>/, '').replace('</svg>', '')}</svg><svg x="336" y="128" width="16" height="16">${tile(16, true).replace(/^<svg[^>]*>/, '').replace('</svg>', '')}</svg></svg>`;
writeFileSync(join(root, 'public', 'icons', 'preview-mcd3.svg'), sheet);
console.log('mcd3 icons written to src/themes/mcd3/icons');
