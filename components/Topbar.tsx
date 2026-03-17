'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

export default function Topbar({ title }: { title?: string }) {
  const { xp, level, profileOpen, setProfileOpen, tgLinked, setScreen } = useStore();
  const [clock, setClock] = useState('');
  const [greet, setGreet] = useState('');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      const h = d.getHours();
      setGreet(h < 5 ? 'Late night, Rider' : h < 12 ? 'Good morning, Rider' : h < 17 ? 'Good afternoon, Rider' : 'Good evening, Rider');
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{
      height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', borderBottom: '.5px solid var(--border)', flexShrink: 0,
      background: 'rgba(5,5,10,0.5)', backdropFilter: 'blur(8px)', zIndex: 20, position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {title ? (
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--chrome-hi)', letterSpacing: '.05em' }}>{title}</div>
        ) : (
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--dim)' }}>{greet}</div>
        )}
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--chrome)', letterSpacing: '.1em' }}>{clock}</div>

      {/* Avatar */}
      <div style={{ position: 'relative' }}>
        <div
          onClick={() => setProfileOpen(!profileOpen)}
          style={{
            width: 34, height: 34, borderRadius: '50%', background: '#0d1525',
            border: '1.5px solid var(--blue)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', fontFamily: 'var(--font-ui)',
            fontSize: 12, fontWeight: 700, color: 'var(--blue)', position: 'relative', userSelect: 'none',
          }}
        >
          RK
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
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0d1525', border: '1.5px solid var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700, color: 'var(--blue)', flexShrink: 0 }}>RK</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: 'var(--chrome-hi)' }}>Rider</div>
                <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 1 }}>Level {level} · {xp} XP</div>
                <div style={{ height: 3, background: 'rgba(255,255,255,.07)', borderRadius: 2, marginTop: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${((xp % 1000) / 1000) * 100}%`, background: 'linear-gradient(90deg,var(--blue),var(--gold))', borderRadius: 2, transition: 'width .6s' }} />
                </div>
              </div>
            </div>

            {/* Items */}
            {[
              { label: 'Edit profile', icon: '👤' },
              { label: 'Notifications', icon: '🔔' },
              { label: `Telegram: ${tgLinked ? '✓ Linked' : 'Not linked'}`, icon: '✈️', action: () => setScreen('tasks') },
              { label: 'Theme settings', icon: '🎨' },
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
}
