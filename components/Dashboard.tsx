'use client';
import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import { useStore, SKINS } from '@/store/useStore';
import Topbar from './Topbar';

const Dashboard = memo(function Dashboard() {
  const { streak, habits, xp, xpToday, setScreen, tgLinked, setTgLinked, setProfileOpen, activeSkin } = useStore();
  const skin = SKINS[activeSkin] || SKINS[0];
  const bikeRef = useRef<HTMLDivElement>(null);
  const [showTgModal, setShowTgModal] = useState(false);
  const [tgCode] = useState(() => 'MTR-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [linking, setLinking] = useState(false);
  const doneHabits = habits.filter(h => h.done).length;

  useEffect(() => {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 22;
      ty = (e.clientY / window.innerHeight - 0.5) * 10;
    };
    let raf: number;
    const anim = () => {
      cx += (tx - cx) * 0.055; cy += (ty - cy) * 0.055;
      if (bikeRef.current) bikeRef.current.style.transform = `translate(${cx}px,${cy}px)`;
      raf = requestAnimationFrame(anim);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(anim);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  const simulateLink = useCallback(() => {
    setLinking(true);
    window.open(`https://t.me/MTRiderBot?start=${tgCode}`, '_blank');
    setTimeout(() => { setLinking(false); setTgLinked(true); setShowTgModal(false); }, 3000);
  }, [tgCode, setTgLinked]);

  const stats = useMemo(() => [
    { label: 'Habits', value: `${doneHabits}/7`, color: '#4a9eff', width: `${Math.round(doneHabits / 7 * 100)}%`, onClick: () => setScreen('habits') },
    { label: 'XP Today', value: `${xpToday}`, color: '#d4a843', width: '43%', onClick: () => setScreen('analytics') },
    { label: 'Streak', value: `${streak}d`, color: '#ff6b35', width: '80%', onClick: () => setScreen('streak') },
    { label: 'Level', value: 'Lv.8', color: '#9b6dff', width: '68%', onClick: () => setScreen('gearup') },
  ], [doneHabits, xp, streak, setScreen]);

  return (
    <>
      <style>{`
        @keyframes bikeReveal{from{opacity:0;transform:translateX(50px) scale(.97)}to{opacity:1;transform:translateX(0) scale(1)}}
        @keyframes textReveal{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:translateX(0)}}
        @keyframes statsReveal{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glowPulse{0%,100%{opacity:.45}50%{opacity:.95}}
        @keyframes modalIn{from{opacity:0;transform:scale(.92) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .stat-chip:hover{background:rgba(255,255,255,.08)!important;transform:translateY(-3px)!important}
        .stat-card:hover{background:rgba(255,255,255,.05)!important;transform:translateY(-2px)!important}
        .tgbtn:hover{background:rgba(41,182,246,.22)!important;transform:translateY(-1px)!important}
        .header-transparent > div { background: transparent !important; border-color: transparent !important; backdrop-filter: none !important; box-shadow: none !important; margin: 8px 16px 0 !important; }
      `}</style>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }} onClick={() => setProfileOpen(false)}>

        {/* FULL SCREEN HERO */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'transparent' }}>

          {/* TOPBAR OVERLAY */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }} className="header-transparent">
            <Topbar />
          </div>

          {/* BIKE — full bleed */}
          <div ref={bikeRef} style={{ position: 'absolute', inset: -20, willChange: 'transform', animation: 'bikeReveal 1.3s cubic-bezier(0.22, 1, 0.36, 1) .1s both' }}>
            <Image
              src="/bike.png"
              alt="Yamaha MT-15"
              fill priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center 50%', filter: 'brightness(0.9) contrast(1.1)' }}
            />
            {/* Smooth deep gradient overlay to ensure text readability on the left */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(2,2,8,0.95) 0%, rgba(2,2,8,0.85) 30%, rgba(2,2,8,0.4) 60%, rgba(2,2,8,0.1) 100%)' }} />
            {/* Ground */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', background: 'linear-gradient(to top,#020208 0%,rgba(2,2,8,.5) 45%,transparent 100%)' }} />
            {/* Headlight glow */}
            <div style={{ position: 'absolute', top: '22%', right: '26%', width: 340, height: 300, background: 'radial-gradient(ellipse,rgba(74,158,255,.22) 0%,rgba(74,158,255,.07) 40%,transparent 70%)', filter: 'blur(28px)', animation: 'glowPulse 3.5s ease-in-out infinite', pointerEvents: 'none' }} />
          </div>

          {/* Wide atmospheric overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at 0% 50%, rgba(2,2,8,0.8) 0%, transparent 80%)' }} />
          {/* Subtle blue atmosphere top-right */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 80% 30%,rgba(74,158,255,.06) 0%,transparent 45%)' }} />
          {/* Scanlines */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.025) 2px,rgba(0,0,0,.025) 4px)' }} />

          {/* HERO TEXT */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 48px', maxWidth: 500, zIndex: 5 }}>
            {/* Tag line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, animation: 'textReveal .8s cubic-bezier(0.22, 1, 0.36, 1) .3s both' }}>
              <div style={{ width: 28, height: 1.5, background: skin.accent, opacity: .6 }} />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: skin.accent, opacity: .85 }}>Daily Command Center</span>
            </div>

            {/* Title */}
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px,3.4vw,56px)', fontWeight: 900, color: 'rgba(245,245,245,.95)', lineHeight: 1.0, letterSpacing: '-.02em', marginBottom: 6, animation: 'textReveal .9s cubic-bezier(0.22, 1, 0.36, 1) .4s both' }}>
              RIDE YOUR
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px,3.4vw,56px)', fontWeight: 900, background: `linear-gradient(135deg, ${skin.accent} 0%, rgba(255,255,255,0.8) 55%, ${skin.accent} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.0, letterSpacing: '-.02em', marginBottom: 24, animation: 'textReveal .9s cubic-bezier(0.22, 1, 0.36, 1) .5s both' }}>
              DISCIPLINE
            </div>

            {/* Accent line */}
            <div style={{ width: 52, height: 2, background: `linear-gradient(90deg, ${skin.accent}, transparent)`, marginBottom: 18, animation: 'textReveal .8s cubic-bezier(0.22, 1, 0.36, 1) .55s both' }} />

            {/* Subtitle */}
            <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.36)', lineHeight: 1.78, marginBottom: 34, animation: 'textReveal .8s cubic-bezier(0.22, 1, 0.36, 1) .6s both' }}>
              Excuses don&apos;t build empires. Habits do.<br />Lock in. Level up. Let the bike prove it.
            </div>

            {/* Chips */}
            <div style={{ display: 'flex', gap: 12, animation: 'textReveal .8s cubic-bezier(0.22, 1, 0.36, 1) .7s both' }}>
              {[
                { v: `${streak}`, l: 'Day streak', c: '#ff6b35', bg: 'rgba(255,107,53,.08)', bc: 'rgba(255,107,53,.22)', fn: () => setScreen('streak') },
                { v: `${doneHabits}/7`, l: 'Habits', c: '#4a9eff', bg: 'rgba(74,158,255,.08)', bc: 'rgba(74,158,255,.22)', fn: () => setScreen('habits') },
                { v: 'Lv.8', l: 'Rank', c: '#d4a843', bg: 'rgba(212,168,67,.08)', bc: 'rgba(212,168,67,.22)', fn: () => setScreen('gearup') },
              ].map(chip => (
                <button key={chip.l} className="stat-chip liquid-glass hoverable" onClick={chip.fn} aria-label={`View ${chip.l}`} style={{ padding: '14px 18px', cursor: 'pointer', flex: 1, textAlign: 'center', color: 'inherit', outline: 'none', border: `1px solid ${chip.bc}` }}>
                  <div className="font-mono" style={{ fontSize: 24, fontWeight: 800, color: chip.c, lineHeight: 1.2, textShadow: `0 0 15px ${chip.c}40` }}>{chip.v}</div>
                  <div className="font-ui" style={{ fontSize: 10, color: 'var(--dim)', letterSpacing: '.15em', textTransform: 'uppercase', marginTop: 6, fontWeight: 700 }}>{chip.l}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Corner watermark */}
          <div style={{ position: 'absolute', bottom: 18, right: 22, zIndex: 5, fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.1)', letterSpacing: '.3em' }}>YAMAHA MT-15</div>
        </div>

        {/* BOTTOM STATS BAR */}
        <div className="scrollArea" style={{ borderTop: '1px solid rgba(255,255,255,.05)', padding: '20px 24px', display: 'flex', gap: 16, flexShrink: 0, overflowX: 'auto', background: 'rgba(5,7,9,.75)', backdropFilter: 'blur(40px)', animation: 'statsReveal .7s cubic-bezier(0.22, 1, 0.36, 1) .9s both' }}>
          {stats.map((s: any, i: number) => (
            <button key={s.label} className="stat-card liquid-glass hoverable" onClick={s.onClick} aria-label={`View ${s.label}`} style={{ minWidth: 160, flex: 1, padding: '18px 24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', cursor: 'pointer', position: 'relative', overflow: 'hidden', outline: 'none' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: s.color, opacity: .8, boxShadow: `0 0 15px ${s.color}` }} />
              <div className="font-ui" style={{ fontSize: 11, color: 'var(--dim)', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700 }}>{s.label}</div>
              <div style={{ width: '100%', textAlign: 'left', marginTop: 14 }}>
                <div className="font-mono" style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1, textShadow: `0 0 20px ${s.color}60` }}>{s.value}</div>
                <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 4, overflow: 'hidden', marginTop: 12 }}>
                  <div style={{ height: '100%', width: s.width, background: s.color, borderRadius: 4, boxShadow: `0 0 10px ${s.color}` }} />
                </div>
              </div>
            </button>
          ))}

          {!tgLinked ? (
            <div className="liquid-glass hoverable" style={{ minWidth: 260, width: 260, flexShrink: 0, padding: '18px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
              <div>
                <div className="font-ui" style={{ fontSize: 12, fontWeight: 700, color: skin.accent, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, whiteSpace: 'nowrap' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, filter: `drop-shadow(0 0 5px ${skin.accent})` }}><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 8.16l-1.98 9.36c-.15.66-.54.81-1.08.51l-3-2.22-1.44 1.41c-.15.18-.3.27-.63.27l.21-3.06 5.58-5.04c.24-.21-.06-.33-.36-.12L6.9 13.17l-2.97-.93c-.63-.21-.66-.63.15-.93l11.61-4.47c.51-.21 1.02.12.83.32z" /></svg>
                  Connect Telegram
                </div>
                <div className="font-ui" style={{ fontSize: 11, color: 'var(--dim)', lineHeight: 1.5 }}>Add tasks via natural language instantly.</div>
              </div>
              <button className="liquid-glass-accent liquid-glass hoverable" onClick={() => setShowTgModal(true)} style={{ marginTop: 12, padding: '8px 12px', color: skin.accent, cursor: 'pointer', textAlign: 'center', outline: 'none' }}>
                <span className="font-ui" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}>Link Now →</span>
              </button>
            </div>
          ) : (
            <div className="liquid-glass" style={{ minWidth: 260, width: 260, flexShrink: 0, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(61,220,132,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(61,220,132,.2)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3ddc84" strokeWidth="3"><polyline points="20,6 9,17 4,12" /></svg>
              </div>
              <div>
                <div className="font-ui" style={{ fontSize: 14, fontWeight: 700, color: '#3ddc84', letterSpacing: '0.05em' }}>Telegram Linked</div>
                <div className="font-ui" style={{ fontSize: 11, color: 'var(--dim)', marginTop: 4 }}>Tasks sync from bot instantly</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TELEGRAM MODAL */}
      {showTgModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', backdropFilter: 'blur(20px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => !linking && setShowTgModal(false)}>
          <div className="liquid-glass" onClick={e => e.stopPropagation()} style={{ width: 400, overflow: 'hidden', animation: 'modalIn .4s cubic-bezier(0.22, 1, 0.36, 1)' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,.05)', background: `linear-gradient(135deg, ${skin.accent}15 0%, transparent 100%)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="liquid-glass-accent liquid-glass" style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={skin.accent}><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 8.16l-1.98 9.36c-.15.66-.54.81-1.08.51l-3-2.22-1.44 1.41c-.15.18-.3.27-.63.27l.21-3.06 5.58-5.04c.24-.21-.06-.33-.36-.12L6.9 13.17l-2.97-.93c-.63-.21-.66-.63.15-.93l11.61-4.47c.51-.21 1.02.12.83.32z" /></svg>
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>LINK BOT</div>
                  <div className="font-ui" style={{ fontSize: 12, color: 'var(--dim)', marginTop: 4 }}>One-time setup · 30 seconds</div>
                </div>
              </div>
            </div>
            <div style={{ padding: '24px 28px' }}>
              {[
                { n: '1', t: 'Click "Open Telegram"', s: 'Opens @MTRiderBot', isCode: false },
                { n: '2', t: 'Send this tracking code', s: tgCode, isCode: true },
                { n: '3', t: 'Done! Sync engaged.', s: 'Try: "add gym 7am"', isCode: false },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, marginBottom: i < 2 ? 24 : 0 }}>
                  <div className="liquid-glass-accent liquid-glass" style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="font-display" style={{ fontSize: 14, fontWeight: 800, color: skin.accent, marginTop: 1 }}>{step.n}</span>
                  </div>
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    <div className="font-ui" style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{step.t}</div>
                    {step.isCode ? (
                      <div className="liquid-glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'rgba(0,0,0,0.2)' }}>
                        <span className="font-mono" style={{ fontSize: 20, fontWeight: 800, color: skin.accent, letterSpacing: '0.15em' }}>{step.s}</span>
                        <button onClick={() => navigator.clipboard?.writeText(tgCode)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={skin.accent} strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                        </button>
                      </div>
                    ) : (
                      <div className="font-ui" style={{ fontSize: 12, color: 'var(--dim)', fontWeight: 500 }}>{step.s}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '0 28px 28px', display: 'flex', gap: 12 }}>
              <button className="liquid-glass hoverable" onClick={() => setShowTgModal(false)} style={{ flex: 1, padding: '14px', textAlign: 'center', outline: 'none', color: '#fff' }}>
                <span className="font-ui" style={{ fontSize: 13, fontWeight: 600 }}>Cancel</span>
              </button>
              <button className="liquid-glass-accent liquid-glass hoverable" onClick={simulateLink} style={{ flex: 2, padding: '14px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, outline: 'none', color: skin.accent }}>
                {linking ? (
                  <><div style={{ width: 14, height: 14, border: `2px solid ${skin.accent}40`, borderTopColor: skin.accent, borderRadius: '50%', animation: 'spin .7s linear infinite' }} /><span className="font-ui" style={{ fontSize: 13, fontWeight: 700 }}>SYNCHRONIZING...</span></>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 8.16l-1.98 9.36c-.15.66-.54.81-1.08.51l-3-2.22-1.44 1.41c-.15.18-.3.27-.63.27l.21-3.06 5.58-5.04c.24-.21-.06-.33-.36-.12L6.9 13.17l-2.97-.93c-.63-.21-.66-.63.15-.93l11.61-4.47c.51-.21 1.02.12.83.32z" /></svg><span className="font-ui" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em' }}>OPEN TELEGRAM</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default Dashboard;
