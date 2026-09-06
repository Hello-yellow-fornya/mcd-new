/**
 * Head additions for the 3.0 build only: the Quicksand preload. The @font-face
 * itself lives in theme.css, scoped to html[data-theme="mcd3"], so a 2.0 build
 * never requests the file.
 */
export function ThemeHead() {
  return <link rel="preload" as="font" type="font/woff2" href="/fonts/quicksand-latin-wght.woff2" crossOrigin="anonymous" />;
}
