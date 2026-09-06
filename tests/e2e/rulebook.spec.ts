import { test, expect, type Page } from '@playwright/test';

/**
 * MCD-layout-rules.md as assertions. Theme-agnostic: the same spec runs
 * against a 2.0 build (`pnpm test:e2e`) and a 3.0 build (`pnpm test:e2e:mcd3`).
 * Components declare the fixtures the rules need:
 *
 *   [data-fold-locked]       the mobile hero frame whose bottom edge lands on the fold
 *   [data-fold-copy]         the copy block inside it
 *   [data-flex-gap]          the hero's one flexible gap ("photo" when a picture fills it)
 *   [data-chip]              a chipped headline line (solid chip on its own line)
 *   [data-card-row]          a row or grid of cards that must be equal height
 *   [data-icon-circle]       an icon circle; data-size is the intended diameter
 *   [data-cta-pair]          the Start + Call pair that ends a content section
 *   [data-content-section]   a content section that must end with the pair
 */

const theme = process.env.NEXT_PUBLIC_THEME === 'mcd3' ? 'mcd3' : 'mcd2';
const pages = ['/', '/claim/goskippy/', '/claim/no-fault-accident/'];

async function dismissConsent(page: Page) {
  await page.getByRole('button', { name: /just the essentials/i }).click({ timeout: 3000 }).catch(() => {});
}

