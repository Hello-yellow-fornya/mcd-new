import { IconCircle } from '@/components/Icon/Icon';
import type { IconName } from '@/components/Icon/names';
import { keeps } from '@/data/copy';
import styles from './KeepsStrip.module.css';

type Props = {
  items?: ReadonlyArray<{ icon: IconName; label: string }>;
};

/** Three things you keep: no excess, no claims bonus, like-for-like car. */
export function KeepsStrip({ items = keeps }: Props) {
  return (
    <section className={styles.keeps} aria-label="What you keep">
      <div className={`wrap ${styles.keepsIn}`}>
        {items.map((k) => (
          <div key={k.label} className={styles.keep}>
            <IconCircle name={k.icon} size={44} />
            {k.label}
          </div>
        ))}
      </div>
    </section>
  );
}
