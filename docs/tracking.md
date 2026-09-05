# Tracking and consent

Brief §8. Google Tag Manager carries GA4 and the Google Ads conversion tags. Nothing loads before consent.

## How consent works

1. On every page `Analytics` pushes consent-mode defaults to `window.dataLayer`: every storage type `denied`, with `functionality_storage` and `security_storage` `granted`.
2. Events are pushed to `window.dataLayer` from the first paint, so nothing is lost while the visitor decides.
3. The banner (`ConsentBanner`) offers two equal choices. The choice is stored in the `mcd_consent` cookie for a year (`{ v, analytics, ads, at }`), with no other cookie set.
4. "Yes, measure visits" pushes a consent `update` with `analytics_storage` and the three ad signals `granted`, then injects `gtm.js` for `NEXT_PUBLIC_GTM_ID`. "No, just the essentials" pushes the update as `denied` and loads nothing.
5. On a later visit GTM loads immediately only if the stored choice was a grant.
6. "Cookie settings" in the footer reopens the banner.

Inside GTM, GA4 and Google Ads tags must use the built-in consent checks (consent mode v2), not custom triggers. No tag may fire on `consent_update` when the update is `denied`.

## dataLayer events

| Event | When | Parameters |
|---|---|---|
| `page_view` | Every route, including client-side navigation | `page_path`, `page_title`, `legal` (`true` on the legal pages: no other events fire there) |
| `phone_click` | Any `tel:` link | `phone` (E.164-ish digits as in the href), `placement` (`header`, `footer`, a `data-track` value, the nearest `[data-placement]`, or the section id), `page_path` |
| `reg_submit` | Reg box submitted, anywhere | `reg_length`, `placement` (`hero`, `claim-now`, `card`) |
| `claim_start` | Reg accepted by the claim-start endpoint on `/claim-now/` | `ref` |
| `claim_submitted` | `/claim-now/thank-you/` viewed after the claim flow completes | `ref` when the flow passes one as `?ref=` |
| `consent_update` | A consent choice made or changed | `analytics`, `ads` |

Conversions to configure in GTM: `claim_submitted` (form), `phone_click` (call), `reg_submit` (reg box). Call tracking via dynamic number insertion works on the rendered `tel:` text; the number is never an image.

## Landing pages

`/claim/*` pages carry the same layer. Their primary conversion is `phone_click` with `placement: hero-call`.
