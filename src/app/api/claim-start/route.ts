import { NextResponse } from 'next/server';
import { isMcd3 } from '@/lib/theme';
import { compactReg, isPlausibleReg } from '@/lib/reg';

/**
 * Stub intake for the reg box (brief §7). Validates the reg, honours a
 * honeypot, rate-limits per address, and hands the reg to the Railway claims
 * API when CLAIMS_API_URL is set. Ollie's question flow owns everything after
 * this; the endpoint only records that a claim was started.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function limited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

function ref(): string {
  return `MCD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Send JSON.' }, { status: 400 });
  }
  // Honeypot: real visitors never fill "website".
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true, ref: ref() }, { status: 202 });
  }
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (limited(ip)) return NextResponse.json({ ok: false, error: 'Too many attempts. Call us instead.' }, { status: 429 });

  const reg = compactReg(String(body.reg ?? ''));
  if (!isPlausibleReg(reg)) return NextResponse.json({ ok: false, error: 'Check the registration and try again.' }, { status: 422 });

  // The 3.0 comparison build shares the claims API and identifies itself by source.
  const payload = { reg, source: isMcd3 ? 'mcd3' : String(body.source ?? 'web'), path: String(body.path ?? ''), startedAt: new Date().toISOString() };

  const api = process.env.CLAIMS_API_URL;
  if (api) {
    try {
      const res = await fetch(`${api.replace(/\/$/, '')}/v1/claims/start`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.CLAIMS_API_KEY ?? ''}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = (await res.json()) as { ref?: string };
        return NextResponse.json({ ok: true, ref: data.ref ?? ref(), reg }, { status: 202 });
      }
      console.error('claims api', res.status);
    } catch (e) {
      console.error('claims api unreachable', e);
    }
  }
  // No API configured (or unreachable): acknowledge so the visitor is never stuck; the phone is the product.
  return NextResponse.json({ ok: true, ref: ref(), reg, stub: true }, { status: 202 });
}
