import claimsData from '@/data/claims.json';
import goskippy from '@/data/landing/goskippy.json';
import noFault from '@/data/landing/no-fault-accident.json';
import type { IconName } from '@/components/Icon/names';
import { isProduction } from '@/lib/staging';

export type Claim = { id: string; kind: 'grid' | 'row'; icon: IconName; title: string; sub?: string; substantiated: boolean; evidence?: string };

export type SourcedFact = { fact: string; source: string; sourceUrl: string; checkedOn: string };

export type LandingConfig = {
  slug: string;
  /** Appears only in the H1 and the independence line (brief §6). */
  insurer: string | null;
  title: string;
  description: string;
  h1: string;
  h1Sub: string;
  instruction: string;
  proof: string[];
  waitRow: string[];
  faultSection: boolean;
  facts: SourcedFact[];
  faq: { q: string; a: string }[];
};

const configs: LandingConfig[] = [goskippy as LandingConfig, noFault as LandingConfig];
const claims = (claimsData as { claims: Claim[] }).claims;

export function getLandingConfigs(): LandingConfig[] {
  return configs;
}

export function getLandingConfig(slug: string): LandingConfig | undefined {
  return configs.find((c) => c.slug === slug);
}

/**
 * Resolves claim ids against claims.json. Unsubstantiated claims never render
 * on production. On preview they render marked, so the layout and the fold can
 * be reviewed before the evidence is on file.
 */
export function resolveClaims(ids: string[]): Claim[] {
  const showUnsubstantiated = !isProduction();
  return ids
    .map((id) => claims.find((c) => c.id === id))
    .filter((c): c is Claim => !!c)
    .filter((c) => c.substantiated || showUnsubstantiated);
}
