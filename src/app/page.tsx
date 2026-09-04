import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Scaffold check',
  alternates: { canonical: '/' },
};

const colours = [
  ['ink', '#16324F', 'type, primary buttons, dark surfaces'],
  ['blue', '#3D6D9C', 'highlight words, links, eyebrows'],
  ['sky', '#BFD6E6', 'highlight underlay, tints'],
  ['stone', '#EDE9E1', 'section surfaces, cards on white'],
  ['paper', '#F7F5F0', 'page background'],
  ['white', '#FFFFFF', 'cards on stone, reg field'],
  ['coral', '#F2694B', 'the one bright'],
  ['green', '#7DC24A', 'functional handled state only'],
] as const;

export default function ScaffoldCheckPage() {
  return (
    <>
      <header className={styles.nav}>
        <div className={`wrap ${styles.navIn}`}>
          <Link className={styles.brand} href="/">
            {site.wordmark}
          </Link>
          <a className={styles.navPhone} href={site.phone.href}>
            Call {site.phone.display}
          </a>
        </div>
      </header>

      <main id="main" className={styles.page}>
        <div className="wrap">
          <p className={styles.status}>Step 1 scaffold check. The homepage replaces this page in step 3.</p>
          <h1>
            Hit by someone else? <mark className={styles.hl}>You shouldn’t pay for it.</mark>
          </h1>
          <p className={styles.lead}>{site.subline}</p>

          <section className={styles.section} aria-labelledby="colour">
            <h2 id="colour">Colour</h2>
            <p className={styles.note}>Each swatch is set in its paired text colour: ink on the light surfaces and the bright, white on ink and blue.</p>
            <ul className={styles.swatches}>
              {colours.map(([name, hex, role]) => (
                <li
                  key={name}
                  className={styles.swatch}
                  style={{ background: `var(--${name})`, color: `var(--on-${name})` }}
                >
                  <b>{name}</b>
                  <small>{hex}</small>
                  <small>{role}</small>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section} aria-labelledby="type">
            <h2 id="type">Type</h2>
            <p className={styles.note}>Libre Franklin 900 for display and big print. Public Sans 400, 600 and 700 for everything else. Both self-hosted.</p>
            <div className={styles.type}>
              <div>
                <span className={styles.label}>Big print, 96px to 48px</span>
                <p className={styles.big}>£0</p>
              </div>
              <div>
                <span className={styles.label}>H2 section, 42px to 28px</span>
                <h2>How it works</h2>
              </div>
              <div>
                <span className={styles.label}>H3 card, 20 to 22px</span>
                <h3>A dedicated, UK-based call handler</h3>
              </div>
              <div>
                <span className={styles.label}>Body, 17px, line-height 1.6, 65 characters</span>
                <p className={styles.body}>
                  Someone hit you. Their insurer has to put it right, not yours. Most people don’t know that, so they claim on
                  their own policy and pay for someone else’s mistake. <strong>Bold is 700</strong> and{' '}
                  <span style={{ fontWeight: 600 }}>semibold is 600</span>.
                </p>
              </div>
              <div>
                <span className={styles.label}>Small and labels, 13 to 15px</span>
                <p className={styles.smallText}>Last reviewed 4 September 2026. By a named handler.</p>
              </div>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="shape">
            <h2 id="shape">Shape and elevation</h2>
            <p className={styles.note}>Cards 20px, photo frames 24px, reg field 14px, pills 999px, icon circles 50%. One soft shadow on floating elements only.</p>
            <ul className={styles.shapes}>
              <li className={styles.shape}><span className={styles.card} />card 20px</li>
              <li className={styles.shape}><span className={styles.photo} />photo 24px</li>
              <li className={styles.shape}><span className={styles.reg} />reg field 14px</li>
              <li className={styles.shape}><span className={styles.pill}>Pill 999px</span>button</li>
              <li className={styles.shape}><span className={styles.circle} />icon circle</li>
              <li className={styles.shape}><span className={styles.float} />floating</li>
            </ul>
          </section>
        </div>

        <section className={`${styles.band} on-dark`} aria-label="Band">
          <div className="wrap">
            <p className={styles.bandL1}>Your insurer has a claims department.</p>
            <p className={styles.bandL2}>
              It works for your insurer. <mark>We work for you.</mark>
            </p>
          </div>
        </section>
      </main>

      <footer className={styles.foot}>
        <div className="wrap">
          <p>
            <strong>{site.wordmark}</strong>
          </p>
          <p className={styles.smallText}>{site.strapline}</p>
          <p>
            <a className={styles.footPhone} href={site.phone.href}>
              {site.phone.display}
            </a>
          </p>
          <p className={styles.footLegal}>
            {site.legalName}. [TODO: regulatory status and FCA firm reference number, exactly as on the FCA Register.]
            Registered address and company number to follow.
          </p>
        </div>
      </footer>
    </>
  );
}
