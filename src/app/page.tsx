import type { Metadata } from 'next';
import { Band, Faq, HandlerBlock, HeroPhoto, IconCircle, JsonLd, ReviewCarousel, SectionCta, SiteFooter, SiteHeader, ThemUs } from '@/components';
import { site, absoluteUrl } from '@/lib/site';
import { benefits, hero, homeFaq, themUs } from '@/data/copy';
import heroImage from '../../public/images/hero-placeholder.jpg';
import heroImageMobile from '../../public/images/hero-placeholder-mobile.jpg';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: { absolute: `${site.name} | The claims department on your side` },
  description: `${hero.line} ${hero.subline}`,
  alternates: { canonical: '/' },
  openGraph: {
    title: site.name,
    description: hero.subline,
    url: '/',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': absoluteUrl('/#org'),
      name: site.name,
      legalName: site.legalName,
      url: absoluteUrl('/'),
      telephone: site.phone.e164,
      areaServed: 'GB',
    },
    {
      '@type': 'WebSite',
      '@id': absoluteUrl('/#website'),
      url: absoluteUrl('/'),
      name: site.name,
      publisher: { '@id': absoluteUrl('/#org') },
      inLanguage: 'en-GB',
    },
  ],
};

/**
 * Homepage. Order: photo hero → benefits grid + CTA pair → review band → the
 * band on ink shards (no CTAs) running into the their/your table + CTA pair →
 * "How it works" FAQ with the catch open + CTA pair → handler block + CTA pair
 * → footer.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader transparent />
      <main id="main">
        <HeroPhoto image={{ src: heroImage, alt: hero.photoAlt }} mobileImage={{ src: heroImageMobile }} underNav />

        <section className={styles.benefits} aria-labelledby="benefits-h" data-placement="benefits">
          <div className="wrap">
            <h2 id="benefits-h">{benefits.heading}</h2>
            <ul className={styles.bgrid}>
              {benefits.items.map((b) => (
                <li key={b.title} className={styles.b}>
                  <IconCircle name={b.icon} size={56} />
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </li>
              ))}
            </ul>
            <SectionCta />
          </div>
        </section>

        <ReviewCarousel />

        <Band size="lg" pattern="shards-ink" cta={false} />

        <section id="ways" className={styles.tu} aria-label="Their claims department compared with your claims handler" data-placement="them-us">
          <div className="wrap">
            <ThemUs head={themUs.head} rows={themUs.rows} className={styles.tuTable} />
            <SectionCta />
          </div>
        </section>

        <Faq id="how" heading={homeFaq.heading} sub={homeFaq.sub} items={homeFaq.items}>
          <SectionCta />
        </Faq>

        <HandlerBlock />
      </main>
      <SiteFooter />
      <JsonLd data={schema} />
    </>
  );
}
