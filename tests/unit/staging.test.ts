import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isProduction, robotsHeaders, robotsMeta, NOINDEX } from '../../src/lib/staging.ts';

test('only VERCEL_ENV=production is production', () => {
  assert.equal(isProduction('production'), true);
  assert.equal(isProduction('preview'), false);
  assert.equal(isProduction('development'), false);
  assert.equal(isProduction(undefined), false);
});

test('non-production gets a site-wide X-Robots-Tag', () => {
  const headers = robotsHeaders('preview');
  assert.equal(headers.length, 1);
  assert.equal(headers[0].source, '/:path*');
  assert.deepEqual(headers[0].headers, [{ key: 'X-Robots-Tag', value: NOINDEX }]);
  assert.deepEqual(robotsHeaders('production'), []);
});

test('robots meta follows the environment', () => {
  assert.deepEqual(robotsMeta('preview'), { index: false, follow: false });
  assert.deepEqual(robotsMeta('production'), { index: true, follow: true, 'max-image-preview': 'large' });
});
