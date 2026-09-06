import Link from 'next/link';
import { Faq, Icon, IconCircle, JsonLd, SectionCta, SiteFooter, SiteHeader, StickyCallBar } from '@/components';
import { Button } from '@/components/Button/Button';
import { Highlight } from '@/components/Highlight/Highlight';
import type { IconName } from '@/components/Icon/names';
import { resolveClaims } from '@/lib/landing';
import { site, absoluteUrl } from '@/lib/site';
import { nav } from '@/data/copy';
import { home3 } from './copy';
import { Illustration } from './Illustration';
import styles from './Home.module.css';

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': absoluteUrl('/#org'), name: site.name, legalName: site.legalName, url: absoluteUrl('/'), telephone: site.phone.e164, areaServed: 'GB' },
    { '@type': 'WebSite', '@id': absoluteUrl('/#website'), url: absoluteUrl('/'), name: site.name, publisher: { '@id': absoluteUrl('/#org') }, inLanguage: 'en-GB' },
  ],
};

/** Heading text with the half-height yellow underlay on its last words, once per section. */
function Hl({ text, highlight }: { text: string; highlight: string }) {
  const at = text.lastIndexOf(highlight);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <Highlight>{text.slice(at)}</Highlight>
    </>
  );
}

/**
 * The MCD 3.0 homepage, reproduced from design/mcd-homepage-concept-guidelines-v1.html
 * (desktop) and mcd-homepage-mobile-guidelines-v1.html (mobile). Yellow hero
 * with the three worries → How it works → We know a shortcut → the handler →
 * who we help → the objection-first FAQ → the ink final CTA → footer. Mobile:
 * the hero is fold-locked with one flexible gap between the worries and the
 * call block; the sticky call bar shows once the hero scrolls away.
 */
