'use client';
import { useMemo, memo, useState, useEffect } from 'react';
import { useStore, SKINS } from '@/store/useStore';
import Topbar from './Topbar';

const Streak = memo(function Streak() {
  const { streak, bestStreak, setStreak, activeSkin } = useStore();
  const skin = SKINS[activeSkin] || SKINS[0];


  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Generate 6 months of mock heatmap data (deterministic for purity)
  const heatmapData = useMemo(() => {
    if (!mounted) return [];
    const days: { date: string; xp: number; level: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time
    for (let i = 179; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];

      // Pure mock logic based on index and current streak
      let xpVal = 0;
      if (i < streak) {
        // High XP for days within current streak
        xpVal = 250 + (i % 150);
      } else {
        // Deterministic sparse activity for past days
        const hash = (i * 1234567) % 100;
        if (hash > 60) {
          xpVal = 100 + (hash * 2);
        }
      }

      const lvl = xpVal === 0 ? 0 : xpVal < 150 ? 1 : xpVal < 300 ? 2 : xpVal < 450 ? 3 : 4;
      days.push({ date: dayStr, xp: xpVal, level: lvl });
    }
    return days;
  }, [streak, mounted]);

  // Weekly XP chart data (last 7 days)
  const weeklyData = useMemo(() => {
    if (!heatmapData.length) return Array(7).fill({ label: '', xp: 0 });
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels.map((label, i) => ({
      label,
      xp: heatmapData[heatmapData.length - 7 + i]?.xp || 0,
    }));
  }, [heatmapData]);

  const maxWeekXp = Math.max(...weeklyData.map(d => d.xp), 1);

  // Organize heatmap into weeks (7 rows, n columns)
  const weeks = useMemo(() => {
    if (!heatmapData.length) return [];
    const w: typeof heatmapData[0][][] = [];
    let col: typeof heatmapData[0][] = [];
    // Find what day of week the first date is
    const firstDate = new Date(heatmapData[0].date);
    const startDow = firstDate.getDay(); // 0=Sun, 1=Mon... we want Mon=0
    const adjusted = (startDow + 6) % 7; // shift so Mon=0
    // Pad beginning
    for (let i = 0; i < adjusted; i++) col.push({ date: '', xp: 0, level: -1 });
    for (const day of heatmapData) {
      col.push(day);
      if (col.length === 7) { w.push(col); col = []; }
    }
    if (col.length) { while (col.length < 7) col.push({ date: '', xp: 0, level: -1 }); w.push(col); }
    return w;
  }, [heatmapData]);

  const heatColors = ['rgba(255,255,255,.04)', '#0e4429', '#006d32', '#26a641', '#39d353'];

  const milestones = [
    { days: 7, label: '1 Week', icon: '⚡' },
    { days: 14, label: '2 Weeks', icon: '💪' },
    { days: 30, label: '1 Month', icon: '🔥' },
    { days: 100, label: '100 Days', icon: '👑' },
  ];

  const simulateDay = () => {
    setStreak(streak + 1);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', background: 'transparent' }}>
      <style>{`
        @keyframes streakIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .heat-cell:hover{outline:1.5px solid rgba(255,255,255,.4);outline-offset:-1px;z-index:2}
        .milestone-card:hover{transform:translateY(-3px)!important;box-shadow:0 8px 24px rgba(0,0,0,.5)!important}
      `}</style>

      <div style={{ position: 'relative', zIndex: 50 }}>
        <Topbar title="STREAK" />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Top stats row */}
        <div style={{ display: 'flex', gap: 14, animation: 'streakIn .5s ease both' }}>
          {/* Current streak */}
          <div className="liquid-glass" style={{
            flex: 1, border: '1px solid rgba(255,107,53,.2)',
            padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20,
            boxShadow: '0 0 20px rgba(255,107,53,.1), inset 0 0 10px rgba(255,107,53,.05)'
          }}>
            <div style={{ fontSize: 40, animation: 'flamePulse 1.8s ease-in-out infinite' }}>🔥</div>
            <div>
              <div className="font-display" style={{ fontSize: 44, fontWeight: 900, color: '#ff6b35', lineHeight: 1, textShadow: '0 0 15px rgba(255,107,53,.4)' }}>{streak}</div>
              <div className="font-ui" style={{ fontSize: 11, fontWeight: 700, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '.15em', marginTop: 4 }}>Current Streak</div>
            </div>
          </div>

          {/* Best streak */}
          <div className="liquid-glass" style={{
            flex: 1, border: '1px solid rgba(212,168,67,.2)',
            padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20,
            boxShadow: '0 0 20px rgba(212,168,67,.1), inset 0 0 10px rgba(212,168,67,.05)'
          }}>
            <div style={{ fontSize: 34 }}>🏆</div>
            <div>
              <div className="font-display" style={{ fontSize: 44, fontWeight: 900, color: '#d4a843', lineHeight: 1, textShadow: '0 0 15px rgba(212,168,67,.4)' }}>{bestStreak}</div>
              <div className="font-ui" style={{ fontSize: 11, fontWeight: 700, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '.15em', marginTop: 4 }}>Best Streak</div>
            </div>
          </div>

          {/* Simulate day */}
          <div
            onClick={simulateDay}
            className="liquid-glass hoverable"
            style={{
              width: 160, border: `1px solid ${skin.accent}40`,
              padding: '24px 28px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 12,
              cursor: 'pointer',
              boxShadow: `0 0 15px ${skin.accent}15, inset 0 0 10px ${skin.accent}10`
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={skin.accent} strokeWidth="2.5"><polyline points="13,2 13,9 20,9" /><path d="M13 2L20 9 20 22 4 22 4 2z" /></svg>
            <div className="font-ui" style={{ fontSize: 11, fontWeight: 800, color: skin.accent, textAlign: 'center', letterSpacing: '0.05em' }}>SIMULATE DAY</div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="liquid-glass" style={{ padding: '32px 40px', animation: 'streakIn .6s ease .1s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="font-ui" style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>6-Month Activity</div>
            <div className="font-ui" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 600, color: 'var(--dim)' }}>
              <span>LESS</span>
              {heatColors.map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
              ))}
              <span>MORE</span>
            </div>
          </div>

          {/* Heatmap grid */}
          <div style={{ display: 'flex', gap: 2, overflowX: 'auto', paddingBottom: 4 }}>
            {/* Day labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginRight: 4, justifyContent: 'center' }}>
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
                <div key={i} style={{ height: 11, fontSize: 8, color: 'var(--dim)', display: 'flex', alignItems: 'center', fontFamily: 'var(--font-ui)' }}>{d}</div>
              ))}
            </div>
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {week.map((day, di) => (
                  <div
                    key={di}
                    className={day.level >= 0 ? 'heat-cell' : ''}
                    title={day.date ? `${day.date}: ${day.xp} XP` : ''}
                    style={{
                      width: 11, height: 11, borderRadius: 2,
                      background: day.level < 0 ? 'transparent' : heatColors[day.level],
                      transition: 'all .15s', cursor: day.level >= 0 ? 'pointer' : 'default',
                      position: 'relative',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          {/* Milestones */}
          <div className="liquid-glass" style={{ flex: 1, padding: '32px 40px', animation: 'streakIn .6s ease .2s both' }}>
            <div className="font-ui" style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>Milestones</div>
            <div style={{ display: 'flex', gap: 16 }}>
              {milestones.map(m => {
                const unlocked = streak >= m.days || bestStreak >= m.days;
                return (
                  <div
                    key={m.days}
                    className="liquid-glass hoverable"
                    style={{
                      flex: 1, padding: '20px 16px', textAlign: 'center',
                      borderColor: unlocked ? 'rgba(212,168,67,.4)' : 'rgba(255,255,255,.05)',
                      boxShadow: unlocked ? '0 0 20px rgba(212,168,67,.15), inset 0 0 10px rgba(212,168,67,.1)' : 'none',
                      opacity: unlocked ? 1 : 0.45,
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 12, filter: unlocked ? 'drop-shadow(0 0 10px rgba(212,168,67,.4))' : 'grayscale(1)' }}>{m.icon}</div>
                    <div className="font-display" style={{ fontSize: 22, fontWeight: 900, color: unlocked ? '#d4a843' : 'var(--dim)', lineHeight: 1 }}>{m.days}</div>
                    <div className="font-ui" style={{ fontSize: 10, color: unlocked ? '#fff' : 'var(--dim)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 700 }}>{m.label}</div>
                    {unlocked && <div className="font-ui" style={{ fontSize: 9, color: 'var(--green)', marginTop: 8, fontWeight: 800, letterSpacing: '0.05em' }}>UNLOCKED</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly chart */}
          <div className="liquid-glass" style={{ width: 340, flexShrink: 0, padding: '32px 40px', animation: 'streakIn .6s ease .3s both' }}>
            <div className="font-ui" style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>This Week</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 110 }}>
              {weeklyData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: d.xp > 0 ? 'var(--green)' : 'var(--dim)' }}>{d.xp > 0 ? d.xp : ''}</div>
                  <div style={{
                    width: '100%', borderRadius: 6, transition: 'height .8s cubic-bezier(0.22, 1, 0.36, 1)',
                    height: `${Math.max(6, (d.xp / maxWeekXp) * 80)}px`,
                    background: d.xp > 0 ? 'linear-gradient(to top, rgba(61,220,132,.3), rgba(61,220,132,.8))' : 'rgba(255,255,255,.05)',
                    boxShadow: d.xp > 0 ? '0 0 10px rgba(61,220,132,.3)' : 'none'
                  }} />
                  <div className="font-ui" style={{ fontSize: 10, color: 'var(--dim)', fontWeight: 700 }}>{d.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Streak;
