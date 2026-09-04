import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd/JsonLd';
import { absoluteUrl } from '@/lib/site';
import styles from './Breadcrumb.module.css';

export type Crumb = { href: string; label: string };

type Props = {
  /** Every crumb including the current page, which is the last item. Home is added automatically. */
  items: Crumb[];
  home?: boolean;
};

export function Breadcrumb({ items, home = true }: Props) {
  const all: Crumb[] = home ? [{ href: '/', label: 'Home' }, ...items] : items;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };
  return (
    <nav className={`wrap ${styles.crumbs}`} aria-label="Breadcrumb">
      <ol>
        {all.map((c, i) =>
          i === all.length - 1 ? (
            <li key={c.href}>
              <span aria-current="page">{c.label}</span>
            </li>
          ) : (
            <li key={c.href}>
              <Link href={c.href}>{c.label}</Link>
            </li>
          ),
        )}
      </ol>
      <JsonLd data={schema} />
    </nav>
  );
}
