import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { isMcd3 } from '@/lib/theme';

/** Web app manifest with the square at 512 and 1024 (the §4a mark on 2.0, "mcd" on yellow on 3.0; scripts/theme-icons.mjs puts the set in place). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: isMcd3 ? 'mcd' : 'MCD',
    description: site.strapline,
    start_url: '/',
    display: 'browser',
    background_color: isMcd3 ? '#f7f5ef' : '#f7f5f0',
    theme_color: isMcd3 ? '#ffd400' : '#16324f',
    icons: [
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-1024.png', sizes: '1024x1024', type: 'image/png', purpose: 'any' },
    ],
  };
}
