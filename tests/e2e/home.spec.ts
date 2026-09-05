import { test, expect, type Locator } from '@playwright/test';

/** innerText of the visible matches only (display:none copy for the other breakpoint is skipped). */
const visibleText = (loc: Locator) =>
  loc.evaluateAll((els) => els.filter((el) => el.checkVisibility()).map((el) => (el as HTMLElement).innerText.replace(/\s+/g, ' ').trim()));

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('one H1, and the sections run in the V1 order for the breakpoint', async ({ page, isMobile }) => {
    await expect(page.locator('h1')).toHaveCount(1);
    expect((await page.locator('h1').innerText()).replace(/\s+/g, ' ')).toBe(isMobile ? 'Non-fault accident?' : 'Hit by someone else? You shouldn’t pay for it.');
    const h2s = await visibleText(page.locator('main h2'));
    expect(h2s).toEqual(
      isMobile
        ? ['What drivers say', 'How it works']
        : ['Why claim through Motor Claims Department', 'What drivers say', 'How it works', 'What’s the catch?'],
    );
    // Visual order of the visible sections, top to bottom
    const order = await page.locator('main > *').evaluateAll((els) =>
      els
        .filter((el) => el.checkVisibility())
        .map((el) => ({ key: el.getAttribute('data-placement') || el.getAttribute('data-testid') || el.id, top: el.getBoundingClientRect().top }))
        .sort((a, b) => a.top - b.top)
        .map((x) => x.key),
    );
    expect(order).toEqual(
      isMobile
        ? ['hero', 'proof', 'reviews', 'band', 'them-us', 'independence-line', 'catch']
        : ['hero', 'benefits', 'band', 'reviews', 'how', 'catch'],
    );
    await expect(page.getByText('I’m Dani')).toHaveCount(0);
    await expect(page.locator('#catch details').first()).toHaveAttribute('open', '');
    await expect(page.locator('#catch details summary').first()).toHaveText('What’s the catch?');
    if (!isMobile) await expect(page.locator('#how ol li')).toHaveCount(4);
  });

  test('the Why claim band moves: five stone cards at a fixed size, duplicated once, paused on hover and touch, static under reduced motion', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop only: the mobile homepage has the proof grid instead');
    const track = page.getByTestId('benefits-track');
    const sets = track.locator('ul');
    await expect(sets).toHaveCount(2);
    await expect(sets.nth(1)).toHaveAttribute('aria-hidden', 'true');
    const cards = sets.first().locator('li');
    await expect(cards).toHaveText([
      /No excess fees to pay, ever/,
      /Keep your no claims bonus/,
      /Like-for-like car hire, 100% guaranteed/,
      /A dedicated, UK-based call handler/,
      /Nothing on your record/,
    ]);
    for (const card of await cards.all()) {
      const box = await card.boundingBox();
      expect(box!.width).toBeCloseTo(340, 0);
      expect(box!.height).toBeCloseTo(220, 0);
      await expect(card).toHaveCSS('background-color', 'rgb(237, 233, 225)');
    }
    const circle = cards.first().locator('span').first();
    await expect(circle).toHaveCSS('background-color', 'rgb(242, 105, 75)');
    await expect(track).toHaveCSS('animation-name', /loop/);
    await expect(track).toHaveCSS('animation-play-state', 'running');
    await page.getByRole('button', { name: /just the essentials/i }).click();
    await page.getByTestId('benefits-band').scrollIntoViewIfNeeded();
    // The track is moving, so point at coordinates rather than waiting for it to settle
    const box = (await track.boundingBox())!;
    await page.mouse.move(box.x + 40, box.y + 40);
    await expect(track).toHaveCSS('animation-play-state', 'paused');
    await page.mouse.move(0, 0);
    await expect(track).toHaveCSS('animation-play-state', 'running');
    // Touch: paused while a finger is down
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + 40, y: box.y + 40 }] });
    await expect(track).toHaveCSS('animation-play-state', 'paused');
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.mouse.move(0, 0);
    await expect(track).toHaveCSS('animation-play-state', 'running');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(track).toHaveCSS('animation-name', 'none');
    await expect(sets.nth(1)).toBeHidden();
  });

  test('the band: two white lines, the coral chip in big print, two small outlined pills and no full CTA pair', async ({ page, isMobile }) => {
    const band = page.getByTestId('band');
    const lines = band.locator('p');
    await expect(lines).toHaveText(['Your insurer has a claims department.', 'It works for your insurer.', 'We work for you.']);
    await expect(lines.first()).toHaveCSS('color', 'rgb(255, 255, 255)');
    const chip = band.locator('mark');
    await expect(chip).toHaveCSS('background-color', 'rgb(242, 105, 75)');
    await expect(chip).toHaveCSS('color', 'rgb(255, 255, 255)');
    expect(parseFloat(await chip.evaluate((el) => getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(28);
    const pills = band.locator('a');
    await expect(pills).toHaveText(['Start your claim', /Call now/]);
    for (const pill of await pills.all()) {
      await expect(pill).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      await expect(pill).toHaveCSS('border-top-color', 'rgb(255, 255, 255)');
      expect((await pill.boundingBox())!.height).toBeCloseTo(isMobile ? 40 : 42, 0);
    }
    await expect(pills.nth(1).locator('svg use')).toHaveAttribute('href', '#i-phone');
    await expect(band.locator('a', { hasText: 'Call 0800 048 0048' })).toHaveCount(0);
  });

  test('the content sections end with the CTA pair, the primary reads "Start your non-fault claim", and the phone is a tel link in text', async ({ page }) => {
    const pairs = page.locator('main a[href="/claim-now/"]', { hasText: 'Start your non-fault claim' }).filter({ visible: true });
    await expect(pairs).toHaveCount(2); // desktop: how + catch; mobile: their/your table + FAQ
    await expect(page.locator('main a[href="/claim-now/"]', { hasText: /^Start your claim$/ }).filter({ visible: true })).toHaveCount(1); // the band pill
    const tel = page.locator('a[href="tel:08000480048"]').filter({ visible: true });
    expect(await tel.count()).toBeGreaterThanOrEqual(5);
    for (const t of await tel.all()) {
      const text = (await t.innerText()).replace(/\s+/g, ' ');
      expect(text).toMatch(/0800 048 0048|Call now/);
    }
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

  test('the photo hero carries the marine scrim above the photo, never leaving the headline unshaded', async ({ page, isMobile }) => {
    const frame = page.getByTestId('hero-frame');
    const scrim = await frame.evaluate((el) => {
      const s = getComputedStyle(el, '::before');
      return { image: s.backgroundImage, z: s.zIndex };
    });
    if (isMobile) {
      // Bottom-anchored copy: the tint rises from the bottom to nothing by 82%
      expect(scrim.image).toMatch(/linear-gradient\(0deg, rgba\(22, 50, 79, 0\.97\) 0%/);
    } else {
      // Left scrim: rgba(22,50,79,.8) at the left edge to transparent by 70% of the width
      expect(scrim.image).toMatch(/linear-gradient\(90deg, rgba\(22, 50, 79, 0\.8\) 0%/);
      expect(scrim.image).toMatch(/rgba\(22, 50, 79, 0\) 70%\)/);
    }
    expect(parseInt(scrim.z, 10)).toBeGreaterThanOrEqual(1);
    // The scrim paints above the photo: hit-testing a point over the photo lands on the frame's scrim, not the image
    const box = (await frame.boundingBox())!;
    const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.tagName, [box.x + 8, box.y + box.height * 0.4]);
    expect(hit).not.toBe('IMG');
    const h1 = (await page.locator('h1').boundingBox())!;
    expect(h1.x).toBeGreaterThanOrEqual(box.x);
    expect(h1.x + h1.width).toBeLessThanOrEqual(box.x + box.width);
  });

  test('desktop header is transparent with white type over the hero, paper with the colour logo once scrolled', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop only');
    const header = page.getByTestId('site-header');
    await expect(header).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(header.locator('svg[data-logo="colour-on-marine"]')).toHaveCount(1);
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(header).toHaveCSS('background-color', 'rgb(247, 245, 240)');
    const logo = header.locator('svg[data-logo="colour-on-paper"]');
    await expect(logo).toHaveCount(1);
    expect((await logo.boundingBox())!.height).toBeCloseTo(36, 0);
    const link = header.getByRole('link', { name: 'How it works' });
    await expect(link).toHaveCSS('color', 'rgb(22, 50, 79)');
    expect((await header.locator('div').first().boundingBox())!.height).toBeCloseTo(88, 0);
  });

  test('mobile: sticky paper bar at 64px with the logo at 28px, the call pill and the burger hard right', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only');
    const header = page.getByTestId('site-header');
    await expect(header).toHaveCSS('background-color', 'rgb(247, 245, 240)');
    await expect(header).toHaveCSS('position', 'sticky');
    expect((await header.boundingBox())!.height).toBeCloseTo(64, 0);
    const logo = header.locator('svg[data-logo]');
    expect((await logo.boundingBox())!.height).toBeCloseTo(28, 0);
    await expect(logo.locator('> g').first()).toHaveCSS('fill', 'rgb(22, 50, 79)');
    const pill = header.getByRole('link', { name: 'Call now' });
    await expect(pill).toHaveCSS('background-color', 'rgb(242, 105, 75)');
    const burger = header.getByRole('button', { name: 'Menu' });
    const [p, b] = [await pill.boundingBox(), await burger.boundingBox()];
    expect(p!.x + p!.width).toBeLessThanOrEqual(b!.x);
    expect(b!.x + b!.width).toBeGreaterThanOrEqual(390 - 14 - 1);
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(header).toHaveCSS('background-color', 'rgb(247, 245, 240)');
  });

  for (const [w, h] of [
    [390, 844],
    [430, 932],
  ]) {
    test(`mobile hero is fold-locked at ${w}×${h}: copy, reg field, call and wait row over the scrim, bottom edge on the fold, proof grid below it`, async ({ page, isMobile }) => {
      test.skip(!isMobile, 'mobile only');
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const frame = (await page.getByTestId('hero-frame').boundingBox())!;
      expect(frame.y).toBeCloseTo(64, 0);
      expect(frame.y + frame.height).toBeCloseTo(h, 0);
      const inView = async (sel: string) => {
        const box = (await page.locator(sel).first().boundingBox())!;
        expect(box, sel).toBeTruthy();
        expect(box.y, `${sel} top`).toBeGreaterThanOrEqual(64);
        expect(box.y + box.height, `${sel} bottom`).toBeLessThanOrEqual(h + 1);
        return box;
      };
      await inView('h1');
      await inView('[data-hero] p');
      await inView('[data-testid="regbox"]');
      await inView('[data-testid="hero-call"]');
      const wait = await inView('[data-testid="hero-wait-row"]');
      const call = (await page.getByTestId('hero-call').boundingBox())!;
      expect(wait.y).toBeGreaterThanOrEqual(call.y + call.height);
      // "Non-fault accident?" at 34px with the coral bar under "Non-fault"; "Choose the smarter way to claim." at 22px Franklin
      const h1 = page.locator('h1');
      expect(parseFloat(await h1.evaluate((el) => getComputedStyle(el).fontSize))).toBe(34);
      await expect(h1.locator('mark').filter({ visible: true })).toHaveText('Non-fault');
      await expect(h1.locator('mark').filter({ visible: true })).toHaveCSS('text-decoration-color', 'rgb(242, 105, 75)');
      const sub = page.locator('[data-hero] p').first();
      expect((await sub.innerText()).replace(/\s+/g, ' ')).toBe('Choose the smarter way to claim.');
      expect(parseFloat(await sub.evaluate((el) => getComputedStyle(el).fontSize))).toBe(22);
      await expect(sub).toHaveCSS('font-weight', '900');
      await expect(sub.locator('mark').filter({ visible: true })).toHaveText('smarter way');
      // Wait row in white, gated by claims.json (both items are unsubstantiated today, so they carry the preview marker)
      const items = page.locator('[data-testid="hero-wait-row"] li');
      await expect(items).toHaveText(['Avg wait 1 min', 'Fastest way to claim']);
      await expect(items.first()).toHaveCSS('color', 'rgb(255, 255, 255)');
      await expect(items.first().locator('span')).toHaveCSS('color', 'rgb(47, 107, 26)');
      await expect(items.nth(1).locator('span')).toHaveCSS('color', 'rgb(22, 50, 79)');
      // No online CTA on the mobile homepage; the proof grid starts under the fold
      await expect(page.locator('a', { hasText: /claim online/ }).filter({ visible: true })).toHaveCount(0);
      const grid = (await page.getByTestId('proof-grid').boundingBox())!;
      expect(grid.y).toBeGreaterThanOrEqual(h - 1);
      const cards = page.locator('[data-testid="proof-grid"] li');
      await expect(cards).toHaveCount(4);
      const circle = cards.first().locator('span').first();
      expect((await circle.boundingBox())!.width).toBeCloseTo(34, 0);
      await expect(circle).toHaveCSS('background-color', 'rgb(22, 50, 79)');
      await expect(circle.locator('svg')).toHaveCSS('color', 'rgb(242, 105, 75)');
      expect(parseFloat(await cards.first().locator('b').evaluate((el) => getComputedStyle(el).fontSize))).toBe(14);
      await expect(page.locator('[data-testid="proof-grid"] li[title*="Unsubstantiated"]')).toHaveText(/90 mins/);
    });
  }
});
