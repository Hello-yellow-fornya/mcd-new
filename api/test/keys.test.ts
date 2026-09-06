import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timingSafeEqual } from 'node:crypto';
import { keyLabelFor, loadApiKeys } from '../src/keys.ts';

test('CLAIMS_API_KEY alone still works, labelled default', () => {
  const keys = loadApiKeys({ CLAIMS_API_KEY: 'one' });
  assert.deepEqual(keys, [{ label: 'default', secret: 'one' }]);
  assert.equal(keyLabelFor('Bearer one', keys, timingSafeEqual), 'default');
});

test('CLAIMS_API_KEYS holds labelled keys and positional ones', () => {
  const keys = loadApiKeys({ CLAIMS_API_KEYS: ' mcd1:aaa , mcd2:bbb ,ccc' });
  assert.deepEqual(keys.map((k) => k.label), ['mcd1', 'mcd2', 'key3']);
  assert.equal(keyLabelFor('Bearer bbb', keys, timingSafeEqual), 'mcd2');
  assert.equal(keyLabelFor('Bearer ccc', keys, timingSafeEqual), 'key3');
});

test('both variables combine; wrong, empty or malformed headers are rejected', () => {
  const keys = loadApiKeys({ CLAIMS_API_KEY: 'old', CLAIMS_API_KEYS: 'mcd2:new' });
  assert.equal(keyLabelFor('Bearer old', keys, timingSafeEqual), 'default');
  assert.equal(keyLabelFor('Bearer new', keys, timingSafeEqual), 'mcd2');
  assert.equal(keyLabelFor('Bearer nope', keys, timingSafeEqual), null);
  assert.equal(keyLabelFor('new', keys, timingSafeEqual), null);
  assert.equal(keyLabelFor(undefined, keys, timingSafeEqual), null);
});

test('duplicate labels fail fast', () => {
  assert.throws(() => loadApiKeys({ CLAIMS_API_KEYS: 'a:1,a:2' }), /duplicate label/);
});
