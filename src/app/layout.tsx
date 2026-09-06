import type { Metadata } from 'next';
import { body, bodySemibold, display } from '@/fonts';
import { site, siteUrl } from '@/lib/site';
import { Sprite } from '@/components/Icon/Sprite';
import { Analytics } from '@/components/Analytics/Analytics';
import { ConsentBanner } from '@/components/Consent/ConsentBanner';
import { HostRobots } from '@/components/Analytics/HostRobots';
import { isMcd3, theme } from '@/lib/theme';
import { ThemeHead } from '@/themes/mcd3/ThemeHead';
import '@/styles/tokens.css';
import '@/themes/mcd3/theme.css';
import './globals.css';

export const metadata: Metadata = {
  // Canonical, OG and sitemap URLs resolve against the final domain (brief §2a).
  metadataBase: new URL(siteUrl),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.subline,
  // Indexable by default; HostRobots adds noindex in the browser and the
  // middleware adds the header whenever the host is not the real domain.
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable} ${bodySemibold.variable}`} data-theme={isMcd3 ? theme : undefined}>
      <body>
        {/* 3.0 only: the Quicksand preload (React hoists the link into <head>) */}
        {isMcd3 && <ThemeHead />}
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Sprite />
        {children}
        <HostRobots />
        <Analytics gtmId={gtmId} />
        <ConsentBanner gtmId={gtmId} />
      </body>
    </html>
  );
}
