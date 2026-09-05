# Motor Claims Department — design system brief for Claude Design

Supersedes `MCD-brand-guidelines-v2.md`. This is the source document for the design system: what to build, in what order, from which files. Everything here is decided unless marked **[open]**. Files referenced are in `/design/` of the `mcd-new` repo.

---

## 0. How to use this

Build the system in the order of the sections: foundations → assets → components → templates → rules. Reproduce the reference files exactly; do not restyle. Where a value is stated here and a file disagrees, this document wins for behaviour and the file wins for appearance — flag the conflict.

Reference files:
- `mcd-site-fullbleed.html` — homepage v1
- `tpl-*.html` — twelve SEO page templates
- `mcd-lp-goskippy-mobile-grid.html`, `mcd-lp-no-fault-accident.html` — landing pages
- `mcd-mobile-hero-v2-bottom.html`, `mcd-mobile-hero-v2-overlay.html` — mobile heroes
- `mcd-image-treatment-hero-regbox.html` — desktop photo hero
- `mcd-review-carousel.html` — review band
- `mcd-shards-*.svg`, `mcd-sweep-*-subtle-*.svg` — patterns
- `mcd-splash-dark-shards-six.png`, `mcd-splash-plain-six.png` — splash format reference
- `mcd-nav-bar-marine.png` — header, three states

---

## 1. The brand in one paragraph

Motor Claims Department is the claims department on your side. When someone else hits you, their insurer has to put it right — not yours. Most people don't know that, so they claim on their own policy and pay for someone else's mistake. MCD claims from the at-fault insurer instead: no excess, nothing on your policy, a like-for-like car while yours is fixed, one named person in the UK handling it. The enemy is a claims system built for insurers; MCD is its antithesis, never its critic. The customer is in a moment of need.

Headline set (approved, use these and nothing invented):
- The smarter way to claim.
- Claiming that works for you. Not your insurer.
- The smarter way to claim when someone hits you.
- A claim that works for you, for once.
- Not your fault? There's a smarter way to claim.
- The claim your insurer won't tell you about.

Instruction line: **Call us before you call your insurer.**
Sub for landing pages: **The smarter way to claim for no-fault accidents.**
Band: *Your insurer has a claims department.* **It works for your insurer. We work for you.**

---

## 2. Foundations

### 2.1 Colour tokens

| Token | Hex | Role |
|---|---|---|
| `color.ink` | #16324F | Type, primary buttons, dark surfaces, footer, icon circles on light |
| `color.blue` | #3D6D9C | Headline highlight words, links, eyebrows, kickers |
| `color.sky` | #BFD6E6 | Highlight underlay, tints, quiet icon circles |
| `color.stone` | #EDE9E1 | Section surfaces, cards on white, independence line |
| `color.paper` | #F7F5F0 | Page background, cards on stone |
| `color.white` | #FFFFFF | Cards on stone, reg field, text on ink and blue |
| `color.coral` | #F2694B | The one bright: phone CTAs, Start your claim, icon circles, big-print underline |
| `color.green` | #7DC24A | Functional "handled" state, ticks, wait-time icons. Never in headlines or ads |
| `color.muted` | #5B6570 | Secondary text |
| `color.line` | #D9D4C8 | Hairlines and borders |
| `color.marine.700` | #214A73 | Lighter marine for icon circles on ink |

