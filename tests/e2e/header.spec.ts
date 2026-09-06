import { test, expect } from '@playwright/test';

test.describe('site header', () => {
  test('desktop: wordmark, links, services dropdown, number in a coral pill', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop only');
    await page.goto('/styleguide/');
    const header = page.getByTestId('site-header');
    await expect(header).toHaveCSS('background-color', 'rgb(22, 50, 79)');
    const brand = header.getByRole('link', { name: 'Motor Claims Department, home' });
    await expect(brand).toBeVisible();
    await expect(brand.locator('svg[data-logo="mono-white"]')).toHaveCount(1);
    expect((await brand.locator('svg').boundingBox())!.height).toBeCloseTo(28, 0);
    const pill = header.getByRole('link', { name: 'Call 0800 048 0048' });
    await expect(pill).toBeVisible();
    await expect(pill).toHaveCSS('background-color', 'rgb(242, 105, 75)');
    await expect(pill.locator('svg')).toHaveCount(1);
    await expect(header.getByRole('button', { name: 'Menu' })).toBeHidden();
    const services = header.getByRole('button', { name: 'Services' });
    await expect(services).toHaveAttribute('aria-expanded', 'false');
    await services.click();
    await expect(services).toHaveAttribute('aria-expanded', 'true');
    await expect(header.getByRole('link', { name: 'Credit hire' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(services).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile: "Call now" pill between wordmark and burger, drawer with links and the full-width call button', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only');
    await page.goto('/styleguide/');
    const header = page.getByTestId('site-header');
    const pill = header.getByRole('link', { name: 'Call now' });
    await expect(pill).toBeVisible();
    expect((await header.locator('svg[data-logo="mono-white"]').boundingBox())!.height).toBeCloseTo(22, 0);
    await expect(pill).toHaveCSS('background-color', 'rgb(242, 105, 75)');
    await expect(header.getByRole('link', { name: 'Call 0800 048 0048' })).toHaveCount(0);
    const burger = header.getByRole('button', { name: 'Menu' });
    await expect(burger).toBeVisible();
    const drawer = page.getByTestId('nav-drawer');
    await expect(drawer).toBeHidden();
    await burger.click();
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveCSS('background-color', 'rgb(247, 245, 240)');
    await expect(drawer.getByRole('link', { name: 'How it works' })).toBeVisible();
    const call = drawer.getByRole('link', { name: 'Call 0800 048 0048' });
    await expect(call).toBeVisible();
    const box = await call.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(56);
    expect(box!.width).toBeGreaterThan(300);
    await expect(drawer.getByText('A person in the UK picks up.')).toBeVisible();
    await header.getByRole('button', { name: 'Close menu' }).click();
    await expect(drawer).toBeHidden();
  });
});

test('logo, favicons and manifest are the §4a set', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('footer svg[data-logo="mono-ink"]')).toHaveCount(1);
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveCount(1);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
  for (const path of ['/icon.svg', '/apple-icon.png', '/favicon.ico', '/icons/icon-512.png', '/icons/icon-1024.png', '/manifest.webmanifest']) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
});
