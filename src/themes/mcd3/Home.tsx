import Link from 'next/link';
import { Faq, Icon, IconCircle, JsonLd, SectionCta, SiteFooter, SiteHeader, StickyCallBar } from '@/components';
import { Button } from '@/components/Button/Button';
import { Highlight } from '@/components/Highlight/Highlight';
import { PhotoPlaceholder } from '@/components/PhotoPlaceholder/PhotoPlaceholder';
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

/** Heading text with the yellow underlay on its last words, once per section. */
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

function Heading({ id, text, highlight }: { id: string; text: string; highlight: string }) {
  return (
    <h2 id={id}>
      <Hl text={text} highlight={highlight} />
    </h2>
  );
}

/**
 * The MCD 3.0 homepage (design/mcd-homepage-concept-guidelines-v1.html and
 * mcd-homepage-mobile-guidelines-v1.html). Yellow hero with the three worries
 * → How it works → We know a shortcut → the handler block → who we help → the
 * objection-first FAQ → the ink final CTA → footer. On mobile the hero is
 * fold-locked with the ink call button, the wait row and the online pill on
 * the fold, and the sticky call bar appears once the hero scrolls away.
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
              <h1 id="hero-h">
                {home3.hero.line}
                <span className={styles.payoffLine}>
                  <mark className={styles.payoff} data-chip="invert">
                    {home3.hero.payoff}
                  </mark>
                </span>
              </h1>
              <p className={styles.lead}>{home3.hero.lead}</p>
              <ul className={styles.worries} aria-label="Three worries, answered" data-card-row>
                {home3.hero.worries.map((w) => (
                  <li key={w.worry}>
                    <IconCircle name={w.icon as IconName} size={44} />
                    <div>
                      <b>{w.worry}</b>
                      <span>{w.answer}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className={styles.flex} data-flex-gap aria-hidden="true" />
              <div className={styles.heroCtas}>
                <Button href={nav.claimHref} variant="ink" className={styles.startDesktop} data-testid="hero-start">
                  {home3.cta.start}
                </Button>
                <a className={styles.heroCall} href={site.phone.href} data-testid="hero-call">
                  <Icon name="phone" className={styles.ph} />
                  {home3.cta.call}
                </a>
                {wait.length > 0 && (
                  <ul className={styles.wait} aria-label="Why call" data-testid="hero-wait-row">
                    {wait.map((c) => (
                      <li key={c.id} className={c.substantiated ? undefined : styles.unsubstantiated} title={c.substantiated ? undefined : 'Unsubstantiated claim: renders on preview only until evidence is on file'}>
                        <span className={styles.pic}>
                          <Icon name={c.icon} size={11} />
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
        </section>

        <section id="how" className={styles.how} aria-labelledby="how-h" data-placement="how" data-content-section>
          <div className="wrap">
            <Heading id="how-h" text={home3.how.heading} highlight={home3.how.highlight} />
            <p className={styles.sub}>{home3.how.intro}</p>
            <ol className={styles.steps} data-card-row>
              {home3.how.steps.map((s) => (
                <li key={s.title}>
                  <IconCircle name={s.icon} size={48} />
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
            <SectionCta />
          </div>
        </section>

        <section id="shortcut" className={styles.shortcut} aria-labelledby="shortcut-h" data-placement="shortcut" data-content-section>
          <div className="wrap">
            <Heading id="shortcut-h" text={home3.shortcut.heading} highlight={home3.shortcut.highlight} />
            <p className={styles.sub}>{home3.shortcut.sub}</p>
            <div className={styles.ways} role="table" aria-label="The old way compared with the new way">
              <div className={styles.waysHead} role="row">
                <div role="columnheader">{home3.shortcut.oldWay}</div>
                <div role="columnheader">{home3.shortcut.newWay}</div>
              </div>
              {home3.shortcut.rows.map((r, i) => (
                <div key={i} className={styles.waysRow} role="row">
                  <div role="cell" className={styles.old}>
                    <span className={styles.mkNo} aria-hidden="true" data-mark="no">
                      <Icon name="cross" size={14} />
                    </span>
                    <span>{r.them}</span>
                  </div>
                  <div role="cell" className={styles.new}>
                    <span className={styles.mkOk} aria-hidden="true" data-mark="ok">
                      <Icon name="tick" size={14} />
                    </span>
                    <span>{r.us}</span>
                  </div>
                </div>
              ))}
            </div>
            <SectionCta />
          </div>
        </section>

        <section className={styles.handler} aria-labelledby="handler-h" data-placement="handler" data-content-section>
          <div className={`wrap ${styles.handlerIn}`}>
            <PhotoPlaceholder label={home3.handler.photoLabel} className={styles.handlerPhoto} />
            <div>
              <p className={styles.eyebrow}>{home3.handler.eyebrow}</p>
              <h2 id="handler-h">{home3.handler.quote}</h2>
              <p>{home3.handler.body}</p>
              <Link className={styles.textLink} href={home3.handler.link.href}>
                {home3.handler.link.label}
              </Link>
            </div>
            <SectionCta className={styles.handlerCta} />
          </div>
        </section>

        <section id="who" className={styles.who} aria-labelledby="who-h" data-placement="who-we-help" data-content-section>
          <div className="wrap">
            <Heading id="who-h" text={home3.who.heading} highlight={home3.who.highlight} />
            <ul className={styles.chips} aria-label="Who we help">
              {home3.who.chips.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className={styles.sub}>{home3.who.note}</p>
            <SectionCta />
          </div>
        </section>

        <Faq id="catch" heading={<Hl text={home3.faq.heading} highlight={home3.faq.highlight} />} sub={home3.faq.sub} items={home3.faq.items} className={styles.faq}>
          <SectionCta />
        </Faq>

        <section className={styles.final} aria-label="Your claims department" data-placement="final-cta">
          <div className="wrap on-dark">
            <p className={styles.finalLine}>{home3.final.line1}</p>
            <p className={styles.finalLine}>{home3.final.line2}</p>
            <p className={styles.finalPayoff}>
              <mark className={styles.finalChip} data-chip>
                {home3.final.payoff}
              </mark>
            </p>
            <div className={styles.finalCtas}>
              <Button href={nav.claimHref}>{home3.cta.start}</Button>
              <Button href={site.phone.href} variant="secondary-on-dark" icon="phone">
                {home3.cta.call}
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
