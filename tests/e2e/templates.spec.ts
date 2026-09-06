import { test, expect } from '@playwright/test';
import { colours as c } from './theme';

const phase1 = [
  ['/accident-management-company/', 'pillar', true],
  ['/non-fault-accident/', 'pillar', true],
  ['/third-party-insurance-claim/', 'pillar', true],
  ['/non-fault-accident-courtesy-car/', 'pillar', true],
  ['/credit-hire/', 'pillar', true],
  ['/how-accident-management-works/', 'process', true],
  ['/accident-management-vs-insurance/', 'comparison', true],
  ['/what-to-do-after-a-car-accident/', 'guide', false],
  ['/accident-management-services-london/', 'location', true],
  ['/how-to-prove-fault/rear-end-collision/', 'article', false],
  ['/how-to-prove-fault/side-impact-collision/', 'article', false],
  ['/how-to-prove-fault/car-park-accidents/', 'article', false],
] as const;

const utility = ['/claim-now/', '/about-us/', '/contact-us/', '/privacy-policy/', '/terms/', '/complaints/', '/cookies/'];

test.describe('phase 1 routes', () => {
  for (const [path, template, keeps] of phase1) {
    test(`${path} (${template})`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://motorclaimsdepartment.co.uk${path}`);
      await expect(page.locator('nav[aria-label="Breadcrumb"] [aria-current="page"]')).toHaveCount(1);
      await expect(page.locator('section[aria-label="What you keep"]')).toHaveCount(keeps ? 1 : 0);
      // TOC entries point at H2s that exist, in order
      const tocIds = (await page.locator('aside[aria-label="On this page"] a').evaluateAll((as) => as.map((a) => a.getAttribute('href')!.slice(1))));
      const h2Ids = await page.locator('main article h2').evaluateAll((hs) => hs.map((h) => h.id));
      expect(h2Ids).toEqual(tocIds);
      // FAQ schema mirrors the visible questions; the first answer is open
      const questions = await page.locator('main details summary').allTextContents();
      const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').last().textContent())!)['@graph'];
      const faq = graph.find((n: { '@type': string }) => n['@type'] === 'FAQPage');
      expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(questions);
      await expect(page.locator('main details').first()).toHaveAttribute('open', '');
      expect(graph.map((n: { '@type': string }) => n['@type'])).toContain('BreadcrumbList');
      // The CTA rule: hero Start is ink, Call is coral; section pair both coral
      const heroStart = page.locator('main a[href="/claim-now/"]').first();
      await expect(heroStart).toHaveCSS('background-color', c.ink);
      // No link to a page that does not build yet
      const hrefs = await page.locator('main a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
      for (const h of hrefs) {
        const r = await page.request.get(h);
        expect(r.status(), h).toBe(200);
      }
    });
  }

  test('process page carries HowTo with step anchors that exist', async ({ page }) => {
    await page.goto('/how-accident-management-works/');
    const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').last().textContent())!)['@graph'];
    const howto = graph.find((n: { '@type': string }) => n['@type'] === 'HowTo');
    expect(howto.step).toHaveLength(4);
    for (const s of howto.step) {
      const id = s.url.split('#')[1];
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test('pillar carries Service schema; location carries LocalBusiness without an address', async ({ page }) => {
    await page.goto('/accident-management-company/');
    let graph = JSON.parse((await page.locator('script[type="application/ld+json"]').last().textContent())!)['@graph'];
    expect(graph.some((n: { '@type': string }) => n['@type'] === 'Service')).toBe(true);
    await page.goto('/accident-management-services-london/');
    graph = JSON.parse((await page.locator('script[type="application/ld+json"]').last().textContent())!)['@graph'];
    const lb = graph.find((n: { '@type': string }) => n['@type'] === 'LocalBusiness');
    expect(lb).toBeTruthy();
    expect(lb.address).toBeUndefined();
  });

  for (const path of utility) {
    test(`utility ${path}`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('aside[aria-label="On this page"]')).toHaveCount(0);
      await expect(page.locator('section[aria-label="What you keep"]')).toHaveCount(0);
    });
  }

  test('drafts do not build, the 404 is branded, sitemap and robots follow the rules', async ({ page, request }) => {
    const draft = await request.get('/accident-recovery/');
    expect(draft.status()).toBe(404);
    await page.goto('/accident-recovery/');
    await expect(page.locator('h1')).toHaveText('That page isn’t here.');
    await expect(page.getByRole('link', { name: 'Call 0800 048 0048' }).first()).toBeVisible();
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('https://motorclaimsdepartment.co.uk/credit-hire/');
    expect(sitemap).not.toContain('/accident-recovery/');
    expect(sitemap).not.toContain('/styleguide/');
    expect(sitemap).not.toContain('/claim/');
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap: https://motorclaimsdepartment.co.uk/sitemap.xml');
  });
});
