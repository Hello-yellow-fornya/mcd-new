import { Fragment } from 'react';
import {
  Band,
  Faq,
  Icon,
  IndependenceLine,
  JsonLd,
  LandingHeader,
  ProofGrid,
  ReviewCarousel,
  SectionCta,
  SiteFooter,
  StickyCallBar,
  ThemUs,
} from '@/components';
import { Button } from '@/components/Button/Button';
import { patternClass } from '@/components/Pattern/Pattern';
import { absoluteUrl, site } from '@/lib/site';
import { resolveClaims, type LandingConfig } from '@/lib/landing';
import { cta, homeFaq, themUs } from '@/data/copy';
import styles from './LandingPage.module.css';


function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i, arr) => (
        <Fragment key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Paid landing page (brief §6) from design/mcd-lp-*.html: mobile-first column,
 * the marine bar, text hero on the ink shards with the proof grid, the coral
 * "call now" pill, the wait row and the online CTA at the fold; independence
 * line; reviews; optional fault checklist; the chip band; them/us; FAQ; footer.
 * Insurer name appears only in the H1 and the independence line.
 */
export function LandingPage({ config }: { config: LandingConfig }) {
  const grid = resolveClaims(config.proof);
  const row = resolveClaims(config.waitRow);
  const url = absoluteUrl(`/claim/${config.slug}/`);
  return (
    <div className={styles.page}>
      <div className={styles.column}>
        <LandingHeader />
        <main id="main">
          <section className={`${styles.hero} ${patternClass('shards-ink')}`} data-hero data-placement="hero">
            <div className={`wrap ${styles.heroIn}`}>
              <h1>
                {config.h1}
                <span className={styles.hl}>{config.h1Sub}</span>
              </h1>
              <h2 className={styles.instruction}>
                <Lines text={config.instruction} />
              </h2>
              {grid.length > 0 && <ProofGrid items={grid} className={styles.grid} />}
              <a className={styles.call} href={site.phone.href} data-track="hero-call" data-testid="hero-call">
                <Icon name="phone" className={styles.callIcon} />
                call now
              </a>
              {row.length > 0 && (
                <ul className={styles.wait} aria-label="Why call" data-testid="wait-row">
                  {row.map((c) => (
                    <li key={c.id} className={c.substantiated ? undefined : styles.unsubstantiated} title={c.substantiated ? undefined : 'Unsubstantiated claim: renders on preview only until evidence is on file'}>
                      <span className={styles.pic}>
                        <Icon name={c.icon} size={c.icon === 'bolt' ? 10 : 11} />
                      </span>
                      {c.title}
                    </li>
                  ))}
                </ul>
              )}
              <Button href="/claim-now/" variant="secondary-on-dark" iconAfter="arrow" className={styles.online} data-testid="hero-online">
                {cta.online}
              </Button>
            </div>
          </section>

          <IndependenceLine insurer={config.insurer ?? undefined} />

          {config.facts.length > 0 && (
            <section className={styles.facts} aria-labelledby="facts-h">
              <div className="wrap">
                <h2 id="facts-h">What your policy says</h2>
                <ul className={styles.factList}>
                  {config.facts.map((f) => (
                    <li key={f.fact}>
                      {f.fact}
                      <span className={styles.src}>
                        Source: <a href={f.sourceUrl}>{f.source}</a>, checked {f.checkedOn}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className={styles.fnote}>Competitor terms quoted from publicly available documents on the dates shown; policies vary and you should check your own schedule.</p>
              </div>
            </section>
          )}

          <ReviewCarousel />

          {config.faultSection && (
            <section className={styles.fault} id="fault" aria-labelledby="fault-h" data-placement="fault">
              <div className="wrap">
                <h2 id="fault-h">Not sure it was their fault?</h2>
                <ul className={styles.fchk}>
                  {['You were hit from behind', 'You were parked or stationary', 'They pulled out or changed lanes into you'].map((t) => (
                    <li key={t}>
                      <span className={styles.ok} aria-hidden="true">
                        <Icon name="tick" size={14} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
                <p className={styles.fnote2}>If any of those is you, it’s a no-fault claim. Not sure? Call — we’ll tell you on the first call, before you’ve signed anything.</p>
                <h3>What to do right now</h3>
                <ol className={styles.now}>
                  {['Get the other driver’s name, reg and insurer.', 'Don’t admit fault — to them or to anyone who rings.', 'Call us before you call your insurer.'].map((t, i) => (
                    <li key={t}>
                      <b aria-hidden="true">{i + 1}</b>
                      {t}
                    </li>
                  ))}
                </ol>
                <p className={`${styles.fnote2} ${styles.small}`}>If the other driver was uninsured or drove off, this route doesn’t apply — call us anyway and we’ll point you to the right one.</p>
                <div className={styles.faultCta}>
                  <Button href={site.phone.href} icon="phone" full>
                    {cta.call}
                  </Button>
                </div>
              </div>
            </section>
          )}

          <Band variant="chip" pattern="shards-ink" />

          <section className={styles.tu} id="ways" data-placement="them-us">
            <div className="wrap">
              <ThemUs head={themUs.head} rows={themUs.rows} compact />
              <SectionCta stack />
            </div>
          </section>

          <Faq id="how" heading={homeFaq.heading} sub={homeFaq.sub} items={config.faq}>
            <SectionCta stack />
          </Faq>
        </main>
        <SiteFooter />
        <StickyCallBar />
      </div>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebPage', url, name: config.title }} />
    </div>
  );
}
