'use client';

import { useState, type ReactNode } from 'react';

/** The only script in the carousel: pause the CSS animation while a finger is on it. */
export function Track({ className, children }: { className: string; children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  return (
    <div
      className={className}
      data-paused={paused || undefined}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onTouchCancel={() => setPaused(false)}
    >
      {children}
    </div>
  );
}
