/**
 * Environment and staging behaviour (brief §2a).
 *
 * Everything keys off Vercel's VERCEL_ENV: "production" | "preview" |
 * "development". Anything that is not production is staging and must not be
 * indexed: an X-Robots-Tag header on every route plus <meta name="robots">.
 * Deployment protection (password or Vercel authentication) is a project
 * setting in the Vercel dashboard and sits on top of this, not instead of it.
 */

export type VercelEnv = 'production' | 'preview' | 'development' | undefined;

/** The final public origin. Canonicals point here from day one. */
export const PRODUCTION_SITE_URL = 'https://motorclaimsdepartment.co.uk';

export const NOINDEX = 'noindex, nofollow';

export function isProduction(env: string | undefined = process.env.VERCEL_ENV): boolean {
  return env === 'production';
}

/** next.config `headers()` entries for the current environment. */
export function robotsHeaders(env: string | undefined) {
  if (isProduction(env)) return [];
  return [
    {
      source: '/:path*',
      headers: [{ key: 'X-Robots-Tag', value: NOINDEX }],
    },
  ];
}

/** `metadata.robots` for the root layout. Landing pages override this to noindex always. */
export function robotsMeta(env: string | undefined) {
  if (isProduction(env)) {
    return { index: true, follow: true, 'max-image-preview': 'large' as const };
  }
  return { index: false, follow: false };
}
