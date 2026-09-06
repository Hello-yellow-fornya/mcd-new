import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Slug rules (brief §5): trailing slashes on, lowercase.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Staging noindex is host-based and lives in src/middleware.ts (brief §2a).
  async headers() {
    return [
      // Paid landing pages are never indexed (brief §6), whatever the host.
      { source: '/claim/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
};

export default nextConfig;
