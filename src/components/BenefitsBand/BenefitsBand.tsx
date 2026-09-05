import { IconCircle } from '@/components/Icon/Icon';
import type { IconName } from '@/components/Icon/names';
import { Track } from './Track';
import styles from './BenefitsBand.module.css';

export type Benefit = { icon: IconName; title: string; body: string };

type Props = {
  heading: string;
  items: ReadonlyArray<Benefit>;
  className?: string;
};

/**
 * "Why claim through Motor Claims Department" as a moving band
 * (design/mcd-site-fullbleed.html): white section, the H2, then the stone
 * benefit cards at a fixed equal height scrolling left on a continuous loop.
 * The set is rendered twice so the loop is seamless; the copy is hidden from
 * assistive tech. Paused on hover and keyboard focus (CSS) and while touched
 * (Track); a static, scrollable row under reduced motion.
 */
export function BenefitsBand({ heading, items, className }: Props) {
  const set = (hidden: boolean) => (
    <ul className={styles.set} aria-hidden={hidden || undefined}>
      {items.map((b) => (
        <li key={b.title} className={styles.card}>
          <IconCircle name={b.icon} size={48} className={styles.ic} />
          <h3>{b.title}</h3>
          <p>{b.body}</p>
        </li>
      ))}
    </ul>
  );
  return (
    <section className={[styles.band, className].filter(Boolean).join(' ')} aria-labelledby="benefits-h" data-placement="benefits" data-testid="benefits-band">
      <div className="wrap">
        <h2 id="benefits-h">{heading}</h2>
      </div>
      <div className={styles.viewport}>
        <Track>
          {set(false)}
          {set(true)}
        </Track>
      </div>
    </section>
  );
}
