'use client';
import { useStore, Screen, SKINS } from '@/store/useStore';

const NAV = [
  { id: 'dashboard' as Screen, color: '#4a9eff', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></svg>, label: 'Dashboard' },
  { id: 'habits' as Screen, color: '#4a9eff', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><polyline points="9,12 11,14 15,10" /></svg>, label: 'Habits' },
  { id: 'tasks' as Screen, color: '#29b6f6', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><polyline points="3,6 4,7 6,5" /><polyline points="3,12 4,13 6,11" /><polyline points="3,18 4,19 6,17" /></svg>, label: 'Tasks' },
  { id: 'streak' as Screen, color: '#ff6b35', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 7 6 10 6 14a6 6 0 0012 0c0-4-2-7-6-12z" /></svg>, label: 'Streak' },
  { id: 'gearup' as Screen, color: '#00d4ff', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>, label: 'Gear Up' },
  { id: 'analytics' as Screen, color: '#9b6dff', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12" /></svg>, label: 'Analytics' },
];

export default function Sidebar() {
  const { screen, setScreen, activeSkin } = useStore();
  const skin = SKINS[activeSkin] || SKINS[0];

  return (
    <div
      aria-label="Main Navigation Sidebar"
      style={{
        width: 64, height: '100vh', borderRight: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '16px 0 20px', gap: 4, flexShrink: 0,
        background: 'linear-gradient(180deg, rgba(5,5,10,0.95) 0%, rgba(3,3,6,0.98) 100%)', backdropFilter: 'blur(16px)', zIndex: 20,
      }}>
      {/* Logo */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 900, color: '#fff', textAlign: 'center', lineHeight: 1.2, marginBottom: 18, padding: '8px 0', letterSpacing: '2px' }}>
        MT
        <div style={{ color: skin.accent, fontSize: 8, letterSpacing: '3px', fontWeight: 700, marginTop: 2, textShadow: `0 0 10px ${skin.accent}60` }}>RIDER</div>
      </div>

      {/* Nav items */}
      {NAV.map(n => (
        <div
          key={n.id}
          onClick={() => setScreen(n.id)}
          title={n.label}
          aria-label={`Navigate to ${n.label}`}
          style={{
            width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 12, cursor: 'pointer', transition: 'all .25s cubic-bezier(0.22, 1, 0.36, 1)', position: 'relative',
            color: screen === n.id ? skin.accent : 'rgba(255,255,255,0.3)',
            background: screen === n.id ? `${skin.accent}12` : 'transparent',
            boxShadow: screen === n.id ? `0 0 20px ${skin.accent}10` : 'none',
          }}
        >
          {n.icon}
          {screen === n.id && (
            <div style={{ position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', width: 3, height: 24, background: `linear-gradient(180deg, transparent, ${skin.accent}, transparent)`, borderRadius: '0 2px 2px 0', boxShadow: `0 0 12px ${skin.accent}` }} />
          )}
        </div>
      ))}

      <div style={{ flex: 1 }} />

      {/* Settings at bottom */}
      <div
        onClick={() => setScreen('settings')}
        title="Settings"
        aria-label="Navigate to Settings"
        style={{
          width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 12, cursor: 'pointer', transition: 'all .25s cubic-bezier(0.22, 1, 0.36, 1)', position: 'relative',
          color: screen === 'settings' ? skin.accent : 'rgba(255,255,255,0.3)',
          background: screen === 'settings' ? `${skin.accent}12` : 'transparent',
          boxShadow: screen === 'settings' ? `0 0 20px ${skin.accent}10` : 'none',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        {screen === 'settings' && (
          <div style={{ position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', width: 3, height: 24, background: `linear-gradient(180deg, transparent, ${skin.accent}, transparent)`, borderRadius: '0 2px 2px 0', boxShadow: `0 0 12px ${skin.accent}` }} />
        )}
      </div>

      {/* Health at bottom */}
      <div
        onClick={() => setScreen('health')}
        title="Health"
        aria-label="Navigate to Health"
        style={{
          width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 12, cursor: 'pointer', transition: 'all .25s cubic-bezier(0.22, 1, 0.36, 1)', position: 'relative',
          color: screen === 'health' ? skin.accent : 'rgba(255,255,255,0.3)',
          background: screen === 'health' ? `${skin.accent}12` : 'transparent',
          boxShadow: screen === 'health' ? `0 0 20px ${skin.accent}10` : 'none',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
        {screen === 'health' && (
          <div style={{ position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', width: 3, height: 24, background: `linear-gradient(180deg, transparent, ${skin.accent}, transparent)`, borderRadius: '0 2px 2px 0', boxShadow: `0 0 12px ${skin.accent}` }} />
        )}
      </div>

      {/* Bottom dot */}
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: skin.accent, margin: '12px auto 0', boxShadow: `0 0 8px ${skin.accent}, 0 0 20px ${skin.glow || skin.accent}` }} />
    </div>
  );
}
