import localFont from 'next/font/local';

/**
 * Self-hosted type (brief §2, guidelines §4). Both faces are SIL OFL; the
 * licences sit alongside the WOFF2 files. Never load from Google's CDN.
 *
 * display: Libre Franklin 900 — headlines, big print, the £0, the phone number,
 *          step and card titles.
 * body:    Public Sans 400 / 700 — everything else. Preloaded.
 * bodySemibold: Public Sans 600, loaded normally (not preloaded) to keep the
 *          hero image ahead of it on slow connections.
 */
export const display = localFont({
  src: './libre-franklin-latin-900-normal.woff2',
  weight: '900',
  style: 'normal',
  display: 'swap',
  preload: true,
  variable: '--font-display',
  adjustFontFallback: 'Arial',
});

export const body = localFont({
  src: [
    { path: './public-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './public-sans-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-body',
  adjustFontFallback: 'Arial',
});

export const bodySemibold = localFont({
  src: './public-sans-latin-600-normal.woff2',
  weight: '600',
  style: 'normal',
  display: 'swap',
  preload: false,
  variable: '--font-body-600',
  adjustFontFallback: 'Arial',
});
