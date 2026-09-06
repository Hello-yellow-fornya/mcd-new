import { Highlight } from '@/components/Highlight/Highlight';
import { Icon } from '@/components/Icon/Icon';
import { SectionCta } from '@/components/SectionCta/SectionCta';
import { patternClass, type PatternName } from '@/components/Pattern/Pattern';
import { site } from '@/lib/site';
import { band, nav } from '@/data/copy';
import styles from './Band.module.css';

type Props = {
  /** Homepage size is a step larger than the SEO templates. */
  size?: 'md' | 'lg';
  /**
   * chip: the homepage band from design/mcd-site-fullbleed.html. Two white
   * Franklin 900 lines, then "We work for you." on its own line in a coral
   * chip with white text (big print only, never below 28px), and two small
   * outlined pills beneath instead of the full CTA pair.
   */
  variant?: 'underline' | 'chip';
  cta?: boolean;
  pattern?: PatternName;
  /** Break before the highlighted words (the mobile landing pages do this). */
  breakBeforeHighlight?: boolean;
  className?: string;
};

/** Ink band: "Your insurer has a claims department. It works for your insurer. We work for you." */
export function Band({ size = 'md', variant = 'underline', cta = true, pattern, breakBeforeHighlight, className }: Props) {
  if (variant === 'chip') {
    return (
      <section className={[styles.band, styles.chipBand, pattern && patternClass(pattern), className].filter(Boolean).join(' ')} data-testid="band">
        <div className="wrap on-dark">
          <p className={styles.line}>{band.line1}</p>
          <p className={styles.line}>{band.line2}</p>
          <p className={styles.chipLine}>
            <mark className={styles.chip} data-chip>
              {band.highlight}
            </mark>
          </p>
          <div className={styles.pills}>
            <a className={styles.pill} href={nav.claimHref}>
              {band.pills.start}
            </a>
            <a className={styles.pill} href={site.phone.href}>
              <Icon name="phone" className={styles.ph} />
              {band.pills.call}
            </a>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className={[styles.band, size === 'lg' && styles.lg, pattern && patternClass(pattern), className].filter(Boolean).join(' ')} data-testid="band">
      <div className="wrap on-dark">
        <p className={styles.l1}>{band.line1}</p>
        <p className={styles.l2}>
          {band.line2}
          {breakBeforeHighlight ? <br /> : ' '}
          <Highlight tone="coral">{band.highlight}</Highlight>
        </p>
        {cta && <SectionCta />}
      </div>
    </section>
  );
}
