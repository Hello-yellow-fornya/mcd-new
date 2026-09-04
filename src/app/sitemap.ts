import type { MetadataRoute } from 'next';
import { getLivePages } from '@/lib/content';
import { absoluteUrl } from '@/lib/site';

/** Live content plus the homepage; never /claim/*, drafts or the styleguide (brief §5). */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getLivePages().filter((p) => !p.frontmatter.slug.startsWith('/claim/'));
  return [
    { url: absoluteUrl('/'), lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...pages.map((p) => ({
      url: absoluteUrl(p.frontmatter.slug),
      lastModified: new Date(p.frontmatter.lastReviewed),
      changeFrequency: 'monthly' as const,
      priority: p.frontmatter.template === 'pillar' ? 0.8 : 0.6,
    })),
  ];
}