export function HomeMcd3() {
  const wait = resolveClaims([...home3.hero.proof]);
  return (
    <div className={styles.home}>
      <SiteHeader />
      <main id="main">
        <section className={styles.hero} data-hero data-placement="hero" aria-labelledby="hero-h">
          <div className={`wrap ${styles.heroIn}`} data-fold-locked>
            <div className={styles.heroCopy} data-fold-copy>
              <p className={styles.heroEyebrow}>{home3.hero.eyebrow}</p>
              <h1 id="hero-h">
                {home3.hero.line}
                <br />
                <mark className={styles.payoff} data-chip="invert">
                  {home3.hero.payoff}
                </mark>
              </h1>
              <p className={styles.lead}>{home3.hero.lead}</p>
              {/* Desktop CTAs (the mobile call block sits at the fold, below) */}
              <div className={styles.heroCtas}>
                <Button href={nav.claimHref} variant="ink" className={styles.heroStart} data-testid="hero-start">
                  {home3.cta.start}
                </Button>
                <a className={styles.heroCallOut} href={site.phone.href}>
                  <Icon name="phone" className={styles.ph} />
                  {home3.cta.call}
                </a>
              </div>
              {/* Mobile: the three worries under the headline pair, then the one flexible gap, then the call block on the fold */}
              <ul className={`${styles.worries} ${styles.worriesMobile}`} aria-label="Three worries, answered" data-card-row>
                {home3.hero.worries.map((w) => (
                  <li key={w.worry} className={styles.worry}>
                    <IconCircle name={w.icon as IconName} size={36} />
                    <div>
                      <b>{w.worry}</b>
                      <span>{w.answer}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className={styles.flex} data-flex-gap aria-hidden="true" />
              <div className={styles.callBlock}>
                <a className={styles.heroCall} href={site.phone.href} data-testid="hero-call">
                  <Icon name="phone" className={styles.ph} />
                  {home3.cta.call}
                </a>
                {wait.length > 0 && (
                  <ul className={styles.wait} aria-label="Why call" data-testid="hero-wait-row">
                    {wait.map((c) => (
                      <li key={c.id} className={c.substantiated ? undefined : styles.unsubstantiated} title={c.substantiated ? undefined : 'Unsubstantiated claim: renders on preview only until evidence is on file'}>
                        <span className={styles.pic}>
                          <Icon name={c.icon === 'dot' ? 'clock' : c.icon} size={9} />
                        </span>
                        {c.title}
                      </li>
                    ))}
                  </ul>
                )}
                <Button href={nav.claimHref} variant="secondary" iconAfter="arrow" className={styles.online} data-testid="hero-online">
                  {home3.hero.online}
                </Button>
              </div>
            </div>
            <Illustration className={styles.illustration} title={home3.hero.illustrationAlt} />
          </div>
          {/* Desktop: the three worries as a row of equal-height cards under the headline pair */}
          <div className={`wrap ${styles.worriesRow}`}>
            <ul className={styles.worries} aria-label="Three worries, answered" data-card-row>
              {home3.hero.worries.map((w) => (
                <li key={w.worry} className={styles.worry}>
                  <IconCircle name={w.icon as IconName} size={44} />
                  <div>
                    <b>{w.worry}</b>
                    <span>{w.answer}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="how" className={styles.sec} aria-labelledby="how-h" data-placement="how" data-content-section>
          <div className="wrap">
            <p className={styles.eyebrow}>{home3.how.eyebrow}</p>
            <h2 id="how-h">
              <Hl text={home3.how.heading} highlight={home3.how.highlight} />
            </h2>
            <p className={styles.sub}>{home3.how.sub}</p>
            <ol className={styles.steps} data-card-row>
              {home3.how.steps.map((s, i) => (
                <li key={s.title} className={styles.step}>
                  <span className={styles.n} aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
            <SectionCta />
          </div>
        </section>

        <section id="shortcut" className={`${styles.sec} ${styles.cream}`} aria-labelledby="shortcut-h" data-placement="shortcut" data-content-section>
          <div className="wrap">
            <p className={styles.eyebrow}>{home3.shortcut.eyebrow}</p>
            <h2 id="shortcut-h">
              <Hl text={home3.shortcut.heading} highlight={home3.shortcut.highlight} />
            </h2>
            <p className={styles.sub}>{home3.shortcut.sub}</p>
            <div className={styles.ways} data-card-row>
              {[
                { way: home3.shortcut.newWay, ok: true },
                { way: home3.shortcut.oldWay, ok: false },
              ].map(({ way, ok }) => (
                <div key={way.title} className={[styles.way, ok ? styles.wayNew : styles.wayOld].join(' ')}>
                  <p className={styles.eyebrow}>{way.eyebrow}</p>
                  <h3>{way.title}</h3>
                  <ul>
                    {way.items.map((item) => (
                      <li key={item}>
                        <span className={ok ? styles.mkOk : styles.mkNo} aria-hidden="true" data-mark={ok ? 'ok' : 'no'}>
                          <Icon name={ok ? 'tick' : 'cross'} size={16} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <SectionCta />
          </div>
        </section>

        <section className={styles.sec} aria-labelledby="handler-h" data-placement="handler" data-content-section>
          <div className={`wrap ${styles.handler}`}>
            <div className={styles.photo} role="img" aria-label={home3.handler.photoLabel}>
              <span className={styles.cap}>{home3.handler.caption}</span>
              {home3.handler.photoLabel}
            </div>
            <div>
              <p className={styles.eyebrow}>{home3.handler.eyebrow}</p>
              <blockquote className={styles.quote}>
                <h2 id="handler-h">{home3.handler.quote}</h2>
              </blockquote>
              <p>{home3.handler.body}</p>
              <p className={styles.linkLine}>
                <Link className={styles.textLink} href={home3.handler.link.href}>
                  {home3.handler.link.label}
                </Link>
              </p>
            </div>
            <SectionCta className={styles.handlerCta} />
          </div>
        </section>

        <section id="who" className={`${styles.sec} ${styles.cream}`} aria-labelledby="who-h" data-placement="who-we-help" data-content-section>
          <div className="wrap">
            <p className={styles.eyebrow}>{home3.who.eyebrow}</p>
            <h2 id="who-h">
              <Hl text={home3.who.heading} highlight={home3.who.highlight} />
            </h2>
            <ul className={styles.tags} aria-label="Who we help">
              {home3.who.tags.map((t, i) => (
                <li key={t} className={i === 0 ? styles.tagOn : undefined}>
                  {t}
                </li>
              ))}
            </ul>
            <SectionCta />
          </div>
        </section>

        <Faq
          id="catch"
          heading={
            <>
              <span className={styles.eyebrowInHeading}>{home3.faq.eyebrow}</span>
              <Hl text={home3.faq.heading} highlight={home3.faq.highlight} />
            </>
          }
          sub={home3.faq.sub}
          items={home3.faq.items}
          className={styles.faq}
        >
          <SectionCta />
        </Faq>

        <section className={styles.final} aria-labelledby="final-h" data-placement="final-cta">
          <div className={`wrap ${styles.finalIn}`}>
            <div>
              <h2 id="final-h">
                {home3.final.heading}{' '}
                <mark className={styles.finalChip} data-chip>
                  {home3.final.payoff}
                </mark>
              </h2>
              <p className={styles.finalSub}>{home3.final.sub}</p>
            </div>
            <div className={styles.finalCtas}>
              <Button href={nav.claimHref}>{home3.cta.start}</Button>
              <Button href={site.phone.href} variant="secondary-on-dark" icon="phone">
                {site.phone.display}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyCallBar />
      <JsonLd data={schema} />
    </div>
  );
}
