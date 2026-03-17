'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import Topbar from './Topbar';

export default function Dashboard() {
  const { streak, habits, xp, setScreen, tgLinked, setTgLinked, setProfileOpen } = useStore();
  const bikeRef = useRef<HTMLDivElement>(null);
  const [showTgModal, setShowTgModal] = useState(false);
  const [tgCode] = useState('MTR-' + Math.random().toString(36).substring(2, 8).toUpperCase());
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

  const simulateLink = () => {
    setLinking(true);
    window.open(`https://t.me/MTRiderBot?start=${tgCode}`, '_blank');
    setTimeout(() => { setLinking(false); setTgLinked(true); setShowTgModal(false); }, 3000);
  };

  const stats = [
    { label: 'Habits', value: `${doneHabits}/7`, color: '#4a9eff', width: `${Math.round(doneHabits/7*100)}%`, onClick: () => setScreen('habits') },
    { label: 'XP Today', value: `${xp-2340}`, color: '#d4a843', width: '43%', onClick: () => setScreen('analytics') },
    { label: 'Streak', value: `${streak}d`, color: '#ff6b35', width: '80%', onClick: () => setScreen('streak') },
    { label: 'Level', value: 'Lv.8', color: '#9b6dff', width: '68%', onClick: () => setScreen('garage') },
  ];

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
      `}</style>

      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',position:'relative'}} onClick={()=>setProfileOpen(false)}>
        <Topbar />

        {/* FULL SCREEN HERO */}
        <div style={{flex:1,position:'relative',overflow:'hidden',background:'#020208'}}>

          {/* BIKE — full bleed */}
          <div ref={bikeRef} style={{position:'absolute',right:0,top:0,bottom:0,width:'80%',willChange:'transform',animation:'bikeReveal 1.3s cubic-bezier(.16,1,.3,1) .1s both'}}>
            <Image
              src="/bike.webp"
              alt="Yamaha MT-15"
              fill priority
              sizes="80vw"
              style={{objectFit:'cover',objectPosition:'center 50%',filter:'brightness(0.52) contrast(1.25) saturate(0.65)'}}
            />
            {/* Left deep fade */}
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,#020208 0%,#020208 8%,rgba(2,2,8,.94) 20%,rgba(2,2,8,.65) 38%,rgba(2,2,8,.15) 62%,transparent 100%)'}}/>
            {/* Top fade */}
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,#020208 0%,transparent 14%,transparent 82%,#020208 100%)'}}/>
            {/* Right edge */}
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to left,rgba(2,2,8,.6) 0%,transparent 18%)'}}/>
            {/* Ground */}
            <div style={{position:'absolute',bottom:0,left:0,right:0,height:'28%',background:'linear-gradient(to top,#020208 0%,rgba(2,2,8,.75) 45%,transparent 100%)'}}/>
            {/* Headlight glow */}
            <div style={{position:'absolute',top:'22%',right:'26%',width:340,height:300,background:'radial-gradient(ellipse,rgba(74,158,255,.22) 0%,rgba(74,158,255,.07) 40%,transparent 70%)',filter:'blur(28px)',animation:'glowPulse 3.5s ease-in-out infinite',pointerEvents:'none'}}/>
          </div>

          {/* Wide atmospheric overlay */}
          <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'linear-gradient(to right,rgba(2,2,8,1) 0%,rgba(2,2,8,.99) 18%,rgba(2,2,8,.88) 32%,rgba(2,2,8,.35) 52%,transparent 72%)'}}/>
          {/* Subtle blue atmosphere top-right */}
          <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'radial-gradient(ellipse at 80% 30%,rgba(74,158,255,.06) 0%,transparent 45%)'}}/>
          {/* Scanlines */}
          <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:2,backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.025) 2px,rgba(0,0,0,.025) 4px)'}}/>

          {/* HERO TEXT */}
          <div style={{position:'absolute',left:0,top:0,bottom:0,display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 48px',maxWidth:500,zIndex:5}}>
            {/* Tag line */}
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:22,animation:'textReveal .8s cubic-bezier(.16,1,.3,1) .3s both'}}>
              <div style={{width:28,height:1.5,background:'var(--blue)',opacity:.6}}/>
              <span style={{fontFamily:'var(--font-ui)',fontSize:11,fontWeight:600,letterSpacing:'.26em',textTransform:'uppercase',color:'var(--blue)',opacity:.85}}>Daily Command Center</span>
            </div>

            {/* Title */}
            <div style={{fontFamily:'var(--font-display)',fontSize:'clamp(34px,3.4vw,56px)',fontWeight:900,color:'rgba(245,245,245,.95)',lineHeight:1.0,letterSpacing:'-.02em',marginBottom:6,animation:'textReveal .9s cubic-bezier(.16,1,.3,1) .4s both'}}>
              RIDE YOUR
            </div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'clamp(34px,3.4vw,56px)',fontWeight:900,background:'linear-gradient(135deg,#4a9eff 0%,#89c8ff 55%,#4a9eff 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',lineHeight:1.0,letterSpacing:'-.02em',marginBottom:24,animation:'textReveal .9s cubic-bezier(.16,1,.3,1) .5s both'}}>
              DISCIPLINE
            </div>

            {/* Accent line */}
            <div style={{width:52,height:2,background:'linear-gradient(90deg,var(--blue),transparent)',marginBottom:18,animation:'textReveal .8s cubic-bezier(.16,1,.3,1) .55s both'}}/>

            {/* Subtitle */}
            <div style={{fontSize:13.5,color:'rgba(255,255,255,.36)',lineHeight:1.78,marginBottom:34,animation:'textReveal .8s cubic-bezier(.16,1,.3,1) .6s both'}}>
              Every habit locked. Every task crushed.<br/>Your MT-15 earns its mods.
            </div>

            {/* Chips */}
            <div style={{display:'flex',gap:10,animation:'textReveal .8s cubic-bezier(.16,1,.3,1) .7s both'}}>
              {[
                {v:`${streak}`,l:'Day streak',c:'#ff6b35',bg:'rgba(255,107,53,.08)',bc:'rgba(255,107,53,.22)',fn:()=>setScreen('streak')},
                {v:`${doneHabits}/7`,l:'Habits',c:'#4a9eff',bg:'rgba(74,158,255,.08)',bc:'rgba(74,158,255,.22)',fn:()=>setScreen('habits')},
                {v:'Lv.8',l:'Rank',c:'#d4a843',bg:'rgba(212,168,67,.08)',bc:'rgba(212,168,67,.22)',fn:()=>setScreen('garage')},
              ].map(chip=>(
                <div key={chip.l} className="stat-chip" onClick={chip.fn} style={{padding:'10px 16px',background:chip.bg,border:`.5px solid ${chip.bc}`,borderRadius:10,cursor:'pointer',flex:1,textAlign:'center',transition:'all .25s cubic-bezier(.16,1,.3,1)',backdropFilter:'blur(10px)'}}>
                  <div style={{fontFamily:'var(--font-display)',fontSize:17,fontWeight:700,color:chip.c,lineHeight:1.2}}>{chip.v}</div>
                  <div style={{fontSize:9,color:'rgba(255,255,255,.32)',letterSpacing:'.1em',textTransform:'uppercase',marginTop:4}}>{chip.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Corner watermark */}
          <div style={{position:'absolute',bottom:18,right:22,zIndex:5,fontFamily:'var(--font-display)',fontSize:10,fontWeight:700,color:'rgba(255,255,255,.1)',letterSpacing:'.3em'}}>YAMAHA MT-15</div>
        </div>

        {/* BOTTOM STATS BAR */}
        <div style={{height:112,borderTop:'.5px solid rgba(255,255,255,.05)',padding:'10px 16px',display:'flex',gap:8,flexShrink:0,background:'rgba(2,2,8,.95)',backdropFilter:'blur(20px)',animation:'statsReveal .7s cubic-bezier(.16,1,.3,1) .9s both'}}>
          {stats.map((s,i)=>(
            <div key={s.label} className="stat-card" onClick={s.onClick} style={{flex:1,background:'rgba(255,255,255,.025)',border:'.5px solid rgba(255,255,255,.055)',borderRadius:12,padding:'10px 14px',display:'flex',flexDirection:'column',justifyContent:'space-between',cursor:'pointer',position:'relative',overflow:'hidden',transition:'all .25s cubic-bezier(.16,1,.3,1)'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:1.5,background:s.color,opacity:.55}}/>
              <div style={{fontSize:10,color:'rgba(255,255,255,.28)',letterSpacing:'.06em',textTransform:'uppercase'}}>{s.label}</div>
              <div>
                <div style={{fontFamily:'var(--font-display)',fontSize:21,fontWeight:800,color:s.color,lineHeight:1}}>{s.value}</div>
                <div style={{height:2,background:'rgba(255,255,255,.04)',borderRadius:2,overflow:'hidden',marginTop:6}}>
                  <div style={{height:'100%',width:s.width,background:s.color,borderRadius:2,transition:'width 1.4s cubic-bezier(.16,1,.3,1)',opacity:.65}}/>
                </div>
              </div>
            </div>
          ))}

          {!tgLinked ? (
            <div style={{width:208,flexShrink:0,background:'rgba(41,182,246,.04)',border:'.5px solid rgba(41,182,246,.16)',borderRadius:12,padding:'11px 14px',display:'flex',flexDirection:'column',justifyContent:'space-between',backdropFilter:'blur(8px)'}}>
              <div>
                <div style={{fontFamily:'var(--font-ui)',fontSize:12,fontWeight:600,color:'#29b6f6',display:'flex',alignItems:'center',gap:5,marginBottom:4}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 8.16l-1.98 9.36c-.15.66-.54.81-1.08.51l-3-2.22-1.44 1.41c-.15.18-.3.27-.63.27l.21-3.06 5.58-5.04c.24-.21-.06-.33-.36-.12L6.9 13.17l-2.97-.93c-.63-.21-.66-.63.15-.93l11.61-4.47c.51-.21 1.02.12.83.32z"/></svg>
                  Connect Telegram
                </div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.28)',lineHeight:1.5}}>Add tasks from anywhere using natural language</div>
              </div>
              <div className="tgbtn" onClick={()=>setShowTgModal(true)} style={{marginTop:8,background:'rgba(41,182,246,.1)',border:'.5px solid rgba(41,182,246,.28)',borderRadius:8,padding:'7px 10px',fontFamily:'var(--font-ui)',fontSize:12,fontWeight:600,color:'#29b6f6',cursor:'pointer',textAlign:'center',transition:'all .2s'}}>
                Link Now →
              </div>
            </div>
          ) : (
            <div style={{width:208,flexShrink:0,background:'rgba(61,220,132,.04)',border:'.5px solid rgba(61,220,132,.18)',borderRadius:12,padding:'11px 14px',display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(61,220,132,.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3ddc84" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
              </div>
              <div>
                <div style={{fontFamily:'var(--font-ui)',fontSize:13,fontWeight:600,color:'#3ddc84'}}>Telegram Linked!</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.3)',marginTop:2}}>Tasks sync from bot instantly</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TELEGRAM MODAL */}
      {showTgModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.88)',backdropFilter:'blur(10px)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>!linking&&setShowTgModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{width:360,background:'#080810',border:'.5px solid rgba(41,182,246,.22)',borderRadius:18,overflow:'hidden',boxShadow:'0 30px 80px rgba(0,0,0,.9),0 0 40px rgba(41,182,246,.06)',animation:'modalIn .3s cubic-bezier(.16,1,.3,1)'}}>
            <div style={{padding:'22px 24px 18px',borderBottom:'.5px solid rgba(255,255,255,.06)',background:'linear-gradient(135deg,rgba(41,182,246,.06) 0%,transparent 100%)'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:42,height:42,borderRadius:12,background:'rgba(41,182,246,.1)',border:'.5px solid rgba(41,182,246,.28)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#29b6f6"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 8.16l-1.98 9.36c-.15.66-.54.81-1.08.51l-3-2.22-1.44 1.41c-.15.18-.3.27-.63.27l.21-3.06 5.58-5.04c.24-.21-.06-.33-.36-.12L6.9 13.17l-2.97-.93c-.63-.21-.66-.63.15-.93l11.61-4.47c.51-.21 1.02.12.83.32z"/></svg>
                </div>
                <div>
                  <div style={{fontFamily:'var(--font-display)',fontSize:15,fontWeight:700,color:'#f0f0f0'}}>Link Telegram Bot</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,.32)',marginTop:2}}>One-time setup · 30 seconds</div>
                </div>
              </div>
            </div>
            <div style={{padding:'20px 24px'}}>
              {[
                {n:'1',t:'Click "Open Telegram" below',s:'Opens @MTRiderBot for you',isCode:false},
                {n:'2',t:'Send this code to the bot',s:tgCode,isCode:true},
                {n:'3',t:'Done! Tasks sync instantly',s:'Try: "add gym tomorrow 7am"',isCode:false},
              ].map((step,i)=>(
                <div key={i} style={{display:'flex',gap:12,marginBottom:i<2?18:0}}>
                  <div style={{width:26,height:26,borderRadius:'50%',background:'rgba(41,182,246,.1)',border:'.5px solid rgba(41,182,246,.28)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontSize:11,fontWeight:700,color:'#29b6f6',flexShrink:0,marginTop:1}}>{step.n}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500,color:'#e0e0e0',marginBottom:4}}>{step.t}</div>
                    {step.isCode ? (
                      <div style={{display:'inline-flex',alignItems:'center',gap:10,background:'rgba(41,182,246,.08)',border:'.5px solid rgba(41,182,246,.22)',borderRadius:8,padding:'7px 13px'}}>
                        <span style={{fontFamily:'var(--font-display)',fontSize:17,fontWeight:700,color:'#29b6f6',letterSpacing:'.12em'}}>{step.s}</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#29b6f6" strokeWidth="2" style={{cursor:'pointer',opacity:.7}} onClick={()=>navigator.clipboard?.writeText(tgCode)}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                      </div>
                    ) : (
                      <div style={{fontSize:11,color:'rgba(255,255,255,.32)'}}>{step.s}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:'0 24px 22px',display:'flex',gap:8}}>
              <div onClick={()=>setShowTgModal(false)} style={{flex:1,padding:'11px',background:'rgba(255,255,255,.04)',border:'.5px solid rgba(255,255,255,.08)',borderRadius:10,textAlign:'center',fontSize:13,color:'rgba(255,255,255,.45)',cursor:'pointer',fontFamily:'var(--font-ui)',fontWeight:600}}>Cancel</div>
              <div onClick={simulateLink} style={{flex:2,padding:'11px',background:'rgba(41,182,246,.1)',border:'.5px solid rgba(41,182,246,.35)',borderRadius:10,textAlign:'center',fontSize:13,color:'#29b6f6',cursor:'pointer',fontFamily:'var(--font-ui)',fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:7,transition:'all .2s'}}>
                {linking ? (
                  <><div style={{width:12,height:12,border:'2px solid rgba(41,182,246,.3)',borderTopColor:'#29b6f6',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>Waiting...</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 8.16l-1.98 9.36c-.15.66-.54.81-1.08.51l-3-2.22-1.44 1.41c-.15.18-.3.27-.63.27l.21-3.06 5.58-5.04c.24-.21-.06-.33-.36-.12L6.9 13.17l-2.97-.93c-.63-.21-.66-.63.15-.93l11.61-4.47c.51-.21 1.02.12.83.32z"/></svg>Open Telegram</>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
