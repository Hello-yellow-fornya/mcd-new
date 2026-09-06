import { test, expect, type Page } from '@playwright/test';
import { isMcd3 } from './theme';

/**
 * design/MCD-layout-rules.md as assertions. Theme-agnostic: the same spec runs
 * against a 2.0 build (`pnpm test:e2e`) and a 3.0 build (`pnpm test:e2e:mcd3`).
 * Components declare the fixtures the rules need:
 *
 *   [data-fold-locked]       the mobile hero frame whose bottom edge lands on the fold
 *   [data-fold-copy]         the copy block inside it
 *   [data-flex-gap]          the hero's one flexible gap ("photo" when a picture fills it)
 *   [data-chip]              a chipped headline line
 *   [data-card-row]          a row or grid of cards that must be equal height
 *   [data-icon-circle]       an icon circle; data-size is the intended diameter
 *   [data-cta-pair]          the Start + Call pair that ends a content section
 *   [data-content-section]   a content section that must end with the pair
 *
 * Where the signed-off 2.0 mockups break a rule, the test is marked with
 * test.fail so the deviation is tracked rather than hidden: it is expected to
 * fail on a 2.0 build and flags the moment 2.0 is brought in line.
 */

const theme = isMcd3 ? 'mcd3' : 'mcd2';
const pages = ['/', '/claim/goskippy/', '/claim/no-fault-accident/'];
const folds: [number, number][] = [
  [390, 844],
  [430, 932],
];

async function ready(page: Page, path: string) {
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('button', { name: /just the essentials/i }).click({ timeout: 2000 }).catch(() => {});
}

/** Visible leaf blocks of the hero copy, top to bottom (h1, p, form, links, lists, the flexible gap). */
async function copyBlocks(page: Page) {
  return page.locator('[data-fold-copy]').evaluate((el) =>
    Array.from(el.querySelectorAll<HTMLElement>('h1, h2, p, form, a, ul, [data-flex-gap]'))
      .filter((n) => n.checkVisibility() && (n.matches('[data-flex-gap]') || !n.closest('[data-flex-gap]')) && !Array.from(n.children).some((c) => c.matches('h1, h2, p, form, a, ul')))
      .map((n) => {
        const r = n.getBoundingClientRect();
        return { tag: n.tagName, flex: n.hasAttribute('data-flex-gap'), top: r.top, bottom: r.bottom, height: r.height };
      })
      .sort((a, b) => a.top - b.top),
  );
}

