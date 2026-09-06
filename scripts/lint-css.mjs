#!/usr/bin/env node
/**
 * CSS rules that the brand guidelines say must be enforced in code (brief §3):
 *
 *   no-uppercase   sentence case everywhere: no text-transform: uppercase / capitalize
 *   no-italic      never italics (guidelines §4)
 *   ink-on-bright  ink text on coral, sky and green — never white or paper
 *
 * A deliberate exception (the reg placeholder is uppercase by design) is marked
 * on the same line:  text-transform: uppercase; /* allow: uppercase *\/
 * White on coral is allowed at big-print sizes only (the band chip, 28px and up):
 * mark the block with  /* allow: big-print *\/
 *
 * Usage: node scripts/lint-css.mjs [dir-or-file...]   (default: src)
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const BRIGHT_BG = /background(?:-color)?\s*:\s*[^;]*?(?:var\(--(?:coral|sky|green)\)|#f2694b|#bfd6e6|#7dc24a)/i;
const LIGHT_TEXT = /(?:^|[;\s{])color\s*:\s*(?:#fff\b|#ffffff\b|white\b|var\(--white\)|var\(--paper\)|var\(--on-ink\)|var\(--on-blue\))/i;

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

export function lintCss(text, file) {
  const findings = [];
  const add = (line, rule, message) => findings.push({ file, line, rule, message });

  text.split('\n').forEach((line, i) => {
    const n = i + 1;
    if (/text-transform\s*:\s*(uppercase|capitalize)/i.test(line) && !/allow:\s*uppercase/.test(line)) {
      add(n, 'no-uppercase', 'Sentence case everywhere: no CSS uppercase (guidelines §4).');
    }
    if (/font-style\s*:\s*(italic|oblique)/i.test(line) && !/allow:\s*italic/.test(line)) {
      add(n, 'no-italic', 'Never italics (guidelines §4).');
    }
  });

  // Declaration blocks: a bright background must not carry light text.
  const stripped = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  const block = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = block.exec(stripped))) {
    const [, selector, decls] = m;
    const raw = text.slice(m.index, m.index + m[0].length); // comments are preserved in position
    if (BRIGHT_BG.test(decls) && LIGHT_TEXT.test(decls) && !/allow:\s*big-print/.test(raw)) {
      add(
        lineOf(stripped, m.index + selector.length),
        'ink-on-bright',
        `Ink text on coral, sky and green — never white (guidelines §3). Selector: ${selector.trim().replace(/\s+/g, ' ')}`,
      );
    }
  }
  return findings;
}

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (extname(full) === '.css') acc.push(full);
  }
  return acc;
}

export function lintPaths(paths) {
  const files = paths.flatMap((p) => {
    const abs = resolve(root, p);
    return existsSync(abs) && statSync(abs).isFile() ? [abs] : walk(abs);
  });
  const findings = files.flatMap((f) => lintCss(readFileSync(f, 'utf8'), relative(root, f)));
  return { files, findings };
}

function main() {
  const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['src'];
  const { files, findings } = lintPaths(paths);
  if (findings.length === 0) {
    console.log(`css lint: ${files.length} file${files.length === 1 ? '' : 's'} checked, no problems.`);
    return 0;
  }
  for (const f of findings) console.error(`${f.file}:${f.line}  ${f.rule}  ${f.message}`);
  console.error(`\ncss lint: ${findings.length} problem${findings.length === 1 ? '' : 's'}. Build stopped.`);
  return 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
