/**
 * The hero illustration, verbatim from design/mcd-homepage-concept-guidelines-v1.html:
 * a replacement car on a driveway with a set of keys, bold ink outline on yellow.
 * Desktop only.
 */
export function Illustration({ className, title = 'Illustration of a replacement car on a driveway with a set of keys' }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 520 300" role="img" aria-label={title} data-illustration="car-and-keys">
      <title>{title}</title>
      <path d="M20 250h480" stroke="#19180F" strokeWidth="5" strokeLinecap="round" />
      <path d="M80 250l16-58a22 22 0 0 1 21-16h210a22 22 0 0 1 20 13l30 61" fill="#FFFFFF" stroke="#19180F" strokeWidth="5" strokeLinejoin="round" />
      <rect x="56" y="185" width="380" height="70" rx="22" fill="#FFF6C9" stroke="#19180F" strokeWidth="5" />
      <path d="M120 190l12-40a10 10 0 0 1 9-6h60v46zM214 144h90a10 10 0 0 1 9 6l17 40H214z" fill="#FFFFFF" stroke="#19180F" strokeWidth="5" strokeLinejoin="round" />
      <circle cx="130" cy="256" r="26" fill="#FFFFFF" stroke="#19180F" strokeWidth="5" />
      <circle cx="130" cy="256" r="9" fill="#19180F" />
      <circle cx="360" cy="256" r="26" fill="#FFFFFF" stroke="#19180F" strokeWidth="5" />
      <circle cx="360" cy="256" r="9" fill="#19180F" />
      <rect x="392" y="205" width="30" height="14" rx="6" fill="#19180F" />
      <path d="M30 200h28M18 222h40M30 244h20" stroke="#19180F" strokeWidth="5" strokeLinecap="round" />
      <g transform="translate(440 70)">
        <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="#19180F" strokeWidth="5" />
        <circle cx="0" cy="0" r="7" fill="#19180F" />
        <path d="M18 14l40 40M46 42l10-10M38 50l10-10" stroke="#19180F" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
