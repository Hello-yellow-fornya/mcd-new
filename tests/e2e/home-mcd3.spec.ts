import { test, expect } from '@playwright/test';
import { isMcd3, colours as c } from './theme';

/** The 3.0 homepage (design/mcd-homepage-concept-guidelines-v1.html and -mobile-guidelines-v1.html). */
test.describe('homepage (MCD 3.0)', () => {
  test.skip(!isMcd3, '3.0 build only');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('sections run in the 3.0 order, one H1 with the payoff in the ink chip, Quicksand only', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1);
    expect((await page.locator('h1').innerText()).replace(/\s+/g, ' ')).toBe('Not your fault? It’s handled.');
    const chip = page.locator('h1 mark[data-chip]');
    await expect(chip).toHaveCSS('background-color', c.ink);
    await expect(chip).toHaveCSS('color', c.bright);
    const order = await page.locator('main > *').evaluateAll((els) =>
      els.filter((el) => (el as HTMLElement).checkVisibility()).map((el) => el.getAttribute('data-placement') || el.id),
    );
    expect(order).toEqual(['hero', 'how', 'shortcut', 'handler', 'who-we-help', 'catch', 'final-cta']);
    await expect(page.locator('[data-hero]')).toHaveCSS('background-color', c.bright);
    await expect(page.locator('[data-placement="final-cta"]')).toHaveCSS('background-color', c.ink);
    await expect(page.locator('footer')).toHaveCSS('background-color', c.ink);
    await expect(page.locator('body')).toHaveCSS('font-family', /Quicksand/);
    // The catch leads the FAQ; the shortcut compares old way and new way with ticked yellow circles and outlined crosses
    await expect(page.locator('#catch details summary').first()).toHaveText('What’s the catch?');
    await expect(page.locator('#shortcut [data-mark="ok"]').first()).toHaveCSS('background-color', c.bright);
    await expect(page.locator('#shortcut [data-mark="no"]').first()).toHaveCSS('border-top-color', c.ink);
    // New way first, then the old way; numbered steps; the tags with the first one selected
    await expect(page.locator('#shortcut h3')).toHaveText(['Call Motor Claims Department', 'Call your insurer']);
    await expect(page.locator('#how ol li h3')).toHaveText(['Tell us what happened', 'Your handler takes it on', 'We put you back in a car', 'They pay. Not you.']);
    await expect(page.locator('#who ul li').first()).toHaveCSS('background-color', c.ink);
    await expect(page.locator('[data-placement="final-cta"] h2')).toHaveText('One call sorts the lot.');
    await expect(page.locator('footer h4')).toHaveText(['Claims', 'Help', 'Legal']);
    // Line icons from the 3.0 sprite; the 2.0 logo is nowhere
    await expect(page.locator('svg[data-sprite="line"]')).toHaveCount(1);
    await expect(page.locator('svg[data-logo]')).toHaveCount(0);
    await expect(page.locator('header [data-wordmark]')).toHaveText(/motor claims\s*department/);
    // One yellow underlay per section heading
    for (const id of ['how', 'shortcut', 'who', 'catch']) await expect(page.locator(`#${id} h2 mark[data-hl]`)).toHaveCount(1);
  });

  test('desktop: wordmark, links, the number as text, the ink Start pill, the illustration', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop only');
    const header = page.getByTestId('site-header');
    await expect(header).toHaveCSS('background-color', c.white);
    expect((await header.boundingBox())!.height).toBeCloseTo(80, 0);
    const number = header.getByRole('link', { name: '0800 048 0048' });
    await expect(number).toBeVisible();
    await expect(number).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    const start = header.getByRole('link', { name: 'Start your non-fault claim' });
    await expect(start).toHaveCSS('background-color', c.ink);
    await expect(header.getByRole('link', { name: 'How it works' })).toBeVisible();
    await expect(page.locator('[data-illustration="car-and-keys"]')).toBeVisible();
    await expect(page.getByTestId('hero-start')).toHaveCSS('background-color', c.ink);
    await expect(page.getByTestId('sticky-call-bar')).toHaveAttribute('inert', '');
  });

  for (const [w, h] of [
    [390, 844],
    [430, 932],
  ]) {
    test(`mobile ${w}×${h}: 64px bar with the ink Call now pill and burger hard right; fold-locked hero with the worries, the ink call button, the wait row and the online pill on the fold; sticky bar after the hero`, async ({ page, isMobile }) => {
      test.skip(!isMobile, 'mobile only');
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const header = page.getByTestId('site-header');
      expect((await header.boundingBox())!.height).toBeCloseTo(64, 0);
      const pill = header.getByRole('link', { name: 'Call now' });
      await expect(pill).toHaveCSS('background-color', c.ink);
      const burger = header.getByRole('button', { name: 'Menu' });
      expect((await burger.boundingBox())!.x + (await burger.boundingBox())!.width).toBeGreaterThanOrEqual(w - 24);
      await expect(page.locator('[data-illustration]')).toBeHidden();
      // Fold
      const hero = (await page.locator('[data-fold-locked]').boundingBox())!;
      expect(hero.y + hero.height).toBeCloseTo(h, 0);
      const inView = async (sel: string) => {
        const box = (await page.locator(sel).first().boundingBox())!;
        expect(box.y, `${sel} top`).toBeGreaterThanOrEqual(64);
        expect(box.y + box.height, `${sel} bottom`).toBeLessThanOrEqual(h + 1);
        return box;
      };
      await inView('h1');
      await inView('[data-hero] p');
      const worries = page.locator('[data-hero] [data-card-row]').filter({ visible: true }).locator('li');
      await expect(worries).toHaveCount(3);
      await expect(worries.first()).toHaveText(/Will it cost me\?/);
      for (const li of await worries.all()) expect((await li.boundingBox())!.y + (await li.boundingBox())!.height).toBeLessThanOrEqual(h);
      const call = await inView('[data-testid="hero-call"]');
      await expect(page.getByTestId('hero-call')).toHaveCSS('background-color', c.ink);
      const wait = await inView('[data-testid="hero-wait-row"]');
      expect(wait.y).toBeGreaterThanOrEqual(call.y + call.height);
      const online = await inView('[data-testid="hero-online"]');
      await expect(page.getByTestId('hero-online')).toHaveText(/Or start your claim online/);
      expect(online.y + online.height, 'online pill sits exactly on the fold').toBeCloseTo(h, 0);
      // Sticky call bar: hidden over the hero, shown once it scrolls away (the 3.0 exception)
      const bar = page.getByTestId('sticky-call-bar');
      await expect(bar).toHaveAttribute('inert', '');
      await page.evaluate(() => window.scrollTo(0, document.querySelector('#shortcut')!.getBoundingClientRect().top + window.scrollY));
      await expect(bar).not.toHaveAttribute('inert', '');
      const barBox = (await bar.boundingBox())!;
      expect(barBox.y + barBox.height).toBeLessThanOrEqual(h + 1);
    });
  }
});
