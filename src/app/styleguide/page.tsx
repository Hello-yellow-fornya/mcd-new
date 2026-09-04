import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Band,
  Breadcrumb,
  Button,
  Callout,
  Faq,
  HeroPhoto,
  HeroText,
  Highlight,
  Icon,
  IconCircle,
  IndependenceLine,
  KeepsStrip,
  Pattern,
  PhotoPlaceholder,
  ProofGrid,
  Prose,
  RegBox,
  RelatedPages,
  ReviewCarousel,
  SectionCta,
  SiteFooter,
  SiteHeader,
  Steps,
  StickyCallBar,
  ThemUs,
  Toc,
} from '@/components';
import { iconNames } from '@/components/Icon/names';
import { isProduction } from '@/lib/staging';
import { benefits, homeFaq, howItWorks } from '@/data/copy';
import heroImage from '../../../public/images/hero-placeholder.jpg';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Component styleguide',
  robots: { index: false, follow: false },
  alternates: { canonical: '/styleguide/' },
};

const themUsRows = [
  { them: 'Works for your insurer', us: 'Works for you' },
  { them: 'A queue, then whoever picks up', us: 'One named person, UK-based, from first call to keys back' },
  { them: 'Your excess, paid by you', us: 'No excess — the other driver’s insurer pays' },
  { them: 'A claim on your policy', us: 'Nothing on your policy. Your no-claims untouched' },
  { them: 'A courtesy car, if you’re covered', us: 'A like-for-like car, on your drive' },
];

const youWeRows = [
  { them: 'One call, or your reg', us: 'Deal with the other driver’s insurer' },
  { them: 'Say yes to a delivery time', us: 'Deliver and collect the cars' },
  { them: 'Tell anyone who rings to speak to us', us: 'Chase the repair and the settlement' },
];

const proof = [
  { icon: 'shield', title: 'Protect your\nno claims', sub: 'Keep your no claims bonus safe.' },
  { icon: 'pound', title: 'No excess\nto pay', sub: 'Our service is free for non-fault drivers.' },
  { icon: 'car', title: 'Like-for-like\nreplacement', sub: 'Car, van or bike, whatever your cover.' },
  { icon: 'bolt', title: 'Back on the road\nwithin 90 mins', sub: 'Nationwide recovery and rapid mobilisation.' },
] as const;

