# motorclaimsdepartment.co.uk — build brief for Claude Code

Fresh build. No migration, no redirects. Next.js on Vercel for the site, Railway for backend services, one Git repo. Everything below is decided unless marked **[assumption]** — those are defaults to build to now and swap later if the client says otherwise.

---

## 1. What you are building

A marketing and lead-generation site for Motor Claims Department (MCD), an independent UK accident management company for non-fault drivers. Two jobs: rank for the non-fault claims category (SEO pages), and convert paid traffic into calls and claim forms (landing pages). The phone number is the product — `0800 048 0048` appears in the nav, hero, every section CTA, footer, and a sticky call bar on mobile.

Source material in `/design/` (copy these files into the repo as-is; they are the spec):

- `MCD-brand-guidelines-v2.md` — tokens, type, components, rules. **Section 3 (colour) and 4 (type) are the design tokens. Section 6 is the component list.**
- `mcd-site-fullbleed.html` — homepage v1, signed off
- `tpl-*.html` — twelve SEO page templates (pillar, process, comparison, guide, location, article)
- `mcd-lp-goskippy-mobile-grid.html`, `mcd-lp-no-fault-accident.html` — paid landing pages (mobile-first)
- `mcd-review-carousel.html` — review band component
- `mcd-shards-*.svg`, `mcd-sweep-*.svg` — background patterns
- `motorclaimsdepartment_sitemap.html` — the approved sitemap and phasing

Treat the HTML templates as the visual and structural truth. Reproduce them as React components; do not redesign.

---

## 2. Stack

- **Next.js 15, App Router, TypeScript.** Static generation for all marketing pages; server functions only where a form posts.
- **Vercel** for the site. Preview deployments on every PR; production from `main`.
- **Railway** for backend services: the claims API (form intake, reg lookup proxy, CRM hand-off) and any queue/DB it needs. **[assumption]** Postgres on Railway for submissions; keep it minimal.
- **Git**: single repo, `main` protected, feature branches, conventional commits. `README.md` explains how to add a page.
- **Styling**: CSS Modules or vanilla CSS with the tokens as custom properties. No Tailwind — the templates are hand-written CSS and the guidelines expect exact values. No component library.
- **Fonts**: self-host Libre Franklin 900 and Public Sans 400/600/700 as WOFF2 via `next/font/local`. Never load from Google's CDN in production (GDPR).
- **Images**: `next/image`, WebP/AVIF, width and height always set, hero eager, everything else lazy. Alt text is a scene description, written by content, never generated.
- **Content**: **[assumption]** MDX files in `/content/` with frontmatter (title, description, slug, template, schema fields, lastReviewed, author). Alex Templeman writes copy; adding a page must be "add a file, open a PR". Do not add a CMS unless asked.

---

## 2a. Environments and staging

The site is not to be served from `motorclaimsdepartment.co.uk` until told. Build to Vercel's default URLs and treat them as staging.

- **No custom domain on the Vercel project at launch of staging.** Production deploys to the auto-assigned `*.vercel.app` address; every branch and PR gets its own preview URL. Do not add the root domain or `www`.
- **Optional staging subdomain:** if the client wants a branded link, add only `staging.motorclaimsdepartment.co.uk` as a custom domain (one CNAME to Vercel). The bare domain stays untouched. At go-live, the root domain and `www` are added the same way.
- **Deployment protection on** for every environment that is not the final production domain: Vercel authentication or a password, so the client and Alex can view it and search engines, ad platforms and competitors cannot.
- **Site-wide `X-Robots-Tag: noindex, nofollow`** on all non-production environments (set in `next.config` / middleware keyed off `VERCEL_ENV`), plus `<meta name="robots" content="noindex">` in the head. This is in addition to the password, not instead of it.
- **Canonical URLs point at the final domain from day one** (`https://motorclaimsdepartment.co.uk/...`), configured from a single `NEXT_PUBLIC_SITE_URL` env var, so nothing is rewritten at go-live.
- **Railway runs a staging environment too** — separate service, separate database, separate email target — so test claim submissions never reach the real claims inbox. Environment variables per environment; no secrets in the repo.
- **Go-live checklist** (do not do any of this until told): add root + `www` in Vercel; switch DNS; remove deployment protection on production only; drop the noindex for `VERCEL_ENV=production`; confirm `sitemap.xml` and `robots.txt` resolve on the real domain; submit the sitemap in Search Console.

---

## 3. Design tokens (from guidelines §3–4)

