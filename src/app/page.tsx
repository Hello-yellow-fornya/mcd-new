import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Band,
  Faq,
  HeroPhoto,
  IconCircle,
  JsonLd,
  Pattern,
  PhotoPlaceholder,
  SectionCta,
  SiteFooter,
  SiteHeader,
  Steps,
} from '@/components';
import { site, absoluteUrl } from '@/lib/site';
import { benefits, handler, hero, homeFaq, howItWorks, whoWeHelp } from '@/data/copy';
import heroImage from '../../public/images/hero-placeholder.jpg';
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

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <HeroPhoto image={{ src: heroImage, alt: hero.photoAlt }} />

        <section className={styles.benefits} aria-labelledby="benefits-h">
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

        <Pattern as="section" name="shards-ink" id="how" className={`${styles.how} on-dark`} aria-labelledby="how-h">
          <div className="wrap">
            <h2 id="how-h">{howItWorks.heading}</h2>
            <p className={styles.howSub}>
              <b>{howItWorks.introLead}</b>
              Most people don’t know that. They ring their own insurer, pay the excess, and watch their no-claims take the hit for
              somebody else’s mistake. We claim from <em>their</em> insurer instead. Here’s what that means for you.
            </p>
            <Steps items={howItWorks.steps} onDark />
            <SectionCta />
          </div>
        </Pattern>

        <Faq id="catch" heading={homeFaq.heading} sub={homeFaq.sub} items={homeFaq.items}>
          <SectionCta />
        </Faq>

        <section className={styles.handler} aria-labelledby="handler-h">
          <div className={`wrap ${styles.handlerIn}`}>
            <PhotoPlaceholder className={styles.handlerPhoto} label={handler.photoLabel} note="Photo: Dani, mid-call, real desk, no headset" />
            <div>
              <p className={styles.pre}>{handler.eyebrow}</p>
              <h2 id="handler-h">{handler.quote}</h2>
              <p>{handler.body}</p>
              <Link className={styles.textLink} href={handler.link.href}>
                {handler.link.label}
              </Link>
            </div>
            <SectionCta className={styles.span} />
          </div>
        </section>

        <Band size="lg" />

        <section id="types" className={styles.types} aria-labelledby="types-h">
          <div className="wrap">
            <h2 id="types-h">Who we help</h2>
            <ul className={styles.chips}>
              {whoWeHelp.map((w) => (
                <li key={w} className={styles.chip}>
                  {w}
                </li>
              ))}
            </ul>
            <SectionCta className={styles.typesCta} />
          </div>
        </section>
      </main>
      <SiteFooter />
      <JsonLd data={schema} />
    </>
  );
}
