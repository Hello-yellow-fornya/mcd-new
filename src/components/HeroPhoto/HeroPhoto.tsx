import { getImageProps, type StaticImageData } from 'next/image';
import { Icon } from '@/components/Icon/Icon';
import type { IconName } from '@/components/Icon/names';
import { RegBox } from '@/components/RegBox/RegBox';
import { site } from '@/lib/site';
import { hero as heroCopy, cta } from '@/data/copy';
import styles from './HeroPhoto.module.css';

export type HeroPill = { icon: IconName; label: string };

type Props = {
  image: { src: string | StaticImageData; alt: string; width?: number; height?: number };
  /** Dedicated portrait crop for the mobile frame, served through <picture>. */
  mobileImage?: { src: string | StaticImageData; width?: number; height?: number };
  /** Homepage: the hero runs up under the transparent nav bar. */
  underNav?: boolean;
  title?: string;
  sub?: string;
  pills?: ReadonlyArray<HeroPill>;
  /** Where the three pills sit on mobile. The signed-off mockup renders them as an ink strip above the photo. */
  mobilePills?: 'above' | 'below';
};

/**
 * Full-bleed photo hero from the homepage: marine scrim from the left, bottom
 * tint, copy block at the Cazoo proportions, reg field and coral call, three
 * transparent pills bottom-right. Mobile: tall crop, bottom scrim, stacked.
 */
const MOBILE = '(max-width: 820px)';
const DESKTOP = '(min-width: 821px)';

export function HeroPhoto({ image, mobileImage, title = heroCopy.line, sub = heroCopy.subline, pills = heroCopy.pills, mobilePills = 'above', underNav }: Props) {
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
  const mobileStrip = <div className={styles.pillsMobile}>{pillList}</div>;
  return (
    <section className={[styles.wrap, underNav && styles.underNav].filter(Boolean).join(' ')} data-hero>
      {/* getImageProps does not preload; these links are hoisted into <head> and only the matching one loads. */}
      {mobile && <link rel="preload" as="image" media={MOBILE} imageSrcSet={mobile.srcSet} imageSizes={mobile.sizes} fetchPriority="high" />}
      <link rel="preload" as="image" media={mobile ? DESKTOP : undefined} imageSrcSet={desktop.srcSet} imageSizes={desktop.sizes} fetchPriority="high" />
      <div className={`${styles.frame} on-dark`}>
        {mobilePills === 'above' && mobileStrip}
        <picture>
          {mobile && <source media={MOBILE} srcSet={mobile.srcSet} sizes={mobile.sizes} />}
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
          <img {...desktop} />
        </picture>
        <div className={styles.copy}>
          <h1>{title}</h1>
          <p className={styles.sub}>{sub}</p>
          <div className={styles.reg}>
            <RegBox onPhoto />
            <a className={styles.call} href={site.phone.href}>
              <Icon name="phone" className={styles.ph} />
              {cta.call}
            </a>
          </div>
        </div>
        <div className={styles.pillsDesktop}>{pillList}</div>
      </div>
      {mobilePills === 'below' && mobileStrip}
    </section>
  );
}
