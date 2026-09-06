#!/usr/bin/env node
/**
 * Puts the right favicon and app-icon set in place for the theme being built.
 * Favicons are static files under src/app and public/icons, so the theme is
 * applied by copying: src/themes/mcd2/icons (the §4a mark) or
 * src/themes/mcd3/icons ("mcd" on the yellow tile). Runs from prebuild, so a
 * Vercel build of the 3.0 project (or an mcd3/… preview branch) gets its own
 * icons and a 2.0 build is byte-for-byte the committed set.
 *
 *   node scripts/theme-icons.mjs
 */
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = process.env;
const theme = env.NEXT_PUBLIC_THEME === 'mcd3' || (!env.NEXT_PUBLIC_THEME && env.VERCEL_ENV === 'preview' && (env.VERCEL_GIT_COMMIT_REF ?? '').startsWith('mcd3/')) ? 'mcd3' : 'mcd2';
const from = join(root, 'src', 'themes', theme, 'icons');
if (!existsSync(from)) throw new Error(`no icon set at ${from}`);

const targets = {
  'icon.svg': join(root, 'src', 'app', 'icon.svg'),
  'apple-icon.png': join(root, 'src', 'app', 'apple-icon.png'),
  'favicon.ico': join(root, 'src', 'app', 'favicon.ico'),
  'icon-16.png': join(root, 'public', 'icons', 'icon-16.png'),
  'icon-32.png': join(root, 'public', 'icons', 'icon-32.png'),
  'icon-180.png': join(root, 'public', 'icons', 'icon-180.png'),
  'icon-512.png': join(root, 'public', 'icons', 'icon-512.png'),
  'icon-1024.png': join(root, 'public', 'icons', 'icon-1024.png'),
};
mkdirSync(join(root, 'public', 'icons'), { recursive: true });
for (const [name, to] of Object.entries(targets)) copyFileSync(join(from, name), to);
console.log(`icons: ${theme} set in place (${Object.keys(targets).length} files)`);
