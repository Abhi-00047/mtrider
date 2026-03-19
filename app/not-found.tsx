import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020205', minHeight: '100vh', padding: 24 }}>
      <div className="liquid-glass" style={{ padding: 48, borderRadius: 24, textAlign: 'center', border: '1px solid rgba(0, 243, 255, 0.2)', boxShadow: '0 0 40px rgba(0, 243, 255, 0.05)' }}>
        <div className="font-mono" style={{ fontSize: 80, fontWeight: 900, color: '#00f3ff', opacity: 0.8, textShadow: '0 0 30px #00f3ff' }}>404</div>
        <div className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginTop: 16, letterSpacing: '0.05em' }}>COORDINATES NOT FOUND</div>
        <div className="font-ui" style={{ fontSize: 13, color: 'var(--dim)', marginTop: 12, marginBottom: 32, maxWidth: 300, lineHeight: 1.6 }}>
          The sector you are trying to access does not exist in the current navigation grid.
        </div>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="liquid-glass hoverable font-ui" style={{ padding: '14px 28px', borderRadius: 12, color: '#00f3ff', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', display: 'inline-block' }}>
            RETURN TO BASE
          </div>
        </Link>
      </div>
    </div>
  );
}
