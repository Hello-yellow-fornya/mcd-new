import type { Metadata } from 'next';
import { Band, BenefitsBand, Faq, HandlerBlock, HeroPhoto, Highlight, JsonLd, ReviewCarousel, SectionCta, SiteFooter, SiteHeader, Steps } from '@/components';
import { patternClass } from '@/components/Pattern/Pattern';
import { site, absoluteUrl } from '@/lib/site';
import { benefits, catchSection, hero, homeFaq, howItWorks } from '@/data/copy';
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

/** The intro with "their" underlined in coral, as the mockup sets it. */
function Intro({ text }: { text: string }) {
  const key = 'their insurer instead';
  const at = text.indexOf(key);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <Highlight tone="coral">their</Highlight>
      {text.slice(at + 'their'.length)}
    </>
  );
}

/**
 * Homepage V1 (design/mcd-site-fullbleed.html). Order: photo hero → the moving
 * "Why claim" band → the chip band on ink shards → review carousel → How it
 * works on ink shards → the catch (FAQ) → handler block → footer.
 */
export default function HomePage() {
  return (
    <div className={styles.home}>
      <SiteHeader transparent solidTone="paper" />
      <main id="main">
        <HeroPhoto image={{ src: heroImage, alt: hero.photoAlt }} mobileImage={{ src: heroImageMobile }} underNav />

        <BenefitsBand heading={benefits.heading} items={benefits.items} />

        <Band variant="chip" pattern="shards-ink" />

        <ReviewCarousel />

        <section id="how" className={`${styles.how} ${patternClass('shards-ink')}`} aria-labelledby="how-h" data-placement="how">
          <div className="wrap on-dark">
            <h2 id="how-h">{howItWorks.heading}</h2>
            <p className={styles.howSub}>
              <b>{howItWorks.introLead}</b>
              <Intro text={howItWorks.intro} />
            </p>
            <Steps items={howItWorks.steps} onDark />
            <SectionCta />
          </div>
        </section>

        <Faq id="catch" heading={catchSection.heading} sub={catchSection.sub} items={homeFaq.items}>
          <SectionCta />
        </Faq>

        <HandlerBlock />
      </main>
      <SiteFooter />
      <JsonLd data={schema} />
    </div>
  );
}
