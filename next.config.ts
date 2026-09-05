import type { NextConfig } from 'next';
import { robotsHeaders } from './src/lib/staging';

const nextConfig: NextConfig = {
  // Slug rules (brief §5): trailing slashes on, lowercase.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Staging (brief §2a): site-wide X-Robots-Tag on every environment that is
  // not production, keyed off VERCEL_ENV at build time. The <meta name="robots">
  // tag is set alongside it in src/app/layout.tsx.
  async headers() {
    return [
      ...robotsHeaders(process.env.VERCEL_ENV),
      // Paid landing pages are never indexed (brief §6), whatever the environment.
      { source: '/claim/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
};

export default nextConfig;
