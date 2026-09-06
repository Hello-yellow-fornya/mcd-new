import { test, expect } from '@playwright/test';

/** The theme mechanism: which skin a build carries, and that a 2.0 build carries nothing of 3.0. */
const theme = process.env.NEXT_PUBLIC_THEME === 'mcd3' ? 'mcd3' : 'mcd2';

test(`the build is the ${theme} theme`, async ({ page, request }) => {
  await page.goto('/');
  const html = page.locator('html');
  if (theme === 'mcd3') {
    await expect(html).toHaveAttribute('data-theme', 'mcd3');
    await expect(page.locator('link[rel="preload"][as="font"][href*="quicksand"]')).toHaveCount(1);
    expect((await request.get('/fonts/quicksand-latin-wght.woff2')).status()).toBe(200);
    await expect(page.locator('body')).toHaveCSS('font-family', /Quicksand/);
    // Layout rules §7: never coral, never marine on the yellow brand; icons never yellow
    const offBrand = await page.evaluate(() => {
      const bad = new Set(['rgb(242, 105, 75)', 'rgb(22, 50, 79)', 'rgb(191, 214, 230)', 'rgb(61, 109, 156)']);
      const out: string[] = [];
      for (const el of Array.from(document.querySelectorAll<HTMLElement>('body *'))) {
        const cs = getComputedStyle(el);
        if (bad.has(cs.backgroundColor) || bad.has(cs.color) || bad.has(cs.borderTopColor)) out.push(`${el.tagName}.${el.className}`);
        if (el.matches('[data-icon-circle] svg') && cs.color === 'rgb(255, 212, 0)') out.push(`yellow icon: ${el.parentElement?.className}`);
      }
      return out.slice(0, 10);
    });
    expect(offBrand).toEqual([]);
  } else {
    expect(await html.getAttribute('data-theme')).toBeNull();
    await expect(page.locator('link[rel="preload"][as="font"][href*="quicksand"]')).toHaveCount(0);
    await expect(page.locator('body')).toHaveCSS('font-family', /Public Sans/);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(247, 245, 240)');
    // No Quicksand face is ever requested on a 2.0 build
    const fonts = await page.evaluate(() => performance.getEntriesByType('resource').map((e) => e.name).filter((n) => /\.woff2/.test(n)));
    expect(fonts.some((n) => n.includes('quicksand'))).toBe(false);
  }
});

test(`the claim start posts source ${theme === 'mcd3' ? '"mcd3"' : 'from the page'}`, async ({ page }) => {
  // Observe the body the browser sends; the stub answers without an API
  await page.goto('/claim-now/');
  const [req] = await Promise.all([
    page.waitForRequest((r) => r.url().includes('/api/claim-start') && r.method() === 'POST'),
    page.getByLabel('Enter your reg').fill('AB12CDE').then(() => page.getByRole('button', { name: 'Start your claim' }).click()),
  ]);
  expect(req.postDataJSON()).toMatchObject({ reg: 'AB12CDE' });
});
