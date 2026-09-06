import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/** Web app manifest with the §4a square at 512 and 1024. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: 'MCD',
    description: site.strapline,
    start_url: '/',
    display: 'browser',
    background_color: '#f7f5f0',
    theme_color: '#16324f',
    icons: [
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-1024.png', sizes: '1024x1024', type: 'image/png', purpose: 'any' },
    ],
  };
}
