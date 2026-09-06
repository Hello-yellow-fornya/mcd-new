import type { ReactNode } from 'react';
import styles from './Highlight.module.css';

/**
 * Headline highlight (guidelines §4): blue words on a sky underlay. One per
 * headline, on the last two to five words. `coral` is the band underline.
 */
export function Highlight({ children, tone = 'sky' }: { children: ReactNode; tone?: 'sky' | 'coral' }) {
  return (
    <mark className={tone === 'coral' ? styles.coral : styles.sky} data-hl={tone}>
      {children}
    </mark>
  );
}
