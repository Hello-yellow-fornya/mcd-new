import type { ReactNode } from 'react';
import { getImageProps, type StaticImageData } from 'next/image';
import { Icon } from '@/components/Icon/Icon';
import type { IconName } from '@/components/Icon/names';
import { RegBox } from '@/components/RegBox/RegBox';
import { site } from '@/lib/site';
import { hero as heroCopy, cta } from '@/data/copy';
import styles from './HeroPhoto.module.css';

export type HeroPill = { icon: IconName; label: string };
export type HeroWaitItem = { id: string; icon: IconName; title: string; substantiated: boolean };

type Props = {
  image: { src: string | StaticImageData; alt: string; width?: number; height?: number };
  /** Dedicated portrait crop for the mobile frame, served through <picture>. */
  mobileImage?: { src: string | StaticImageData; width?: number; height?: number };
  /** Homepage: the hero runs up under the transparent nav bar (desktop only; on mobile the bar is paper and the hero sits under it). */
  underNav?: boolean;
  title?: string;
  sub?: string;
  /** Mobile-only headline and sub (design/mcd-homepage-mobile-v2.html); the desktop copy is hidden below 820px when these are set. */
  mobileTitle?: ReactNode;
  mobileSub?: ReactNode;
  /** The wait row under the call button, mobile only. Comes from claims.json, so unsubstantiated items never render on production. */
  waitRow?: ReadonlyArray<HeroWaitItem>;
  pills?: ReadonlyArray<HeroPill>;
  /** Where the three pills sit on mobile: an ink strip above the photo, below it, or not at all (the fold-locked mobile hero). */
  mobilePills?: 'above' | 'below' | 'none';
  className?: string;
};

/**
 * Full-bleed photo hero from the homepage: marine scrim from the left, bottom
 * tint, copy block at the Cazoo proportions, reg field and coral call, three
 * transparent pills bottom-right. Mobile: fold-locked frame
 * (100dvh minus the bar), bottom scrim, bottom-anchored copy.
 */
const MOBILE = '(max-width: 820px)';
const DESKTOP = '(min-width: 821px)';

export function HeroPhoto({ image, mobileImage, title = heroCopy.line, sub = heroCopy.subline, mobileTitle, mobileSub, waitRow, pills = heroCopy.pills, mobilePills = 'above', underNav, className }: Props) {
  const common = { alt: image.alt, fill: true, sizes: '100vw', quality: 65, priority: true, fetchPriority: 'high' as const, className: styles.img };
  const desktop = getImageProps({ ...common, src: image.src }).props;
  const mobile = mobileImage ? getImageProps({ ...common, src: mobileImage.src }).props : null;
  const pillList = (
    <ul className={styles.pills} aria-label="Three reasons to claim through MCD">
      {pills.map((p) => (
        <li key={p.label}>
          <Icon name={p.icon} size={18} />
          <span>{p.label}</span>
        </li>
      ))}
    </ul>
  );
  const mobileStrip = mobilePills === 'none' ? null : <div className={styles.pillsMobile}>{pillList}</div>;
  return (
    <section className={[styles.wrap, underNav && styles.underNav, className].filter(Boolean).join(' ')} data-hero data-placement="hero">
      {/* getImageProps does not preload; these links are hoisted into <head> and only the matching one loads. */}
      {mobile && <link rel="preload" as="image" media={MOBILE} imageSrcSet={mobile.srcSet} imageSizes={mobile.sizes} fetchPriority="high" />}
      <link rel="preload" as="image" media={mobile ? DESKTOP : undefined} imageSrcSet={desktop.srcSet} imageSizes={desktop.sizes} fetchPriority="high" />
      <div className={`${styles.frame} on-dark`} data-testid="hero-frame" data-fold-locked={mobilePills === 'none' ? '' : undefined}>
        {mobilePills === 'above' && mobileStrip}
        {/* On mobile the photo fills the flexible space above the bottom-anchored copy: the hero's one flexible gap */}
        <picture data-flex-gap="photo">
          {mobile && <source media={MOBILE} srcSet={mobile.srcSet} sizes={mobile.sizes} />}
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
          <img {...desktop} />
        </picture>
        <div className={styles.copy} data-fold-copy>
          <h1>
            {mobileTitle ? (
              <>
                <span className={styles.desk}>{title}</span>
                <span className={styles.mob}>{mobileTitle}</span>
              </>
            ) : (
              title
            )}
          </h1>
          <p className={[styles.sub, mobileSub && styles.subSwitch].filter(Boolean).join(' ')}>
            {mobileSub ? (
              <>
                <span className={styles.desk}>{sub}</span>
                <span className={styles.mob}>{mobileSub}</span>
              </>
            ) : (
              sub
            )}
          </p>
          <div className={styles.reg}>
            <RegBox onPhoto />
            <a className={styles.call} href={site.phone.href} data-testid="hero-call">
              <Icon name="phone" className={styles.ph} />
              {cta.call}
            </a>
            {waitRow && waitRow.length > 0 && (
              <ul className={styles.wait} aria-label="Why call" data-testid="hero-wait-row">
                {waitRow.map((c) => (
                  <li key={c.id} className={c.substantiated ? undefined : styles.unsubstantiated} title={c.substantiated ? undefined : 'Unsubstantiated claim: renders on preview only until evidence is on file'}>
                    <span className={styles.pic}>
                      <Icon name={c.icon} size={c.icon === 'bolt' ? 9 : 10} />
                    </span>
                    {c.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className={styles.pillsDesktop}>{pillList}</div>
      </div>
      {mobilePills === 'below' && mobileStrip}
    </section>
  );
}
