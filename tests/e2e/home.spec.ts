import { test, expect } from '@playwright/test';

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('sections run in the V1 order with one H1', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText('Hit by someone else? You shouldn’t pay for it.');
    // Order: hero → Why claim band → the band → reviews (sample data on staging) → How it works → the catch → handler → footer
    const h2s = await page.locator('main h2').allTextContents();
    expect(h2s).toEqual([
      'Why claim through Motor Claims Department',
      'What drivers say',
      'How it works',
      'What’s the catch?',
      '“I’m Dani. I’ll own your claim until your keys are back.”',
    ]);
    const sections = await page.locator('main > *').evaluateAll((els) => els.map((el) => el.getAttribute('data-placement') || el.getAttribute('data-testid') || el.id || el.tagName.toLowerCase()));
    expect(sections.filter((s) => s !== 'link')).toEqual(['section', 'benefits', 'band', 'section', 'how', 'catch', 'section']);
    for (const id of ['how', 'catch']) await expect(page.locator(`#${id}`)).toHaveCount(1);
    await expect(page.locator('#catch details').first()).toHaveAttribute('open', '');
    await expect(page.locator('#catch details summary').first()).toHaveText('What’s the catch?');
    await expect(page.locator('#how ol li')).toHaveCount(4);
  });

  test('the Why claim band moves: five stone cards at a fixed size, duplicated once, paused on hover, static under reduced motion', async ({ page, isMobile }) => {
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
    const [w, h] = isMobile ? [280, 210] : [340, 220];
    for (const card of await cards.all()) {
      const box = await card.boundingBox();
      expect(box!.width).toBeCloseTo(w, 0);
      expect(box!.height).toBeCloseTo(h, 0);
      await expect(card).toHaveCSS('background-color', 'rgb(237, 233, 225)');
    }
    const circle = cards.first().locator('span').first();
    await expect(circle).toHaveCSS('background-color', 'rgb(242, 105, 75)');
    await expect(track).toHaveCSS('animation-name', /loop/);
    await expect(track).toHaveCSS('animation-play-state', 'running');
    // The track is moving, so point at coordinates rather than waiting for it to settle.
    // Desktop pauses on hover; touch has no hover, so it pauses while a finger is down.
    // The consent banner overlays the lower viewport on mobile and would take the touch
    await page.getByRole('button', { name: /just the essentials/i }).click();
    await page.getByTestId('benefits-band').scrollIntoViewIfNeeded();
    const box = (await track.boundingBox())!;
    if (isMobile) {
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + 40, y: box.y + 40 }] });
      await expect(track).toHaveCSS('animation-play-state', 'paused');
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      // Touch browsers keep :hover on the last tapped element, so a tap pauses it until a tap elsewhere
      const heading = (await page.locator('#benefits-h').boundingBox())!;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: heading.x + 10, y: heading.y + 10 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await expect(track).toHaveCSS('animation-play-state', 'running');
    } else {
      await page.mouse.move(box.x + 40, box.y + 40);
      await expect(track).toHaveCSS('animation-play-state', 'paused');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(track).toHaveCSS('animation-name', 'none');
    await expect(sets.nth(1)).toBeHidden();
  });

  test('the band: two white lines, the coral chip in big print, two small outlined pills and no full CTA pair', async ({ page }) => {
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
      expect((await pill.boundingBox())!.height).toBeCloseTo(42, 0);
    }
    await expect(pills.nth(1).locator('svg use')).toHaveAttribute('href', '#i-phone');
    await expect(band.locator('a', { hasText: 'Call 0800 048 0048' })).toHaveCount(0);
  });

  test('the content sections end with the CTA pair and the phone is a tel link in text', async ({ page }) => {
    const pairs = page.locator('main a[href="/claim-now/"]:has-text("Start your claim")');
    await expect(pairs).toHaveCount(4); // band pill, how, catch, handler
    const tel = page.locator('a[href="tel:08000480048"]');
    expect(await tel.count()).toBeGreaterThanOrEqual(6);
    for (const t of await tel.all()) {
      const text = (await t.textContent())?.replace(/\s+/g, ' ') ?? '';
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
    const frame = page.locator('[data-hero] > div').first();
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
    const hit = await page.evaluate(
      ([x, y]) => document.elementFromPoint(x, y)?.tagName,
      [box.x + 8, box.y + box.height * 0.5],
    );
    expect(hit).not.toBe('IMG');
    const h1 = (await page.locator('h1').boundingBox())!;
    expect(h1.x).toBeGreaterThanOrEqual(box.x);
    expect(h1.x + h1.width).toBeLessThanOrEqual(box.x + box.width);
  });

  test('header is transparent with white type over the hero, paper with the colour logo once scrolled', async ({ page, isMobile }) => {
    const header = page.getByTestId('site-header');
    await expect(header).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(header.locator('svg[data-logo="colour-on-marine"]')).toHaveCount(1);
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(header).toHaveCSS('background-color', 'rgb(247, 245, 240)');
    const logo = header.locator('svg[data-logo="colour-on-paper"]');
    await expect(logo).toHaveCount(1);
    expect((await logo.boundingBox())!.height).toBeCloseTo(isMobile ? 28 : 36, 0);
    if (!isMobile) {
      const link = header.getByRole('link', { name: 'How it works' });
      await expect(link).toHaveCSS('color', 'rgb(22, 50, 79)');
      const heights = await header.locator('div').first().boundingBox();
      expect(heights!.height).toBeCloseTo(88, 0);
    }
  });
});
