import type { ReactNode } from 'react';
import { JsonLd } from '@/components/JsonLd/JsonLd';
import styles from './Faq.module.css';

export type FaqItem = { q: string; a: string };

type Props = {
  items: ReadonlyArray<FaqItem>;
  /** With a heading the FAQ renders as the two-column section (heading left, questions right). */
  heading?: string;
  sub?: string;
  /** Slot after the questions, normally a SectionCta. */
  children?: ReactNode;
  /** Emit FAQPage JSON-LD from the same items, so schema always matches the visible FAQ. */
  schema?: boolean;
  firstOpen?: boolean;
  id?: string;
};

function List({ items, firstOpen, large }: { items: ReadonlyArray<FaqItem>; firstOpen: boolean; large?: boolean }) {
  return (
    <div className={[styles.faq, large && styles.large].filter(Boolean).join(' ')}>
      {items.map((item, i) => (
        <details key={item.q} open={firstOpen && i === 0}>
          <summary>{item.q}</summary>
          <div className={styles.a}>
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

export function faqSchema(items: ReadonlyArray<FaqItem>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

/** Details accordion with plus/minus in coral, first item open by default. */
export function Faq({ items, heading, sub, children, schema = true, firstOpen = true, id }: Props) {
  const ld = schema ? <JsonLd data={faqSchema(items)} /> : null;
  if (!heading) {
    return (
      <>
        <List items={items} firstOpen={firstOpen} />
        {ld}
      </>
    );
  }
  return (
    <section id={id} className={styles.section}>
      <div className={`wrap ${styles.sectionIn}`}>
        <div>
          <h2>{heading}</h2>
          {sub && <p className={styles.sub}>{sub}</p>}
        </div>
        <List items={items} firstOpen={firstOpen} large />
        {children && <div className={styles.after}>{children}</div>}
      </div>
      {ld}
    </section>
  );
}
