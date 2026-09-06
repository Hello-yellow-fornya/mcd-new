/**
 * The hero illustration: a car and its keys in bold ink outline on yellow.
 * Desktop only. [assumption] Drawn to the brief's description; the signed-off
 * SVG in mcd-homepage-concept-guidelines-v1.html replaces it once the file is
 * in /design/.
 */
export function Illustration({ className, title = 'A car with its keys, drawn in bold outline' }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 520 320" role="img" aria-label={title} data-illustration="car-and-keys">
      <title>{title}</title>
      <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        {/* body */}
        <path d="M60 210h400v-52a18 18 0 0 0-18-18h-44l-46-52a24 24 0 0 0-18-8H168a24 24 0 0 0-19 9l-44 51H78a18 18 0 0 0-18 18z" />
        <path d="M120 140h96v-60M216 80h100l40 60" />
        {/* wheels */}
        <circle cx="150" cy="212" r="34" fill="var(--yellow)" />
        <circle cx="150" cy="212" r="12" />
        <circle cx="380" cy="212" r="34" fill="var(--yellow)" />
        <circle cx="380" cy="212" r="12" />
        {/* lights and door line */}
        <path d="M60 176h26M434 176h26M262 140v70" />
        {/* key: round bow, shaft down to the right, two teeth on the underside */}
        <circle cx="440" cy="60" r="24" />
        <circle cx="440" cy="60" r="7" fill="currentColor" stroke="none" />
        <path d="M457 77l52 52M488 108l-10 10M501 121l-10 10" />
        <path d="M509 129l8-8" />
      </g>
    </svg>
  );
}
