import type { Metadata } from 'next';
import { body, bodySemibold, display } from '@/fonts';
import { site, siteUrl } from '@/lib/site';
import { robotsMeta } from '@/lib/staging';
import { Sprite } from '@/components/Icon/Sprite';
import '@/styles/tokens.css';
import './globals.css';

export const metadata: Metadata = {
  // Canonical, OG and sitemap URLs resolve against the final domain (brief §2a).
  metadataBase: new URL(siteUrl),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.subline,
  // noindex on every environment that is not production, in addition to the
  // X-Robots-Tag header set in next.config.ts.
  robots: robotsMeta(process.env.VERCEL_ENV),
  openGraph: {
    siteName: site.name,
    locale: site.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable} ${bodySemibold.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Sprite />
        {children}
      </body>
    </html>
  );
}
