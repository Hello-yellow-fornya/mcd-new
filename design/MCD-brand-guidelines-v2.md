# Motor Claims Department — Brand guidelines v2

Working draft for design-system build. Everything here has been decided in mockups; where a value is still open it says so. Written so a design tool can turn it into tokens, components and templates without further interpretation.

---

## 1. The idea

**The claims department on your side.**

When someone else hits you, their insurer has to put it right — not yours. Most people don't know that, so they claim on their own policy and pay for someone else's mistake. MCD claims from the at-fault insurer instead: no excess, no claim on your policy, a like-for-like car while yours is fixed, one named person in the UK handling it.

- **Belief:** the cost of a crash should follow the person who caused it.
- **Enemy:** a claims system built for insurers. *The insurers work for themselves. We work for you.* Never shown as a caricature — no fat cats. MCD is the antithesis, not the critic.
- **Line:** Hit by someone else? You shouldn't pay for it.
- **Behaviour we plant:** call us before you call your insurer.
- **Customer moment:** a moment of need, not a moment of shopping.

### The antithesis principle
Every decision — copy, design, product — answers "what would the insurer do?" and does the opposite.

| The insurer | MCD |
|---|---|
| Small print | Big print |
| A call centre and a queue | A named person who picks up |
| A glass tower, a stock handshake | A driveway, a real handover |
| Jargon, "subject to" | Plain words, short sentences |
| Hides the sums | Shows the workings |
| Tells you after | Tells you first |

### Distinctly un-AI
MCD must look made by people, about people. Rules that follow from this:
- Every asset comes from MCD's world: the roadside, the phone call, keys, the driveway, the courtesy car.
- Real over rendered: real handlers with first names, a real phone number, real cars on real streets. No AI-generated people in any final asset (AI images are for shoot reference only).
- Stubborn, not flexible: a small number of assets, repeated. Range is what templates offer; repetition is what brands own.
- The words come first. Design serves the sentence.
- Ban list: blob / cut-paper illustration, gradient washes, glass-tower or handshake photography, shield-with-tick logos, road-curve swooshes, generic "human-centred" stock, AI people, AI copy in the customer's voice.

Two tests for every piece of work: cover the logo — can you name the brand? Could a claims-farming cold-caller run it unchanged? If yes, it isn't doing its job.

---

## 2. Voice

The person who reads the small print for you and tells you what it says. A capable friend in the trade; not an insurer, not a campaigner.

- Plain, certain, faintly amused. Contempt is implied by the facts; the brand itself stays kind.
- Short sentences. "You" twice as often as "we". Sentence case everywhere. No italics, no all caps, no exclamation marks.
- Headlines name the situation before the service: *Hit by someone else?* comes before anything about us.
- Two beats: the worry, then the fix. *Not your fault. Still your premium. Not with us.*
- Every enemy claim must be a published fact (Which?, the Ombudsman, MSE), never an accusation.
- Never promise what the product can't fully keep: no "your premium won't go up", no repair timescales, no write-off values. Say "nothing goes through your policy" and stop.
- The test for any sentence: could it be said out loud across a counter?

### Approved copy
- **Line:** Hit by someone else? You shouldn't pay for it.
- **Subline:** The other driver's insurer pays. Nothing goes through your policy.
- **Reg box:** Enter your reg *(label inside the field)* — AB12 CDE *(placeholder)*
- **Phone:** Call 0800 048 0048 — A person in the UK picks up.
- **Band:** Your insurer has a claims department. It works for your insurer. **We work for you.**
- **Benefits (four):**
  - No excess fees to pay, ever — Nothing to pay up front. Nothing to chase back.
  - Keep your no claims bonus — Nothing goes through your policy, so your no-claims is untouched.
  - Like-for-like car hire, 100% guaranteed — Delivered to your drive. If yours is written off, you keep it until the money lands.
  - A dedicated, UK-based call handler — Your handler owns it from first call to keys back. No queues, no repeating yourself.
- **Hero pills (three):** Keep your no claims · No excess fees, ever · Like-for-like car hire
- **How it works:** heading *How it works*; intro *Someone hit you. Their insurer has to put it right — not yours.* then four steps: 1 Tell us what happened · 2 Your handler takes it on · 3 We put you back in a car · 4 They pay. Not you.
- **The catch (FAQ, open by default):** We recover our costs from the at-fault driver's insurer, which is why it costs you nothing. If they refuse to accept fault, we argue it for you. In the rare case that fault can't be established, you could be asked to cover the hire charges — which is why we tell you on the first call whether your claim is one we'd take on. *(Wording to be confirmed against MCD's actual policy on failed claims.)*

