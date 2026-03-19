'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const PUNCHY_LINES = [
  'NO DAYS OFF.',
  'BUILT DIFFERENT.',
  'OUTWORK EVERYONE.',
];

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'logo' | 'rev' | 'lines' | 'exit'>('logo');
  const [lineIndex, setLineIndex] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    // Phase 1: Logo slice in (0–1.8s)
    const t1 = setTimeout(() => {
      setShowFlash(true);
      setPhase('rev');
    }, 1800);
    // Kill flash after 400ms
    const tFlash = setTimeout(() => setShowFlash(false), 2200);
    // Phase 2: Lines begin (3s)
    const t2 = setTimeout(() => setPhase('lines'), 3000);
    // Cycle punchy lines
    const t3 = setTimeout(() => setLineIndex(1), 3800);
    const t4 = setTimeout(() => setLineIndex(2), 4600);
    // Phase 3: Exit (5.4s)
    const t5 = setTimeout(() => setPhase('exit'), 5400);
    const t6 = setTimeout(() => onComplete(), 6200);
    return () => { clearTimeout(t1); clearTimeout(tFlash); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#030305',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: phase === 'exit' ? 0 : 1,
      transition: 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes logoSlice {
          0%   { clip-path: inset(50% 0 50% 0); opacity: 0; }
          50%  { clip-path: inset(0 0 0 0); opacity: 1; }
          100% { clip-path: inset(0 0 0 0); opacity: 1; }
        }
        @keyframes subtitleFade {
          0%   { opacity: 0; transform: translateY(10px); letter-spacing: 16px; }
          100% { opacity: 1; transform: translateY(0); letter-spacing: 8px; }
        }
        @keyframes lineExpand {
          0%   { width: 0; opacity: 0; }
          100% { width: 100px; opacity: 0.6; }
        }
        @keyframes revPulse {
          0%   { transform: scale(1); text-shadow: 0 0 0 transparent; }
          25%  { transform: scale(1.15); text-shadow: 0 0 80px rgba(0,212,255,0.9), 0 0 160px rgba(0,212,255,0.4); }
          50%  { transform: scale(0.95); }
          100% { transform: scale(1); text-shadow: 0 0 30px rgba(0,212,255,0.4); }
        }
        @keyframes gridReveal {
          0%   { opacity: 0; transform: rotateX(80deg) translateY(200px); }
          100% { opacity: 0.15; transform: rotateX(75deg) translateY(0); }
        }
        @keyframes orbGlow {
          0%   { opacity: 0; transform: scale(0.5); }
          100% { opacity: 0.25; transform: scale(1); }
        }
        @keyframes tagReveal {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 0.4; transform: translateY(0); }
        }
        @keyframes lightningFlash {
          0%   { opacity: 0; }
          8%   { opacity: 1; }
          15%  { opacity: 0.15; }
          22%  { opacity: 0.8; }
          35%  { opacity: 0.1; }
          50%  { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes boltAppear {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          15%  { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          50%  { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes punchSlam {
          0%   { opacity: 0; transform: translateY(20px) scale(0.85); }
          30%  { opacity: 1; transform: translateY(-2px) scale(1.03); }
          50%  { transform: translateY(0) scale(1); }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(0) scale(1); }
        }
        @keyframes screenShake {
          0%, 100% { transform: translate(0,0); }
          12% { transform: translate(-4px, 3px); }
          25% { transform: translate(5px, -2px); }
          37% { transform: translate(-3px, -4px); }
          50% { transform: translate(4px, 2px); }
          62% { transform: translate(-2px, 3px); }
          75% { transform: translate(3px, -1px); }
        }
      `}</style>

      {/* ⚡ FULL SCREEN LIGHTNING FLASH */}
      {showFlash && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          background: 'radial-gradient(ellipse at 50% 45%, rgba(200,230,255,0.95), rgba(0,180,255,0.3) 50%, transparent 80%)',
          animation: 'lightningFlash 0.4s ease-out both',
          pointerEvents: 'none',
        }} />
      )}

      {/* ⚡ REAL LIGHTNING BOLT IMAGE */}
      {showFlash && (
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: '80vw', height: '90vh',
          maxWidth: 700, maxHeight: 900,
          zIndex: 99, pointerEvents: 'none',
          animation: 'boltAppear 0.4s ease-out both',
          mixBlendMode: 'screen',
        }}>
          <Image
            src="/lightning.png"
            alt="Lightning"
            fill
            sizes="80vw"
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      )}

      {/* Perspective grid */}
      <div style={{
        position: 'absolute', inset: -50, top: '55%',
        perspective: '800px', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.06) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridReveal 2s cubic-bezier(0.22,1,0.36,1) 0.3s both',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
        }} />
      </div>

      {/* Orb glow */}
      <div style={{
        position: 'absolute', width: '55vw', height: '55vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.15), transparent 60%)',
        animation: 'orbGlow 2.5s ease-out 0.4s both',
        pointerEvents: 'none',
      }} />

      {/* Main content — shakes on lightning */}
      <div style={{
        position: 'relative', textAlign: 'center', zIndex: 10,
        animation: showFlash ? 'screenShake 0.2s ease-out both' : 'none',
      }}>
        {/* MT */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(90px, 16vw, 160px)',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '16px',
          lineHeight: 1,
          animation: phase === 'rev' || phase === 'lines'
            ? 'logoSlice 1.2s ease-out both, revPulse 0.6s ease-out 0.05s both'
            : 'logoSlice 1.2s ease-out both',
        }}>
          MT
        </div>

        {/* Accent line */}
        <div style={{
          height: '2px', margin: '16px auto 18px',
          background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
          animation: 'lineExpand 0.8s cubic-bezier(0.22,1,0.36,1) 0.8s both',
        }} />

        {/* RIDER */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(18px, 3vw, 24px)',
          fontWeight: 700,
          color: '#00d4ff',
          animation: 'subtitleFade 1s cubic-bezier(0.22,1,0.36,1) 1s both',
        }}>
          RIDER
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.35)',
          marginTop: 24,
          letterSpacing: '3.5px',
          textTransform: 'uppercase',
          animation: 'tagReveal 0.8s ease-out 2s both',
        }}>
          Discipline on two wheels
        </div>

        {/* 🔥 PUNCHY LINES — no blur, sharp slam */}
        {phase === 'lines' && (
          <div style={{
            marginTop: 40, height: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div
              key={lineIndex}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(22px, 4vw, 36px)',
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '6px',
                textTransform: 'uppercase',
                textShadow: '0 0 20px rgba(0,212,255,0.4)',
                animation: 'punchSlam 0.7s cubic-bezier(0.22,1,0.36,1) both',
              }}
            >
              {PUNCHY_LINES[lineIndex]}
            </div>
          </div>
        )}
      </div>

      {/* Bottom version badge */}
      <div style={{
        position: 'absolute', bottom: 32,
        fontFamily: 'var(--font-mono)',
        fontSize: 10, fontWeight: 600, letterSpacing: '2px',
        color: 'rgba(255,255,255,0.12)',
      }}>
        v1.0 — PRE-RELEASE
      </div>
    </div>
  );
}
