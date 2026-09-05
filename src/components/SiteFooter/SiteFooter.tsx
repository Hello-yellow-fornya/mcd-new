import Link from 'next/link';
import { site } from '@/lib/site';
import { isProduction } from '@/lib/staging';
import { footer } from '@/data/copy';
import { CookieSettingsButton } from '@/components/Consent/ConsentBanner';
import { Logo } from '@/components/Logo/Logo';
import styles from './SiteFooter.module.css';

/**
 * The FCA status line and firm reference number come from FCA_STATUS_LINE
 * (brief §11): a visible [TODO] on preview, and the production build stops
 * until it is set.
 */
export function fcaLine(): string {
  const line = process.env.FCA_STATUS_LINE?.trim();
  if (line) return line;
  if (isProduction()) {
    throw new Error('FCA_STATUS_LINE is not set. Add the regulatory status line, exactly as on the FCA Register, to the production environment before building.');
  }
  return '[TODO: regulatory status and FCA firm reference number, exactly as on the FCA Register.]';
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.foot}>
      <div className={`wrap ${styles.footIn}`}>
        <div>
          <p>
            <Link href="/" className={styles.brand} aria-label="Motor Claims Department, home">
              <Logo variant="mono-ink" height={28} />
            </Link>
          </p>
          <p className={styles.muted}>{site.strapline}</p>
          <p>
            <a className={styles.phone} href={site.phone.href}>
              {site.phone.display}
            </a>
          </p>
        </div>
        {footer.links.map((col, i) => (
          <ul key={i}>
            {col.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            {i === footer.links.length - 1 && (
              <li>
                <CookieSettingsButton className={styles.linkButton} />
              </li>
            )}
          </ul>
        ))}
        <p className={styles.legal} data-testid="legal-line">
          {site.legalName}. {fcaLine()} Registered in England and Wales, company number {footer.companyNumber}. Registered office:{' '}
          {footer.registeredOffice}. © {year}.
        </p>
      </div>
    </footer>
  );
}