function Block({ id, title, note, children }: { id: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={styles.block} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`}>{title}</h2>
      {note && <p className={styles.note}>{note}</p>}
      {children}
    </section>
  );
}

/** Every component from brief §4 with its variants. Staging only. */
export default function StyleguidePage() {
  if (isProduction()) notFound();
  return (
    <>
      <SiteHeader />
      <main id="main">
        <HeroPhoto image={{ src: heroImage, alt: 'A woman outside a red-brick London terrace being handed the keys to her hire car' }} />

        <div className={`wrap ${styles.page}`}>
          <div className={styles.intro}>
            <p className={styles.status}>Step 2 component styleguide. Staging only; not built on production.</p>
            <h1>
              Every component, <Highlight>one page.</Highlight>
            </h1>
          </div>

          <Block id="buttons" title="Button" note="coral, ink, secondary, secondary on dark; md and lg; with icons.">
            <div className={styles.row}>
              <Button href="/claim-now/">Start your claim</Button>
              <Button href="tel:08000480048" icon="phone">
                Call 0800 048 0048
              </Button>
              <Button href="tel:08000480048" variant="ink" icon="phone">
                Call 0800 048 0048
              </Button>
              <Button variant="secondary">What’s the catch?</Button>
              <Button href="/claim-now/" variant="secondary" iconAfter="arrow">
                Or start your claim online
              </Button>
              <Button href="tel:08000480048" size="lg" icon="phone">
                call now
              </Button>
            </div>
            <div className={`${styles.dark} on-dark`} style={{ marginTop: 16 }}>
              <div className={styles.row}>
                <Button variant="secondary-on-dark">What’s the catch?</Button>
                <Button href="tel:08000480048" icon="phone">
                  Call 0800 048 0048
                </Button>
              </div>
            </div>
          </Block>

          <Block id="icons" title="Icon" note="The solid set as drawn in the mockups, from one SVG sprite. Circles: coral, sky, ink.">
            <div className={styles.row}>
              {iconNames.map((n) => (
                <span key={n} title={n} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <Icon name={n} size={24} label={n} /> {n}
                </span>
              ))}
            </div>
            <div className={styles.row} style={{ marginTop: 16 }}>
              <IconCircle name="pound" tone="coral" size={56} />
              <IconCircle name="shield" tone="coral" size={44} />
              <IconCircle name="car" tone="sky" size={56} />
              <IconCircle name="person" tone="sky" size={32} />
              <IconCircle name="phone" tone="ink" size={56} />
              <IconCircle name="bolt" tone="ink" size={72} />
            </div>
          </Block>

          <Block id="breadcrumb" title="Breadcrumb" note="With BreadcrumbList JSON-LD.">
            <Breadcrumb items={[{ href: '/accident-management-company/', label: 'Accident management company' }, { href: '/how-accident-management-works/', label: 'How it works' }]} />
          </Block>

          <Block id="regbox" title="RegBox" note="Field, and the ink reg card. Formats to AB12 CDE as you type; submit opens the claim form.">
            <div className={styles.narrow}>
              <div className={styles.stone}>
                <RegBox />
              </div>
              <div style={{ marginTop: 16 }}>
                <RegBox variant="card" />
              </div>
            </div>
          </Block>

          <Block id="sectioncta" title="SectionCta" note="Both coral: the end-of-section pair. Beside a Call button anywhere else, Start your claim is ink (see the HeroText below).">
            <SectionCta />
          </Block>

          <Block id="callout" title="Callout" note="Default, and the catch variant with the one shared wording.">
            <Prose>
              <Callout lead="The short version">Someone hit you. Their insurer has to put it right — not yours. We claim from their insurer, so nothing goes through your policy.</Callout>
              <Callout variant="catch" />
            </Prose>
          </Block>

          <Block id="steps" title="Steps" note="Compact template cards, and the homepage cards with icon circles (shown on the ink shard pattern).">
            <Prose>
              <Steps
                items={[
                  { title: '1. Get their details', body: 'Name, reg and insurer.' },
                  { title: '2. Don’t admit fault', body: 'To them or to anyone who rings.' },
                  { title: '3. Call us before your insurer', body: 'Lorem ipsum dolor sit amet.' },
                  { title: '4. Tell your insurer it happened', body: 'A notification, not a claim.' },
                ]}
              />
            </Prose>
            <Pattern name="shards-ink" className={`${styles.dark} on-dark`} style={{ marginTop: 24 }}>
              <h2>{howItWorks.heading}</h2>
              <Steps items={howItWorks.steps} onDark />
              <SectionCta />
            </Pattern>
          </Block>

          <Block id="themus" title="ThemUs" note="them/us with cross and tick, and you/we with ticks both sides.">
            <Prose>
              <ThemUs head={['Their claims department', 'Your claims handler']} rows={themUsRows} />
              <ThemUs head={['What you do', 'What we do']} rows={youWeRows} variant="you-we" label="Who does what" />
            </Prose>
          </Block>

          <Block id="toc-prose" title="Toc and Prose" note="Sticky on this page list from the H2s; article body styles.">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 260px) 1fr', gap: 40, alignItems: 'start' }}>
              <Toc
                items={[
                  { id: 'what-is', text: 'What is an accident management company?' },
                  { id: 'how-it-works', text: 'How accident management works' },
                  { id: 'faq', text: 'Frequently asked questions' },
                ]}
              />
              <Prose>
                <h2 id="what-is">What is an accident management company?</h2>
                <p className="muted">
                  <strong>You do this.</strong> It’s the only thing you have to do.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. An accident management company handles a non-fault claim on your behalf and recovers the cost from the at-fault driver’s insurer. <Link href="/credit-hire/">How credit hire works</Link>.
                </p>
                <h3>What we ask you on the first call</h3>
                <ul>
                  <li>The other driver’s name, reg and insurer if you have them</li>
                  <li>Where and when it happened</li>
                  <li>Whether anyone was hurt</li>
                </ul>
                <figure>
                  <PhotoPlaceholder ratio="16/9" label="Diagram of a non-fault claim" note="Illustration: how the claim flows · SVG · alt written" />
                  <figcaption>How a non-fault claim flows when an accident management company handles it.</figcaption>
                </figure>
              </Prose>
            </div>
          </Block>

          <Block id="faq-inline" title="Faq" note="Inline list inside prose; the two-column section is further down.">
            <Prose>
              <Faq items={homeFaq.items.slice(0, 2)} schema={false} />
            </Prose>
          </Block>

          <Block id="proof" title="ProofGrid" note="2×2 proof cards from the landing pages, 390px wide.">
            <div className={styles.narrow}>
              <ProofGrid items={proof} />
            </div>
          </Block>

          <Block id="benefits" title="Benefits grid (from IconCircle)" note="Four stone cards, 2×2, from the homepage.">
            <ul className={styles.benefits}>
              {benefits.items.map((b) => (
                <li key={b.title} className={styles.benefit}>
                  <IconCircle name={b.icon} size={56} />
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="placeholder" title="PhotoPlaceholder" note="Stone box, 24px photo frame.">
            <div className={styles.narrow}>
              <PhotoPlaceholder label="A Motor Claims Department handler handing a customer the keys" note="Photo: keys handed over on a driveway · alt written · width/height set · WebP" />
            </div>
          </Block>

          <Block id="patterns" title="Pattern" note="Shards in six colours and the three subtle sweeps.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {(['shards-ink', 'shards-blue', 'shards-coral', 'shards-sky', 'shards-stone', 'shards-white', 'sweep-stone', 'sweep-splash', 'sweep-ledger'] as const).map((n) => (
                <Pattern key={n} name={n} style={{ aspectRatio: '16/9', borderRadius: 'var(--r-card)', padding: 12, fontSize: 13, fontWeight: 700, border: 'var(--border)' }}>
                  {n}
                </Pattern>
              ))}
            </div>
          </Block>
        </div>

        <HeroText
          kicker="Independent. Not an insurer."
          title="Accident management company for non-fault drivers"
          lead="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hit by someone else? Their insurer has to put it right — not yours."
          meta={{ lastReviewed: '[4 September 2026]', author: '[Named handler, role]' }}
          photo={<PhotoPlaceholder label="A Motor Claims Department handler handing a customer the keys to a like-for-like hire car outside her home" note="Photo: keys handed over on a driveway · alt written · width/height set · WebP" />}
        />
        <KeepsStrip />
        <IndependenceLine insurer="GoSkippy" />
        <ReviewCarousel />
        <Faq heading={homeFaq.heading} sub={homeFaq.sub} items={homeFaq.items} id="catch">
          <SectionCta />
        </Faq>
        <RelatedPages
          items={[
            { href: '/third-party-insurance-claim/', title: 'Third party insurance claim', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
            { href: '/non-fault-accident-courtesy-car/', title: 'Non-fault accident courtesy car', description: 'Sed do eiusmod tempor incididunt ut labore.' },
            { href: '/what-to-do-after-a-car-accident/', title: 'What to do after a car accident', description: 'Ut enim ad minim veniam, quis nostrud.' },
          ]}
        />
        <Band size="lg" />
        <Band pattern="shards-ink" cta={false} breakBeforeHighlight />
      </main>
      <SiteFooter />
      {/* Landing pages render this after their hero (CLAUDE.md §4); shown here for review. */}
      <StickyCallBar />
    </>
  );
}
