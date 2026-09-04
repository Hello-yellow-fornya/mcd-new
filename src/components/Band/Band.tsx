import { Highlight } from '@/components/Highlight/Highlight';
import { SectionCta } from '@/components/SectionCta/SectionCta';
import { patternClass, type PatternName } from '@/components/Pattern/Pattern';
import { band } from '@/data/copy';
import styles from './Band.module.css';

type Props = {
  /** Homepage size is a step larger than the SEO templates. */
  size?: 'md' | 'lg';
  cta?: boolean;
  pattern?: PatternName;
  /** Break before the highlighted words (the mobile landing pages do this). */
  breakBeforeHighlight?: boolean;
  className?: string;
};

/** Ink band: "Your insurer has a claims department. It works for your insurer. We work for you." */
export function Band({ size = 'md', cta = true, pattern, breakBeforeHighlight, className }: Props) {
  return (
    <section className={[styles.band, size === 'lg' && styles.lg, pattern && patternClass(pattern), className].filter(Boolean).join(' ')}>
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