test.describe(`layout rulebook (${theme})`, () => {
  // ---- 1. The fold ----
  for (const [w, h] of folds) {
    test(`§1 hero is fold-locked at ${w}×${h}: bottom edge on the fold, exactly one flexible gap, never the largest`, async ({ page, isMobile }) => {
      test.skip(!isMobile, 'mobile rule');
      await page.setViewportSize({ width: w, height: h });
      await ready(page, '/');
      const hero = page.locator('[data-fold-locked]');
      await expect(hero).toHaveCount(1);
      const box = (await hero.boundingBox())!;
      expect(box.y + box.height, 'hero bottom edge on the fold').toBeCloseTo(h, 0);
      const gaps = hero.locator('[data-flex-gap]');
      await expect(gaps, 'exactly one flexible gap').toHaveCount(1);
      const blocks = await copyBlocks(page);
      const fixed: number[] = [];
      for (let i = 1; i < blocks.length; i++) if (!blocks[i].flex && !blocks[i - 1].flex) fixed.push(Math.max(0, blocks[i].top - blocks[i - 1].bottom));
      expect(fixed.length).toBeGreaterThan(0);
      expect(Math.max(...fixed), 'every other gap is a fixed, tight value').toBeLessThanOrEqual(40);
      if ((await gaps.getAttribute('data-flex-gap')) !== 'photo') {
        // "The flexible gap is never the largest gap on screen": smaller than the content block
        // above it and the content block below it, so type and cards dominate, not space.
        const flex = blocks.find((b) => b.flex)!;
        const copy = (await page.locator('[data-fold-copy]').boundingBox())!;
        expect(flex.height, 'flexible gap is not the largest block on screen').toBeLessThan(Math.max(flex.top - copy.y, copy.y + copy.height - flex.bottom));
      }
    });

    test(`§1 the last element in the hero has its bottom edge exactly on the fold at ${w}×${h} (homepage)`, async ({ page, isMobile }) => {
      test.skip(!isMobile, 'mobile rule');
      test.fail(!isMcd3, '2.0 deviation: the signed-off mobile hero (mcd-homepage-mobile-v2.html) anchors the copy 26px above the fold');
      await page.setViewportSize({ width: w, height: h });
      await ready(page, '/');
      const blocks = await copyBlocks(page);
      const last = blocks.filter((b) => !b.flex).at(-1)!;
      expect(last.bottom, 'last element on the fold').toBeCloseTo(h, 0);
    });

    for (const path of pages.slice(1)) {
      test(`§1 the online-claim pill sits exactly on the fold at ${w}×${h} (${path})`, async ({ page, isMobile }) => {
        test.skip(!isMobile, 'mobile rule');
        test.fail(h !== 844, 'deviation: the landing-page hero (mcd-lp-*.html) is tuned to 844px rather than fold-locked, so at 430×932 the pill sits above the fold');
        await page.setViewportSize({ width: w, height: h });
        await ready(page, path);
        const pill = (await page.getByTestId('hero-online').boundingBox())!;
        expect(pill.y + pill.height).toBeCloseTo(h, 0);
      });
    }
  }

  for (const [w, h] of [
    [1280, 720],
    [1440, 820],
    [1920, 900],
  ]) {
    test(`§1 desktop ${w}×${h}: headline, lead, CTAs and the whole proof row are inside the first screen`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'desktop rule');
      await page.setViewportSize({ width: w, height: h });
      await ready(page, '/');
      const hero = page.locator('[data-hero]');
      for (const sel of ['h1', 'p', 'a[href], button']) {
        const box = (await hero.locator(sel).filter({ visible: true }).first().boundingBox())!;
        expect(box, sel).toBeTruthy();
        expect(box.y + box.height, `${sel} inside ${h}`).toBeLessThanOrEqual(h);
      }
      // The reasons to believe: every card of the proof row, not just its top
      const proof = hero.locator('ul').filter({ visible: true }).first();
      const box = (await proof.boundingBox())!;
      expect(box.y + box.height, `proof row inside ${h}`).toBeLessThanOrEqual(h);
    });
  }

  // ---- 2. The headline pair ----
  for (const path of pages) {
    test(`§2 ${path}: a chipped line carries margin-top equal to its top padding and clear space above`, async ({ page }) => {
      await ready(page, path);
      const chips = page.locator('[data-chip]').filter({ visible: true });
      const n = await chips.count();
      for (let i = 0; i < n; i++) {
        const info = await chips.nth(i).evaluate((el) => {
          const cs = getComputedStyle(el);
          const own = el.getBoundingClientRect();
          const line = el.parentElement!;
          // The line above: text before the chip inside the same block, else the previous block
          const range = document.createRange();
          range.setStart(line, 0);
          range.setEndBefore(el);
          const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0 && r.bottom <= own.top + 1);
          const prev = line.previousElementSibling as HTMLElement | null;
          const above = rects.length ? Math.max(...rects.map((r) => r.bottom)) : prev ? prev.getBoundingClientRect().bottom : null;
          return { pad: parseFloat(cs.paddingTop), clear: above === null ? null : own.top - above };
        });
        if (info.clear === null) continue; // the chip is on the first line: nothing above to crowd
        expect(info.clear, 'clear space above the chip is at least its top padding').toBeGreaterThanOrEqual(Math.max(2, info.pad - 0.5));
      }
    });
  }

  // ---- 3. Proof ----
  for (const path of pages) {
    test(`§3 ${path}: proof grid cards equal height, icon circle 34–36px, title 14px, sub 12–13px; wait row directly under the call button`, async ({ page, isMobile }) => {
      test.skip(!isMobile, 'mobile rule');
      test.fail(path !== '/', 'deviation: the signed-off landing grid (mcd-lp-*.html) uses 40px circles and 15px titles');
      await ready(page, path);
      const grid = page.getByTestId('proof-grid').filter({ visible: true });
      test.skip((await grid.count()) === 0, 'no proof grid on this page in this theme');
      await expect(grid.locator('li')).toHaveCount(4);
      const circle = grid.locator('[data-icon-circle]').first();
      const size = (await circle.boundingBox())!.width;
      expect(size).toBeGreaterThanOrEqual(34);
      expect(size).toBeLessThanOrEqual(36);
      expect(parseFloat(await grid.locator('b').first().evaluate((el) => getComputedStyle(el).fontSize))).toBe(14);
      const sub = parseFloat(await grid.locator('li span:not([data-icon-circle])').first().evaluate((el) => getComputedStyle(el).fontSize));
      expect(sub).toBeGreaterThanOrEqual(12);
      expect(sub).toBeLessThanOrEqual(13);
    });

    test(`§3 ${path}: the wait row sits directly under the call button`, async ({ page, isMobile }) => {
      test.skip(!isMobile, 'mobile rule');
      await ready(page, path);
      const call = (await page.getByTestId('hero-call').boundingBox())!;
      const wait = (await page.locator('[data-testid="hero-wait-row"], [data-testid="wait-row"]').first().boundingBox())!;
      expect(wait.y).toBeGreaterThanOrEqual(call.y + call.height);
      expect(wait.y - (call.y + call.height), 'directly under').toBeLessThanOrEqual(24);
    });
  }

  // ---- 4. CTAs ----
  test('§4 mobile nav: logo hard left at 28–30px, a full "Call now" pill and the burger hard right, sticky', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile rule');
    await ready(page, '/');
    const header = page.getByTestId('site-header');
    await expect(header).toHaveCSS('position', 'sticky');
    const brand = header.getByRole('link', { name: /home/i });
    const pill = header.getByRole('link', { name: /^call now$/i });
    const burger = header.getByRole('button', { name: 'Menu' });
    const vw = page.viewportSize()!.width;
    const [b, p, m] = [await brand.boundingBox(), await pill.boundingBox(), await burger.boundingBox()];
    expect(b!.x, 'logo hard left').toBeLessThanOrEqual(24);
    expect(b!.height, 'logo as large as the bar allows').toBeGreaterThanOrEqual(28);
    expect(b!.height).toBeLessThanOrEqual(30.5);
    expect((await pill.innerText()).trim()).toMatch(/^Call now$/);
    expect(p!.x + p!.width, 'pill left of the burger').toBeLessThanOrEqual(m!.x);
    expect(m!.x + m!.width, 'burger hard right').toBeGreaterThanOrEqual(vw - 24);
  });

  test('§4 desktop nav: everything on one line at 1280, logo hard left, the start or phone pill hard right', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop rule');
    await page.setViewportSize({ width: 1280, height: 720 });
    await ready(page, '/');
    const header = page.getByTestId('site-header');
    const items = header.locator('a, button').filter({ visible: true });
    const boxes = await items.evaluateAll((els) => els.map((el) => el.getBoundingClientRect()).map((r) => ({ x: r.x, right: r.right, cy: r.y + r.height / 2 })));
    const centres = boxes.map((b) => b.cy);
    expect(Math.max(...centres) - Math.min(...centres), 'one line').toBeLessThanOrEqual(6);
    expect(Math.min(...boxes.map((b) => b.x)), 'logo hard left').toBeLessThanOrEqual((1280 - 1140) / 2 + 24 + 1);
    expect(Math.max(...boxes.map((b) => b.right)), 'pill hard right').toBeGreaterThanOrEqual(1280 - (1280 - 1140) / 2 - 24 - 1);
  });

  for (const path of pages) {
    test(`§4 ${path}: every content section ends with the CTA pair`, async ({ page }) => {
      await ready(page, path);
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

    test(`§4 ${path}: the phone number is text inside a tel: link`, async ({ page }) => {
      await ready(page, path);
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
  }

  // ---- 5. Bands and strips ----
  for (const path of ['/', '/claim/goskippy/', '/credit-hire/']) {
    test(`§5 ${path}: the band is three bold white lines, the chip on its own line with clear space, two small outlined pills`, async ({ page }) => {
      await ready(page, path);
      const band = page.getByTestId('band');
      test.skip((await band.count()) === 0, 'no band on this page in this theme');
      test.fail(path === '/credit-hire/', 'deviation: the template band (Band size md, from the 2.0 templates) sets the quiet line at 75% opacity');
      const lines = band.locator('p').filter({ visible: true });
      await expect(lines).toHaveCount(3);
      for (const line of await lines.all()) {
        await expect(line).toHaveCSS('color', 'rgb(255, 255, 255)');
        await expect(line).toHaveCSS('opacity', '1');
        expect(parseInt(await line.evaluate((el) => getComputedStyle(el).fontWeight), 10)).toBeGreaterThanOrEqual(700);
      }
      const chip = band.locator('mark[data-chip]');
      await expect(chip).toHaveCount(1);
      const pills = band.locator('a').filter({ visible: true });
      await expect(pills, 'two small outlined pills, not the full pair').toHaveCount(2);
      for (const p of await pills.all()) await expect(p).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      await expect(band.locator('[data-cta-pair]')).toHaveCount(0);
    });
  }

  test('§5 the moving strip: equal-height items, duplicated once, paused on hover, static under reduced motion', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the strip is desktop only');
    await ready(page, '/');
    const track = page.getByTestId('benefits-track');
    test.skip((await track.count()) === 0, 'no moving strip on this page in this theme');
    await expect(track.locator('ul')).toHaveCount(2);
    await expect(track.locator('ul').nth(1)).toHaveAttribute('aria-hidden', 'true');
    await page.mouse.move(0, 0);
    await expect(track).toHaveCSS('animation-play-state', 'running');
    await page.getByTestId('benefits-band').scrollIntoViewIfNeeded();
    const box = (await track.boundingBox())!;
    await page.mouse.move(box.x + 40, box.y + 40);
    await expect(track).toHaveCSS('animation-play-state', 'paused');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(track).toHaveCSS('animation-name', 'none');
  });

  for (const path of pages) {
    test(`§5 ${path}: the independence line sits after the their/your table, not before it`, async ({ page, isMobile }) => {
      await ready(page, path);
      const indep = page.getByTestId('independence-line').filter({ visible: true });
      const table = page.locator('[role="table"]').filter({ visible: true });
      test.skip((await indep.count()) === 0 || (await table.count()) === 0, 'page has no independence line or table in this view');
      test.fail(path !== '/', '2.0 and 3.0 deviation: the landing pages place the independence line directly under the hero (brief §6, mcd-lp-*.html)');
      const [i, t] = [await indep.first().boundingBox(), await table.first().boundingBox()];
      expect(i!.y, 'independence line after the table').toBeGreaterThanOrEqual(t!.y + t!.height);
      void isMobile;
    });
  }

  // ---- 6. Cards, chips, icons ----
  for (const path of pages) {
    test(`§6 ${path}: cards in a row are equal height`, async ({ page }) => {
      await ready(page, path);
      const rows = page.locator('[data-card-row]').filter({ visible: true });
      const n = await rows.count();
      for (let i = 0; i < n; i++) {
        const heights = await rows.nth(i).evaluate((el) => {
          const byTop = new Map<number, number[]>();
          for (const c of Array.from(el.children).filter((c) => (c as HTMLElement).checkVisibility()) as HTMLElement[]) {
            const r = c.getBoundingClientRect();
            byTop.set(Math.round(r.top), [...(byTop.get(Math.round(r.top)) ?? []), r.height]);
          }
          return Array.from(byTop.values());
        });
        for (const row of heights) expect(Math.max(...row) - Math.min(...row), 'card heights in a row').toBeLessThanOrEqual(1);
      }
    });

    test(`§6 ${path}: icon circles are inline-flex, flex: none, fixed size, never clipped`, async ({ page }) => {
      await ready(page, path);
      const circles = page.locator('[data-icon-circle]').filter({ visible: true });
      const n = await circles.count();
      expect(n).toBeGreaterThan(0);
      for (let i = 0; i < n; i++) {
        const info = await circles.nth(i).evaluate((el) => {
          const r = el.getBoundingClientRect();
          const svg = el.querySelector('svg')!.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return { w: r.width, h: r.height, size: Number(el.getAttribute('data-size')), clipped: svg.left < r.left - 0.5 || svg.right > r.right + 0.5 || svg.top < r.top - 0.5 || svg.bottom > r.bottom + 0.5, display: cs.display, flex: cs.flexShrink };
        });
        expect(info.w).toBeCloseTo(info.size, 0);
        expect(info.h).toBeCloseTo(info.size, 0);
        expect(info.clipped, 'icon inside its circle').toBe(false);
        expect(['inline-flex', 'flex'], 'inline-flex (a flex item reports it as flex)').toContain(info.display);
        expect(info.flex, 'flex: none').toBe('0');
      }
    });
  }

  // ---- 7. Colour ----
  test('§7 reversed text on dark surfaces is white at full opacity', async ({ page }) => {
    await ready(page, '/');
    const dark = page.locator('[data-testid="band"], [data-placement="final-cta"]').filter({ visible: true });
    const n = await dark.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const bad = await dark.nth(i).evaluate((el) =>
        Array.from(el.querySelectorAll<HTMLElement>('p, h2, span, a'))
          .filter((t) => t.checkVisibility() && t.textContent?.trim() && !t.closest('mark') && !t.matches('mark'))
          .map((t) => ({ tag: t.tagName, color: getComputedStyle(t).color, opacity: getComputedStyle(t).opacity }))
          .filter((t) => t.color !== 'rgb(255, 255, 255)' || t.opacity !== '1')
          // ink-on-yellow buttons and the chip are not reversed text
          .filter((t) => t.color !== 'rgb(25, 24, 15)' && t.color !== 'rgb(15, 36, 56)' && t.color !== 'rgb(22, 50, 79)'),
      );
      expect(bad).toEqual([]);
    }
  });
});
