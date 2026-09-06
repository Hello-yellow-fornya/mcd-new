import { test, expect } from '@playwright/test';

test.describe('claim-now', () => {
  test('reg box posts to the stub endpoint, shows the reference and exposes the flow mount', async ({ page }) => {
    await page.goto('/claim-now/?reg=ab12cde');
    await page.getByTestId('consent-banner').getByRole('button', { name: 'No, just the essentials' }).click();
    const input = page.getByLabel('Enter your reg');
    await expect(input).toHaveValue('AB12 CDE');
    await page.getByRole('button', { name: 'Start your claim' }).click();
    const started = page.getByTestId('claim-started');
    await expect(started).toBeVisible();
    await expect(started).toContainText('Reg AB12 CDE received');
    await expect(started).toContainText(/MCD-[A-Z0-9]{6}/);
    const mount = page.locator('#claim-flow[data-claim-flow-mount]');
    await expect(mount).toHaveCount(1);
    await expect(mount).toHaveAttribute('data-reg', 'AB12 CDE');
    const events = await page.evaluate(() => (window.dataLayer || []).map((e) => (e as { event?: string }).event).filter(Boolean));
    expect(events).toContain('reg_submit');
    expect(events).toContain('claim_start');
  });

  test('endpoint validates, honours the honeypot and rate-limits', async ({ request }) => {
    const bad = await request.post('/api/claim-start/', { data: { reg: 'ABCDEFG' } });
    expect(bad.status()).toBe(422);
    const honey = await request.post('/api/claim-start/', { data: { reg: 'AB12CDE', website: 'http://spam' } });
    expect(honey.status()).toBe(202);
    const ok = await request.post('/api/claim-start/', { data: { reg: 'ab12 cde' } });
    expect(ok.status()).toBe(202);
    expect((await ok.json()).reg).toBe('AB12CDE');
    let last = 202;
    for (let i = 0; i < 12; i++) last = (await request.post('/api/claim-start/', { data: { reg: 'AB12CDE' }, headers: { 'x-forwarded-for': '203.0.113.9' } })).status();
    expect(last).toBe(429);
  });

  test('thank-you route fires the conversion and is not indexed', async ({ page }) => {
    await page.goto('/claim-now/thank-you/?ref=MCD-TEST01');
    await expect(page.locator('meta[name="robots"]:not([data-host])')).toHaveAttribute('content', /noindex/);
    const events = await page.evaluate(() => (window.dataLayer || []).filter((e) => (e as { event?: string }).event === 'claim_submitted') as { ref?: string }[]);
    expect(events).toHaveLength(1);
    expect(events[0].ref).toBe('MCD-TEST01');
  });
});
