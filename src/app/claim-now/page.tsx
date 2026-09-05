import type { Metadata } from 'next';
import { Band, Breadcrumb, HeroText, JsonLd, SiteFooter, SiteHeader } from '@/components';
import { absoluteUrl, site } from '@/lib/site';
import { ClaimStart } from './ClaimStart';
import styles from './claim-now.module.css';

export const metadata: Metadata = {
  title: { absolute: 'Start your claim | Motor Claims Department' },
  description: 'Start a non-fault claim online, or call 0800 048 0048 and a person in the UK picks up.',
  alternates: { canonical: '/claim-now/' },
};

/**
 * /claim-now/: the hero and the reg box, posting to the stub intake, with the
 * slot where the question flow mounts. The flow itself is not built here.
 */
export default function ClaimNowPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Breadcrumb items={[{ href: '/claim-now/', label: 'Start your claim' }]} schema={false} />
        <HeroText kicker="Three steps. Nothing goes through your policy." title="Start your claim" lead="Enter your reg and your handler takes it from there. Or call, and we do it together on the phone." cta="call" />
        <section className={styles.section} data-placement="claim-now">
          <div className={`wrap ${styles.grid}`}>
            <ClaimStart />
            <div className={styles.aside}>
              <h2>What we ask you</h2>
              <ul>
                <li>The other driver’s name, reg and insurer, if you have them</li>
                <li>Where and when it happened</li>
                <li>Whether anyone was hurt</li>
              </ul>
              <h2>What happens next</h2>
              <p>Your handler calls you back, confirms the other driver is covered and the fault is clear, and arranges your car. That is your bit done.</p>
            </div>
          </div>
        </section>
        <Band cta={false} />
      </main>
      <SiteFooter />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'Organization', '@id': absoluteUrl('/#org'), name: site.name, url: absoluteUrl('/'), telephone: site.phone.e164 },
            { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') }, { '@type': 'ListItem', position: 2, name: 'Start your claim', item: absoluteUrl('/claim-now/') }] },
          ],
        }}
      />
    </>
  );
}
