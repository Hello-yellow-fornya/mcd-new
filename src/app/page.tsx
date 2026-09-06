import type { Metadata } from 'next';
import { Band, BenefitsBand, Faq, HeroPhoto, Highlight, IndependenceLine, JsonLd, ProofGrid, ReviewCarousel, SectionCta, SiteFooter, SiteHeader, Steps, ThemUs } from '@/components';
import { patternClass } from '@/components/Pattern/Pattern';
import { site, absoluteUrl } from '@/lib/site';
import { resolveClaims } from '@/lib/landing';
import { benefits, catchSection, hero, heroMobile, homeFaq, howItWorks, themUs } from '@/data/copy';
import heroImage from '../../public/images/hero-placeholder.jpg';
import heroImageMobile from '../../public/images/hero-placeholder-mobile.jpg';
import { isMcd3 } from '@/lib/theme';
import { HomeMcd3 } from '@/themes/mcd3/Home';
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

/** A headline with one marked phrase (the coral bar on the mobile hero). */
function Marked({ before, mark, after }: { before: string; mark: string; after: string }) {
  return (
    <>
      {before}
      <mark>{mark}</mark>
      {after}
    </>
  );
}

/** A heading that reads one way on desktop and another on mobile. */
function Switch({ desktop, mobile }: { desktop: string; mobile: string }) {
  return (
    <>
      <span className={styles.deskOnly}>{desktop}</span>
      <span className={styles.mobOnly}>{mobile}</span>
    </>
  );
}

/**
 * Homepage V1.
 * Desktop (design/mcd-site-fullbleed.html): photo hero → the moving "Why claim"
 * band → the chip band on ink shards → review carousel → How it works on ink
 * shards → the catch (FAQ) → footer.
 * Mobile (design/mcd-homepage-mobile-v2.html): the paper bar, the fold-locked
 * photo hero → 2×2 proof grid → reviews → the chip band → their/your table with
 * the CTA pair → independence line → FAQ → footer.
 * One DOM, ordered for desktop; the mobile order is flex order on <main>, and
 * the sections that belong to one breakpoint only are hidden on the other.
 */
function HomeMcd2() {
  const grid = resolveClaims([...heroMobile.proof]);
  const waitRow = resolveClaims([...heroMobile.waitRow]);
  return (
    <div className={styles.home}>
      <SiteHeader transparent solidTone="paper" />
      <main id="main" className={styles.main}>
        <HeroPhoto
          image={{ src: heroImage, alt: hero.photoAlt }}
          mobileImage={{ src: heroImageMobile }}
          mobileTitle={<Marked {...heroMobile.line} />}
          mobileSub={<Marked {...heroMobile.sub} />}
          waitRow={waitRow}
          mobilePills="none"
          underNav
          className={styles.oHero}
        />

        <BenefitsBand heading={benefits.heading} highlight="Motor Claims Department" items={benefits.items} className={styles.deskOnly} />

        <Band variant="chip" pattern="shards-ink" className={styles.oBand} />

        <ReviewCarousel className={styles.oReviews} />

        <section id="how" className={`${styles.how} ${patternClass('shards-ink')} ${styles.deskOnly}`} aria-labelledby="how-h" data-placement="how" data-content-section>
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

        <Faq
          id="catch"
          heading={<Switch desktop={catchSection.heading} mobile={homeFaq.heading} />}
          sub={<Switch desktop={catchSection.sub} mobile={homeFaq.sub} />}
          items={homeFaq.items}
          className={styles.oFaq}
        >
          <SectionCta stack />
        </Faq>

        {/* Mobile only: the proof grid under the fold, then the their/your table and the independence line */}
        {grid.length > 0 && (
          <section className={`${styles.proofSec} ${styles.mobOnly} ${styles.oProof}`} aria-label="Why claim through Motor Claims Department" data-placement="proof">
            <ProofGrid items={grid} size="sm" />
          </section>
        )}
        <section id="ways" className={`${styles.tu} ${styles.mobOnly} ${styles.oTu}`} aria-label="Their claims department compared with your claims handler" data-placement="them-us" data-content-section>
          <div className="wrap">
            <ThemUs head={themUs.head} rows={themUs.rows} compact />
            <SectionCta stack />
          </div>
        </section>
        <IndependenceLine className={`${styles.mobOnly} ${styles.oIndep}`} />
      </main>
      <SiteFooter />
      <JsonLd data={schema} />
    </div>
  );
}

/** One route, one skin: the theme decides which homepage renders. */
export default function HomePage() {
  return isMcd3 ? <HomeMcd3 /> : <HomeMcd2 />;
}
