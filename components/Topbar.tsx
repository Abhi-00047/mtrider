'use client';
import { useEffect, useState, memo } from 'react';
import { useStore, SKINS } from '@/store/useStore';

const Topbar = memo(function Topbar({ title }: { title?: string }) {
  const { xp, level, profileOpen, setProfileOpen, tgLinked, setScreen, activeSkin, userInitial, userName } = useStore();
  const skin = SKINS[activeSkin] || SKINS[0];
  const [timeParts, setTimeParts] = useState({ hm: '00:00', sec: '00', ampm: 'AM' });
  const [greet, setGreet] = useState('');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h12 = d.getHours() % 12 || 12;
      const hh = String(h12).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
      setTimeParts({ hm: `${hh}:${mm}`, sec: ss, ampm });
      const h = d.getHours();
      const first = userName.split(' ')[0];
      setGreet(h < 5 ? `Late night, ${first}` : h < 12 ? `Good morning, ${first}` : h < 17 ? `Good afternoon, ${first}` : `Good evening, ${first}`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{
      height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', flexShrink: 0, zIndex: 20, position: 'relative',
      margin: '12px 16px 0', borderRadius: 14,
      background: 'rgba(5, 7, 9, 0.55)', backdropFilter: 'blur(20px) saturate(1.6)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {title ? (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '3px', textTransform: 'uppercase', textShadow: `0 0 8px ${skin.accent}40` }}>{title}</div>
        ) : (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>{greet}</div>
        )}

        {/* Telegram Concierge Hook */}
        <div style={{ padding: '5px 10px', background: tgLinked ? `${skin.accent}15` : 'rgba(255,255,255,0.03)', border: `1px solid ${tgLinked ? `${skin.accent}40` : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.4s ease' }} onClick={() => !tgLinked ? setScreen('dashboard') : null}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: tgLinked ? skin.accent : '#555', boxShadow: tgLinked ? `0 0 8px ${skin.accent}` : 'none' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, color: tgLinked ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            {tgLinked ? 'Connected' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Elite Telemetry Clock */}
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 5,
        padding: '5px 12px', background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '8px', border: `1px solid ${skin.accent}25`,
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '2px', textShadow: `0 0 10px ${skin.accent}60` }}>
          {timeParts.hm}<span style={{ color: skin.accent, opacity: 0.7 }}>:</span>{timeParts.sec}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 800, color: skin.accent, letterSpacing: '1px', opacity: 0.7 }}>
          {timeParts.ampm}
        </div>
      </div>

      {/* Avatar */}
      <div style={{ position: 'relative' }}>
        <div
          onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }}
          style={{
            width: 34, height: 34, borderRadius: '50%', background: '#0d1525',
            border: `1.5px solid ${skin.accent}`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', fontFamily: 'var(--font-mono)',
            fontSize: 12, fontWeight: 700, color: skin.accent, position: 'relative', userSelect: 'none',
          }}
        >
          {userInitial}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: '#4caf50', border: '1.5px solid var(--bg)' }} />
        </div>

        {/* Dropdown */}
        {profileOpen && (
          <div style={{
            position: 'absolute', top: 42, right: 0, width: 230,
            background: '#0d0d16', border: '.5px solid rgba(255,255,255,.1)',
            borderRadius: 14, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,.85)',
            zIndex: 100, animation: 'dropIn .18s ease forwards',
          }}>
            {/* Header */}
            <div style={{ padding: 14, borderBottom: '.5px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0d1525', border: `1.5px solid ${skin.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: skin.accent, flexShrink: 0 }}>{userInitial}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: 'var(--chrome-hi)' }}>{userName}</div>
                <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 1 }}>Level {level} · {xp} XP</div>
                <div style={{ height: 3, background: 'rgba(255,255,255,.07)', borderRadius: 2, marginTop: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${((xp % 1000) / 1000) * 100}%`, background: `linear-gradient(90deg, ${skin.accent}, ${skin.glow})`, borderRadius: 2, transition: 'width .6s' }} />
                </div>
              </div>
            </div>

            {/* Items */}
            {[
              { label: 'Edit profile', icon: '👤', action: () => { setScreen('settings'); setProfileOpen(false); } },
              { label: 'Notifications', icon: '🔔' },
              { label: `Telegram: ${tgLinked ? '✓ Linked' : 'Not linked'}`, icon: '✈️', action: () => setScreen('tasks') },
              { label: 'Theme settings', icon: '🎨', action: () => { setScreen('settings'); setProfileOpen(false); } },
            ].map(item => (
              <div
                key={item.label}
                onClick={item.action}
                style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: '#999', cursor: 'pointer', transition: 'all .15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.04)', e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = '#999')}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
              </div>
            ))}

            <div style={{ height: .5, background: 'var(--border)', margin: '2px 0' }} />

            <div
              style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: '#ff5555', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,85,85,.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 14 }}>🚪</span> Log out
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Topbar;
