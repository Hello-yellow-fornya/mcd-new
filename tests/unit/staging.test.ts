import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isProduction } from '../../src/lib/staging.ts';
import { isLiveHost } from '../../src/lib/host.ts';

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
