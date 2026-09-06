import { Fragment } from 'react';
import { IconCircle } from '@/components/Icon/Icon';
import type { IconName } from '@/components/Icon/names';
import styles from './ProofGrid.module.css';

export type ProofItem = { id?: string; icon: IconName; title: string; sub?: string; substantiated?: boolean };

type Props = {
  items: ReadonlyArray<ProofItem>;
  label?: string;
  /** md: the landing-page grid (40px circles, 15px titles). sm: the mobile homepage grid (34px circles, 14px titles, hairline cards). */
  size?: 'md' | 'sm';
  className?: string;
};

/**
 * 2×2 proof cards: marine circle, coral icon, title, one-line sub. A newline
 * in the title forces the line break the mockup uses. Items flagged
 * substantiated: false are marked on previews (resolveClaims drops them on
 * production).
 */
export function ProofGrid({ items, label = 'Why claim through MCD', size = 'md', className }: Props) {
  return (
    <ul className={[styles.grid, size === 'sm' && styles.sm, className].filter(Boolean).join(' ')} aria-label={label} data-testid="proof-grid" data-card-row>
      {items.map((p) => {
        const unsubstantiated = p.substantiated === false;
        return (
          <li key={p.id ?? p.title} className={unsubstantiated ? styles.unsubstantiated : undefined} title={unsubstantiated ? 'Unsubstantiated claim: renders on preview only until evidence is on file' : undefined}>
            <IconCircle name={p.icon} tone="ink" size={size === 'sm' ? 34 : 40} className={styles.gic} />
            <b>
              {p.title.split('\n').map((line, i, arr) => (
                <Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </Fragment>
              ))}
            </b>
            {p.sub && <span className={styles.sub}>{p.sub}</span>}
          </li>
        );
      })}
    </ul>
  );
}
