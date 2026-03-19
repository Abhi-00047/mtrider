'use client';
import { useStore, SKINS } from '@/store/useStore';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState, useCallback } from 'react';
import SplashScreen from '@/components/SplashScreen';

const Habits = dynamic(() => import('@/components/Habits'));
const Tasks = dynamic(() => import('@/components/Tasks'));
const Streak = dynamic(() => import('@/components/Streak'));
const GearUp = dynamic(() => import('@/components/GearUp'));
const Analytics = dynamic(() => import('@/components/Analytics'));
const Health = dynamic(() => import('@/components/Health'));
const Settings = dynamic(() => import('@/components/Settings'));

const LoadingFallback = () => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
    <div style={{ width: 40, height: 40, border: '2px solid rgba(0, 243, 255, 0.1)', borderTopColor: '#00f3ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
  </div>
);

export default function Home() {
  const { screen, activeSkin } = useStore();
  const skin = SKINS[activeSkin] || SKINS[0];
  const checkDailyReset = useStore(s => s.checkDailyReset);
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  // Auto-reset habits at midnight / on fresh app load
  useEffect(() => {
    checkDailyReset();
  }, [checkDailyReset]);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }
  
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#050508', position: 'relative' }}>
      <style>{`
        @keyframes globalGrid { 0% { transform: translateY(0); } 100% { transform: translateY(40px); } }
        @keyframes globalHolo { 0%, 100% { opacity: 0.15; filter: blur(70px); } 50% { opacity: 0.35; filter: blur(100px); } }
        @keyframes noiseShift { 0% { transform: translate(0,0) } 10% { transform: translate(-5%,-5%) } 20% { transform: translate(-10%,5%) } 30% { transform: translate(5%,-10%) } 40% { transform: translate(-5%,15%) } 50% { transform: translate(-10%,5%) } 60% { transform: translate(15%,0) } 70% { transform: translate(0,15%) } 80% { transform: translate(3%,35%) } 90% { transform: translate(-10%,10%) } 100% { transform: translate(0,0) } }
        * { letter-spacing: 0.03em; } /* Luxury Tracking */
      `}</style>
      
      {/* Matte Noise Texture Overlay */}
      <div style={{ position: 'fixed', inset: -200, zIndex: 9999, pointerEvents: 'none', background: 'transparent', opacity: 0.04 }}>
         <svg width="100%" height="100%">
            <filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
         </svg>
      </div>

      {/* Global Cyber Grid */}
      <div style={{ position: 'absolute', inset: -50, top: '40%', perspective: '1000px', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'rotateX(75deg) translateY(-100px) translateZ(-200px)',
          animation: 'globalGrid 6s linear infinite',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1), transparent)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), transparent)'
        }} />
      </div>

      {/* Global Holographic Orbs */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: `radial-gradient(circle, ${skin.glow} 0%, transparent 60%)`, mixBlendMode: 'screen', animation: 'globalHolo 12s ease-in-out infinite alternate', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '50%', right: '-20%', width: '70vw', height: '70vw', borderRadius: '50%', background: `radial-gradient(circle, ${skin.accent} 0%, transparent 60%)`, mixBlendMode: 'screen', animation: 'globalHolo 15s ease-in-out infinite alternate-reverse', pointerEvents: 'none', zIndex: 0 }} />

      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Suspense fallback={<LoadingFallback />}>
          <div className="page-transition" key={screen} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {screen === 'dashboard' && <Dashboard />}
            {screen === 'habits' && <Habits />}
            {screen === 'tasks' && <Tasks />}
            {screen === 'streak' && <Streak />}
            {screen === 'gearup' && <GearUp />}
            {screen === 'analytics' && <Analytics />}
            {screen === 'health' && <Health />}
            {screen === 'settings' && <Settings />}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
