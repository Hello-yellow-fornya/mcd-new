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

export const theme: Theme = resolveTheme(process.env.NEXT_PUBLIC_THEME);
export const isMcd3 = theme === 'mcd3';
