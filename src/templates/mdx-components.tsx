import type { ComponentProps, ReactNode } from 'react';
import Link from 'next/link';
import { Callout } from '@/components/Callout/Callout';
import { Steps } from '@/components/Steps/Steps';
import { ThemUs } from '@/components/ThemUs/ThemUs';
import { PhotoPlaceholder } from '@/components/PhotoPlaceholder/PhotoPlaceholder';
import { isLinkable } from '@/lib/content';
import styles from './templates.module.css';

/** Placeholder figure inside prose: stone box, caption underneath. */
function Figure({ label, note, caption, ratio = '16/9' }: { label: string; note?: string; caption?: string; ratio?: '16/9' | '4/3' | '3/2' }) {
  return (
    <figure>
      <PhotoPlaceholder label={label} note={note} ratio={ratio} className={styles.figure} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/**
 * Links to pages that do not build yet (Phase 2/3 drafts) render as plain text
 * so nothing on the live site 404s. They come back as links when the page ships.
 */
function A({ href, children, ...rest }: ComponentProps<'a'>) {
  if (!href) return <a {...rest}>{children}</a>;
  if (href.startsWith('/')) {
    if (!isLinkable(href)) {
      return (
        <span className={styles.draftLink} data-draft-link={href} title="Coming soon">
          {children}
        </span>
      );
    }
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

/** Components available inside MDX content. */
export const mdxComponents = {
  a: A,
  Callout,
  Steps,
  ThemUs,
  Figure,
  Muted: ({ children }: { children: ReactNode }) => <p className="muted">{children}</p>,
};
