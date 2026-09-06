/**
 * The 3.0 icon set: round-capped 1.8px line icons in ink, same ids as the
 * 2.0 sprite so every <Icon name> resolves in either theme. Strokes are set on
 * the group so the shared `.icon { fill: currentColor }` rule never fills them.
 */
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function SpriteLine() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false" data-sprite="line">
      <defs>
        <symbol id="i-phone" viewBox="0 0 24 24">
          <g {...stroke}>
            <path d="M5 4h3l2 4.6-2.4 1.6a11 11 0 0 0 6.2 6.2l1.6-2.4L20 16v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
          </g>
        </symbol>
        <symbol id="i-shield" viewBox="0 0 24 24">
          <g {...stroke}>
            <path d="M12 3l7 2.8v6c0 4.6-3 8.2-7 9.2-4-1-7-4.6-7-9.2v-6z" />
            <path d="M9 12l2 2 4-4" />
          </g>
        </symbol>
        <symbol id="i-pound" viewBox="0 0 24 24">
          <g {...stroke}>
            <path d="M16 7.5A3.5 3.5 0 0 0 9 8v8.5H7.5" />
            <path d="M7.5 12.5h6M8 17h9" />
          </g>
        </symbol>
        <symbol id="i-car" viewBox="0 0 24 24">
          <g {...stroke}>
            <path d="M3 12l2-5h14l2 5v5H3z" />
            <path d="M5 17v2M19 17v2M3 12h18" />
            <circle cx="7" cy="14.5" r="0.6" />
            <circle cx="17" cy="14.5" r="0.6" />
          </g>
        </symbol>
        <symbol id="i-person" viewBox="0 0 24 24">
          <g {...stroke}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
          </g>
        </symbol>
        <symbol id="i-star" viewBox="0 0 24 24">
          <g {...stroke}>
            <path d="M12 3l2.8 6 6.5.7-4.9 4.4 1.3 6.4L12 17.3 6.3 20.5l1.3-6.4L2.7 9.7l6.5-.7z" />
          </g>
        </symbol>
        <symbol id="i-bolt" viewBox="0 0 24 24">
          <g {...stroke}>
            <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
          </g>
        </symbol>
        <symbol id="i-tick" viewBox="0 0 24 24">
          <g {...stroke}>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </g>
        </symbol>
        <symbol id="i-cross" viewBox="0 0 24 24">
          <g {...stroke}>
            <path d="M7 7l10 10M17 7L7 17" />
          </g>
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24">
          <g {...stroke}>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </g>
        </symbol>
        <symbol id="i-dot" viewBox="0 0 24 24">
          <g {...stroke}>
            <circle cx="12" cy="12" r="4.5" />
          </g>
        </symbol>
        <symbol id="i-document" viewBox="0 0 24 24">
          <g {...stroke}>
            <path d="M7 3h7l4 4v14H7z" />
            <path d="M14 3v4h4M10 12h5M10 16h5" />
          </g>
        </symbol>
        <symbol id="i-headset" viewBox="0 0 24 24">
          <g {...stroke}>
            <path d="M4 13a8 8 0 0 1 16 0" />
            <path d="M4 13v4a2 2 0 0 0 2 2h1v-6H4zM20 13v4a2 2 0 0 1-2 2h-1v-6h3" />
            <path d="M12 22h3a2 2 0 0 0 2-2" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}
