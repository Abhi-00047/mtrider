'use client';
import { useStore, Screen } from '@/store/useStore';

const NAV = [
  { id: 'dashboard' as Screen, color: '#4a9eff', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>, label: 'Dashboard' },
  { id: 'habits' as Screen, color: '#4a9eff', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><polyline points="9,12 11,14 15,10"/></svg>, label: 'Habits' },
  { id: 'tasks' as Screen, color: '#29b6f6', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><polyline points="3,6 4,7 6,5"/><polyline points="3,12 4,13 6,11"/><polyline points="3,18 4,19 6,17"/></svg>, label: 'Tasks' },
  { id: 'streak' as Screen, color: '#ff6b35', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 7 6 10 6 14a6 6 0 0012 0c0-4-2-7-6-12z"/></svg>, label: 'Streak' },
  { id: 'garage' as Screen, color: '#d4a843', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17H3v-4l2-5h12l2 5v4h-2"/><path d="M5 13h14"/></svg>, label: 'Garage' },
  { id: 'analytics' as Screen, color: '#9b6dff', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>, label: 'Analytics' },
];

export default function Sidebar() {
  const { screen, setScreen } = useStore();

  return (
    <div style={{
      width: 60, height: '100vh', borderRight: '.5px solid var(--border)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '16px 0 20px', gap: 2, flexShrink: 0,
      background: 'rgba(5,5,10,0.8)', backdropFilter: 'blur(12px)', zIndex: 20,
    }}>
      {/* Logo */}
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 900, color: 'var(--chrome-hi)', textAlign: 'center', lineHeight: 1.2, marginBottom: 18, padding: '8px 0' }}>
        MT
        <div style={{ color: 'var(--blue)', fontSize: 9, letterSpacing: '.15em', fontWeight: 500, marginTop: 1 }}>RIDER</div>
      </div>

      {/* Nav items */}
      {NAV.map(n => (
        <div
          key={n.id}
          onClick={() => setScreen(n.id)}
          title={n.label}
          style={{
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 10, cursor: 'pointer', transition: 'all .2s', position: 'relative',
            color: screen === n.id ? n.color : 'var(--dim)',
            background: screen === n.id ? `${n.color}1a` : 'transparent',
          }}
        >
          {n.icon}
          {screen === n.id && (
            <div style={{ position: 'absolute', left: -9, top: '50%', transform: 'translateY(-50%)', width: 3, height: 18, background: n.color, borderRadius: '0 2px 2px 0' }} />
          )}
        </div>
      ))}

      <div style={{ flex: 1 }} />

      {/* Health at bottom */}
      <div
        onClick={() => setScreen('health')}
        title="Health"
        style={{
          width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 10, cursor: 'pointer', transition: 'all .2s', position: 'relative',
          color: screen === 'health' ? '#3ddc84' : 'var(--dim)',
          background: screen === 'health' ? '#3ddc841a' : 'transparent',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        {screen === 'health' && (
          <div style={{ position: 'absolute', left: -9, top: '50%', transform: 'translateY(-50%)', width: 3, height: 18, background: '#3ddc84', borderRadius: '0 2px 2px 0' }} />
        )}
      </div>

      {/* Bottom dot */}
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(74,158,255,0.4)', margin: '12px auto 0', boxShadow: '0 0 6px rgba(74,158,255,.4)' }} />
    </div>
  );
}
