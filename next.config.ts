import type { NextConfig } from 'next';
import { themeForBuild } from './src/lib/theme';

const nextConfig: NextConfig = {
  // The theme is resolved once here and inlined as NEXT_PUBLIC_THEME, so server
  // and client bundles agree even when it came from the branch name rather than
  // the variable (a preview build on an mcd3/… branch). Without this the client
  // would hydrate as 2.0 while the server rendered 3.0.
  env: {
    NEXT_PUBLIC_THEME: themeForBuild({
      NEXT_PUBLIC_THEME: process.env.NEXT_PUBLIC_THEME,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
    }),
  },
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