```
--ink:    #16324F   type, primary buttons, dark surfaces
--blue:   #3D6D9C   headline highlight words, links, eyebrows
--sky:    #BFD6E6   highlight underlay, tints
--stone:  #EDE9E1   section surfaces, cards on white
--paper:  #F7F5F0   page background
--white:  #FFFFFF
--coral:  #F2694B   the one bright: phone CTAs, Start your claim, icon circles
--green:  #7DC24A   functional "handled"/tick state only
--muted:  #5B6570   secondary text
--line:   #D9D4C8   hairlines
display: Libre Franklin 900
body:    Public Sans 400 / 600 / 700
radii:   cards 20px · photo frames 24px · reg field 14px · buttons and pills 999px · icon circles 50%
grid:    max-width 1140px, 24px gutters; section padding 72px desktop / 48px mobile
motion:  150–200ms ease-out; nothing moves uninvited
```

Rules that must be enforced in code, not just documented: ink text on coral/sky/green (never white); white text only on ink/blue; sentence case everywhere (no CSS uppercase); coral appears once per view as the bright, except the section CTA pair.

---

## 4. Components (build these, then compose pages from them)

Each maps to markup in the templates. Names are suggestions; keep them consistent.

- `SiteHeader` — wordmark (text placeholder until the logo exists), nav links, coral phone button. Mobile: wordmark only; `StickyCallBar` appears after the hero scrolls away.
- `Breadcrumb` — with BreadcrumbList JSON-LD.
- `HeroText` — kicker, H1, lead, CTA pair, meta line (last reviewed, author), photo placeholder slot.
- `HeroPhoto` — full-bleed photo hero from the homepage: marine scrim from the left, bottom tint, copy block at the Cazoo proportions, reg box + coral call, three transparent pills bottom-right. Mobile: tall crop, bottom scrim, stacked.
- `RegBox` — white field, "Enter your reg" label inside, placeholder AB12 CDE in Franklin 900, coral arrow. Formats input to `AB12 CDE` on the fly; accepts any case/spacing. Optional live lookup (see §7).
- `KeepsStrip` — three icon items (no excess, keep no claims, like-for-like car).
- `Toc` — sticky "On this page" from the H2s.
- `Prose` — article body styles; H2s get ids and `scroll-margin-top`.
- `Callout` — stone box with a bold lead line. Variants: default, catch.
- `Steps` — 2×2 step cards.
- `ThemUs` — the two-column table with cross/tick marks (them/us, you/we variants).
- `Faq` — `<details>` accordion, first open, with FAQPage JSON-LD generated from the same data.
- `RelatedPages` — three cards.
- `Band` — ink band: "Your insurer has a claims department. It works for your insurer. **We work for you.**" with the coral underline.
- `ReviewCarousel` — auto-scrolling, pauses on hover/touch, reduced-motion fallback to a scrollable row. Data from a JSON file until the review platform is wired.
- `ProofGrid` — 2×2 proof cards (landing pages).
- `IndependenceLine` — "Independent accident management company. Not an insurer…" strip.
- `SectionCta` — coral Start your claim + coral Call (with icon). Every content section ends with it.
- `SiteFooter` — links, phone in Franklin coral, legal line with the FCA placeholder.
- `Icon` — the solid icon set as an SVG sprite; circle variants: coral/ink, sky/ink, ink/coral.
- `Pattern` — the shard and sweep SVGs as CSS backgrounds, per colourway.

---

## 5. Page templates and routing

Routes come from the sitemap. Phase 1 live at launch, Phase 2/3 stubbed as MDX with `draft: true` so they don't build.

| Template | Component | Schema | Launch pages |
|---|---|---|---|
| Home | `HomePage` | Organization, WebSite | `/` |
| Pillar | `PillarPage` | Organization, Breadcrumb, Service or Article, FAQPage | `/accident-management-company/`, `/non-fault-accident/`, `/third-party-insurance-claim/`, `/non-fault-accident-courtesy-car/`, `/credit-hire/` |
| Process | `ProcessPage` | + HowTo with step anchors | `/how-accident-management-works/` |
| Comparison | `ComparisonPage` | + Article | `/accident-management-vs-insurance/` |
| Guide | `GuidePage` | + HowTo, no keeps strip | `/what-to-do-after-a-car-accident/` |
| Location | `LocationPage` | + LocalBusiness (address only if real) | `/accident-management-services-london/` |
| Article | `ArticlePage` | + Article, no keeps strip | `/how-to-prove-fault/rear-end-collision/`, `/side-impact-collision/`, `/car-park-accidents/` |
| Landing (paid) | `LandingPage` | none; `noindex, nofollow` | `/claim/goskippy/`, `/claim/no-fault-accident/` (+ one per insurer, from the same template with a config file) |
| Utility | `UtilityPage` | Organization | `/claim-now/`, `/about-us/`, `/contact-us/`, `/privacy-policy/`, `/terms/`, `/complaints/`, `/cookies/` |

Slug rules: trailing slashes on, lowercase, `non-fault` on the site, `no-fault` only inside `/claim/`. `/how-it-works/` does not exist — it is `/how-accident-management-works/`.

