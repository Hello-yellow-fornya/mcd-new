/**
 * Bearer keys, one per front end.
 *
 *   CLAIMS_API_KEYS="mcd1:<secret>,mcd2:<secret>"   labelled keys (preferred)
 *   CLAIMS_API_KEY="<secret>"                        a single key, labelled "default"
 *
 * Both may be set; an entry without a label is labelled by position
 * ("key1", "key2", …). The label, never the secret, is what gets recorded.
 */
export type ApiKey = { label: string; secret: string };

export function loadApiKeys(env: Record<string, string | undefined>): ApiKey[] {
  const keys: ApiKey[] = [];
  const single = env.CLAIMS_API_KEY?.trim();
  if (single) keys.push({ label: 'default', secret: single });
  const list = env.CLAIMS_API_KEYS?.trim();
  if (list) {
    list
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean)
      .forEach((entry, i) => {
        const at = entry.indexOf(':');
        const label = at > 0 ? entry.slice(0, at).trim() : `key${i + 1}`;
        const secret = at > 0 ? entry.slice(at + 1).trim() : entry;
        if (secret) keys.push({ label, secret });
      });
  }
  const labels = new Set<string>();
  for (const k of keys) {
    if (labels.has(k.label)) throw new Error(`CLAIMS_API_KEYS: duplicate label "${k.label}"`);
    labels.add(k.label);
  }
  return keys;
}

type SafeEqual = (a: Uint8Array, b: Uint8Array) => boolean;

/** The label of the key in an Authorization header, or null. Constant-time comparison per key. */
export function keyLabelFor(header: string | undefined, keys: ApiKey[], safeEqual: SafeEqual): string | null {
  const presented = header?.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!presented) return null;
  const a = Buffer.from(presented);
  for (const k of keys) {
    const b = Buffer.from(k.secret);
    if (a.length === b.length && safeEqual(a, b)) return k.label;
  }
  return null;
}
