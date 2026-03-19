'use client';
import { useStore, SKINS } from '@/store/useStore';
import Topbar from './Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Settings() {
  const {
    activeSkin, setActiveSkin,
    soundOn, toggleSound,
    userName, setUserName,
    userInitial, setUserInitial,
    resetAppData,
    setScreen,
  } = useStore();

  const [tempName, setTempName] = useState(userName);
  const [tempInitial, setTempInitial] = useState(userInitial);

  const skin = SKINS[activeSkin] || SKINS[0];

  const generateInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleNameChange = (newName: string) => {
    setTempName(newName);
    setTempInitial(generateInitials(newName));
  };

  const hasChanges = tempName !== userName || tempInitial !== userInitial;

  const handleSave = () => {
    setUserName(tempName);
    setUserInitial(tempInitial);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 50 }}>
        <Topbar title="Settings" />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* PROFILE SECTION */}
          <section>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: skin.accent, letterSpacing: '2px', marginBottom: 16, textTransform: 'uppercase' }}>
              Profile Identity
            </div>
            <div className="liquid-glass" style={{ padding: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: `${skin.accent}20`,
                border: `1px solid ${skin.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 900, color: '#fff',
                textShadow: `0 0 10px ${skin.accent}`
              }}>
                {tempInitial}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>Display Name</div>
                    <input
                      value={tempName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 8, padding: '10px 14px', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: 14,
                        outline: 'none', transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = `${skin.accent}60`}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                  <div style={{ width: 80 }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>Initials</div>
                    <input
                      value={tempInitial}
                      maxLength={2}
                      onChange={(e) => setTempInitial(e.target.value.toUpperCase())}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 8, padding: '10px 14px', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 14,
                        textAlign: 'center', outline: 'none', transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = `${skin.accent}60`}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* APPEARANCE SECTION */}
          <section>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: skin.accent, letterSpacing: '2px', marginBottom: 16, textTransform: 'uppercase' }}>
              Visual Interface
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {SKINS.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setActiveSkin(idx)}
                  className="liquid-glass hoverable"
                  style={{
                    padding: 16, cursor: 'pointer',
                    border: activeSkin === idx ? `1px solid ${s.accent}` : '1px solid rgba(255,255,255,0.08)',
                    background: activeSkin === idx ? `${s.accent}08` : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: s.accent, boxShadow: `0 0 15px ${s.accent}40` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: activeSkin === idx ? '#fff' : 'rgba(255,255,255,0.8)' }}>{s.name}</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Theme {idx + 1}</div>
                    </div>
                    {activeSkin === idx && (
                      <div style={{ color: s.accent }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AUDIO & SYSTEM */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            <section>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: skin.accent, letterSpacing: '2px', marginBottom: 16, textTransform: 'uppercase' }}>
                Audio Feedback
              </div>
              <div className="liquid-glass" style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Interface Sounds</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Engine revs & tick sounds</div>
                </div>
                <div
                  onClick={toggleSound}
                  style={{
                    width: 44, height: 24, borderRadius: 12, background: soundOn ? skin.accent : 'rgba(255,255,255,0.1)',
                    position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute',
                    top: 3, left: soundOn ? 23 : 3, transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
              </div>
            </section>

            <section>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: skin.accent, letterSpacing: '2px', marginBottom: 16, textTransform: 'uppercase' }}>
                System & Data
              </div>
              <div className="liquid-glass" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{
                  padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.5
                }}>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Telegram Sync</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: skin.accent }}>Coming Soon</div>
                </div>
                <button
                  onClick={() => { if (confirm('Erase all data and reset app?')) resetAppData(); }}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,85,85,0.05)',
                    border: '1px solid rgba(255,85,85,0.2)', color: '#ff5555', fontFamily: 'var(--font-ui)',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,85,85,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,85,85,0.05)'}
                >
                  RESET ALL DATA
                </button>
              </div>
            </section>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen('dashboard')}
              style={{
                flex: 1, padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '1px',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              EXIT SETTINGS
            </motion.button>

            <AnimatePresence>
              {hasChanges && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  style={{
                    flex: 1, padding: '16px', borderRadius: 16, background: skin.accent,
                    border: 'none', color: '#000',
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 900, letterSpacing: '1px',
                    cursor: 'pointer', boxShadow: `0 0 20px ${skin.accent}40`
                  }}
                >
                  SAVE CHANGES
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16, opacity: 0.2 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '4px' }}>MT RIDER OS v1.0.4</div>
          </div>

        </div>
      </div>
    </div>
  );
}
