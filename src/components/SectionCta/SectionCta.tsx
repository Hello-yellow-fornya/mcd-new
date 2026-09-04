import { Button } from '@/components/Button/Button';
import { site } from '@/lib/site';
import { cta, nav } from '@/data/copy';
import styles from './SectionCta.module.css';

type Props = {
  /** Landing pages stack the pair full width. */
  stack?: boolean;
  className?: string;
};

/** Every content section ends with this pair, both coral: Start your claim + Call 0800 048 0048. */
export function SectionCta({ stack, className }: Props) {
  return (
    <div className={[styles.secCta, stack && styles.stack, className].filter(Boolean).join(' ')}>
      <Button href={nav.claimHref}>{cta.start}</Button>
      <Button href={site.phone.href} icon="phone">
        {cta.call}
      </Button>
    </div>
  );
}
