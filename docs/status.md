# Phase 1 status

Written at the end of the Phase 1 build, 5 September 2026, against `CLAUDE.md` as updated the same day (`mcd-new-2` only, host-based noindex, §4a logo). Items marked **open** need an answer or an action from the client or Hello Yellow before the site goes live.

## 1. Staging, checked against §2a

| Requirement | State | Where |
|---|---|---|
| No custom domain on `mcd-new-2` | Met for `mcd-new-2`. Separately, `motorclaimsdepartment.co.uk` already resolves to Vercel (bare domain 308s to `www`, `www` is a CNAME to `vercel-dns-016.com`) and serves a holding page titled "Motor Claims Department — non-fault accident specialists". The go-live checklist starts with finding that project and removing the domain there. `mcd-new` is retired; disconnect it from the repo so it stops building. | Vercel dashboard |
| Deployment protection on every deployment of `mcd-new-2`, production included | **Open, and not met.** Previews are protected (Vercel authentication, confirmed by the SSO redirect). The production deployment `https://mcd-new-2.vercel.app/` returns 200 to anyone. | Vercel → `mcd-new-2` → Settings → Deployment Protection → Standard Protection, all deployments, until the real domain is attached |
| `noindex` off the real domain | Met, host-based. Every response whose host is not `motorclaimsdepartment.co.uk` (or `www`) carries `X-Robots-Tag: noindex, nofollow` from the middleware, gets a disallow-all `robots.txt`, and gains the robots meta tag in the browser. That includes the `.vercel.app` production build. It lifts on its own on the real domain. Tested both ways in `tests/e2e/staging.spec.ts`. One limitation: pages are static, so the meta tag is added by script rather than server-rendered; the header is the authoritative signal and is server-side. | `src/middleware.ts`, `src/lib/host.ts`, `src/app/robots.ts`, `HostRobots` |
| Canonicals on the final domain | Met. Every page's canonical is `https://motorclaimsdepartment.co.uk/…` from `NEXT_PUBLIC_SITE_URL`'s default, on every environment. | `src/lib/site.ts` |
| Railway staging isolated | **Open.** The Railway service has not been created yet. `api/README.md` has the steps: root directory `api`, a Postgres plugin, a `staging` environment with its own database and inbox, preview `CLAIMS_API_URL` pointing at staging, production at production. Until then the reg box gets a stub acknowledgement from the Next route handler and stores nothing. | `api/` |
| Optional `staging.motorclaimsdepartment.co.uk` | Not added; no DNS record exists. Add only if a branded link is wanted. | DNS |

## 2. Assumptions built to

Every `[assumption]` in the brief, what was built, and where to change it.

| Assumption (brief §) | Built as | Where |
|---|---|---|
| Postgres on Railway for submissions (§2) | A `submissions` table and `submission_events` log, migrated on deploy. Only the "started" row is written today. | `api/migrations/001_submissions.sql` |
| MDX in `/content/` with frontmatter, no CMS (§2) | As stated. Slug in frontmatter is the route; drafts don't build; `pnpm new-page` scaffolds. | `src/lib/content/`, `content/`, `README.md` |
| Three-step claim form posting to Railway (§7) | **Superseded.** The question flow is Ollie's. `/claim-now/` is the hero and the reg box posting to `/api/claim-start/`, which forwards to Railway when `CLAIMS_API_URL` is set, plus the `#claim-flow` mount and the thank-you route. | `src/app/claim-now/`, `src/app/api/claim-start/route.ts` |
| Reg lookup off at launch (§7) | Off. No DVLA call anywhere; `DVLA_API_KEY` is reserved in `api/.env.example`. | `api/` |
| Cookiebot or an open-source CMP on consent mode v2 (§8) | Neither: the site's own two-choice banner on consent mode v2, GTM injected only after a grant, one cookie, reopened from the footer. Confirmed 4 September. | `src/components/Consent/`, `src/lib/analytics.ts`, `docs/tracking.md` |
| Font pairing (§2, guidelines §4) | Public Sans body everywhere; the Libre Franklin body in the homepage and landing mockups was a test artefact. | `src/fonts/index.ts` |

Decisions taken during the build that were not in the brief, all confirmed on 4 September: `--ink-900` on coral surfaces; the CTA rule (Call always coral, Start your claim ink beside it, coral only in the section pair); the template footer everywhere, on white; preloading only three font files; the native-size mobile hero crop; unsubstantiated claims rendered marked on previews only; Services dropdown listing the five Phase 1 pillars; "Advice" pointing at the accident guide.

## 3. Placeholders that block production

