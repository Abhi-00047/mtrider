'use client';
import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Fatal route error:', error);
  }, [error]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020205', minHeight: '100vh', padding: 24 }}>
      <div className="liquid-glass" style={{ padding: 40, borderRadius: 24, textAlign: 'center', border: '1px solid rgba(255, 0, 85, 0.2)', boxShadow: '0 0 40px rgba(255, 0, 85, 0.1)' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <div className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#ff0055', marginBottom: 16 }}>SYSTEM MALFUNCTION</div>
        <div className="font-ui" style={{ fontSize: 13, color: 'var(--dim)', marginBottom: 32, maxWidth: 300, lineHeight: 1.5 }}>
          An unexpected telemetry failure occurred in the module. Our subroutines have cached the error.
        </div>
        <button 
          onClick={() => reset()}
          className="liquid-glass hoverable font-ui"
          style={{ padding: '12px 24px', borderRadius: 12, color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          REBOOT SYSTEM
        </button>
      </div>
    </div>
  );
}
