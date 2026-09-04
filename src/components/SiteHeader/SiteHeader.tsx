import Link from 'next/link';
import { Button } from '@/components/Button/Button';
import { site } from '@/lib/site';
import { nav, cta } from '@/data/copy';
import styles from './SiteHeader.module.css';

type Props = {
  links?: ReadonlyArray<{ href: string; label: string }>;
};

/**
 * Sticky nav on paper: text wordmark (until the logo exists), links, coral
 * phone button. Mobile shows the wordmark only; StickyCallBar takes over once
 * the hero has scrolled away.
 */
export function SiteHeader({ links = nav.links }: Props) {
  return (
    <header className={styles.nav}>
      <div className={`wrap ${styles.navIn}`}>
        <Link className={styles.brand} href="/">
          {site.wordmark}
        </Link>
        <nav className={styles.links} aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Button href={site.phone.href} icon="phone" className={styles.phone}>
          {cta.call}
        </Button>
      </div>
    </header>
  );
}
