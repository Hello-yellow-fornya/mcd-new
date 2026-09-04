import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Band, Button, SiteFooter, SiteHeader } from '@/components';
import { site } from '@/lib/site';
import { cta } from '@/data/copy';
import { ThankYouEvent } from './ThankYouEvent';
import styles from '@/templates/templates.module.css';

export const metadata: Metadata = {
  title: 'Claim started',
  robots: { index: false, follow: false },
  alternates: { canonical: '/claim-now/thank-you/' },
};

/** The thank-you route the claim flow redirects to. Fires the conversion; not indexed. */
export default function ThankYouPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className={styles.notFound}>
          <div className="wrap">
            <h1>That’s your bit done.</h1>
            <p>Your handler calls you back to confirm the other driver is covered and to arrange your car. If anything changes before then, ring us.</p>
            <Button href={site.phone.href} icon="phone">
              {cta.call}
            </Button>
          </div>
        </section>
        <Band cta={false} />
      </main>
      <SiteFooter />
      <Suspense fallback={null}>
        <ThankYouEvent />
      </Suspense>
    </>
  );
}
