import Link from 'next/link';
import { site } from '@/lib/site';
import { footer } from '@/data/copy';
import { CookieSettingsButton } from '@/components/Consent/ConsentBanner';
import { fcaLine } from '@/components/SiteFooter/SiteFooter';
import { Wordmark } from './Wordmark';
import { home3 } from './copy';
import styles from './FooterMcd3.module.css';

/** The 3.0 footer from design/mcd-homepage-concept-guidelines-v1.html: ink, four columns, yellow headings and number. */
export function FooterMcd3() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.foot}>
      <div className={`wrap ${styles.in}`}>
        <div>
          <Link href="/" className={styles.brand} aria-label="Motor Claims Department, home">
            <Wordmark surface="ink" />
          </Link>
          <p className={styles.strap}>{home3.footer.strapline}</p>
          <p>
            <a className={styles.tel} href={site.phone.href}>
              {site.phone.display}
            </a>
          </p>
        </div>
        {home3.footer.columns.map((col, i) => (
          <div key={col.heading}>
            <h4>{col.heading}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
              {i === home3.footer.columns.length - 1 && (
                <li>
                  <CookieSettingsButton className={styles.linkButton} />
                </li>
              )}
            </ul>
          </div>
        ))}
        <p className={styles.legal} data-testid="legal-line">
          {site.legalName}. {fcaLine()} Registered in England and Wales, company number {footer.companyNumber}. Registered office: {footer.registeredOffice}. © {year}.
        </p>
      </div>
    </footer>
  );
}
