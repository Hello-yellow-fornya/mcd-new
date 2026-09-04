import type { Metadata } from 'next';
import { Band, Button, SiteFooter, SiteHeader } from '@/components';
import { site } from '@/lib/site';
import { cta, nav } from '@/data/copy';
import styles from '@/templates/templates.module.css';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false, follow: false } };

/** Branded 404 (brief §5). */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className={styles.notFound}>
          <div className="wrap">
            <h1>That page isn’t here.</h1>
            <p>The link may be old, or the page hasn’t been written yet. If you’ve been hit by someone else, the number still works.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button href={nav.claimHref} variant="ink">
                {cta.start}
              </Button>
              <Button href={site.phone.href} icon="phone">
                {cta.call}
              </Button>
              <Button href="/" variant="secondary">
                Back to the homepage
              </Button>
            </div>
          </div>
        </section>
        <Band cta={false} />
      </main>
      <SiteFooter />
    </>
  );
}