Generate `sitemap.xml` (excluding `/claim/*` and drafts), `robots.txt` (disallow `/claim/`), a branded 404, and `manifest` / favicons once the logo exists.

Schema is generated from frontmatter + page data, never hand-typed, so FAQ schema always matches the visible FAQ.

---

## 6. Landing pages (`/claim/*`)

Mobile-first pages from `mcd-lp-goskippy-mobile-grid.html` and `mcd-lp-no-fault-accident.html`. Insurer pages are one template plus a config: insurer name, H1, any sourced facts with `source`, `sourceUrl`, `checkedOn` fields rendered verbatim with the date. Rules that must hold in code:

- `noindex, nofollow`; excluded from sitemap; canonical to self.
- Insurer name appears only where the config puts it (H1 and the independence line). Never in ad copy — that's the ads account's job, but the page must not depend on it.
- The independence line renders on every landing page, directly under the hero.
- "Call now" pill is the primary CTA; online CTA sits at the fold; sticky call bar appears after the hero.
- Proof-row claims (avg wait, timings) come from a single `claims.json` with a `substantiated: true|false` flag; unsubstantiated ones do not render. This is how compliance is enforced.

---

## 7. Claim-now and the reg box

**[assumption]** Until the client specs it: a three-step form — reg + contact details → what happened (date, where, other driver's details, whose fault, photos optional) → confirm. Posts to the Railway API, which stores the submission, emails the claims team, and later hands off to the CRM/Proclaim integration. Server-side validation, honeypot + rate limiting, no third-party form SaaS.

Reg lookup: **[assumption]** off at launch. If enabled, proxy the DVLA Vehicle Enquiry API through Railway (never expose the key), show make/model/colour back to the user as confirmation only, and add it to the privacy policy.

The phone number on every page is a `tel:` link. Call tracking (dynamic number insertion) is added via the tag manager, so the number must render as text inside a stable element, not an image.

---

## 8. Tracking and consent

- Google Tag Manager, with GA4 and Google Ads conversion tags loaded only after consent.
- A consent banner in the brand style (not a stock CMP look), two choices, no dark patterns, revisitable from the footer. **[assumption]** Cookiebot or an open-source CMP wired to GTM consent mode v2.
- Conversions: form submit (thank-you route), `tel:` click, reg-box submit. Fire as GTM events with a documented `dataLayer` spec.
- No tracking on the legal pages beyond page views.

---

## 9. Performance, accessibility, SEO baseline

- Lighthouse mobile: Performance ≥ 90, Accessibility 100, SEO 100 on every template. Budget: LCP < 2.0s on 4G, CLS < 0.05, total JS < 100KB on marketing pages (the carousel is CSS; keep it that way).
- Semantic landmarks, skip link, visible focus rings (2px ink, 2px offset; white on dark), touch targets ≥ 44px, every icon labelled or hidden, every image with alt. Reg field has a real `<label>`.
- One H1 per page, H2s with ids matching the TOC, canonical on every page, OG/Twitter tags from frontmatter, `max-image-preview:large`.
- Test the fold: on a 390×844 viewport the landing-page hero must show headline, instruction, sub, proof grid, call pill, wait row, with the online CTA touching the bottom edge. Add a Playwright test that measures it.

---

## 10. Content workflow

- `/content/<section>/<slug>.mdx` with frontmatter: `title`, `description`, `template`, `kicker`, `h1`, `lastReviewed`, `author`, `faq[]`, `related[]`, `schemaType`, `draft`.
- Alex adds pages by PR. Vercel preview link on every PR. A `pnpm new-page --template pillar --slug ...` script scaffolds the file from the template's lorem-ipsum version.
- Lint: no exclamation marks, no all-caps headings, no "week(s)" phrasing, no "premium won't go up", banned-word list in `content.rules.json`. Fail the build on a hit.

---

## 11. Placeholders to wire when the client supplies them

- Logo / favicon (wordmark is text until then)
- FCA status line and firm reference number in the footer — render a visible `[TODO]` in preview, block production build if unset
- The catch wording (pending MCD's policy on failed claims)
- Real reviews feed; real handler names/photos; London local content
- `claims.json` substantiation flags flipped to true only with evidence

---

## 12. Definition of done for launch

- All Phase 1 routes build and pass Lighthouse targets
- Landing pages `noindex`, excluded from sitemap, independence line present, fold test passing
- Form posts to Railway, stores, emails, returns a thank-you route that fires the conversion
- Consent gating verified; no tags before consent
- Legal pages present; FCA placeholder resolved or build blocked
- README covers: run locally, add a page, add an insurer landing page, deploy, and the go-live checklist from §2a
- Staging verified: no custom domain, deployment protection on, noindex header present, canonicals pointing at the final domain, Railway staging isolated
