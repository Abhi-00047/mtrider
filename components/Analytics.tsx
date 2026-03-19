'use client';
import { useEffect, useState, useMemo, memo } from 'react';
import { useStore, SKINS } from '@/store/useStore';
import Topbar from './Topbar';

const LiveChart = memo(function LiveChart({ color }: { color: string }) {
  const [data, setData] = useState(() => Array(20).fill(0).map((_, i) => ({ time: Date.now() - (19 - i) * 1000, val: 50 + Math.random() * 20 })));

  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1].val;
        const next = Math.max(20, Math.min(100, last + (Math.random() * 10 - 5)));
        return [...prev.slice(1), { time: Date.now(), val: next }];
      });
    }, 150);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ width: '100%', height: 120, position: 'relative', marginTop: 20 }}>
      <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="liveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${(i / 19) * 400} ${120 - d.val}`).join(' ') + " L 400 120 L 0 120 Z"}
          fill="url(#liveGrad)"
        />
        <path
          d={data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${(i / 19) * 400} ${120 - d.val}`).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2"
          style={{ transition: 'all 0.15s linear' }}
        />
        {/* Scanning line */}
        <line x1="400" y1="0" x2="400" y2="120" stroke={color} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      </svg>
    </div>
  );
});

const Analytics = memo(function Analytics() {
  const { xp, level, habits, streak, xpToday, activeSkin } = useStore();

  const skin = SKINS[activeSkin] || SKINS[0];

  // Dynamically map chart colors to the active skin for total cohesion
  const colors = {
    cyan: skin.accent,
    purple: skin.primary === '#1a1a24' ? 'rgba(255,255,255,0.2)' : skin.primary, // fallback if too dark
    pink: skin.glow,
    neonGreen: skin.accent,
    gold: skin.accent,
    deepBlue: skin.primary,
  };

  const [needleAngle, setNeedleAngle] = useState(-90);
  const [animXp, setAnimXp] = useState(0);

  // Productivity score calculation
  const doneCount = habits.filter(h => h.done).length;
  const score = Math.min(100, Math.round((doneCount / habits.length) * 60 + Math.min(streak, 20) * 2));

  // Animate speedometer needle (-90 to +90 degrees for a perfect semi-circle)
  useEffect(() => {
    const target = -90 + (score / 100) * 180;
    const timer = setTimeout(() => setNeedleAngle(target), 600);
    return () => clearTimeout(timer);
  }, [score]);

  // Animate XP counter
  useEffect(() => {
    let frame: number;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setAnimXp(Math.round(eased * xp));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [xp]);

  // Mock bar chart data
  const barData = useMemo(() => {
    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return labels.map((l, i) => ({
      label: l,
      // Deterministic mock data for purity
      habits: 100 + ((i * 45) % 250),
      tasks: 50 + ((i * 35) % 150),
    }));
  }, []);
  const maxBar = Math.max(...barData.map(d => d.habits + d.tasks), 1);

  const timeGauges = [
    { label: 'Morning', value: 85, color: colors.cyan },
    { label: 'Midday', value: 72, color: colors.gold },
    { label: 'Evening', value: 55, color: colors.purple },
    { label: 'Night', value: 40, color: colors.pink },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#020205', position: 'relative' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(3.5); opacity: 0; } }
      `}</style>

      {/* Cyber Grid Background (Simplified for performance) */}
      <div style={{ position: 'absolute', inset: -50, top: '50%', perspective: '1000px', pointerEvents: 'none', zIndex: 0, opacity: 0.4 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: 'rotateX(70deg) translateY(-20px)',
          maskImage: 'linear-gradient(to top, black, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent 80%)',
        }} />
      </div>

      {/* Holographic Orbs (Simplified) */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', borderRadius: '50%', background: `radial-gradient(circle, ${colors.purple}15 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: `radial-gradient(circle, ${colors.cyan}10 0%, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 50 }}>
        <Topbar title="TELEMETRY" />
      </div>

      {/* Massive Uncompressed Layout */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '30px 40px', display: 'flex', flexDirection: 'column', gap: 35, position: 'relative', zIndex: 10 }}>

        {/* Top Hero Section */}
        <div style={{ display: 'flex', gap: 35, animation: 'fadeUp .8s cubic-bezier(.16,1,.3,1) both' }}>

          {/* Hyper-Premium Speedometer */}
          <div className="liquid-glass" style={{ flex: 1.5, padding: '35px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <div className="font-ui" style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.3em', textTransform: 'uppercase', color: colors.cyan, marginBottom: 10, alignSelf: 'flex-start', textShadow: `0 0 15px ${colors.cyan}` }}>
              SYSTEM PERFORMANCE
            </div>

            <svg width="340" height="220" viewBox="0 0 340 220" style={{ overflow: 'visible', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))' }}>
              <defs>
                <linearGradient id="speedoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={colors.pink} />
                  <stop offset="50%" stopColor={colors.purple} />
                  <stop offset="100%" stopColor={colors.cyan} />
                </linearGradient>
                <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background ambient ring */}
              <path d={`M 40 200 A 130 130 0 0 1 300 200`} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="24" strokeLinecap="round" />

              {/* Thick Dashed Track */}
              <path d={`M 40 200 A 130 130 0 0 1 300 200`} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="18" strokeDasharray="6 8" strokeLinecap="butt" />

              {/* Glowing Gradient Active Value */}
              <path
                d={`M 40 200 A 130 130 0 0 1 300 200`}
                fill="none" stroke="url(#speedoGrad)" strokeWidth="18" strokeLinecap="round"
                strokeDasharray={`${(score / 100) * Math.PI * 130} ${Math.PI * 130}`}
                filter="url(#neonGlow)"
                style={{ transition: 'stroke-dasharray 1.6s cubic-bezier(0.25, 1, 0.5, 1)' }}
              />

              {/* Outer delicate ring markings */}
              {[...Array(11)].map((_, i) => {
                const angle = -90 + i * (180 / 10);
                const rad = (angle * Math.PI) / 180;
                const active = score >= (i / 10) * 100;

                return (
                  <line key={`tick-${i}`}
                    x1={170 + 145 * Math.sin(rad)} y1={200 - 145 * Math.cos(rad)}
                    x2={170 + 155 * Math.sin(rad)} y2={200 - 155 * Math.cos(rad)}
                    stroke={active ? colors.cyan : "rgba(255,255,255,0.1)"} strokeWidth={i % 2 === 0 ? "3" : "1"}
                    style={{ transition: 'stroke 0.5s' }}
                  />
                );
              })}

              {/* Needle Hub */}
              <circle cx="170" cy="200" r="16" fill="#000" stroke={colors.cyan} strokeWidth="3" filter="url(#neonGlow)" />
              <circle cx="170" cy="200" r="4" fill={colors.purple} />

              {/* Sweep Needle */}
              <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: `170px 200px`, transition: 'transform 1.6s cubic-bezier(0.25, 1, 0.5, 1)' }}>
                <polygon points="166,200 174,200 170,80" fill="url(#speedoGrad)" filter="url(#neonGlow)" opacity="0.9" />
                <line x1="170" y1="200" x2="170" y2="75" stroke="#fff" strokeWidth="2" />
              </g>

              {/* Floating Data Text (Top Right Corner) */}
              <text x="320" y="45" textAnchor="end" className="font-mono" fontSize="56" fontWeight="900" fill="#fff" style={{ textShadow: `0 0 30px ${colors.cyan}` }}>{score}</text>
              <text x="320" y="65" textAnchor="end" className="font-ui" fontSize="12" fontWeight="800" fill={colors.purple} letterSpacing="4">SCORE</text>
            </svg>
          </div>

          {/* Holographic Odometer & Stats */}
          <div className="liquid-glass" style={{ flex: 1, padding: '35px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="font-ui" style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.3em', textTransform: 'uppercase', color: colors.pink, marginBottom: 24, textShadow: `0 0 15px ${colors.pink}` }}>CORE EXPERIENCE</div>

              {/* Digital LED Display Box */}
              <div style={{
                background: '#040408', borderRadius: 20, padding: '24px', border: `1px solid ${colors.purple}40`,
                boxShadow: `inset 0 10px 30px rgba(0,0,0,0.8), 0 0 30px ${colors.purple}20`,
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12
              }}>
                {String(animXp).padStart(6, '0').split('').map((digit, i) => (
                  <div key={i} className="neon-text font-mono" style={{
                    width: 45, height: 65, background: 'linear-gradient(180deg, rgba(20,20,30,0.8) 0%, rgba(5,5,10,0.9) 100%)',
                    border: `1px solid ${i < String(animXp).padStart(6, '0').length - String(xp).length ? 'rgba(255,255,255,0.05)' : colors.cyan}60`,
                    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 40, fontWeight: 900,
                    color: i < String(animXp).padStart(6, '0').length - String(xp).length ? 'rgba(255,255,255,0.05)' : colors.cyan,
                    boxShadow: i < String(animXp).padStart(6, '0').length - String(xp).length ? 'none' : `inset 0 0 15px ${colors.cyan}40, 0 0 10px ${colors.cyan}`
                  }}>{digit}</div>
                ))}
                <div className="font-display" style={{ alignSelf: 'flex-end', fontSize: 22, fontWeight: 900, color: colors.purple, marginLeft: 8, marginBottom: 8, textShadow: `0 0 10px ${colors.purple}` }}>XP</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 30 }}>
              {[
                { l: 'Daily Drift', v: `+${xpToday}`, c: colors.neonGreen },
                { l: 'Rider Class', v: `LV.${level}`, c: colors.cyan },
                { l: 'Chain Streak', v: `${streak}X`, c: colors.gold }
              ].map((stat, i) => (
                <div key={i} className="liquid-glass" style={{ borderRadius: 16, padding: '16px 10px', textAlign: 'center' }}>
                  <div className="font-mono" style={{ fontSize: 26, fontWeight: 900, color: stat.c, textShadow: `0 0 15px ${stat.c}` }}>{stat.v}</div>
                  <div className="font-ui" style={{ fontSize: 10, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4, fontWeight: 700 }}>{stat.l}</div>
                </div>
              ))}
            </div>
            <LiveChart color={colors.cyan} />
          </div>
        </div>

        {/* Bottom Row — Cyber Bar Chart & Radials */}
        <div style={{ display: 'flex', gap: 35, animation: 'fadeUp .8s cubic-bezier(.16,1,.3,1) .2s both' }}>

          <div className="liquid-glass" style={{ flex: 1.5, padding: '30px 35px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div className="font-ui" style={{ fontSize: 13, fontWeight: 900, letterSpacing: '.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>TOTAL PERFORMANCE</div>
                <div className="font-mono" style={{ fontSize: 38, fontWeight: 900, color: '#fff', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  {barData.reduce((acc, curr) => acc + curr.habits + curr.tasks, 0).toLocaleString()}
                  <div style={{ fontSize: 13, color: colors.neonGreen, background: `${colors.neonGreen}20`, padding: '4px 8px', borderRadius: 6, fontWeight: 800, letterSpacing: '0.5px' }}>↑ 18.2%</div>
                </div>
              </div>
              <div style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 }}>
                <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--dim)', fontWeight: 800, letterSpacing: '1px', cursor: 'pointer' }}>
                  <span style={{ color: '#fff' }}>1W</span>
                  <span style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--dim)'}>1M</span>
                  <span style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--dim)'}>3M</span>
                  <span style={{ transition: 'color 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--dim)'}>1Y</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 260, padding: '0 10px', position: 'relative', marginTop: 10 }}>
              <svg viewBox="0 0 400 240" style={{ width: '100%', height: '100%', overflow: 'visible', position: 'absolute', inset: 0 }}>
                <defs>
                  <linearGradient id="tradeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={colors.neonGreen} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={colors.neonGreen} stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="glowLine">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid Lines */}
                {[...Array(5)].map((_, i) => (
                  <line key={i} x1="0" y1={i * 45 + 20} x2="400" y2={i * 45 + 20} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 4" />
                ))}

                {/* Area Fill */}
                <path
                  d={
                    barData.map((d, i) => {
                      const x = (i / (barData.length - 1)) * 400;
                      const y = 200 - ((d.habits + d.tasks) / maxBar) * 160;
                      return (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
                    }).join(' ') + ` L 400 240 L 0 240 Z`
                  }
                  fill="url(#tradeGrad)"
                />

                {/* Precision Trend Line */}
                <path
                  d={barData.map((d, i) => {
                    const x = (i / (barData.length - 1)) * 400;
                    const y = 200 - ((d.habits + d.tasks) / maxBar) * 160;
                    return (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
                  }).join(' ')}
                  fill="none" stroke={colors.neonGreen} strokeWidth="3"
                  style={{ filter: `url(#glowLine)`, transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
                  strokeLinejoin="round"
                />

                {/* Data Points and X-Axis Labels */}
                {barData.map((d, i) => {
                  const x = (i / (barData.length - 1)) * 400;
                  const val = d.habits + d.tasks;
                  const y = 200 - (val / maxBar) * 160;

                  return (
                    <g key={i}>
                      {i === barData.length - 1 && (
                        <>
                          <circle cx={x} cy={y} r="4" fill="#000" stroke={colors.neonGreen} strokeWidth="2.5" />

                          {/* Price Tooltip Tag */}
                          <rect x={x - 45} y={y - 12} width="35" height="24" rx="4" fill={colors.neonGreen} />
                          <polygon points={`${x - 10},${y} ${x - 5},${y - 4} ${x - 10},${y - 8}`} fill={colors.neonGreen} />
                          <text x={x - 27} y={y + 4} textAnchor="middle" fill="#000" fontSize="11" className="font-mono" fontWeight="900">{val}</text>
                        </>
                      )}

                      {/* X Axis Labels */}
                      <text x={x} y={225} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11" className="font-mono" fontWeight="700">{d.label}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="liquid-glass" style={{ flex: 1, padding: '30px 35px' }}>
            <div className="font-ui" style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.3em', textTransform: 'uppercase', color: colors.neonGreen, marginBottom: 30, textShadow: `0 0 15px ${colors.neonGreen}` }}>TIME DISTRIBUTION</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {timeGauges.map(g => {
                const r = 40;
                const circ = 2 * Math.PI * r;
                const dash = (g.value / 100) * circ;
                return (
                  <div key={g.label} className="liquid-glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', borderRadius: 20 }}>
                    <svg width="90" height="90" viewBox="0 0 90 90" style={{ filter: `drop-shadow(0 0 8px ${g.color}60)` }}>
                      <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <circle cx="45" cy="45" r={r} fill="none" stroke={g.color} strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${dash} ${circ}`}
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '45px 45px', transition: 'stroke-dasharray 1.2s cubic-bezier(.16,1,.3,1)' }}
                      />
                      <text x="45" y="51" textAnchor="middle" className="font-mono" fontSize="20" fontWeight="900" fill="#fff">{g.value}%</text>
                    </svg>
                    <div className="font-ui" style={{ marginTop: 12, fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: g.color, textTransform: 'uppercase' }}>{g.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

export default Analytics;
