# Design files versus the build

Written 5 September 2026 after `design/mcd-nav-bar-marine.png`, `design/MCD-design-system-brief-claude-design.md` and the two logo PNGs landed. Nothing here has been changed in the build; each line is a difference for a decision. Where the consolidated instructions of 4 September already decided an item, it is marked **decided** and listed for completeness.

## A. The header against `mcd-nav-bar-marine.png`

Three states in the PNG: desktop, mobile, mobile with the menu open.

| State | In the PNG | In the build | Note |
|---|---|---|---|
| Desktop links | How it works · Non-fault accident · Services ▾ · Advice · About, in that order | Services ▾ · How it works · vs your insurer · Advice | The build follows the SEO templates' nav plus the "Services lists the Phase 1 pillars" decision. The PNG has no "vs your insurer", adds "About" (`/about-us/` exists) and "Non-fault accident" at top level, and puts Services third. |
| Desktop phone pill | Solid phone icon + `0800 048 0048`, no "Call" | Solid phone icon + `Call 0800 048 0048` | The brief text says "desktop shows the number"; the PNG shows the number alone. |
| Desktop wordmark | "motor claims department" as text, Franklin, white | The §4a mono white lockup, 28px | **Decided**: the logo supersedes the PNG's text wordmark. |
| Active link | White, 2px coral underline sitting under the text with a gap | Same | Match. |
| Mobile closed | Wordmark · "Call now" pill · burger | Logo · "Call now" pill · burger | Match apart from the wordmark → logo. |
| Mobile open, header | Burger becomes an × | Same (the three lines animate to an ×) | Match. |
| Mobile open, links | How it works · Non-fault accident · Services · Advice · About, one level, hairline above the first and between each | Services with five indented children · How it works · vs your insurer · Advice; hairline under each item, none above the first | Same link-set difference as desktop, plus the build nests the Services children in the drawer where the PNG shows Services as one line. The top hairline is missing in the build. |
| Mobile open, call button | Full-width coral `Call 0800 048 0048` with the icon, then "A person in the UK picks up." in muted text | Same | Match. |
| Bar heights | Not measurable from the PNG | 72px / 64px per the brief | — |
| Transparent-over-hero state | Not in the PNG | Built for the homepage per the brief, with a light marine tint across the top of the photo so the links stay legible | The tint is my addition; the brief only says "transparent". |

## B. `MCD-design-system-brief-claude-design.md` against the build, by section

### §0 How to use this
- The brief lists reference files that are not in `/design/`: `mcd-mobile-hero-v2-bottom.html`, `mcd-mobile-hero-v2-overlay.html`, `mcd-image-treatment-hero-regbox.html`, `mcd-splash-dark-shards-six.png`, `mcd-splash-plain-six.png`, and `mcd-shards-light-*` (parked). The mobile hero and the desktop photo hero were built from `mcd-site-fullbleed.html` instead.
- The brief says "the file wins for appearance"; the `mcd-logo-mono-and-square.png` named in `CLAUDE.md` §4a is not in the repo either. The lockup was built from the §4a spec and checked by eye against `mcd-logo-motor-mark.png`.

### §1 The brand in one paragraph
- **Homepage H1** is "Hit by someone else? You shouldn't pay for it." from the signed-off `mcd-site-fullbleed.html`. It is not in the brief's approved headline set ("use these and nothing invented"). The landing pages use "Call us before you call your insurer." and "The smarter way to claim for no-fault accidents." as specified.
- The band wording matches.

### §2.1 Colour tokens
- `color.marine.700` #214A73 exists in the build as `--marine-lift`, unused so far: icon circles on dark surfaces use ink with a coral icon, as drawn in the landing mockups (`.gic`), not marine-700.
- "Ink text on coral" — **decided**: `--ink-900` on coral. The copy of `CLAUDE.md` on `main` reverted §3 to the old wording and dropped the `--ink-900` line; the merged copy on this branch keeps it.
- The parked palettes (Original, Splash, Ledger v2) are not documented anywhere in the build. The brief asks for an appendix.
- The usage split (42/28/20/6/4) is not measured.

### §2.2 Type
- **Display L (landing H1) "58 → 44px"**: the build sets 58px at every width, as the landing mockups do at 390px. No 44px step exists.
- **Highlight on dark**: the brief gives `inset 0 -0.18em 0 coral`; the build uses `-0.25em` for the band (from `mcd-site-fullbleed.html`) and `-0.20em` on the landing pages (from the landing mockups). "White underline on coral" has no use in the build yet.
- `text-wrap: balance` is on every H1; not on H2s.
- Body 600 exists as its own non-preloaded family (**decided**).

