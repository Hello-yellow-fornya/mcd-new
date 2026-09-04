import type { ReactNode } from 'react';
import { theCatch } from '@/data/copy';
import styles from './Callout.module.css';

type Props =
  | { variant?: 'default'; lead: string; children: ReactNode }
  | { variant: 'catch'; lead?: string; children?: ReactNode };

/**
 * Stone box with a bold lead line. The catch variant carries the one wording
 * for "The catch" so every page says the same thing (pending MCD's policy).
 */
export function Callout(props: Props) {
  if (props.variant === 'catch') {
    return (
      <div className={styles.callout} data-variant="catch">
        <b>{props.lead ?? 'The catch'}</b>
        {props.children ?? theCatch.callout}
      </div>
    );
  }
  return (
    <div className={styles.callout}>
      <b>{props.lead}</b>
      {props.children}
    </div>
  );
}
