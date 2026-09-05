import { Icon } from '@/components/Icon/Icon';
import { isProduction } from '@/lib/staging';
import data from '@/data/reviews.json';
import { Track } from './Track';
import styles from './ReviewCarousel.module.css';

export type Review = { name: string; location: string; rating: number; quote: string; source?: string };
export type ReviewsData = { sample?: boolean; aggregate: { rating: number; count: string }; reviews: Review[] };

function Stars({ n, size }: { n: number; size: number }) {
  return (
    <span className={styles.stars} aria-label={`${n} stars`}>
      {Array.from({ length: n }, (_, i) => (
        <Icon key={i} name="star" size={size} />
      ))}
    </span>
  );
}

/**
 * Auto-scrolling review band. Pure CSS animation; pauses on hover and touch;
 * under reduced motion it becomes a scrollable row. Reads src/data/reviews.json
 * until the review platform is wired. Sample data never renders on production.
 */
export function ReviewCarousel({ reviews = data as ReviewsData, heading = 'What drivers say', className }: { reviews?: ReviewsData; heading?: string; className?: string }) {
  if (reviews.sample && isProduction()) return null;
  const sets: Array<'a' | 'b'> = ['a', 'b'];
  return (
    <section className={[styles.reviews, className].filter(Boolean).join(' ')} aria-label="Customer reviews" data-placement="reviews">
      <div className={styles.head}>
        <h2>{heading}</h2>
        <div className={styles.score}>
          <Stars n={5} size={12} />
          <b>{reviews.aggregate.rating}</b> · {reviews.aggregate.count} reviews
        </div>
      </div>
      <Track className={styles.track}>
        {sets.map((set) =>
          reviews.reviews.map((r) => (
            <article key={`${set}-${r.name}`} className={styles.card} aria-hidden={set === 'b' || undefined}>
              <Stars n={r.rating} size={16} />
              <p className={styles.quote}>“{r.quote}”</p>
              <div className={styles.who}>
                <span className={styles.av} aria-hidden="true">
                  {r.name.charAt(0)}
                </span>
                <span>
                  <b>{r.name}</b>
                  {r.location}
                </span>
                {r.source && <span className={styles.src}>{r.source}</span>}
              </div>
            </article>
          )),
        )}
      </Track>
    </section>
  );
}
