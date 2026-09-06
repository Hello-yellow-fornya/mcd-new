import { PRODUCTION_SITE_URL } from './staging.ts';

/**
 * Staging rule (brief §2a): anything not served from the real domain is
 * staging. Keyed off the request host matching NEXT_PUBLIC_SITE_URL, never
 * off VERCEL_ENV, so the .vercel.app production build stays noindexed and
 * the noindex lifts on its own once the real domain is attached.
 */
export function siteHost(): string {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_SITE_URL).host.toLowerCase();
}

/**
 * True when the request host is the real site (with or without www). A site
 * URL on vercel.app (the 3.0 comparison project sets NEXT_PUBLIC_SITE_URL to
 * its own .vercel.app address) is never live, so those builds stay noindexed.
 */
export function isLiveHost(host: string | null | undefined, site = siteHost()): boolean {
  if (!host) return false;
  const s = site.split(':')[0];
  if (s.endsWith('.vercel.app')) return false;
  const h = host.toLowerCase().split(':')[0];
  return h === s || h === `www.${s}` || `www.${h}` === s;
}