In the order they will bite.

1. **FCA status line.** `FCA_STATUS_LINE` is unset. Previews show a visible `[TODO]` in the footer; the production build throws until it is set, exactly as on the FCA Register. Also the company number and registered office in the legal line are bracketed placeholders in `src/data/copy.ts` (`footer.companyNumber`, `footer.registeredOffice`).
2. **Substantiation flags.** `src/data/claims.json`: "Back on the road within 90 mins", "Avg wait 1 min" and "Fastest way to claim" are `substantiated: false`. They render with a dotted coral outline on previews and never on production. Flip a flag only with evidence on file, and record it in `evidence`.
3. **The catch wording.** `src/data/copy.ts` → `theCatch.callout` and `theCatch.faq` carry the mockup wording, pending MCD's policy on hire charges where fault cannot be established. Every page reads from those two strings.
4. **Claim-flow mount.** `#claim-flow` on `/claim-now/` is empty until Ollie's flow mounts on it. Until then a visitor who submits a reg sees the reference and the note "Next, a few questions about what happened", and nothing follows. Either the flow ships before go-live, or the copy after the reference changes to "Your handler will call you" and the stub becomes a real hand-off (email or CRM).
5. **Logo: done from §4a.** The horizontal lockup and the square are SVG components with the type as outlines; header (mono white) and footer (mono ink) use the lockup; favicon, Apple icon, 512 and 1024 app icons and the manifest are cut from the square. Still open: the OG/social image (`/assets/og/…` is referenced nowhere yet), and a designer's eye on the generated lockup against `design/mcd-logo-motor-mark.png` (kerning is not applied; the mark's spoke length is my reading of the PNG).
6. **Real reviews.** `src/data/reviews.json` is sample data with `sample: true`, so the review band does not render on production at all. Replace with verified reviews and the real aggregate, set `sample: false`.
7. **Photography.** Every photo is a placeholder box with the intended scene as its label, except the homepage hero, which is the mockup's AI placeholder image (guidelines §1 rule that out for final assets). Real shoot needed for the hero, the handler, and the twelve template heroes.
8. **Copy.** The twelve template pages and the seven utility pages are lorem ipsum with the mockups' fixed lines. Alex writes the rest by PR. Titles over 60 characters and descriptions over 155 are warned at build time (one page today: third-party-insurance-claim).
9. **Named handler and dates.** `author: "[Named handler, role]"` and `lastReviewed: 2026-09-04` on every page.
10. **Phase 2 and 3 pages.** Fifty draft stubs exist under `content/`. In-body links to them render as plain text until they leave draft.

## 4. What is needed to go live, in order

1. Turn on deployment protection for every deployment of `mcd-new-2` now, and disconnect the retired `mcd-new` project from the repo.
2. Protect `main` on GitHub: it is currently unprotected. Require a pull request and block force pushes.
3. Read `docs/design-diff.md` (the header check against the PNG and the brief-versus-build differences) and decide each item.
5. Set `NEXT_PUBLIC_GTM_ID` in Vercel (preview and production) once the container exists; inside GTM, GA4 and Google Ads tags on consent-mode checks, conversions per `docs/tracking.md`.
6. Create the Railway service from `api/` with production and staging environments; set `CLAIMS_API_URL` and `CLAIMS_API_KEY` in Vercel per environment.
7. Resolve the placeholders in section 3 in that order: FCA line and company details, substantiation evidence, the catch wording, the claim flow, logo, reviews, photography, copy.
8. Run the go-live checklist in `README.md` (unrun): find the project holding `motorclaimsdepartment.co.uk` and remove it there, add root and `www` to `mcd-new-2`, switch DNS, remove protection on production only, confirm the noindex has lifted on the real domain, confirm `sitemap.xml` and `robots.txt`, submit the sitemap.

## 5. Quality gates at the end of Phase 1

- 19 unit tests, 98 Playwright checks (both viewports), all passing on the production build.
- Lighthouse mobile, production-mode build, throttled 4G: homepage 97–98 / 100 / 100 / 100 with LCP 2.4–2.6s across runs; template pages 98–100 / 100 / 100 / 100 with LCP 1.4–2.4s; landing pages 97–98 / 100 / 100 / 66, the 66 being the intended `noindex`; `/claim-now/` 98 / 100 / 100 / 100. The homepage LCP sits above the brief's 2.0s target on Lighthouse's simulation; accepted 4 September.
- First-load JavaScript is 117–119 KB against the brief's 100 KB; the Next.js 15 framework floor is 102 KB. Accepted as a documented exception pending a reworded target.
