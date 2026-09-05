import { logoPaths } from './paths';

/**
 * The logo, built from brief §4a: "MOTOR" in Libre Franklin 900 with the mark
 * replacing the second O, "CLAIMS DEPARTMENT" in Public Sans 700 fitted to
 * the same width, 6px below at nav size. Type is set as outlines
 * (scripts/logo-outlines.py), so no web font is involved.
 *
 * The mark: a disc with an eight-spoke burst and a hub. Spokes at 45°, stroke
 * 9/100 of the disc diameter, round caps, hub radius 11/100.
 */
export type LogoVariant =
  | 'colour-on-paper' // coral disc, ink spokes and hub, ink type
  | 'colour-on-marine' // coral disc, ink spokes and hub, white type
  | 'colour-on-coral' // ink-900 disc, coral spokes, ink-900 type
  | 'mono-ink' // on paper or white: ink type and disc, spokes take the background
  | 'mono-white' // on marine: white type and disc, spokes invert to ink
  | 'mono-ink900'; // on coral: ink-900 type and disc, spokes take the coral

type Colours = { text: string; disc: string; spokes: string };

const variants: Record<LogoVariant, Colours> = {
  'colour-on-paper': { text: 'var(--ink)', disc: 'var(--coral)', spokes: 'var(--ink)' },
  'colour-on-marine': { text: 'var(--white)', disc: 'var(--coral)', spokes: 'var(--ink)' },
  'colour-on-coral': { text: 'var(--ink-900)', disc: 'var(--ink-900)', spokes: 'var(--coral)' },
  'mono-ink': { text: 'var(--ink)', disc: 'var(--ink)', spokes: 'var(--paper)' },
  'mono-white': { text: 'var(--white)', disc: 'var(--white)', spokes: 'var(--ink)' },
  'mono-ink900': { text: 'var(--ink-900)', disc: 'var(--ink-900)', spokes: 'var(--coral)' },
};

const P = logoPaths;
/** Gap between the lines: 6px at the 28px nav size, so proportional to the lockup. */
const GAP = 275;
const TOP = -P.mark.d; // the O (and the mark) overshoot the cap height
const HEIGHT = P.mark.d + GAP + P.line2.capHeight;
const LINE2_Y = GAP + P.line2.capHeight;

/** The eight-spoke mark, centred at (cx, cy) with diameter d. */
export function Mark({ cx, cy, d, disc, spokes }: { cx: number; cy: number; d: number; disc: string; spokes: string }) {
  const r = d / 2;
  const stroke = d * 0.09;
  const hub = d * 0.11;
  const reach = r * 0.7;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={disc} />
      <g stroke={spokes} strokeWidth={stroke} strokeLinecap="round">
        {[0, 45, 90, 135].map((a) => {
          const rad = (a * Math.PI) / 180;
          const dx = Math.cos(rad) * reach;
          const dy = Math.sin(rad) * reach;
          return <line key={a} x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} />;
        })}
      </g>
      <circle cx={cx} cy={cy} r={hub} fill={spokes} />
    </g>
  );
}

type Props = {
  variant?: LogoVariant;
  /** Rendered height in px. Omit to size it from CSS (the header does: 28 desktop / 22 mobile). Minimum lockup width is 120px (40px tall). */
  height?: number | string;
  title?: string;
  className?: string;
};

export function Logo({ variant = 'mono-ink', height, title = 'Motor Claims Department', className }: Props) {
  const c = variants[variant];
  const h = height === undefined ? undefined : typeof height === 'number' ? `${height}px` : height;
  return (
    <svg
      className={className}
      viewBox={`0 ${TOP} ${P.motor.width} ${HEIGHT}`}
      style={h ? { height: h, width: 'auto' } : { width: 'auto' }}
      role="img"
      aria-label={title}
      data-logo={variant}
    >
      <title>{title}</title>
      <g fill={c.text}>
        {P.motor.paths.map((g, i) => (
          <path key={`m${i}`} d={g.d} />
        ))}
      </g>
      <Mark cx={P.mark.cx} cy={P.mark.cy} d={P.mark.d} disc={c.disc} spokes={c.spokes} />
      <g fill={c.text} transform={`translate(0 ${LINE2_Y})`}>
        {P.line2.paths.map((g, i) => (
          <path key={`c${i}`} d={g.d} />
        ))}
      </g>
    </svg>
  );
}

export type SquareTone = 'marine' | 'paper' | 'coral';

const squares: Record<SquareTone, { tile: string; text: string; disc: string; spokes: string }> = {
  marine: { tile: '#16324f', text: '#ffffff', disc: '#f2694b', spokes: '#16324f' },
  paper: { tile: '#f7f5f0', text: '#16324f', disc: '#f2694b', spokes: '#16324f' },
  coral: { tile: '#f2694b', text: '#0f2438', disc: '#0f2438', spokes: '#f2694b' },
};

/**
 * The square: the mark stacked over "MCD" on a tile with a 32px radius at
 * 256px (12.5%). Favicon, app icon and social avatar. Hex colours rather than
 * tokens so it renders as a standalone file.
 */
export function squareSvg(tone: SquareTone, size = 1024, markOnly = false): string {
  const s = squares[tone];
  const U = 1000;
  const radius = U * 0.125;
  const d = markOnly ? U * 0.56 : U * 0.38;
  const cy = markOnly ? U / 2 : U * 0.36;
  const mcdScale = (U * 0.56) / P.mcd.width;
  const mcdY = U * 0.82;
  const r = d / 2;
  const stroke = d * 0.09;
  const hub = d * 0.11;
  const reach = r * 0.7;
  const spokes = [0, 45, 90, 135]
    .map((a) => {
      const rad = (a * Math.PI) / 180;
      const dx = Math.cos(rad) * reach;
      const dy = Math.sin(rad) * reach;
      return `<line x1="${(U / 2 - dx).toFixed(1)}" y1="${(cy - dy).toFixed(1)}" x2="${(U / 2 + dx).toFixed(1)}" y2="${(cy + dy).toFixed(1)}"/>`;
    })
    .join('');
  const mcd = markOnly
    ? ''
    : `<g fill="${s.text}" transform="translate(${((U - P.mcd.width * mcdScale) / 2).toFixed(1)} ${mcdY}) scale(${mcdScale.toFixed(4)})">${P.mcd.paths.map((g) => `<path d="${g.d}"/>`).join('')}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${U} ${U}" width="${size}" height="${size}"><title>MCD</title><rect width="${U}" height="${U}" rx="${radius}" fill="${s.tile}"/><circle cx="${U / 2}" cy="${cy}" r="${r}" fill="${s.disc}"/><g stroke="${s.spokes}" stroke-width="${stroke.toFixed(1)}" stroke-linecap="round">${spokes}</g><circle cx="${U / 2}" cy="${cy}" r="${hub.toFixed(1)}" fill="${s.spokes}"/>${mcd}</svg>`;
}

export function LogoSquare({ tone = 'marine', size = 64, className }: { tone?: SquareTone; size?: number; className?: string }) {
  return <span className={className} style={{ display: 'inline-block', width: size, height: size }} dangerouslySetInnerHTML={{ __html: squareSvg(tone, size) }} />;
}
