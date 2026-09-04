import { test, expect } from '@playwright/test';

test.describe('styleguide components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/styleguide/');
  });

  test('FAQ: first item open, JSON-LD mirrors the visible questions', async ({ page }) => {
    const details = page.locator('#catch details');
    await expect(details.first()).toHaveAttribute('open', '');
    await expect(details.nth(1)).not.toHaveAttribute('open', '');
    const questions = await details.locator('summary').allTextContents();
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const faq = blocks.map((b) => JSON.parse(b)).find((d) => d['@type'] === 'FAQPage');
    expect(faq).toBeTruthy();
    expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(questions);
  });

  test('Breadcrumb emits BreadcrumbList with absolute URLs on the final domain', async ({ page }) => {
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const crumbs = blocks.map((b) => JSON.parse(b)).find((d) => d['@type'] === 'BreadcrumbList');
    expect(crumbs.itemListElement[0].item).toBe('https://motorclaimsdepartment.co.uk/');
    expect(crumbs.itemListElement.at(-1).item).toBe('https://motorclaimsdepartment.co.uk/how-accident-management-works/');
  });

  test('RegBox formats as you type and hands the reg to the claim form', async ({ page }) => {
    const box = page.getByTestId('regbox').first();
    const input = box.getByLabel('Enter your reg');
    await input.fill('ab12cde');
    await expect(input).toHaveValue('AB12 CDE');
    await box.getByRole('button', { name: 'Start your claim' }).click();
    await expect(page).toHaveURL(/\/claim-now\/\?reg=AB12CDE$/);
  });

  test('every coral surface carries ink-900 text, and nothing but the reg input is uppercase', async ({ page }) => {
    const bad = await page.evaluate(() => {
      const coral = 'rgb(242, 105, 75)';
      const ink900 = 'rgb(15, 36, 56)';
      const out: string[] = [];
      for (const el of Array.from(document.querySelectorAll('body *'))) {
        const cs = getComputedStyle(el);
        if (cs.backgroundColor === coral && cs.color !== ink900 && el.textContent?.trim()) out.push(`coral: ${el.tagName}.${el.className} ${cs.color}`);
        if (cs.textTransform === 'uppercase' && !(el instanceof HTMLInputElement)) out.push(`uppercase: ${el.tagName}.${el.className}`);
        if (cs.fontStyle === 'italic') out.push(`italic: ${el.tagName}.${el.className}`);
      }
      return out;
    });
    expect(bad).toEqual([]);
  });

  test('review carousel renders the set twice and honours reduced motion', async ({ page }) => {
    const cards = page.locator('section[aria-label="Customer reviews"] article');
    await expect(cards).toHaveCount(8);
    await expect(cards.nth(4)).toHaveAttribute('aria-hidden', 'true');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const anim = await cards.first().evaluate((el) => getComputedStyle(el.parentElement!).animationName);
    expect(anim).toBe('none');
  });

  test('independence line and legal placeholder are present', async ({ page }) => {
    await expect(page.getByTestId('independence-line')).toContainText('Not GoSkippy, not an insurer');
    await expect(page.getByTestId('legal-line')).toContainText('[TODO: regulatory status');
  });
});

test.describe('sticky call bar', () => {
  test('mobile: hidden over the hero, shown once it has scrolled away', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only');
    await page.goto('/styleguide/');
    const bar = page.getByTestId('sticky-call-bar');
    await expect(bar).toHaveAttribute('inert', '');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await expect(bar).not.toHaveAttribute('inert', '');
    await expect(bar.getByRole('link', { name: 'Call 0800 048 0048' })).toBeVisible();
  });

  test('desktop: never shown', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop only');
    await page.goto('/styleguide/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByTestId('sticky-call-bar')).toBeHidden();
  });
});
