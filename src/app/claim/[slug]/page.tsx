import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLandingConfig, getLandingConfigs } from '@/lib/landing';
import { LandingPage } from '@/templates/LandingPage';

export const dynamicParams = false;

export function generateStaticParams() {
  return getLandingConfigs().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const config = getLandingConfig(slug);
  if (!config) return {};
  return {
    title: { absolute: `${config.title} — Motor Claims Department` },
    description: config.description,
    // Brief §6: noindex, nofollow; canonical to self.
    robots: { index: false, follow: false },
    alternates: { canonical: `/claim/${config.slug}/` },
  };
}

export default async function LandingRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = getLandingConfig(slug);
  if (!config) notFound();
  return <LandingPage config={config} />;
}
