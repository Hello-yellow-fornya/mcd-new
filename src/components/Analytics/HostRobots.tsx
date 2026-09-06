'use client';

import { useEffect } from 'react';
import { isLiveHost } from '@/lib/host';

/**
 * Adds <meta name="robots" content="noindex, nofollow"> when the page is not
 * served from the real domain (brief §2a). Pages are static, so the host can
 * only be known in the browser; the X-Robots-Tag header from the middleware
 * carries the same rule server-side.
 */
export function HostRobots() {
  useEffect(() => {
    if (isLiveHost(location.host)) return;
    if (document.querySelector('meta[name="robots"][data-host]')) return;
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    meta.dataset.host = location.host;
    document.head.appendChild(meta);
  }, []);
  return null;
}
