import Image, { type StaticImageData } from 'next/image';
import { Icon } from '@/components/Icon/Icon';
import type { IconName } from '@/components/Icon/names';
import { RegBox } from '@/components/RegBox/RegBox';
import { site } from '@/lib/site';
import { hero as heroCopy, cta } from '@/data/copy';
import styles from './HeroPhoto.module.css';

export type HeroPill = { icon: IconName; label: string };

type Props = {
  image: { src: string | StaticImageData; alt: string; width?: number; height?: number };
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
export function HeroPhoto({ image, title = heroCopy.line, sub = heroCopy.subline, pills = heroCopy.pills, mobilePills = 'above' }: Props) {
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
    <section className={styles.wrap} data-hero>
      <div className={`${styles.frame} on-dark`}>
        {mobilePills === 'above' && mobileStrip}
        <Image src={image.src} alt={image.alt} fill priority fetchPriority="high" quality={65} sizes="100vw" className={styles.img} />
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
