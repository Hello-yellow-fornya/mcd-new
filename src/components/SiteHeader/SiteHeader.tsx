'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/Icon/Icon';
import { Logo } from '@/components/Logo/Logo';
import { site } from '@/lib/site';
import { nav, cta, type NavLink } from '@/data/copy';
import styles from './SiteHeader.module.css';

type Props = {
  links?: ReadonlyArray<NavLink>;
  /** Homepage only: transparent over the photo hero, solid marine once it sticks. */
  transparent?: boolean;
  /** Landing pages: wordmark and the coral pill only, no links or drawer (the mockups show the wordmark alone). */
  minimal?: boolean;
};

function isActive(pathname: string, link: NavLink) {
  if (pathname === link.href) return true;
  return link.children?.some((c) => c.href === pathname) ?? false;
}

/**
 * The marine bar (CLAUDE.md §4). Sticky, ink, 72px desktop / 64px mobile.
 * The mono white lockup (§4a, 28px desktop / 22px mobile), links at 88% white with the active page underlined in
 * coral, a coral phone pill (the number on desktop, "Call now" on mobile,
 * never an icon-only circle) and a burger that opens the paper drawer.
 */
export function SiteHeader({ links = nav.links, transparent = false, minimal = false }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(!transparent);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const drawerId = useId();

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent]);

  useEffect(() => {
    setOpen(false);
    setMenuOpen(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setMenuOpen(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const solid = stuck || open;

  return (
    <header className={[styles.bar, transparent && styles.transparent, solid && styles.solid, 'on-dark'].filter(Boolean).join(' ')} data-testid="site-header">
      <div className={`wrap ${styles.in}`}>
        <Link className={styles.brand} href="/" aria-label="Motor Claims Department, home">
          <Logo variant="mono-white" className={styles.logo} />
        </Link>

        {!minimal && (
        <nav className={styles.links} aria-label="Main">
          {links.map((l) =>
            l.children ? (
              <div
                key={l.label}
                className={styles.menu}
                onMouseEnter={() => setMenuOpen(l.label)}
                onMouseLeave={() => setMenuOpen(null)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenuOpen(null);
                }}
              >
                <button
                  type="button"
                  className={[styles.link, isActive(pathname, l) && styles.active].filter(Boolean).join(' ')}
                  aria-expanded={menuOpen === l.label}
                  aria-controls={`${drawerId}-${l.label}`}
                  onClick={() => setMenuOpen(menuOpen === l.label ? null : l.label)}
                >
                  {l.label}
                  <span className={styles.caret} aria-hidden="true" />
                </button>
                <ul id={`${drawerId}-${l.label}`} className={styles.dropdown} hidden={menuOpen !== l.label}>
                  {l.children.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} aria-current={pathname === c.href ? 'page' : undefined}>
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className={[styles.link, isActive(pathname, l) && styles.active].filter(Boolean).join(' ')}
                aria-current={pathname === l.href ? 'page' : undefined}
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>
        )}

        <a className={[styles.phone, minimal && styles.phoneMinimal].filter(Boolean).join(' ')} href={site.phone.href}>
          <Icon name="phone" className={styles.ph} />
          <span className={styles.phoneDesktop}>{cta.call}</span>
          <span className={styles.phoneMobile}>Call now</span>
        </a>

        {!minimal && (
        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls={drawerId}
          aria-label={open ? 'Close menu' : 'Menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        )}
      </div>

      {!minimal && (
      <div id={drawerId} className={styles.drawer} hidden={!open} data-testid="nav-drawer">
        <nav aria-label="Main menu" className={styles.drawerIn}>
          <ul className={styles.drawerList}>
            {links.map((l) => (
              <li key={l.label}>
                <Link href={l.href} aria-current={pathname === l.href ? 'page' : undefined}>
                  {l.label}
                </Link>
                {l.children && (
                  <ul className={styles.drawerSub}>
                    {l.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} aria-current={pathname === c.href ? 'page' : undefined}>
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <a className={styles.drawerCall} href={site.phone.href}>
            <Icon name="phone" className={styles.ph} />
            {cta.call}
          </a>
          <p className={styles.reassure}>{site.phone.reassurance}</p>
        </nav>
      </div>
      )}
    </header>
  );
}

/** The landing-page header: the marine bar with the wordmark and the coral pill only. */
export function LandingHeader() {
  return <SiteHeader minimal />;
}
