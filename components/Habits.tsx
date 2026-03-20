import { useState, useEffect, useCallback, memo } from 'react';
import { useStore, SKINS } from '@/store/useStore';
import { supabase } from '@/lib/supabase';
import Topbar from './Topbar';

const Habits = memo(function Habits() {
  const { habits, setHabits, toggleHabit, xp, level, streak, combo, comboActive, xpToday, soundOn, toggleSound, activeSkin, user } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newXp, setNewXp] = useState(50);

  const fetchHabits = useCallback(async () => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[Habits] Load error:', error);
      return;
    }

    if (data) {
      setHabits(data.map((h: any) => ({
        id: h.id,
        name: h.title,
        done: h.completed,
        xp: h.xp_reward,
        time: h.time || 'Any time',
        cat: h.category || 'Mind',
        col: h.color || '#9b6dff'
      })));
    }
  }, [user, setHabits]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !user) return;

    const { error } = await supabase.from('habits').insert({
      user_id: user.id,
      title: newTitle,
      xp_reward: newXp,
      completed: false
    });

    if (error) {
      alert(`Error adding habit: ${error.message}`);
    } else {
      setShowAddModal(false);
      setNewTitle('');
      setNewXp(50);
      fetchHabits();
    }
  };
  const skin = SKINS[activeSkin] || SKINS[0];
  const doneCount = habits.filter(h => h.done).length;
  const pct = habits.length === 0 ? 0 : Math.round(doneCount / habits.length * 100);
  const xpRel = xp - (level - 1) * 1000;
  const xpFill = Math.min(100, Math.round(xpRel / 1000 * 100));

  const RANKS = ['Rookie Rider', 'Iron Rider', 'Steel Rider', 'Chrome Rider', 'Shadow Rider', 'Apex Rider', 'Legend Rider'];
  const rank = RANKS[Math.min(level - 1, RANKS.length - 1)];

  // Bike throttle blip — short rev sound
  const playTick = useCallback(() => {
    if (!soundOn) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Low growl oscillator (engine fundamental)
      const o1 = ctx.createOscillator(); const g1 = ctx.createGain();
      o1.connect(g1); g1.connect(ctx.destination);
      o1.type = 'sawtooth';
      o1.frequency.setValueAtTime(85, ctx.currentTime);
      o1.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + .08);
      o1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + .2);
      g1.gain.setValueAtTime(.08, ctx.currentTime);
      g1.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .25);
      o1.start(); o1.stop(ctx.currentTime + .25);
      // Overtone — adds grit
      const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
      o2.connect(g2); g2.connect(ctx.destination);
      o2.type = 'square';
      o2.frequency.setValueAtTime(170, ctx.currentTime);
      o2.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + .08);
      o2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + .2);
      g2.gain.setValueAtTime(.04, ctx.currentTime);
      g2.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .2);
      o2.start(); o2.stop(ctx.currentTime + .2);
    } catch {
      // Audio errors ignored
    }
  }, [soundOn]);

  // Throttle rev — rising engine note with exhaust pop
  const playComplete = useCallback(() => {
    if (!soundOn) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Main rev sweep
      const o = ctx.createOscillator(); const g = ctx.createGain();
      const dist = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i * 2) / 256 - 1;
        curve[i] = (Math.PI + 200 * x) / (Math.PI + 200 * Math.abs(x));
      }
      dist.curve = curve;
      o.connect(dist); dist.connect(g); g.connect(ctx.destination);
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(90, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + .15);
      o.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + .35);
      o.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + .5);
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(.1, ctx.currentTime + .03);
      g.gain.setValueAtTime(.1, ctx.currentTime + .15);
      g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .55);
      o.start(); o.stop(ctx.currentTime + .55);
      // Exhaust crackle (noise burst at the end)
      const bufSize = ctx.sampleRate * 0.08;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
      const noise = ctx.createBufferSource(); const ng = ctx.createGain();
      noise.buffer = buf; noise.connect(ng); ng.connect(ctx.destination);
      ng.gain.setValueAtTime(0, ctx.currentTime + .3);
      ng.gain.linearRampToValueAtTime(.06, ctx.currentTime + .32);
      ng.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .45);
      noise.start(ctx.currentTime + .3);
    } catch {
      // Audio errors ignored
    }
  }, [soundOn]);

  const spawnParticles = useCallback((el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2; const cy = r.top + r.height / 2;
    const cols = ['#4a9eff', '#d4a843', '#3ddc84', '#ff6b35', '#9b6dff'];
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 50;
      p.style.cssText = `position:fixed;width:5px;height:5px;border-radius:50%;pointer-events:none;z-index:9999;left:${cx}px;top:${cy}px;background:${cols[i % 5]};--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px;animation:burst .7s ease forwards`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  }, []);

  const spawnXpFloat = useCallback((el: HTMLElement, earned: number) => {
    const r = el.getBoundingClientRect();
    const f = document.createElement('div');
    f.style.cssText = `position:fixed;left:${r.right - 70}px;top:${r.top}px;font-family:'Orbitron',sans-serif;font-size:14px;font-weight:700;color:#d4a843;pointer-events:none;z-index:9999;animation:floatUp .9s ease forwards`;
    f.textContent = `+${earned} XP`;
    f.ariaLive = 'polite';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 950);
  }, []);

  const handleToggle = useCallback((id: number, el: HTMLElement) => {
    const h = habits.find(x => x.id === id);
    if (!h) return;
    if (!h.done) {
      playTick();
      setTimeout(() => playComplete(), 80);
      spawnParticles(el);
      const earned = Math.round(h.xp * (combo >= 3 ? 3 : combo >= 2 ? 2 : combo >= 1.5 ? 1.5 : 1));
      spawnXpFloat(el, earned);
    }
    toggleHabit(id);
  }, [habits, combo, toggleHabit, playTick, playComplete, spawnParticles, spawnXpFloat]);

  const comboDisplay = combo >= 3 ? 3 : combo >= 2 ? 2 : combo >= 1.5 ? '1.5' : 1;
  const comboColor = combo >= 3 ? '#d4a843' : combo >= 2 ? '#ff6b35' : combo >= 1.5 ? skin.accent : 'var(--dim)';
  const comboLabel = combo >= 3 ? 'BLAZING!' : combo >= 2 ? 'ON FIRE!' : combo >= 1.5 ? 'Building!' : 'No combo';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: 'transparent' }}>
      <style>{`
        @keyframes burst{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0)}}
        @keyframes floatUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-55px)}}
        @keyframes cardIn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes xpFill{from{width:0}to{width:100%}}
        .habit-row:hover{background:rgba(255,255,255,.05)!important;transform:translateX(4px)!important;border-color:rgba(255,255,255,.14)!important}
        .habit-row.done-row:hover{transform:translateX(2px)!important}
      `}</style>

      <div style={{ position: 'relative', zIndex: 50 }}>
        <Topbar title="HABITS" />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* LEFT — habit list */}
        <div className="scrollArea" style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div className="font-ui" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--dim)' }}>Today&apos;s Ride Plan</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button 
                onClick={() => setShowAddModal(true)}
                className="liquid-glass hoverable" 
                style={{ padding: '6px 14px', borderRadius: 8, fontSize: 10, fontWeight: 800, color: skin.accent, border: `1px solid ${skin.accent}40`, background: 'transparent', cursor: 'pointer' }}
              >
                + ADD HABIT
              </button>
              <div className="font-mono" style={{ fontSize: 13, fontWeight: 800, color: pct === 100 ? '#3ddc84' : 'var(--dim)' }}>{doneCount} / {habits.length} DONE</div>
            </div>
          </div>

          {[...habits].map((h, i) => (
            <div
              key={h.id}
              className={`habit-row liquid-glass hoverable ${h.done ? ' done-row' : ''}`}
              onClick={(e) => handleToggle(h.id, e.currentTarget as HTMLElement)}
              onKeyDown={(e) => e.key === 'Enter' && handleToggle(h.id, e.currentTarget as HTMLElement)}
              tabIndex={0}
              role="button"
              aria-label={`Toggle habit: ${h.name}`}
              style={{
                background: h.done ? 'rgba(61,220,132,.06)' : 'rgba(255,255,255,.02)',
                border: `1px solid ${h.done ? 'rgba(61,220,132,.2)' : 'rgba(255,255,255,.05)'}`,
                borderRadius: 16, padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 16,
                cursor: h.done ? 'default' : 'pointer',
                animation: `cardIn .4s cubic-bezier(0.22, 1, 0.36, 1) ${i * .05}s both`,
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Done shimmer */}
              {h.done && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(61,220,132,.04) 0%, transparent 60%)', pointerEvents: 'none' }} />}

              {/* Checkbox */}
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                border: `1.5px solid ${h.done ? skin.accent : 'var(--dim)'}`,
                background: h.done ? `${skin.accent}20` : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all .3s',
              }}>
                {h.done && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={skin.accent} strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12" /></svg>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="font-ui" style={{
                  fontSize: 16, fontWeight: 700,
                  color: h.done ? 'var(--dim)' : '#fff',
                  textDecorationLine: h.done ? 'line-through' : 'none',
                  textDecorationColor: h.done ? 'var(--dim)' : 'transparent',
                  transition: 'color .2s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  letterSpacing: '0.02em'
                }}>{h.name}</div>
                <div className="font-ui" style={{ fontSize: 12, color: 'var(--dim)', marginTop: 4, fontWeight: 500 }}>{h.time}</div>
              </div>

              {/* XP */}
              <div className="font-mono" style={{ fontSize: 16, fontWeight: 800, color: '#d4a843', opacity: h.done ? .4 : 1, flexShrink: 0, textShadow: h.done ? 'none' : '0 0 10px rgba(212,168,67,.4)' }}>+{h.xp}</div>

              {/* Category */}
              <div className="font-display" style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 12,
                background: `${h.col}15`, color: h.col,
                fontWeight: 800, flexShrink: 0,
                border: `1px solid ${h.col}30`, letterSpacing: '0.05em'
              }}>{h.cat}</div>
            </div>
          ))}
        </div>

        {/* RIGHT — stats panel */}
        <div className="scrollArea" style={{
          width: 320, borderLeft: '1px solid rgba(255,255,255,0.05)',
          padding: 32, display: 'flex', flexDirection: 'column',
          gap: 24, overflowY: 'auto', flexShrink: 0,
          background: 'rgba(5,7,9,.5)', backdropFilter: 'blur(20px)'
        }}>

          {/* Progress ring */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
            <svg width="96" height="96" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="6" />
              <circle cx="48" cy="48" r="38" fill="none" stroke="url(#rg)" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 38 * pct / 100} ${2 * Math.PI * 38}`}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '48px 48px', transition: 'stroke-dasharray .8s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
              <defs>
                <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4a9eff" />
                  <stop offset="100%" stopColor="#d4a843" />
                </linearGradient>
              </defs>
              <text x="48" y="44" textAnchor="middle" className="font-display" fontSize="22" fontWeight="900" fill="#fff" style={{ textShadow: '0 0 10px rgba(255,255,255,.4)' }}>{pct}%</text>
              <text x="48" y="58" textAnchor="middle" className="font-ui" fontSize="10" fontWeight="700" fill="var(--dim)" letterSpacing="2">DONE</text>
            </svg>
          </div>

          {/* XP Card */}
          <div className="liquid-glass" style={{ padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${skin.accent}, #d4a843)`, boxShadow: `0 0 15px ${skin.accent}` }} />
            <div className="font-display" style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1 }}>LEVEL {level}</div>
            <div className="font-ui" style={{ fontSize: 12, fontWeight: 700, color: skin.accent, marginTop: 4, letterSpacing: '0.05em' }}>{rank}</div>
            <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 4, overflow: 'hidden', margin: '14px 0 6px' }}>
              <div style={{ height: '100%', width: `${xpFill}%`, background: `linear-gradient(90deg, ${skin.accent}, #d4a843)`, borderRadius: 4, transition: 'width .8s cubic-bezier(0.22, 1, 0.36, 1)' }} />
            </div>
            <div className="font-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--dim)', fontWeight: 700 }}>
              <span>{xp}</span><span>{level * 1000}</span>
            </div>
          </div>

          {/* Combo */}
          <div className="liquid-glass" style={{
            padding: '20px 24px', textAlign: 'center',
            borderColor: comboActive ? `${comboColor}40` : 'rgba(255,255,255,0.08)',
            boxShadow: comboActive ? `0 0 30px ${comboColor}20` : 'none'
          }}>
            <div className="font-mono" style={{ fontSize: 36, fontWeight: 900, color: comboColor, lineHeight: 1, textShadow: comboActive ? `0 0 15px ${comboColor}` : 'none' }}>
              <span className="font-display" style={{ fontSize: 18, verticalAlign: 'super' }}>x</span>{comboDisplay}
            </div>
            <div className="font-ui" style={{ fontSize: 11, color: 'var(--dim)', letterSpacing: '.15em', textTransform: 'uppercase', marginTop: 8, fontWeight: 700 }}>{comboLabel}</div>
            <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 4, overflow: 'hidden', marginTop: 12 }}>
              <div style={{ height: '100%', width: comboActive ? '60%' : '100%', background: comboColor, borderRadius: 4, transition: 'width .1s linear, background .3s' }} />
            </div>
          </div>

          {/* Streak */}
          <div className="liquid-glass hoverable" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, border: '1px solid rgba(255,107,53,.3)' }}>
            <div style={{ fontSize: 32, animation: 'HeadlightPulse 1.8s ease-in-out infinite' }}>🔥</div>
            <div>
              <div className="font-mono" style={{ fontSize: 28, fontWeight: 900, color: '#ff6b35', lineHeight: 1, textShadow: '0 0 15px rgba(255,107,53,.4)' }}>{streak}</div>
              <div className="font-ui" style={{ fontSize: 10, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4, fontWeight: 700 }}>Day streak</div>
            </div>
          </div>

          {/* Today XP */}
          <div className="liquid-glass" style={{ padding: '20px 24px' }}>
            <div className="font-ui" style={{ fontSize: 11, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 8, fontWeight: 700 }}>Today&apos;s XP</div>
            <div className="font-mono" style={{ fontSize: 28, fontWeight: 900, color: '#d4a843', lineHeight: 1, textShadow: '0 0 15px rgba(212,168,67,.4)' }}>{xpToday}</div>
          </div>

          {/* Sound toggle */}
          <button
            className={`liquid-glass-pill liquid-glass hoverable ${soundOn ? 'liquid-glass-accent' : ''}`}
            onClick={toggleSound}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '14px 20px',
              cursor: 'pointer', outline: 'none'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={soundOn ? skin.accent : 'var(--dim)'} strokeWidth="2.5">
              {soundOn
                ? <><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" /><path d="M19.07 4.93a10 10 0 010 14.14" /><path d="M15.54 8.46a5 5 0 010 7.07" /></>
                : <><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>
              }
            </svg>
            <span className="font-ui" style={{ fontSize: 13, color: soundOn ? skin.accent : 'var(--dim)', fontWeight: 700, letterSpacing: '0.05em' }}>
              {soundOn ? 'SOUNDS: ON' : 'SOUNDS: MUTED'}
            </span>
          </button>

          {/* Motivator */}
          <div className="font-ui" style={{ padding: '0 12px', fontSize: 12, color: 'var(--dim)', lineHeight: 1.65, fontStyle: 'italic', textAlign: 'center', marginTop: 10 }}>
            &quot;Discipline isn&apos;t a feeling. It&apos;s a <strong style={{ color: '#fff', fontWeight: 700 }}>gear you shift into.</strong>&quot;
          </div>
        </div>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <form onSubmit={handleAddHabit} className="liquid-glass" style={{ width: '100%', maxWidth: 400, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '0.02em' }}>NEW OBJECTIVE</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label className="font-ui" style={{ fontSize: 11, fontWeight: 700, color: 'var(--dim)', letterSpacing: '0.1em' }}>HABIT NAME</label>
              <input 
                autoFocus
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Morning Ride"
                className="liquid-glass"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', color: '#fff', borderRadius: 12, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label className="font-ui" style={{ fontSize: 11, fontWeight: 700, color: 'var(--dim)', letterSpacing: '0.1em' }}>XP REWARD</label>
              <input 
                type="number"
                value={newXp}
                onChange={e => setNewXp(parseInt(e.target.value) || 0)}
                className="liquid-glass"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', color: '#fff', borderRadius: 12, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" onClick={() => setShowAddModal(false)} className="hoverable" style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--dim)', fontWeight: 700, cursor: 'pointer' }}>CANCEL</button>
              <button type="submit" className="liquid-glass-accent hoverable" style={{ flex: 2, padding: '14px', borderRadius: 12, background: skin.accent, border: 'none', color: '#000', fontWeight: 800, cursor: 'pointer' }}>DEPLOY HABIT</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
});

export default Habits;
