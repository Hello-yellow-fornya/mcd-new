import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
import { isProduction } from '@/lib/staging';

/** Disallow /claim/ everywhere (brief §5); on staging disallow everything on top of the noindex header. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isProduction() ? { userAgent: '*', allow: '/', disallow: ['/claim/', '/styleguide/'] } : { userAgent: '*', disallow: '/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