### §2.3 Space, shape, elevation, motion
- Matches. Reg card shadow, landing call-pill shadow and sticky-bar shadow are as stated. Reduced motion stops the carousel.

### §3.1 Patterns
- Matches the chosen set. The band on the homepage and landing pages uses ink shards; the landing hero uses stone shards; "pattern behind copy is the low-contrast version" is met by the subtle files.

### §3.2 Splash format
- **Not built.** No `Splash` component; the two reference PNGs are not in the repo.

### §3.3 Icons
- Eleven of the fourteen icons exist (phone, tick, £, car, person, shield, bolt, star, cross, arrow, dot). **Missing**: keys, clock, document, question, road, speech bubble, wrench. None are drawn in any file, so none were invented.
- Circle on dark: the brief says marine-700/coral; the build uses ink/coral (see §2.1).
- "Never coral alone": the landing wait row uses green-tint circles with green-deep marks from the landing mockups, which are also not in the token table.

### §3.4 Photography
- Every photo is a placeholder except the homepage hero, which is the mockup's AI image. The two-crop rule is anticipated: the hero takes a desktop image and a separate mobile crop through `<picture>`.

### §3.5 Logo
- **Superseded** by `CLAUDE.md` §4a; built. Open points on the build of §4a itself:
  - `CLAUDE.md` §4 sets the header lockup at 28px tall and §4a sets a 120px minimum width. At 28px tall the lockup is 84px wide; 120px wide is 40px tall. The header is built at 28px / 22px as §4 says. The "small, nav size" panel in `mcd-logo-motor-mark.png` looks nearer 40px.
  - "CLAIMS DEPARTMENT" fitted to MOTOR's width comes out at a 5.4px cap height inside a 28px lockup (4.2px at 22px). Legible on a retina screen, faint on a 1× one.
  - Kerning is not applied to the outlines (tracking is). Spoke reach is 70% of the disc radius, read from the PNG. The 6px gap is fixed at nav size and scales with the lockup. The square's 32px radius is taken at a 256px tile (12.5%).
  - Favicons at 16 and 32 use the mark alone, as §4a allows; 180, 512 and 1024 carry the square. The manifest lists 512 and 1024 only; there is no 192.

### §4 Components
- `SiteHeader`: see section A. The brief also says the mobile wordmark is 15px; superseded by the 22px logo.
- `CallNowPill`: brief says "call now" at 29px display, icon left at 125% of the text; the build uses 24px with a 30px icon, which is the landing mockups' final cascade (they step through 32, 29, 24).
- `ProofRow`: brief says 15px pale-green circles, 13px grey text, one bold navy figure; the build uses 17px circles and 14px regular grey text with no bold figure, which is the landing mockups' final cascade.
- `BenefitsGrid` is inline in the homepage rather than a component. `Splash`, `MobileHeroBottom`, `MobileHeroOverlay` are not built (no reference files). `HeroPills` is inside `HeroPhoto`.
- `Button` variants map: coral, ink, outline-ink (`secondary`), outline-white (`secondary-on-dark`).

### §5 Templates
- Utility pages: the brief says "use the pillar shell"; the build uses the article shell without the keeps strip, TOC or related cards (**decided** 4 September).
- Landing-page fold rule: built and tested at 390×844.

### §6 Rules
- §6.1 voice rules are enforced by the content lint (exclamation marks, all-caps headings, "week(s)"), and italics by the CSS lint.
- §6.3 ban list: the homepage hero is an AI image (placeholder). The shield icon with a tick is in the icon set from the mockups; the ban list names "shield-with-tick logos", which the logo itself does not use.
- §6.4 claims: "100% guaranteed" (homepage benefit card, from `mcd-site-fullbleed.html`) and "car, van or bike" (landing proof card) are listed in §7 as needing substantiation. In `claims.json` the like-for-like card is marked substantiated because it describes the service; the "100% guaranteed" wording is in `src/data/copy.ts` and is not gated. Decide whether both should be gated like the timing claims.
- §6.5: built and tested.

### §7 Open items
- All still open except the logo: FCA line and FRN, catch wording, personal injury, handler names and photography, reviews, substantiation, utility page designs.

### §8 Deliverables
- These are Claude Design deliverables (token file, library, usage page). The code has the tokens and components; there is no do/don't usage page.

## C. `CLAUDE.md` on `main` against this branch

- `main`'s §3 lost the `--ink-900` line and the "ink-900 on coral" rule when the file was re-uploaded; this branch keeps them alongside the new §2, §2a and §4a text.
- §2 still lists `Public Sans 400/600/700` as preloaded fonts; the build preloads 400 and 700 only (**decided**).
