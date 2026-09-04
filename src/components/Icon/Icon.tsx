import type { IconName } from './names';
import styles from './Icon.module.css';

type IconProps = {
  name: IconName;
  /** Pixel size; defaults to 1em so it follows the text. */
  size?: number | string;
  /** Accessible name. Omit for decorative icons (the default), which are hidden from assistive tech. */
  label?: string;
  className?: string;
};

export function Icon({ name, size = '1em', label, className }: IconProps) {
  const px = typeof size === 'number' ? `${size}px` : size;
  return (
    <svg
      className={[styles.icon, className].filter(Boolean).join(' ')}
      width={px}
      height={px}
      style={{ width: px, height: px }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <use href={`#i-${name}`} />
    </svg>
  );
}

export type CircleTone = 'coral' | 'sky' | 'ink';

type IconCircleProps = {
  name: IconName;
  /** coral: ink icon on coral (feature marker). sky: ink icon on sky (quiet). ink: coral icon on ink (on dark). */
  tone?: CircleTone;
  /** Circle diameter in px. The icon fills about 55% of it. Guidelines sizes: 32, 44, 56, 72. */
  size?: number;
  label?: string;
  className?: string;
};

export function IconCircle({ name, tone = 'coral', size = 56, label, className }: IconCircleProps) {
  const iconSize = Math.round(size * 0.54);
  return (
    <span
      className={[styles.circle, styles[tone], className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Icon name={name} size={iconSize} />
    </span>
  );
}
