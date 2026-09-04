import { independence } from '@/data/copy';
import styles from './IndependenceLine.module.css';

/** "Independent accident management company. Not an insurer…" Renders directly under every landing-page hero. */
export function IndependenceLine({ insurer, text }: { insurer?: string; text?: string }) {
  const copy = text ?? (insurer ? independence.insurer(insurer) : independence.generic);
  return (
    <div className={styles.indep} data-testid="independence-line">
      <div className="wrap">{copy}</div>
    </div>
  );
}
