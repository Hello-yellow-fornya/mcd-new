import { test, expect } from '@playwright/test';

// Runs against a build with VERCEL_ENV unset, i.e. staging behaviour (brief §2a).

test('every route carries X-Robots-Tag noindex on staging', async ({ request }) => {
  for (const path of ['/', '/does-not-exist/']) {
    const res = await request.get(path);
    expect(res.headers()['x-robots-tag'], path).toBe('noindex, nofollow');
  }
});

test('head has noindex meta and a canonical on the final domain', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
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
