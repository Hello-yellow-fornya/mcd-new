import { IconCircle } from '@/components/Icon/Icon';
import type { IconName } from '@/components/Icon/names';
import styles from './Steps.module.css';

export type Step = { title: string; body: string; icon?: IconName; id?: string };

type Props = {
  items: ReadonlyArray<Step>;
  /** On an ink surface (the homepage How it works) the cards drop their hairline. */
  onDark?: boolean;
  className?: string;
};

/**
 * 2×2 step cards. With icons they are the homepage cards (coral icon circle,
 * display title); without, the compact cards from the SEO templates.
 */
export function Steps({ items, onDark, className }: Props) {
  const withIcons = items.some((s) => s.icon);
  return (
    <ol className={[styles.steps, withIcons ? styles.icons : styles.compact, onDark && styles.onDark, className].filter(Boolean).join(' ')} data-card-row>
      {items.map((s, i) => (
        <li key={s.id ?? i} id={s.id} className={styles.step}>
          {s.icon && <IconCircle name={s.icon} size={56} className={styles.ic} />}
          <div>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
