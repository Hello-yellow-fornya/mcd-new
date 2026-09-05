# motorclaimsdepartment.co.uk

Marketing and lead-generation site for Motor Claims Department. Next.js 15 (App Router, TypeScript) on Vercel; the claims API runs on Railway. `CLAUDE.md` is the build brief; everything in `design/` is the visual and structural spec and is reproduced, not redesigned.

## Run locally

Requires Node 22.18 or later (the unit tests rely on Node’s built-in type stripping) and pnpm 10; `corepack enable` gives you the pinned version.

```bash
pnpm install
cp .env.example .env.local   # optional; defaults are fine
pnpm dev                     # http://localhost:3000
```

Checks, all of which also run in CI and before every build:

```bash
pnpm check          # typecheck + eslint + content lint + css lint + unit tests
pnpm lint:content   # brief §10 rules over content/  (fails the build on a hit)
pnpm lint:css       # brand rules that live in code: no uppercase, no italics, ink on the bright
pnpm test           # unit tests (node --test)
pnpm test:e2e       # Playwright, against a production build (run `pnpm exec playwright install` once)
```

## Environments and staging

Nothing is served from `motorclaimsdepartment.co.uk` until told. Vercel's auto-assigned URLs are staging.

| | Vercel production (`main`) | Vercel preview (every branch and PR) |
|---|---|---|
| `VERCEL_ENV` | `production` | `preview` |
| Custom domain | none at launch of staging (optionally `staging.motorclaimsdepartment.co.uk`) | none |
| Deployment protection | **on** until go-live | **on** |
| `X-Robots-Tag: noindex, nofollow` + `<meta name="robots" content="noindex">` | only once `VERCEL_ENV=production` is the real domain | always |
| Canonical URLs | `https://motorclaimsdepartment.co.uk/...` | same |

- Robots behaviour keys off `VERCEL_ENV` at build time in `next.config.ts` and `src/app/layout.tsx` (logic in `src/lib/staging.ts`).
- Canonical, Open Graph and sitemap URLs come from a single `NEXT_PUBLIC_SITE_URL`, defaulting to the final domain, so nothing is rewritten at go-live.
- Deployment protection is a Vercel project setting (Settings → Deployment Protection): Vercel authentication or a password on every environment that is not the final production domain. It sits on top of the noindex, not instead of it.
- Per-environment variables live in Vercel and Railway. No secrets in the repo; `.env.example` lists what exists.

## Project layout

```
CLAUDE.md               the build brief
design/                 brand guidelines, signed-off HTML mockups, SVG patterns, sitemap
content/                MDX pages with frontmatter (step 4)
content.rules.json      content lint rules (brief §10)
scripts/                lint-content.mjs, lint-css.mjs
src/app/                App Router routes and global CSS
src/fonts/              self-hosted Libre Franklin 900 and Public Sans 400/600/700 (WOFF2, SIL OFL)
src/lib/                site config, staging behaviour
src/styles/tokens.css   design tokens from guidelines §3–5 as custom properties
tests/unit/             node --test
tests/e2e/              Playwright
```

## Design tokens

`src/styles/tokens.css` holds the exact values from the guidelines: colours, contrast pairings (`--on-coral`, `--on-ink`, …), type faces and scale, radii, grid, spacing, shadow, motion and focus ring. Components use tokens, never raw values. Three rules are enforced by `pnpm lint:css` rather than documented:

- sentence case everywhere: no `text-transform: uppercase` (the reg placeholder is the one exception, marked `/* allow: uppercase */`)
- never italics
- ink text on coral, sky and green, never white; white type only on ink and blue

## Components

`src/components/` holds the set from brief §4, one folder per component with its CSS module, exported from `src/components/index.ts`. Markup and values come from the mockups in `design/`; copy comes from `src/data/copy.ts` so the approved words live in one place. `/styleguide/` renders every component with its variants on staging (it returns 404 on production).

- Icons are one SVG sprite (`Sprite` in the root layout) drawn from the mockups; `IconCircle` gives the coral, sky and ink circles.
- `StickyCallBar` sits in the root layout and shows on mobile once the element marked `data-hero` has scrolled away.
- `ReviewCarousel` reads `src/data/reviews.json`; while `sample` is true it does not render on production.
- `SiteFooter` reads `FCA_STATUS_LINE`; a `[TODO]` shows on preview and the production build stops until it is set.

## Add a page

