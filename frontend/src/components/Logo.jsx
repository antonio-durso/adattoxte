/**
 * Logo "Adatto x Te" — replica del logo del business plan
 * (copertina: testo nero con due linee orizzontali color pesca #F0AA82).
 */
export default function Logo({ size = '' }) {
  return (
    <span className={`logo ${size ? 'logo-' + size : ''}`} aria-label="Adatto x Te">
      <span className="logo-line" />
      <span className="logo-text">
        Adatto <em>x</em> Te
      </span>
      <span className="logo-line" />
    </span>
  );
}
