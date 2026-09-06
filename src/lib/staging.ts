/**
 * Environment helpers.
 *
 * The staging noindex is host-based (see src/lib/host.ts and
 * src/middleware.ts), not VERCEL_ENV-based. VERCEL_ENV is still used for the
 * things that are about the build rather than the host: the production
 * build guard on the FCA line, sample reviews, the styleguide route, and
 * unsubstantiated claims on previews.
 */

export type VercelEnv = 'production' | 'preview' | 'development' | undefined;

/** The final public origin. Canonicals point here from day one. */
export const PRODUCTION_SITE_URL = 'https://motorclaimsdepartment.co.uk';

export function isProduction(env: string | undefined = process.env.VERCEL_ENV): boolean {
  return env === 'production';
}
