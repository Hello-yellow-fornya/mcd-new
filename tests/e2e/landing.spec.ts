import { test, expect } from '@playwright/test';

const pages = ['/claim/goskippy/', '/claim/no-fault-accident/'];

test.describe('landing pages', () => {
  for (const path of pages) {
    test(`${path}: noindex, canonical to self, independence line under the hero, insurer only where allowed`, async ({ page, request }) => {
      const res = await request.get(path);
      expect(res.headers()['x-robots-tag']).toContain('noindex');
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]:not([data-host])')).toHaveAttribute('content', 'noindex, nofollow');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://motorclaimsdepartment.co.uk${path}`);
      await expect(page.locator('h1')).toHaveCount(1);
      // Independence line directly after the hero
      const afterHero = page.locator('[data-hero] + *');
      await expect(afterHero).toHaveAttribute('data-testid', 'independence-line');
      // Insurer name only in the H1 and the independence line
      const insurer = path.includes('goskippy') ? 'GoSkippy' : null;
      if (insurer) {
        const bodyText = await page.locator('main').innerText();
        const count = bodyText.split(insurer).length - 1;
        expect(count).toBe(2);
      }
      // Primary CTA is the call pill; sticky call bar exists
      await expect(page.getByTestId('hero-call')).toHaveCSS('background-color', 'rgb(242, 105, 75)');
      await expect(page.getByTestId('sticky-call-bar')).toHaveCount(1);
      // Not in the sitemap
      const sitemap = await (await request.get('/sitemap.xml')).text();
      expect(sitemap).not.toContain(path);
    });

    test(`${path}: fold at 390×844 shows H1, H2, proof grid, call pill, wait row and the online CTA, in that order, with the online CTA's bottom edge on the fold`, async ({ page, isMobile }) => {
      test.skip(!isMobile, 'mobile fold only');
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const inView = async (sel: string) => {
        const box = await page.locator(sel).first().boundingBox();
        expect(box, sel).toBeTruthy();
        expect(box!.y, `${sel} top`).toBeGreaterThanOrEqual(0);
        expect(box!.y + box!.height, `${sel} bottom`).toBeLessThanOrEqual(844 + 1);
        return box!;
      };
      // Everything above the fold, in order: each element starts below the previous one ends
      const order = ['[data-hero] h1', '[data-hero] h2', '[data-testid="proof-grid"]', '[data-testid="hero-call"]', '[data-testid="wait-row"]', '[data-testid="hero-online"]'];
      let prevBottom = 0;
      let online = { y: 0, height: 0 };
      for (const sel of order) {
        const box = await inView(sel);
        expect(box.y, `${sel} starts after the previous element`).toBeGreaterThanOrEqual(prevBottom - 1);
        prevBottom = box.y + box.height;
        online = box;
      }
      // The online CTA is the outlined pill whose bottom edge touches the fold
      const bottom = online.y + online.height;
      expect(bottom, 'online CTA bottom edge').toBeGreaterThanOrEqual(844 - 1);
      expect(bottom, 'online CTA bottom edge').toBeLessThanOrEqual(844);
      const onlineCta = page.getByTestId('hero-online');
      await expect(onlineCta).toHaveText(/Or start your non-fault claim online/);
      await expect(onlineCta).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      await expect(onlineCta).toHaveCSS('border-top-color', 'rgb(22, 50, 79)');
      // The 2×2 grid: the four cards, marine circles, coral icons
      const cards = page.locator('[data-testid="proof-grid"] li');
      await expect(cards).toHaveText([/Protect your\s*no claims/, /No excess\s*to pay/, /Like-for-like\s*replacement/, /Back on the road\s*within 90 mins/]);
      const circle = cards.first().locator('span').first();
      await expect(circle).toHaveCSS('background-color', 'rgb(22, 50, 79)');
      await expect(circle.locator('svg')).toHaveCSS('color', 'rgb(242, 105, 75)');
      // The coral call pill with the solid phone icon
      const call = page.getByTestId('hero-call');
      await expect(call).toHaveCSS('background-color', 'rgb(242, 105, 75)');
      await expect(call.locator('svg use')).toHaveAttribute('href', '#i-phone');
    });
  }

  test('no-fault page carries the fault checklist; goskippy does not', async ({ page }) => {
    await page.goto('/claim/no-fault-accident/');
    await expect(page.locator('#fault')).toHaveCount(1);
    await page.goto('/claim/goskippy/');
    await expect(page.locator('#fault')).toHaveCount(0);
  });

  test('unsubstantiated claims are marked on preview', async ({ page }) => {
    await page.goto('/claim/goskippy/');
    const marked = page.locator('[data-testid="proof-grid"] li[title*="Unsubstantiated"]');
    await expect(marked).toHaveCount(1);
    await expect(marked).toContainText('90 mins');
  });
});
