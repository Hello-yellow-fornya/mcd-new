# MCD 3.0: the yellow skin

A third variation for the client to choose from: the same site, pages, copy rules, claim form and API as 2.0 with a different visual skin, built as a theme in this repo and deployed to its own Vercel project so 2.0 and 3.0 sit side by side.

## Where it lives

- `src/lib/theme.ts`: `NEXT_PUBLIC_THEME=mcd3` selects it (a preview build on an `mcd3/…` branch does too). Unset builds 2.0 unchanged.
- `src/themes/mcd3/`: `theme.css` (tokens and the shared-component overrides), `Home.tsx` (the 3.0 homepage), `copy.ts` (the 3.0 framing copy), `Wordmark.tsx`, `SpriteLine.tsx` (the 1.8px line icons, same ids as the 2.0 sprite), `Illustration.tsx`, `ThemeHead.tsx` (the Quicksand preload).
- Shared components branch on `isMcd3` only where the skin differs: the header (wordmark, number as text, ink Start pill, ink Call now pill on mobile), the footer (ink), the sprite, the homepage route.
- Every other page (landing pages, claim-now, about, contact, legal, the SEO templates) is the 2.0 page under the 3.0 tokens.

## Tokens

Safety Yellow `#FFD400`, ink `#19180F`, cream `#F7F5EF`, white, body grey `#54524A`, ochre `#B08900`, pale `#FFF6C9`, hairline `#E6E2D6`. Ink on yellow. Yellow only in the hero, chips and icon circles; cream and white alternate; ink for the final CTA and the footer. Quicksand 500/600/700 only, self-hosted (`public/fonts`, OFL in `src/fonts/LICENSE-quicksand.txt`). Sentence case.

## Built to the brief, not yet to the files

The four 3.0 design files named in the brief (`mcd-homepage-concept-guidelines-v1.html`, `mcd-homepage-mobile-guidelines-v1.html`, `MCD-brand-guidelines-v1-original.pdf`, `MCD-layout-rules.md`) were not in `/design/` on any branch when this was built. The skin follows the brief's written values. When the files land, reconcile:

- **Copy.** The three worries, the shortcut heading and sub, the who-we-help note and the FAQ heading are drafted in `src/themes/mcd3/copy.ts` and marked `[assumption]`. Headline, lead, steps, comparison rows, FAQ items, band lines and CTA labels are the shared 2.0 copy.
- **Illustration.** `Illustration.tsx` is a bold-outline car and keys drawn to the description; swap in the SVG from the desktop file.
- **Layout values.** Section paddings, card radii and the hero proportions are the 2.0 values under 3.0 tokens.
- **Rulebook.** `tests/e2e/rulebook.spec.ts` encodes the rules as listed in the brief; check the wording of each against `MCD-layout-rules.md`, especially "not the largest gap on screen", read here as "smaller than the content block above or below it, with every other gap fixed".

## Known differences from a clean 3.0 build

- A 3.0 build still preloads the three 2.0 font files (`next/font` registers them from the layout); they are not used for any text. A 2.0 build loads nothing of 3.0.
- The favicon and app icons are the 2.0 mark on both builds.

## Hosting

See the README: the `mcd-new-3` project needs creating in the Vercel dashboard or with a token (none was available in the build session), with `NEXT_PUBLIC_THEME=mcd3`, `NEXT_PUBLIC_SITE_URL=https://mcd-new-3.vercel.app`, the shared variables, and deployment protection. The 3.0 build posts `source: "mcd3"` to the shared claims API; no new Railway service.

## Tests

`pnpm test:e2e` (2.0, port 3100) and `pnpm test:e2e:mcd3` (3.0, port 3101). The rulebook, theme, staging, landing, claim-now, consent, templates and components specs run on both; `home.spec.ts` is the 2.0 homepage and `home-mcd3.spec.ts` the 3.0 one.
