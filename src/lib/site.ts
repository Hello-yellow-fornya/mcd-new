import { PRODUCTION_SITE_URL } from './staging';

function normaliseOrigin(value: string): string {
  const url = new URL(value);
  return url.origin;
}

/**
 * Public origin for canonical, Open Graph and sitemap URLs. Configured from a
 * single NEXT_PUBLIC_SITE_URL and defaulting to the final domain (brief §2a).
 */
export const siteUrl: string = normaliseOrigin(process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_SITE_URL);

export const site = {
  name: 'Motor Claims Department',
  legalName: 'Motor Claims Department Ltd',
  /** Former text wordmark; the header and footer now use the §4a logo. Kept for copy that spells the name out. */
  wordmark: 'motor claims department',
  strapline: 'The claims department on your side.',
  line: 'Hit by someone else? You shouldn’t pay for it.',
  subline: 'The other driver’s insurer pays. Nothing goes through your policy.',
  phone: {
    display: '0800 048 0048',
    href: 'tel:08000480048',
    e164: '+448000480048',
    reassurance: 'A person in the UK picks up.',
  },
  locale: 'en_GB',
  url: siteUrl,
} as const;

/** Ensures a site path has a leading and trailing slash (slug rules, brief §5). */
export function canonicalPath(path: string): string {
  let p = path.trim();
  if (!p.startsWith('/')) p = `/${p}`;
  const [pathname, query = ''] = p.split('?');
  const withSlash = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return query ? `${withSlash}?${query}` : withSlash;
}

export function absoluteUrl(path: string): string {
  return new URL(canonicalPath(path), siteUrl).toString();
}
