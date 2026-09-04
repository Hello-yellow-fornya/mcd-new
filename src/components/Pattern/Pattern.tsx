import type { ReactNode, ElementType } from 'react';
import styles from './Pattern.module.css';

export type PatternName =
  | 'shards-ink'
  | 'shards-blue'
  | 'shards-coral'
  | 'shards-sky'
  | 'shards-stone'
  | 'shards-white'
  | 'sweep-stone'
  | 'sweep-splash'
  | 'sweep-ledger';

const classes: Record<PatternName, string> = {
  'shards-ink': styles.shardsInk,
  'shards-blue': styles.shardsBlue,
  'shards-coral': styles.shardsCoral,
  'shards-sky': styles.shardsSky,
  'shards-stone': styles.shardsStone,
  'shards-white': styles.shardsWhite,
  'sweep-stone': styles.sweepStone,
  'sweep-splash': styles.sweepSplash,
  'sweep-ledger': styles.sweepLedger,
};

/** Class name for a pattern background, to compose onto any section. */
export function patternClass(name: PatternName) {
  return classes[name];
}

/**
 * Shard and sweep SVGs as CSS backgrounds (guidelines §8). Ink shards are the
 * site pattern (How it works); stone and white for quiet sections; sweeps for
 * dark surfaces. Coral is campaign only, not a site surface.
 */
export function Pattern({ name, as: Tag = 'div', className, children, ...rest }: { name: PatternName; as?: ElementType; className?: string; children?: ReactNode } & Record<string, unknown>) {
  return (
    <Tag className={[classes[name], className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  );
}
