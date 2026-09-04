import Link from 'next/link';
import { PhotoPlaceholder } from '@/components/PhotoPlaceholder/PhotoPlaceholder';
import { SectionCta } from '@/components/SectionCta/SectionCta';
import { handler } from '@/data/copy';
import styles from './HandlerBlock.module.css';

/** "Your handler" block from the homepage and landing pages: photo, eyebrow, quote, link, CTA pair. */
export function HandlerBlock({ stackCta }: { stackCta?: boolean }) {
  return (
    <section className={styles.handler} aria-labelledby="handler-h">
      <div className={`wrap ${styles.in}`}>
        <PhotoPlaceholder className={styles.photo} label={handler.photoLabel} note="Photo: Dani, mid-call, real desk, no headset" />
        <div>
          <p className={styles.pre}>{handler.eyebrow}</p>
          <h2 id="handler-h">{handler.quote}</h2>
          <p>{handler.body}</p>
          <Link className={styles.textLink} href={handler.link.href}>
            {handler.link.label}
          </Link>
        </div>
        <SectionCta className={styles.span} stack={stackCta} />
      </div>
    </section>
  );
}
