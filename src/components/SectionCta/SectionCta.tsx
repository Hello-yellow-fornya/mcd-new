import { Button } from '@/components/Button/Button';
import { site } from '@/lib/site';
import { cta, nav } from '@/data/copy';
import styles from './SectionCta.module.css';

type Props = {
  /** Guidelines §6: both coral. The SEO templates draw the Call button in ink. */
  callVariant?: 'coral' | 'ink';
  /** Landing pages stack the pair full width. */
  stack?: boolean;
  className?: string;
};

/** Every content section ends with this pair: Start your claim + Call 0800 048 0048. */
export function SectionCta({ callVariant = 'coral', stack, className }: Props) {
  return (
    <div className={[styles.secCta, stack && styles.stack, className].filter(Boolean).join(' ')}>
      <Button href={nav.claimHref}>{cta.start}</Button>
      <Button href={site.phone.href} variant={callVariant} icon="phone">
        {cta.call}
      </Button>
    </div>
  );
}
