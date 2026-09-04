import { test, expect } from '@playwright/test';

const pages = ['/claim/goskippy/', '/claim/no-fault-accident/'];

test.describe('landing pages', () => {
  for (const path of pages) {
    test(`${path}: noindex, canonical to self, independence line under the hero, insurer only where allowed`, async ({ page, request }) => {
      const res = await request.get(path);
      expect(res.headers()['x-robots-tag']).toContain('noindex');
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
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

    test(`${path}: fold at 390×844 shows headline, instruction, proof grid, call pill, wait row, and the online CTA touching the bottom edge`, async ({ page, isMobile }) => {
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
      await inView('h1');
      await inView('[data-hero] p');
      await inView('[data-testid="proof-grid"]');
      await inView('[data-testid="hero-call"]');
      await inView('[data-testid="wait-row"]');
      const online = await inView('[data-testid="hero-online"]');
      const bottom = online.y + online.height;
      expect(bottom, 'online CTA bottom edge').toBeGreaterThanOrEqual(844 - 12);
      expect(bottom, 'online CTA bottom edge').toBeLessThanOrEqual(844);
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
