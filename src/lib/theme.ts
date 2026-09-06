/**
 * Visual theme (MCD 3.0 brief). One build serves one theme, chosen at build
 * time by NEXT_PUBLIC_THEME:
 *
 *   mcd2  the 2.0 skin, the default; the build output is unchanged when the
 *         variable is unset
 *   mcd3  the 3.0 skin (Safety Yellow, Quicksand), deployed to its own Vercel
 *         project so the client can compare the two side by side
 *
 * Everything that differs between the skins lives under src/themes/<theme>
 * and behind `theme` checks in shared components; pages do not branch.
 */
export const THEMES = ['mcd2', 'mcd3'] as const;
export type Theme = (typeof THEMES)[number];

export function resolveTheme(value: string | undefined | null): Theme {
  return value === 'mcd3' ? 'mcd3' : 'mcd2';
}

/**
 * Preview builds on a branch named mcd3/… render the 3.0 skin without an
 * environment variable, so the 2.0 Vercel project can show a 3.0 preview
 * before the mcd-new-3 project exists. Production builds never take this
 * path: main is always the variable's theme.
 */
export function themeForBuild(env: { NEXT_PUBLIC_THEME?: string; VERCEL_ENV?: string; VERCEL_GIT_COMMIT_REF?: string }): Theme {
  if (env.NEXT_PUBLIC_THEME) return resolveTheme(env.NEXT_PUBLIC_THEME);
  if (env.VERCEL_ENV === 'preview' && env.VERCEL_GIT_COMMIT_REF?.startsWith('mcd3/')) return 'mcd3';
  return 'mcd2';
}

export const theme: Theme = themeForBuild({
  NEXT_PUBLIC_THEME: process.env.NEXT_PUBLIC_THEME,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
});
export const isMcd3 = theme === 'mcd3';
