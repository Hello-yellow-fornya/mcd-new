import { Fragment } from 'react';
import { IconCircle } from '@/components/Icon/Icon';
import type { IconName } from '@/components/Icon/names';
import styles from './ProofGrid.module.css';

export type ProofItem = { icon: IconName; title: string; sub: string };

/** 2×2 proof cards from the landing pages. A newline in the title forces the line break the mockup uses. */
export function ProofGrid({ items, label = 'Why claim through MCD' }: { items: ReadonlyArray<ProofItem>; label?: string }) {
  return (
    <ul className={styles.grid} aria-label={label}>
      {items.map((p) => (
        <li key={p.title}>
          <IconCircle name={p.icon} tone="ink" size={40} className={styles.gic} />
          <b>
            {p.title.split('\n').map((line, i, arr) => (
              <Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </Fragment>
            ))}
          </b>
          <span className={styles.sub}>{p.sub}</span>
        </li>
      ))}
    </ul>
  );
}