Pages are MDX files under `content/<section>/<slug>.mdx`. The route comes from the `slug` in the frontmatter, not the folder. Adding a page is "add a file, open a PR"; every PR gets a Vercel preview.

```bash
pnpm new-page --template pillar --slug /accident-recovery/ --title "Accident recovery"
```

That copies the template's lorem-ipsum skeleton from `content/_templates/` as a draft. Write the page, remove `draft: true`, open a PR. Frontmatter fields (brief §10):

| Field | Purpose |
|---|---|
| `slug`, `template` | The route and one of `pillar`, `process`, `comparison`, `guide`, `location`, `article`, `utility` |
| `title`, `description` | `<title>` (≤60 characters) and meta description (≤155) |
| `kicker`, `h1`, `lead` | The hero |
| `lastReviewed`, `author` | The meta line and Article schema |
| `breadcrumb` | Parent pages in order; Home is added |
| `photo` | `alt` and a production `note` until the real photo exists |
| `faq` | Rendered after the body and emitted as FAQPage schema from the same data |
| `related` | Slugs of related pages; drafts are dropped at build time |
| `schemaType`, `steps` | Override the template's schema; HowTo steps by heading id |
| `draft` | `true` keeps the page out of the build and the sitemap |

In the body: H2s become the "On this page" list (ids are GitHub-style slugs of the heading text; H2s starting "Step 1." feed HowTo schema), and `<Callout>`, `<Steps>`, `<ThemUs>`, `<Figure>` and `<Muted>` are available. Links to pages that do not build yet render as plain text, so nothing 404s.

`pnpm stubs` creates a draft file for every sitemap page that has none; drafts for Phase 2 and 3 are already in place. `pnpm lint:content` runs before every build and stops it on an exclamation mark, an all-caps heading, "week(s)", or a banned phrase.

## Add an insurer landing page

Landing pages live at `/claim/<slug>/`, one JSON config each in `src/data/landing/`, rendered by `src/templates/LandingPage.tsx` from `design/mcd-lp-*.html`. Copy `goskippy.json`, change `slug`, `insurer`, `title`, `description`, `h1` and the FAQ, and the page builds; the insurer name only ever appears in the H1 and the independence line. Proof cards and the wait row reference ids in `src/data/claims.json`; a claim renders on production only when `substantiated: true` and `evidence` is filled (on previews unsubstantiated claims render with a dotted outline so the layout can be reviewed). Sourced facts go in `facts[]` with `source`, `sourceUrl` and `checkedOn`, rendered verbatim with the date.

Every `/claim/*` page is `noindex, nofollow`, excluded from the sitemap, canonical to itself. The fold test in `tests/e2e/landing.spec.ts` checks the 390×844 layout.

## Navigation

`src/data/copy.ts` holds the header links. For launch, "Services" lists the five Phase 1 pillars in sitemap order and "Advice" points at the accident guide. When the service children come out of draft in Phase 2: move the five pillars to the top-level links, put the service children under "Services", and point "Advice" at `/resource/` (one line each).

## Claim-now and the claims API

`/claim-now/` is the hero and the reg box. The reg box posts to `/api/claim-start/` (a Next route handler: honeypot, rate limit, reg validation), which forwards to the Railway API when `CLAIMS_API_URL` and `CLAIMS_API_KEY` are set and otherwise acknowledges with a stub reference. The question flow is Ollie's and mounts on `#claim-flow` (`data-claim-flow-mount`, with `data-ref` and `data-reg` once the reg is accepted); when it completes it sends the visitor to `/claim-now/thank-you/?ref=…`, which fires the conversion. The Railway service and schema are in `api/` with their own README.

## Tracking and consent

See `docs/tracking.md`: GTM loads only after consent, the banner is the brand's own, the choice is one cookie, and every `dataLayer` event is specified there.

## Deploy

Push to a branch and open a PR: Vercel builds a preview and comments the URL. Merging to `main` deploys production (still the `*.vercel.app` address until go-live). `pnpm build` runs the content and CSS lints first and stops on a hit.

## Go-live checklist (brief §2a)

Do none of this until told.

1. Add the root domain and `www` to the Vercel project.
2. Switch DNS.
3. Remove deployment protection on production only.
4. Confirm `VERCEL_ENV=production` drops the noindex header and meta on the real domain.
5. Confirm `sitemap.xml` and `robots.txt` resolve on the real domain.
6. Submit the sitemap in Search Console.