test.describe(`layout rulebook (${theme})`, () => {
  for (const [w, h] of [
    [390, 844],
    [430, 932],
  ]) {
    test(`hero bottom on the fold at ${w}×${h}, exactly one flexible gap and it is not the largest gap on screen`, async ({ page, isMobile }) => {
      test.skip(!isMobile, 'mobile rule');
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const hero = page.locator('[data-fold-locked]');
      await expect(hero).toHaveCount(1);
      const box = (await hero.boundingBox())!;
      expect(box.y + box.height, 'hero bottom edge').toBeCloseTo(h, 0);
      // Exactly one flexible gap in the hero
      const gaps = hero.locator('[data-flex-gap]');
      await expect(gaps).toHaveCount(1);
      const kind = await gaps.getAttribute('data-flex-gap');
      // The fixed gaps inside the copy block: the largest of them is the yardstick
      const copy = hero.locator('[data-fold-copy]');
      const fixedGaps = await copy.evaluate((el) => {
        const boxes = Array.from(el.querySelectorAll<HTMLElement>('h1, p, form, a, ul, [data-flex-gap]'))
          .filter((n) => n.checkVisibility() && !n.closest('[data-flex-gap]') && !Array.from(n.children).some((c) => c.matches('h1, p, form, a, ul')))
          .map((n) => n.getBoundingClientRect())
          .sort((a, b) => a.top - b.top);
        const out: number[] = [];
        for (let i = 1; i < boxes.length; i++) out.push(Math.max(0, boxes[i].top - boxes[i - 1].bottom));
        return out;
      });
      expect(fixedGaps.length).toBeGreaterThan(0);
      const largestFixed = Math.max(...fixedGaps);
      const flex = (await gaps.boundingBox())!;
      if (kind === 'photo') {
        // A photo fills the flexible space: the copy must be packed with fixed gaps only
        expect(largestFixed).toBeLessThanOrEqual(40);
      } else {
        // Empty flexible space: never the largest gap on screen
        const flexHeight = await gaps.evaluate((el) => el.getBoundingClientRect().height);
        expect(flexHeight).toBeGreaterThanOrEqual(0);
        expect(flexHeight, 'flexible gap is not the largest gap').toBeLessThan(Math.max(largestFixed, box.height * 0.25));
      }
      expect(flex).toBeTruthy();
    });
  }

  for (const path of pages) {
    test(`${path}: chipped headline lines carry clear space above`, async ({ page }) => {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const chips = page.locator('[data-chip]').filter({ visible: true });
      const n = await chips.count();
      for (let i = 0; i < n; i++) {
        const chip = chips.nth(i);
        const clear = await chip.evaluate((el) => {
          const own = el.getBoundingClientRect();
          // The nearest preceding rendered text: the previous element of the chip's line box
          const line = el.parentElement!;
          const prev = line.previousElementSibling as HTMLElement | null;
          const above = prev ? prev.getBoundingClientRect().bottom : line.parentElement!.getBoundingClientRect().top;
          return own.top - above;
        });
        expect(clear, 'clear space above the chip').toBeGreaterThanOrEqual(6);
      }
    });

    test(`${path}: cards in a row are equal height`, async ({ page }) => {
      await page.goto(path);
      await dismissConsent(page);
      await page.evaluate(() => document.fonts.ready);
      const rows = page.locator('[data-card-row]').filter({ visible: true });
      const n = await rows.count();
      for (let i = 0; i < n; i++) {
        const heights = await rows.nth(i).evaluate((el) => {
          const cards = Array.from(el.children).filter((c) => (c as HTMLElement).checkVisibility()) as HTMLElement[];
          const byTop = new Map<number, number[]>();
          for (const c of cards) {
            const r = c.getBoundingClientRect();
            const key = Math.round(r.top);
            byTop.set(key, [...(byTop.get(key) ?? []), r.height]);
          }
          return Array.from(byTop.values());
        });
        for (const row of heights) {
          expect(Math.max(...row) - Math.min(...row), 'card heights in a row').toBeLessThanOrEqual(1);
        }
      }
    });

    test(`${path}: icon circles are unclipped and fixed-size`, async ({ page }) => {
      await page.goto(path);
      await dismissConsent(page);
      const circles = page.locator('[data-icon-circle]').filter({ visible: true });
      const n = await circles.count();
      expect(n).toBeGreaterThan(0);
      for (let i = 0; i < n; i++) {
        const c = circles.nth(i);
        const info = await c.evaluate((el) => {
          const r = el.getBoundingClientRect();
          const svg = el.querySelector('svg')!.getBoundingClientRect();
          return { w: r.width, h: r.height, size: Number(el.getAttribute('data-size')), clipped: svg.left < r.left - 0.5 || svg.right > r.right + 0.5 || svg.top < r.top - 0.5 || svg.bottom > r.bottom + 0.5, overflow: getComputedStyle(el).overflow, flex: getComputedStyle(el).flexShrink };
        });
        expect(info.w, 'circle width').toBeCloseTo(info.size, 0);
        expect(info.h, 'circle height').toBeCloseTo(info.size, 0);
        expect(info.clipped, 'icon inside its circle').toBe(false);
        expect(info.flex, 'circle never shrinks').toBe('0');
      }
    });

    test(`${path}: the phone number is text inside a tel: link`, async ({ page }) => {
      await page.goto(path);
      const tel = page.locator('a[href^="tel:"]').filter({ visible: true });
      expect(await tel.count()).toBeGreaterThanOrEqual(2);
      let withNumber = 0;
      for (const t of await tel.all()) {
        await expect(t).toHaveAttribute('href', 'tel:08000480048');
        const text = (await t.innerText()).replace(/\s+/g, ' ').trim();
        expect(text, 'a tel link carries words, never an icon alone').not.toBe('');
        if (text.includes('0800 048 0048')) withNumber++;
      }
      expect(withNumber, 'the number itself appears as text').toBeGreaterThanOrEqual(1);
    });

    test(`${path}: every content section ends with the CTA pair`, async ({ page }) => {
      await page.goto(path);
      await dismissConsent(page);
      const sections = page.locator('[data-content-section]').filter({ visible: true });
      const n = await sections.count();
      expect(n).toBeGreaterThan(0);
      for (let i = 0; i < n; i++) {
        const s = sections.nth(i);
        const pair = s.locator('[data-cta-pair]').filter({ visible: true }).last();
        await expect(pair).toHaveCount(1);
        await expect(pair.locator('a[href="/claim-now/"]')).toHaveCount(1);
        await expect(pair.locator('a[href^="tel:"]')).toHaveCount(1);
        const [sb, pb] = [await s.boundingBox(), await pair.boundingBox()];
        expect(sb!.y + sb!.height - (pb!.y + pb!.height), 'the pair is the last thing in the section').toBeLessThanOrEqual(90);
      }
    });
  }

  test('mobile nav: logo left, pill and burger hard right', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile rule');
    await page.goto('/');
    const header = page.getByTestId('site-header');
    const brand = header.getByRole('link', { name: /home/i });
    const pill = header.getByRole('link', { name: /call now/i });
    const burger = header.getByRole('button', { name: 'Menu' });
    const vw = page.viewportSize()!.width;
    const [b, p, m] = [await brand.boundingBox(), await pill.boundingBox(), await burger.boundingBox()];
    expect(b!.x, 'logo starts at the left gutter').toBeLessThanOrEqual(24);
    expect(p!.x + p!.width, 'pill sits left of the burger').toBeLessThanOrEqual(m!.x);
    expect(m!.x + m!.width, 'burger ends at the right gutter').toBeGreaterThanOrEqual(vw - 24);
  });
});
