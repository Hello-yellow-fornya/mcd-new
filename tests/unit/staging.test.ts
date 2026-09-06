import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isProduction } from '../../src/lib/staging.ts';
import { isLiveHost } from '../../src/lib/host.ts';
import { resolveTheme } from '../../src/lib/theme.ts';

test('only VERCEL_ENV=production is production', () => {
  assert.equal(isProduction('production'), true);
  assert.equal(isProduction('preview'), false);
  assert.equal(isProduction('development'), false);
  assert.equal(isProduction(undefined), false);
});

test('only the real domain, with or without www, is live', () => {
  const site = 'motorclaimsdepartment.co.uk';
  assert.equal(isLiveHost('motorclaimsdepartment.co.uk', site), true);
  assert.equal(isLiveHost('www.motorclaimsdepartment.co.uk', site), true);
  assert.equal(isLiveHost('MotorClaimsDepartment.co.uk:443', site), true);
  assert.equal(isLiveHost('mcd-new-2.vercel.app', site), false);
  assert.equal(isLiveHost('mcd-new-2-git-main-fornya.vercel.app', site), false);
  assert.equal(isLiveHost('staging.motorclaimsdepartment.co.uk', site), false);
  assert.equal(isLiveHost('localhost:3100', site), false);
  assert.equal(isLiveHost(null, site), false);
});

test('a site URL on vercel.app is never live, so the 3.0 comparison project stays noindexed', () => {
  assert.equal(isLiveHost('mcd-new-3.vercel.app', 'mcd-new-3.vercel.app'), false);
  assert.equal(isLiveHost('www.mcd-new-3.vercel.app', 'mcd-new-3.vercel.app'), false);
});

test('the theme defaults to mcd2 unless NEXT_PUBLIC_THEME is exactly mcd3', () => {
  assert.equal(resolveTheme(undefined), 'mcd2');
  assert.equal(resolveTheme(''), 'mcd2');
  assert.equal(resolveTheme('mcd2'), 'mcd2');
  assert.equal(resolveTheme('mcd3'), 'mcd3');
  assert.equal(resolveTheme('MCD3'), 'mcd2');
  assert.equal(resolveTheme('mcd4'), 'mcd2');
});
