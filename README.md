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

## Add a page

Coming in step 4 with the page templates: `content/<section>/<slug>.mdx` with frontmatter, and `pnpm new-page --template pillar --slug ...` to scaffold from the template's lorem-ipsum version. Adding a page is "add a file, open a PR"; every PR gets a Vercel preview link.

## Add an insurer landing page

Coming in step 5: one template plus a config file per insurer under `/claim/`.

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
