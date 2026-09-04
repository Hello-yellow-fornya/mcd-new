import { test, expect } from '@playwright/test';

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('sections run in the signed-off order with one H1', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText('Hit by someone else? You shouldn’t pay for it.');
    const h2s = await page.locator('main h2').allTextContents();
    expect(h2s).toEqual([
      'Why claim through Motor Claims Department',
      'How it works',
      'What’s the catch?',
      '“I’m Dani. I’ll own your claim until your keys are back.”',
      'Who we help',
    ]);
    for (const id of ['how', 'catch', 'types']) await expect(page.locator(`#${id}`)).toHaveCount(1);
  });

  test('every content section ends with the CTA pair and the phone is a tel link in text', async ({ page }) => {
    const pairs = page.locator('main a[href="/claim-now/"]:has-text("Start your claim")');
    await expect(pairs).toHaveCount(6);
    const tel = page.locator('a[href="tel:08000480048"]');
    expect(await tel.count()).toBeGreaterThanOrEqual(8);
    for (const t of await tel.all()) expect((await t.textContent())?.replace(/\s+/g, ' ')).toContain('0800 048 0048');
  });

  test('Organization and WebSite schema, canonical on the final domain', async ({ page }) => {
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const graph = blocks.map((b) => JSON.parse(b)).find((d) => d['@graph']);
    const types = graph['@graph'].map((n: { '@type': string }) => n['@type']);
    expect(types).toEqual(['Organization', 'WebSite']);
    expect(graph['@graph'][0].telephone).toBe('+448000480048');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://motorclaimsdepartment.co.uk/');
    const faq = blocks.map((b) => JSON.parse(b)).find((d) => d['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(4);
  });

  test('hero image is eager, art-directed for mobile, and the reg field has a real label', async ({ page, isMobile }) => {
    const img = page.locator('main picture img').first();
    await expect(img).toHaveAttribute('alt', /keys to her hire car/);
    expect(await img.getAttribute('loading')).not.toBe('lazy');
    await expect(img).toHaveAttribute('fetchpriority', 'high');
    const current = await img.evaluate((el) => (el as HTMLImageElement).currentSrc);
    expect(current).toMatch(isMobile ? /hero-placeholder-mobile/ : /hero-placeholder\.[a-f0-9]+\.jpg/);
    await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(2);
    await expect(page.getByLabel('Enter your reg')).toBeVisible();
  });

  test('header is transparent over the hero and marine once scrolled', async ({ page }) => {
    const header = page.getByTestId('site-header');
    await expect(header).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(header).toHaveCSS('background-color', 'rgb(22, 50, 79)');
  });
});