Rules, enforced as component constraints:
- Ink text on coral, sky, green and stone. White text only on ink and blue.
- Coral is a gesture: once per view as the bright, plus the section CTA pair. Never a background for copy on the site; coral shards are a campaign surface.
- Usage split ≈ 42% paper · 28% stone · 20% ink · 6% blue/sky · 4% coral.
- Parked, not deleted: Original (yellow #FFD400 / ink #19180F / cream #F7F5EF), Splash (#2BA3DC, #0F4C81, #141414, #EEF1F4, pink #F06EAC), Ledger v2 (#3756FF, #1B9AAA, #15171A, #F3F1B4, #E3EEF4). Document as alternates in an appendix; do not build components in them.

### 2.2 Type

- `font.display`: Libre Franklin 900. Headlines, big print, £0, phone number, card and step titles.
- `font.body`: Public Sans 400 / 600 / 700. Everything else — body, UI, buttons, labels, tables, FAQ. Body is always Public Sans; any file showing Franklin body text is a test artefact.
- Self-hosted WOFF2. Latin subset.

Scale (desktop → mobile):
- Display XL (hero H1): 74 → 34px, line-height 1.0, tracking −0.03em
- Display L (landing H1): 58 → 44px, line-height 1.02
- H2: 42 → 28px, line-height 1.05, tracking −0.02em
- H3 / card title: 20–22px, line-height 1.15
- Big print numbers: 96 → 48px, tracking −0.03em
- Body: 17px / 1.6, max 65 characters per line
- Small / labels: 13–15px; buttons 16–18px bold
- Reg placeholder: display 900, 30–40px, uppercase, tracking −0.02em

Setting rules: sentence case everywhere (no CSS uppercase); no italics; one display weight per surface; `text-wrap: balance` on headlines. Highlight: one to two words per headline, `blue` with a `sky` underlay on light, or white with a coral underline (`box-shadow: inset 0 -0.18em 0 coral`) on dark; white underline on coral.

### 2.3 Space, shape, elevation, motion

- Base 4px. Section padding 72 / 48px. Grid 1140px, 24px gutters. Breakpoint 820px.
- Radii: cards 20 · photo frames 24 · reg field 14 · reg card 24 · buttons and pills 999 · icon circles 50%.
- Borders: 1px `line` on light; 1px white at 60–85% on photography.
- Shadow only on floating elements: sticky call bar; reg card on stone `0 18px 40px rgba(22,50,79,.25)`; call pill on landing pages `0 14px 26px rgba(242,105,75,.35)`.
- Motion 150–200ms ease-out. Nothing moves uninvited. Reduced-motion: no autoplay.

---

## 3. Assets

### 3.1 Patterns
- **Shards (dark)** — the chosen set: `mcd-shards-{ink,blue,coral,sky,stone,white}-1920x1080.svg`. One hue, shards ~22% darker (10% on sky/stone). Ink is the site pattern (How it works, band); stone and white for quiet sections; coral campaign only.
- **Tonal sweep (subtle)** — `mcd-sweep-{stone,splash,ledger}-subtle-1920x1080.svg`. Dark surfaces only. Shapes fixed; crop, don't redraw.
- Light shards (`mcd-shards-light-*`) exist but are not in the system — parked.
- Rule: pattern behind copy is the low-contrast version; full strength only with no copy.

### 3.2 Splash format
Twelve panels in `mcd-splash-dark-shards-six.png` and `mcd-splash-plain-six.png`: each colourway, shards and plain, with the same message centred both ways and one to two words underlined. This is the template for any headline-on-colour surface (social, OOH, video end-frame, section band). Build as a component with colourway and surface props.

### 3.3 Icons
Solid silhouettes on a 24-unit grid; the tick is a 4-unit round stroke; the £ is display 900. Two-tone is always the circle colour knocked out of the icon. Circle variants: coral/ink (feature), sky/ink (quiet), marine-700/coral (on dark). Sizes 32 / 44 / 56 / 72; icon fills ~55% of the circle. Never on white without a circle; never coral alone. Set: phone, tick, keys, £, car, clock, person, document, question, shield, road, speech bubble, wrench, bolt. Car is supporting only.

### 3.4 Photography
Real staff, real customers, ordinary UK streets, overcast daylight shot warm. The moment is relief — keys just handed over. Every scene delivered in two crops: subject-right (overlay) and subject-centre (cards, 4:5 social). No AI people in final assets. Treatment: marine scrim from the left (80% → 0 by 70% width) plus a bottom tint (72% → 0 over the bottom third); never black.

### 3.5 Logo
**[open]** Not designed. Wordmark placeholder: "motor claims department" in Public Sans 700, lowercase. Leave a slot in header and footer; "MCD" is favicon shorthand only.

---

## 4. Components

Build each with desktop and mobile states, from the markup in the reference files.

**Navigation and frame**
- `SiteHeader` — marine bar (`mcd-nav-bar-marine.png`): ink background, Franklin 900 wordmark in white, Public Sans links at 88% white with the active page underlined in coral, coral phone pill with the solid icon. Mobile: wordmark 15px, a full "Call now" pill (40px) before the burger — never an icon-only circle — and a paper drawer with 18px bold links, a full-width coral call button and "A person in the UK picks up." Homepage only: transparent over the photo hero until sticky
- `StickyCallBar` — ink pill, full width; appears after the hero scrolls away
- `SiteFooter` — three columns, phone in display coral, legal line (FCA placeholder blocks production)
- `Breadcrumb`, `Toc` (sticky on-page nav)

**Actions**
- `Button` — variants: coral (Start your claim, Call), ink, outline-ink, outline-white; min-height 48 (60 on mobile hero); solid phone icon variant
- `SectionCta` — coral Start + coral Call; closes every content section
- `CallNowPill` — landing pages: 60px, "call now" lower case 29px display, icon left at 125% of text

**Conversion**
- `RegBox` — ink card / white field, "Enter your reg" label inside, AB12 CDE placeholder, coral arrow; formats input live; on photography: field only
- `HeroPills` — three transparent outlined pills, bottom-right of photo hero; copy fixed
- `ProofGrid` — 2×2 white cards, marine circle + coral icon, two-line display title, one-line sub
- `ProofRow` — wait-time row: 15px pale-green circles, 13px grey text, one bold navy figure
- `IndependenceLine` — stone strip: "Independent accident management company. Not an insurer — …"

**Content**
- `HeroText`, `HeroPhoto`, `MobileHeroBottom`, `MobileHeroOverlay`
- `KeepsStrip`, `Callout` (default / catch), `Steps` (2×2), `ThemUs` (them/us and you/we variants), `Faq` (details/summary, first open), `RelatedPages`, `Band`, `ReviewCarousel` (auto-scroll, pause on touch, reduced-motion fallback), `BenefitsGrid` (2×2 stone cards), `Splash`

---

## 5. Templates

- Homepage — `mcd-site-fullbleed.html`
- Pillar — `tpl-accident-management-company.html` (+ non-fault-accident, third-party-insurance-claim, courtesy-car, credit-hire)
- Process — `tpl-how-accident-management-works.html`
- Comparison — `tpl-accident-management-vs-insurance.html`
- Guide — `tpl-what-to-do-after-a-car-accident.html`
- Location — `tpl-location-london.html`
- Article — `tpl-article-*.html`
- Landing, insurer comparison — `mcd-lp-goskippy-mobile-grid.html` (mobile-first)
- Landing, no-fault — `mcd-lp-no-fault-accident.html`
- Utility (about, contact, legal) — **[open]**, not yet designed; use the pillar shell

Landing-page fold rule: at 390×844 the headline, instruction, sub, proof grid, call pill and wait row are visible with the online CTA touching the bottom edge.

---

## 6. Rules

### 6.1 Voice
Plain, certain, short sentences. "You" more than "we". Sentence case. No exclamation marks, no italics, no slogans, no "week(s)" phrasing. The test: could it be said across a counter.

### 6.2 The antithesis principle
Every decision answers "what would the insurer do?" and does the opposite: big print not small print; a named person not a queue; a driveway not a glass tower; workings shown not hidden; told first not after.

### 6.3 Distinctly un-AI
Assets from MCD's world only (roadside, phone, keys, driveway). Real over rendered. Stubborn, not flexible — few assets, repeated. Words first. Ban list: blob illustration, gradient washes, glass-tower or handshake stock, shield-with-tick logos, road swooshes, AI people, AI copy in the customer's voice, fat-cat imagery or tone.

### 6.4 Claims
Never: "your premium won't go up"; timing promises without evidence; repairer or parts promises until confirmed; naming an insurer outside landing-page config; absolutes about a competitor. Always: the catch on any page that sells the service — fault must be clear and the other driver insured; if not, MCD says so on the first call.

### 6.5 Landing-page compliance
`noindex`; independence line under the hero; insurer name only in H1 and independence line; competitor facts quoted with source and date; proof-row claims render only when substantiated.

---

## 7. Open items

Logo; FCA status line and FRN; the catch wording (MCD's policy on failed claims); whether MCD handles personal injury; real handler names and photography; real reviews; substantiation for wait time, "within 90 mins", "car, van or bike", "100% guaranteed"; utility page designs.

---

## 8. Deliverables from Claude Design

1. Token file (colour, type, space, radii, shadow, motion) matching §2 exactly
2. Component library per §4 with variants and states
3. Template pages per §5 assembled from the components
4. Pattern and splash asset library per §3
5. A usage page for §6 — the rules shown as do/don't pairs using real components
