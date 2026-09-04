import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lintCss } from '../../scripts/lint-css.mjs';

const rulesHit = (css) => lintCss(css, 'x.css').map((f) => f.rule);

test('token file and sane components pass', () => {
  assert.deepEqual(rulesHit('.btn-coral{background:var(--coral);color:var(--on-coral)}'), []);
  assert.deepEqual(rulesHit('.band{background:var(--ink);color:var(--on-ink)}'), []);
});

test('uppercase and italics fail unless explicitly allowed', () => {
  assert.deepEqual(rulesHit('.eyebrow{text-transform:uppercase}'), ['no-uppercase']);
  assert.deepEqual(rulesHit('.reg input{text-transform:uppercase; /* allow: uppercase */}'), []);
  assert.deepEqual(rulesHit('em{font-style:italic}'), ['no-italic']);
});

test('white text on coral, sky or green fails', () => {
  assert.deepEqual(rulesHit('.x{background:var(--coral);color:#fff}'), ['ink-on-bright']);
  assert.deepEqual(rulesHit('.x{background-color:#7DC24A;color:var(--white)}'), ['ink-on-bright']);
  assert.deepEqual(rulesHit('.x{background:var(--sky);color:var(--on-ink)}'), ['ink-on-bright']);
  assert.deepEqual(rulesHit('@media (max-width:820px){.x{background:var(--coral);color:white}}'), ['ink-on-bright']);
});

test('comments do not trigger the pairing rule', () => {
  assert.deepEqual(rulesHit('/* never color:#fff on background:var(--coral) */ .x{background:var(--coral);color:var(--ink)}'), []);
});
