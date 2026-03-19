export default function Loading() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020205', minHeight: '100vh' }}>
      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
      <div style={{ position: 'relative', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, border: '2px solid #00f3ff', borderRadius: '50%', animation: 'pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' }} />
        <div style={{ width: 12, height: 12, background: '#00f3ff', borderRadius: '50%', boxShadow: '0 0 20px #00f3ff' }} />
      </div>
      <div className="font-ui" style={{ marginTop: 24, fontSize: 11, fontWeight: 800, color: '#00f3ff', letterSpacing: '0.3em', textTransform: 'uppercase', animation: 'hologramPulse 2s infinite alternate' }}>
        INITIALIZING CORE...
      </div>
    </div>
  );
}
