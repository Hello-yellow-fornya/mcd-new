'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button/Button';
import { site } from '@/lib/site';
import { cta } from '@/data/copy';
import styles from './StickyCallBar.module.css';

type Props = {
  /** Element the bar waits for; the bar shows once it has scrolled out of view. */
  heroSelector?: string;
};

/**
 * Mobile-only sticky call bar (guidelines §6): ink primary button, full width,
 * appears after the hero scrolls away. Desktop never shows it.
 */
export function StickyCallBar({ heroSelector = '[data-hero]' }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(heroSelector);
    if (!hero) {
      const onScroll = () => setShow(window.scrollY > 600);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }
    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.bottom < 80),
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [heroSelector]);

  return (
    <div className={[styles.bar, show && styles.show].filter(Boolean).join(' ')} data-testid="sticky-call-bar" inert={!show}>
      <Button href={site.phone.href} variant="ink" full>
        {cta.call}
      </Button>
    </div>
  );
}
