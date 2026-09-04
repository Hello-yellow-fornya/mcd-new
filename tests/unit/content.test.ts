import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractHeadings, normaliseSlug } from '../../src/lib/content/index.ts';

test('headings get GitHub-style ids, deduplicated', () => {
  const body = `## What is it?\n\nText\n\n## Step 1. Tell us what happened\n\n### What we ask\n\n## What is it?`;
  assert.deepEqual(extractHeadings(body), [
    { id: 'what-is-it', text: 'What is it?', depth: 2 },
    { id: 'step-1-tell-us-what-happened', text: 'Step 1. Tell us what happened', depth: 2 },
    { id: 'what-we-ask', text: 'What we ask', depth: 3 },
    { id: 'what-is-it-1', text: 'What is it?', depth: 2 },
  ]);
});

test('slugs get leading and trailing slashes', () => {
  assert.equal(normaliseSlug('credit-hire'), '/credit-hire/');
  assert.equal(normaliseSlug('/how-to-prove-fault/rear-end-collision'), '/how-to-prove-fault/rear-end-collision/');
});
