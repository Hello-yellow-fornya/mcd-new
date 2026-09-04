import type { ReactNode } from 'react';
import { Button } from '@/components/Button/Button';
import { site } from '@/lib/site';
import { cta, nav } from '@/data/copy';
import styles from './HeroText.module.css';

type Props = {
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  meta?: { lastReviewed?: string; author?: string };
  /** Photo slot: a next/image or a PhotoPlaceholder. */
  photo?: ReactNode;
};

/** Text hero from the SEO templates: kicker, H1, lead, CTA pair, meta line, photo slot. */
export function HeroText({ kicker, title, lead, meta, photo }: Props) {
  return (
    <section className={styles.hero} data-hero>
      <div className={`wrap ${styles.heroIn}`}>
        <div>
          {kicker && <p className={styles.kicker}>{kicker}</p>}
          <h1>{title}</h1>
          {lead && <p className={styles.lead}>{lead}</p>}
          <div className={styles.ctaRow}>
            {/* CTA rule: Call is always coral with the phone icon; Start your claim is ink here, coral only in the section pair. */}
            <Button href={nav.claimHref} variant="ink">
              {cta.start}
            </Button>
            <Button href={site.phone.href} icon="phone">
              {cta.call}
            </Button>
          </div>
          {meta && (meta.lastReviewed || meta.author) && (
            <p className={styles.meta}>
              {meta.lastReviewed && (
                <span>
                  Last reviewed <b>{meta.lastReviewed}</b>
                </span>
              )}
              {meta.author && (
                <span>
                  By <b>{meta.author}</b>
                </span>
              )}
            </p>
          )}
        </div>
        {photo && <div className={styles.photo}>{photo}</div>}
      </div>
    </section>
  );
}
