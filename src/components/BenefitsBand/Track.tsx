'use client';

import { useState, type ReactNode } from 'react';
import styles from './BenefitsBand.module.css';

/**
 * The moving track. CSS pauses it on hover and keyboard focus; touch has no
 * hover, so a pointer press pauses it for as long as the finger is down.
 */
export function Track({ children }: { children: ReactNode }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      className={styles.track}
      data-testid="benefits-track"
      data-paused={pressed || undefined}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      {children}
    </div>
  );
}