---

## 3. Colour

Lead palette: **Stone + coral**. Five core colours, one bright, one functional state.

| Token | Hex | Role |
|---|---|---|
| `ink` | #16324F | Marine ink. Type, primary buttons, dark surfaces, footer |
| `blue` | #3D6D9C | Marine blue. Headline highlight words, links, eyebrows, step titles |
| `sky` | #BFD6E6 | Highlight underlay, table marks, tints on dark |
| `stone` | #EDE9E1 | Section surfaces, cards on white |
| `paper` | #F7F5F0 | Page background, cards on stone |
| `white` | #FFFFFF | Cards on stone, text on ink, reg field |
| `coral` | #F2694B | The one bright. Phone CTAs, Start your claim, icon circles, big-print highlight |
| `green` | #7DC24A | Functional "handled" state in product only. Never in headlines or ads |
| `muted` | #5B6570 | Secondary text |
| `line` | #D9D4C8 | Hairlines and borders |
| `ink-900` | #0F2438 | Text and icons on coral surfaces only. Reads as ink; measures 5.2:1 against coral |

Rules
- Usage split roughly 42% paper · 28% stone · 20% ink · 6% blue and sky · 4% coral.
- Coral is a gesture, never a wallpaper. Exception: the coral shard pattern is a campaign asset for posters and ads, not a site surface.
- Ink text on sky and green, `ink-900` text and icons on coral — never white on any of them. White type only on ink and blue.
- Pink (#F06EAC) and the alternative palettes (Original yellow, Splash, Ledger) are parked, not deleted; see §11.

Contrast: ink on paper/stone/white and white on ink both exceed WCAG AAA. Ink on coral measures 4.3:1, which only passes AA for large text, so coral surfaces use `ink-900` (5.2:1, AA at 16px). Blue on stone passes AA for text ≥ 16px bold.

---

## 4. Typography

Two faces, both open licence (SIL OFL), self-hosted as WOFF2. Do not load from Google's CDN in production.

| Token | Family | Use |
|---|---|---|
| `display` | Libre Franklin 900 | Headlines, big print, the £0, the phone number, step and card titles |
| `body` | Public Sans 400 / 700 | Body copy, UI, buttons, labels, tables, FAQ |

Scale (desktop → mobile)
- H1 hero: 74px → 34px, line-height 1.0, tracking −0.03em, `text-wrap: balance`
- H1 on photo: 3.6% of frame width (≈ 46px at 1280)
- H2 section: 42px → 28px, line-height 1.05, tracking −0.02em
- H3 card: 20–22px, line-height 1.15
- Big print numbers: 96px → 48px, tracking −0.03em
- Body: 17px, line-height 1.6, max 65 characters per line
- Small / labels: 13–15px
- Buttons: 16–18px bold

Setting rules
- Sentence case everywhere. Never all caps, never italics.
- One weight per surface for display; mixed weights only in body.
- Highlight words in a headline are set in `blue` with a `sky` underlay (`box-shadow: inset 0 -0.22em 0 sky`). One highlight per headline, on the last 2–5 words.
- Reg placeholder set in `display` 900, uppercase, letter-spacing −0.02em.
- Public Sans and Libre Franklin share bones (Public Sans is a Franklin fork), so they may sit on one line.

Year-two direction: a customised cut ("MCD Sans") of Libre Franklin — alternates, embedded brand glyphs (tick, phone, car) so they can sit inside headlines. Choose year-one type with that in mind.

---

## 5. Spacing, shape, elevation

- Base unit 4px. Section padding 72px desktop / 48px mobile. Grid max-width 1140px with 24px gutters.
- Radii: cards 20px; photo frames 24px; reg field 14px; reg card 24px; buttons and pills 999px (full pill); icon circles 50%.
- Borders: 1px `line` hairline on light; 1px white at 60–85% on photography.
- Shadows: none on static elements. One soft shadow only on floating elements (sticky call bar, reg card on stone: `0 18px 40px rgba(22,50,79,.25)`).
- Motion: 150–200ms ease-out on hovers and accordions. Nothing moves uninvited. The one signature move (when defined) is the highlighter swipe left-to-right; every tick, progress state and headline highlight resolves with it.

---

## 6. Components

### Buttons
| Name | Style | Use |
|---|---|---|
| `btn-coral` | Coral fill, ink text, pill, min-height 48px (60px on mobile hero) | Start your claim; Call 0800 048 0048 (with solid phone icon) |
| `btn-primary` | Ink fill, white text, pill | Secondary actions on light surfaces, sticky call bar |
| `btn-secondary` | Transparent, 2px ink border, pill | Tertiary: "What's the catch?" |
| `btn-secondary-on-dark` | Transparent, white border, white text | Tertiary on ink surfaces |

Every content section ends with the same pair: `btn-coral` Start your claim + `btn-coral` Call 0800 048 0048. One primary action per view beyond that. Minimum touch target 44px.

### Reg box (signed off)
- Container: `ink` card, radius 24px, padding 26px; heading "Enter your reg." in `display`, subline "The fastest way to start your claim." in `sky`.
- Field: white, radius 14px, padding 6–10px; label "Enter your reg" 12px bold `muted` above the placeholder, placeholder "AB12 CDE" in `display` 900 30–40px, colour #B8C2CB.
- Action: coral circle 48px with ink arrow, inside the field on the right.
- On photography: field only (no card), width 27–31% of frame, 44px coral arrow, phone CTA beneath.
- Behaviour: accept any case or spacing; format to "AB12 CDE" on input.
- Mobile: full width, first element under the headline, always above the fold.

### Hero pills (reasons to believe)
Transparent, 1px white border at 75–85%, 40px tall, white solid icon 18px + 14px bold white text. Three, in a row, bottom-right of the photo hero; on mobile they wrap under the CTAs. Copy is fixed (see §2).

### Icons
Solid silhouettes on a 24-unit grid, drawn chunky; the tick is a 4pt round stroke; the £ is `display` 900. Two-tone is always the circle colour knocked out of the icon (clock hands, document lines, shield tick) — never a third colour.
- Feature markers: ink icon on `coral` circle
- Quiet: ink icon on `sky` circle
- On dark: coral icon on a lighter marine circle (#214A73)
- Sizes 32 / 44 / 56 / 72; the icon fills ~55% of the circle. Never on white without a circle. Never coral on its own.
- Set so far: phone, tick, keys, £, car, clock, person, document, question, shield, road, speech bubble, wrench. The car is a supporting icon only, never a brand device.

### Cards
`stone` on white, `white` on stone or ink; radius 20px; padding 26–28px; icon circle top-left 56px; H3 then one or two sentences. No borders on dark surfaces.

### Benefits grid
Four cards, 2×2, equal size. Title "Why claim through Motor Claims Department" on one line. Copy fixed (§2).

### How it works
On the marine shard pattern; H2 "How it works"; bold mechanism line then the explanation with *their* underlined in coral; four white step cards 2×2 with coral icon circles; section CTAs. No timing labels, no catch note (the catch is the FAQ that follows).

### FAQ
Hairline rows, plus/minus in coral, first item ("What's the catch?") open by default. Two-column on desktop: heading left, questions right.

### Band
Ink surface. Line 1 in `display` at 70% opacity; line 2 in `display` 900 with the last three words underlined in coral (`box-shadow: inset 0 -0.25em 0 coral`).

### Handler block
Photo left (24px radius), eyebrow "Your handler" in `blue`, quoted headline in `display`, one paragraph, text link with sky underline. Always a real first name and a real photo.

### Nav and call bar
Sticky nav, paper background, wordmark in body 700, links 16px, coral phone button. Mobile: wordmark only; a sticky bottom call bar (`btn-primary`, full width) appears on scroll.

---

## 7. Photography

Subjects, not stock. Real staff, real customers, ordinary British streets in daylight.
- The moment is relief: keys just handed over, a breath out, looking at the car not the camera. Mid-conversation is fine.
- Cars whole and cared for, never damaged. No hi-vis, no handshake, no thumbs-up, no dealership look.
- Overcast daylight, shot warm and slightly over. No golden hour, no flare.
- Every shoot delivers two crops of each scene: subject-right (for overlay layouts) and subject-centre (for cards and social 4:5).
- Streets should be slightly untidy — bins, parked cars, cables. Clean is the tell of AI.

### Treatment
- Frame: full-bleed under the nav, or 24px radius inside the grid.
- Scrim: marine from the left, 80% → 0% by 70% of the width; plus a full-width marine tint rising from the bottom edge (72% → 0% over the bottom third). Never black.
- Copy block: 4% in from the left, headline starting ~26–33% down; H1 3.6% of frame width; reg field and coral phone CTA beneath; three transparent pills bottom-right.
- Mobile: tall 9:15 crop positioned on the subject, bottom scrim, headline high in the sky, subject's face clear in the middle third, CTAs at the bottom thumb zone.

---

## 8. Patterns

Three families, all tonal — one hue in two to four shades, never a second colour.

1. **Tonal sweep** — four soft wave shapes in close shades of one hue (steps of ~3–4% lightness). Dark surfaces only: hero panels, video end-frames, footer. Files: `mcd-sweep-{stone|splash|ledger}-subtle-1920x1080.svg`. Shapes are fixed; crop, don't redraw.
2. **Shards** — steep diagonal slashes of mixed widths with a harlequin diamond edge fading from the left. One colour block per pattern: ink, blue, coral, sky, stone, white. Files: `mcd-shards-{colour}-1920x1080.svg`. Ink is the site pattern (How it works); coral is campaign only; stone and white for quiet sections.
3. **Marker bands / speckle** — the highlighter gesture at background scale, and a mono ink speckle with brush marks, for posters and photo corners. Vector for now; the physical (painted, scanned) versions are the intended final.

Rule: pattern behind copy is always the low-contrast version; full strength only where there is no copy.

---

## 9. Layout — homepage v1 (signed off)

1. Nav
2. Photo hero, full-bleed: headline, subline, reg field, coral call CTA, three pills bottom-right
3. Why claim through Motor Claims Department — four benefit cards, section CTAs
4. How it works — on ink shards, four steps, section CTAs
5. What's the catch? — FAQ, first open, section CTAs
6. Your handler — photo + quote, section CTAs
7. Band — "It works for your insurer. We work for you.", section CTAs
8. Who we help — chips, section CTAs
9. Footer — wordmark, strapline, phone in `display` coral, FCA line

Mobile order: nav → hero (headline, reg, call) → pills → benefits → how it works → catch → handler → band → who we help → footer, with the sticky call bar.

---

## 10. Accessibility

Ink-on-light and white-on-ink exceed AAA. Touch targets ≥ 44px. Focus ring 2px ink, 2px offset (white on dark). Every icon labelled; every photo described. Whole journey completable by phone. No countdowns, no motion that starts on its own. Reg field has a visible label, not just a placeholder.

---

## 11. Parked options (not deleted)

- **Original** (v1.0): safety yellow #FFD400, ink #19180F, cream #F7F5EF — the highlighter chip. Kept as the control.
- **Splash**: white, cloud #EEF1F4, ink #141414, splash blue #2BA3DC, deep blue #0F4C81, pink #F06EAC.
- **Ledger v2**: white, #15171A, RISD blue #3756FF, turquoise #1B9AAA, lemon #F3F1B4, sky #E3EEF4, green #7DC24A.
- Alternative type: Bricolage Grotesque (challenger character), New Rail Alphabet + ABC Favorit (paid pairing, signage heritage).

---

## 12. Open items

- Logo / wordmark: not yet designed. "Motor Claims Department" currently set in body 700 lowercase as a placeholder. "MCD" is favicon shorthand only.
- The catch: final wording depends on MCD's policy on hire charges when fault can't be established.
- "100% guaranteed" on car hire: confirm it holds on every accepted claim.
- Choice of repairer and original parts: confirm before they return as benefits.
- Handler photography: real handler, real name, needed before the handler block ships.
- Signature motion: define the highlighter swipe timing and apply to tick, progress and headline.
- Physical pattern versions: paint and stamps to be made and scanned.
- Compliance read of every enemy line and proof point.

---

## 13. Asset index

- `mcd-site-fullbleed.html` — homepage v1, desktop and mobile
- `mcd-preview-homepage-reg.html`, `mcd-preview-image-hero-reg.html` — previews with desktop/mobile toggle
- `mcd-mobile-hero-v2-bottom.html`, `mcd-mobile-hero-v2-overlay.html` — mobile hero, two signed-off versions
- `mcd-image-treatment-hero-regbox.html`, `mcd-image-treatment-hero-cazoo-proportions.html` — desktop photo hero, two CTA treatments
- `mcd-sweep-*-subtle-1920x1080.svg`, `mcd-sweep-*-1920x1080.svg` — tonal grounds
- `mcd-shards-*-1920x1080.svg` — shard patterns in six colours
- `mcd-ground-*-1920x1080.svg` — traced tonal grounds
- `MCD_brand_positioning_first_draft.docx` — positioning document
