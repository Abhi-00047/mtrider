'use client';
import { useState } from 'react';
import { useStore, SKINS } from '@/store/useStore';
import Topbar from './Topbar';

const CATEGORIES = ['All', 'Nutrition', 'Fitness', 'Sleep', 'Mental', 'Rider Health', 'Recovery'] as const;

export default function Health() {
  const { savedTips, toggleSavedTip, activeSkin } = useStore();
  const skin = SKINS[activeSkin] || SKINS[0];
  const [filter, setFilter] = useState<typeof CATEGORIES[number]>('All');

  const TIPS = [
    { id: 1, cat: 'Nutrition', icon: '🥗', title: 'Protein Timing Matters', desc: 'Consume 20-40g protein within 2 hours post-workout to maximize muscle synthesis and recovery.', color: '#3ddc84' },
    { id: 2, cat: 'Fitness', icon: '💪', title: 'Progressive Overload', desc: 'Increase weight, reps, or sets by 5-10% each week. Consistency beats intensity.', color: skin.accent },
    { id: 3, cat: 'Sleep', icon: '🌙', title: '90-Minute Sleep Cycles', desc: 'Sleep in multiples of 90 minutes (6h, 7.5h, 9h) to wake during light sleep and feel refreshed.', color: '#9b6dff' },
    { id: 4, cat: 'Mental', icon: '🧠', title: 'Box Breathing Technique', desc: 'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Resets your nervous system in 2 minutes.', color: '#ff6b35' },
    { id: 5, cat: 'Rider Health', icon: '🏍️', title: 'Eye Fatigue Prevention', desc: 'Follow the 20-20-20 rule while riding. Every 20 mins, focus 20 feet away for 20 seconds.', color: '#d4a843' },
    { id: 6, cat: 'Recovery', icon: '🧊', title: 'Cold Water Immersion', desc: '2-3 minutes of cold exposure reduces inflammation and boosts dopamine by up to 250%.', color: skin.accent },
    { id: 7, cat: 'Nutrition', icon: '💧', title: 'Hydration Formula', desc: 'Drink 35ml per kg of body weight daily. Add electrolytes on ride days for better endurance.', color: '#3ddc84' },
    { id: 8, cat: 'Fitness', icon: '🔥', title: 'Zone 2 Cardio Benefits', desc: '150 mins/week of low-intensity cardio improves mitochondrial density and fat oxidation.', color: skin.accent },
    { id: 9, cat: 'Sleep', icon: '📱', title: 'Blue Light Cutoff', desc: 'Stop screens 1 hour before bed. Blue light suppresses melatonin by up to 50%.', color: '#9b6dff' },
    { id: 10, cat: 'Mental', icon: '📓', title: 'Gratitude Journaling', desc: 'Write 3 things you\'re grateful for each night. Studies show it increases happiness by 25%.', color: '#ff6b35' },
    { id: 11, cat: 'Rider Health', icon: '🦴', title: 'Posture on the Bike', desc: 'Keep wrists neutral and grip light. Death-gripping the bars causes wrist and forearm fatigue.', color: '#d4a843' },
    { id: 12, cat: 'Recovery', icon: '🧘', title: 'Active Recovery Days', desc: 'Light yoga or 20-min walks on rest days boost blood flow and reduce DOMS by up to 40%.', color: skin.accent },
  ];
  const [flipped, setFlipped] = useState(false);

  const spotlight = TIPS[0]; // "Tip of the day"
  const filtered = filter === 'All' ? TIPS : TIPS.filter(t => t.cat === filter);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', background: 'transparent' }}>
      <style>{`
        @keyframes healthIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .tip-card:hover{transform:translateY(-3px)!important;box-shadow:0 8px 24px rgba(0,0,0,.4)!important}
        .cat-chip:hover{background:rgba(255,255,255,.06)!important}
        .flip-container{perspective:800px;cursor:pointer}
        .flip-inner{position:relative;width:100%;height:100%;transition:transform .7s cubic-bezier(0.22, 1, 0.36, 1);transform-style:preserve-3d}
        .flip-inner.flipped{transform:rotateY(180deg)}
        .flip-front,.flip-back{position:absolute;inset:0;backface-visibility:hidden;border-radius:16px;overflow:hidden}
        .flip-back{transform:rotateY(180deg)}
      `}</style>

      <div style={{ position: 'relative', zIndex: 50 }}>
        <Topbar title="HEALTH" />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Spotlight — Tip of the Day with 3D flip */}
        <div style={{ animation: 'healthIn .5s ease both' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 10 }}>Tip of the Day</div>
          <div
            className="flip-container"
            onClick={() => setFlipped(!flipped)}
            style={{ height: 140 }}
          >
            <div className={`flip-inner${flipped ? ' flipped' : ''}`}>
              {/* Front */}
              <div className="flip-front" style={{
                background: `linear-gradient(135deg, ${spotlight.color}15, ${spotlight.color}08)`,
                border: `.5px solid ${spotlight.color}30`,
                padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 22,
              }}>
                <div style={{ fontSize: 48, flexShrink: 0 }}>{spotlight.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--chrome-hi)', marginBottom: 6 }}>{spotlight.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.6 }}>{spotlight.desc}</div>
                </div>
                <div style={{ position: 'absolute', top: 14, right: 18, fontSize: 9, color: 'var(--dim)', fontFamily: 'var(--font-ui)' }}>TAP TO FLIP →</div>
              </div>
              {/* Back */}
              <div className="flip-back" style={{
                background: 'rgba(255,255,255,.03)', border: '.5px solid var(--border)',
                padding: '22px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              }}>
                <div style={{ fontSize: 13, color: 'var(--dim)', lineHeight: 1.8, textAlign: 'center', maxWidth: 400 }}>
                  <strong style={{ color: 'var(--chrome-hi)' }}>Why it works:</strong> Post-exercise, your muscles enter an anabolic window where protein utilization increases by ~30%. Leucine-rich foods (eggs, whey, chicken) trigger mTOR signalling most effectively.
                </div>
                <div style={{ marginTop: 12, fontSize: 9, color: 'var(--dim)', fontFamily: 'var(--font-ui)' }}>TAP TO FLIP BACK ←</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', animation: 'healthIn .5s cubic-bezier(0.22, 1, 0.36, 1) .05s both' }}>
          {CATEGORIES.map(cat => (
            <div
              key={cat}
              className="cat-chip"
              onClick={() => setFilter(cat)}
              style={{
                padding: '10px 18px', borderRadius: 12, fontSize: 12,
                fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: 'pointer',
                background: filter === cat ? `${skin.accent}15` : 'rgba(255,255,255,.03)',
                color: filter === cat ? skin.accent : 'var(--dim)',
                border: `.5px solid ${filter === cat ? `${skin.accent}40` : 'var(--border)'}`,
                transition: 'all .2s',
              }}
            >{cat}</div>
          ))}
        </div>

        {/* Tip grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, animation: 'healthIn .5s cubic-bezier(0.22, 1, 0.36, 1) .1s both' }}>
          {filtered.map(tip => {
            const saved = savedTips.includes(tip.id);
            return (
              <div
                key={tip.id}
                className="tip-card"
                style={{
                  background: 'rgba(255,255,255,.025)', border: '.5px solid var(--border)',
                  borderRadius: 13, padding: '16px 18px', position: 'relative', overflow: 'hidden',
                  transition: 'all .25s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {/* Top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, background: tip.color, opacity: .45 }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 24 }}>{tip.icon}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--chrome-hi)' }}>{tip.title}</div>
                      <div style={{
                        fontSize: 9, padding: '2px 7px', borderRadius: 5, display: 'inline-block',
                        background: `${tip.color}15`, color: tip.color, marginTop: 3,
                        fontFamily: 'var(--font-ui)', fontWeight: 600,
                        border: `.5px solid ${tip.color}25`,
                      }}>{tip.cat}</div>
                    </div>
                  </div>

                  {/* Save heart */}
                  <div
                    onClick={() => toggleSavedTip(tip.id)}
                    style={{ cursor: 'pointer', fontSize: 18, transition: 'transform .2s', transform: saved ? 'scale(1.1)' : 'scale(1)' }}
                  >
                    {saved ? '❤️' : '🤍'}
                  </div>
                </div>

                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.6 }}>{tip.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Saved tips section */}
        {savedTips.length > 0 && (
          <div style={{ animation: 'healthIn .4s ease both' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 10 }}>
              ❤️ Saved Tips ({savedTips.length})
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TIPS.filter(t => savedTips.includes(t.id)).map(t => (
                <div key={t.id} style={{
                  padding: '8px 14px', borderRadius: 10,
                  background: 'rgba(255,107,157,.05)', border: '.5px solid rgba(255,107,157,.2)',
                  fontSize: 12, color: 'var(--chrome)', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span>{t.icon}</span> {t.title}
                  <span onClick={() => toggleSavedTip(t.id)} style={{ cursor: 'pointer', marginLeft: 4, fontSize: 10, opacity: .5 }}>✕</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
