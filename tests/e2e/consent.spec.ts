import { test, expect } from '@playwright/test';

test.describe('tracking and consent', () => {
  test('nothing loads before consent; accepting loads GTM; declining does not', async ({ page, context }) => {
    await page.goto('/');
    const banner = page.getByTestId('consent-banner');
    await expect(banner).toBeVisible();
    await expect(page.locator('script[data-gtm]')).toHaveCount(0);
    const defaults = await page.evaluate(() => JSON.stringify(window.dataLayer?.[0]));
    expect(defaults).toContain('"analytics_storage":"denied"');
    await banner.getByRole('button', { name: 'No, just the essentials' }).click();
    await expect(banner).toBeHidden();
    await expect(page.locator('script[data-gtm]')).toHaveCount(0);
    const cookies = await context.cookies();
    const consent = cookies.find((c) => c.name === 'mcd_consent');
    expect(consent).toBeTruthy();
    expect(consent!.value).toContain('%22analytics%22%3A%22denied%22');
    // Reopen from the footer and accept
    await page.locator('footer').getByRole('button', { name: 'Cookie settings' }).click();
    await expect(banner).toBeVisible();
    await banner.getByRole('button', { name: 'Yes, measure visits' }).click();
    await expect(page.locator('script[data-gtm]')).toHaveCount(1);
    await expect(page.locator('script[data-gtm]')).toHaveAttribute('src', /googletagmanager\.com\/gtm\.js\?id=GTM-TEST0000/);
    // Next page load: loads straight away
    await page.goto('/credit-hire/');
    await expect(page.getByTestId('consent-banner')).toHaveCount(0);
    await expect(page.locator('script[data-gtm]')).toHaveCount(1);
  });

  test('tel clicks push phone_click with a placement; legal pages get page views only', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('consent-banner').getByRole('button', { name: 'No, just the essentials' }).click();
    await page.evaluate(() => {
      for (const a of Array.from(document.querySelectorAll('a[href^="tel:"]'))) a.addEventListener('click', (e) => e.preventDefault());
    });
    await page.locator('footer a[href^="tel:"]').click();
    const events = await page.evaluate(() => (window.dataLayer || []).filter((e) => e && typeof e === 'object' && 'event' in e).map((e) => e as Record<string, unknown>));
    const phone = events.find((e) => e.event === 'phone_click');
    expect(phone).toBeTruthy();
    expect(phone!.placement).toBe('footer');
    expect(events.some((e) => e.event === 'page_view' && e.page_path === '/')).toBe(true);

    await page.goto('/privacy-policy/');
    await page.evaluate(() => {
      for (const a of Array.from(document.querySelectorAll('a[href^="tel:"]'))) a.addEventListener('click', (e) => e.preventDefault());
    });
    await page.locator('footer a[href^="tel:"]').click();
    const legal = await page.evaluate(() => (window.dataLayer || []).filter((e) => e && typeof e === 'object' && 'event' in e).map((e) => e as Record<string, unknown>));
    expect(legal.some((e) => e.event === 'page_view' && e.legal === true)).toBe(true);
    expect(legal.some((e) => e.event === 'phone_click')).toBe(false);
  });
});
