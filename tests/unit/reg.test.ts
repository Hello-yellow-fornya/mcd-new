import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compactReg, formatReg, isPlausibleReg } from '../../src/lib/reg.ts';

test('formats a current-style plate to AB12 CDE as it is typed', () => {
  assert.equal(formatReg('a'), 'A');
  assert.equal(formatReg('ab12'), 'AB12');
  assert.equal(formatReg('ab12c'), 'AB12 C');
  assert.equal(formatReg('ab12cde'), 'AB12 CDE');
  assert.equal(formatReg('AB12 CDE'), 'AB12 CDE');
  assert.equal(formatReg('  ab 12 - cde '), 'AB12 CDE');
});

test('older formats are uppercased and compacted, never re-spaced', () => {
  assert.equal(formatReg('a123 bcd'), 'A123BCD');
  assert.equal(formatReg('abc 123d'), 'ABC123D');
});

test('compact strips everything but letters and digits and caps at seven', () => {
  assert.equal(compactReg('ab12 cde9'), 'AB12CDE');
  assert.equal(compactReg(''), '');
});

test('plausibility needs a letter and a digit', () => {
  assert.equal(isPlausibleReg('AB12 CDE'), true);
  assert.equal(isPlausibleReg('ABCDEFG'), false);
  assert.equal(isPlausibleReg('1'), false);
});
