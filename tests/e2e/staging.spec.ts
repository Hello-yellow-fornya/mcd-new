import { test, expect } from '@playwright/test';

// The staging rule is host-based (brief §2a): the test server is localhost, so
// every response is staging; a request that claims the real host is live.
const LIVE = 'motorclaimsdepartment.co.uk';

test('every route carries X-Robots-Tag noindex when not served from the real domain', async ({ request }) => {
  for (const path of ['/', '/credit-hire/', '/does-not-exist/']) {
    const res = await request.get(path);
    expect(res.headers()['x-robots-tag'], path).toBe('noindex, nofollow');
  }
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /');
  expect(robots).not.toContain('Allow: /');
});

test('the same build served from the real domain has no noindex and an allow robots.txt', async ({ request }) => {
  const res = await request.get('/credit-hire/', { headers: { host: LIVE } });
  expect(res.status()).toBe(200);
  expect(res.headers()['x-robots-tag']).toBeUndefined();
  const www = await request.get('/', { headers: { host: `www.${LIVE}` } });
  expect(www.headers()['x-robots-tag']).toBeUndefined();
  const robots = await (await request.get('/robots.txt', { headers: { host: LIVE } })).text();
  expect(robots).toContain('Allow: /');
  expect(robots).toContain('Disallow: /claim/');
  // Landing pages stay noindexed on the real domain (brief §6)
  const lp = await request.get('/claim/goskippy/', { headers: { host: LIVE } });
  expect(lp.headers()['x-robots-tag']).toContain('noindex');
});

test('head gets the noindex meta off the real domain, and a canonical on it', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"][data-host]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://motorclaimsdepartment.co.uk/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB');
});

test('fonts are self-hosted and loaded', async ({ page }) => {
  const fontRequests: string[] = [];
  page.on('request', (r) => {
    if (r.resourceType() === 'font') fontRequests.push(r.url());
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() =>
    Array.from(document.fonts).filter((f) => f.status === 'loaded').map((f) => `${f.weight} ${f.family}`),
  );
  expect(loaded.some((f) => f.startsWith('900'))).toBe(true);
  expect(loaded.some((f) => f.startsWith('400'))).toBe(true);
  expect(fontRequests.length).toBeGreaterThan(0);
  for (const url of fontRequests) expect(url).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
  // Only Franklin 900 and Public Sans 400/700 are preloaded; 600 loads normally.
  await expect(page.locator('link[rel="preload"][as="font"]')).toHaveCount(3);
});

test('skip link is the first focusable element and targets main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.locator('a.skip');
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href', '#main');
  await expect(page.locator('main#main')).toHaveCount(1);
});
