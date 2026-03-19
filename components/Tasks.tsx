'use client';
import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useStore, SKINS } from '@/store/useStore';
import Topbar from './Topbar';

const Tasks = memo(function Tasks() {
  const { tasks, activeSkin, chatMsgs, addChatMsg, addTask, toggleTask, deleteTask } = useStore();
  const [inp, setInp] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const skin = SKINS[activeSkin] || SKINS[0];

  useEffect(() => {
    if (chatEndRef.current && chatEndRef.current.parentElement) {
      chatEndRef.current.parentElement.scrollTo({
        top: chatEndRef.current.parentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMsgs]);

  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const pm: Record<string, number> = { high: 0, med: 1, low: 2 };
    return pm[a.priority] - pm[b.priority];
  });

  const priColors: Record<string, string> = { high: '#ff0055', med: '#d4a843', low: '#00f3ff' };

  // Advanced Bot Interaction Logic
  const handleChat = useCallback(() => {
    const text = inp.trim();
    if (!text) return;

    addChatMsg({ role: 'user', text });
    setInp('');

    setTimeout(() => {
      const lower = text.toLowerCase();
      if (lower.includes('add') || lower.includes('remind')) {
        let clean = text.replace(/add /i, '').replace(/remind me to /i, '').trim();
        const pri = clean.includes('urgent') ? 'high' : 'med';
        clean = clean.replace(/urgent/i, '').trim();

        addTask(clean, 'Anytime', 'tg', pri);
        addChatMsg({ role: 'bot', text: `Acknowledged, Rider. '${clean}' has been logged to the grid.` });
      } else if (lower.includes('done') || lower.includes('complete')) {
        const words = lower.split(' ').filter(w => w !== 'done' && w !== 'with' && w !== 'complete');
        let matched = false;
        for (const t of tasks) {
          if (!t.done && words.some(w => t.name.toLowerCase().includes(w))) {
            toggleTask(t.id);
            addChatMsg({ role: 'bot', text: 'Task complete. XP awarded. Excellent form.' });
            matched = true;
            break;
          }
        }
        if (!matched) addChatMsg({ role: 'bot', text: 'I couldn\'t identify an active objective matching that description.' });
      } else {
        addChatMsg({ role: 'bot', text: 'I am your digital concierge. Use commands like "Add [task]" or mark them "done".' });
      }
    }, 800);
  }, [inp, addChatMsg, addTask, toggleTask, tasks]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: 'transparent' }}>
      <style>{`
        @keyframes taskIn { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes msgIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .scrollArea::-webkit-scrollbar { width: 6px; height: 6px; }
        .scrollArea::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 6px; }
        @media (max-width: 768px) {
          .tasks-layout { flex-direction: column !important; overflow-y: auto !important; }
          .tasks-left { padding: 24px 20px !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; flex: none !important; overflow: visible !important; }
          .tasks-right { flex: none !important; overflow: visible !important; height: 500px !important; }
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 50 }}>
        <Topbar title="OPERATIONS & CONCIERGE" />
      </div>

      <div className="tasks-layout" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT COMPONENT */}
        <div className="scrollArea tasks-left" style={{ flex: 1.5, padding: '40px 60px', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          {tasks.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '10vh' }}>
              <div style={{ fontSize: 64, opacity: 0.2, marginBottom: 20 }}>📋</div>
              <div className="font-display" style={{ fontSize: 24, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>No Active Operations</div>
            </div>
          )}

          {sorted.map((t, i) => (
            <div key={t.id} className="liquid-glass hoverable" onClick={() => toggleTask(t.id)} style={{ marginBottom: 24, padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 24, animation: `taskIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05}s both`, opacity: t.done ? 0.3 : 1, cursor: 'pointer' }}>

              <div style={{ width: 28, height: 28, borderRadius: '50%', border: t.done ? 'none' : '2px solid rgba(255,255,255,0.1)', background: t.done ? skin.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)', boxShadow: t.done ? `0 0 20px ${skin.accent}` : 'none' }}>
                {t.done && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="font-ui" style={{
                  fontSize: 18, fontWeight: 700,
                  color: t.done ? 'var(--dim)' : '#fff',
                  textDecoration: t.done ? 'line-through rgba(255,255,255,.2)' : 'none',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  letterSpacing: '0.02em',
                  transition: 'all 0.4s ease'
                }}>{t.name}</div>
                <div className="font-ui" style={{ fontSize: 13, color: 'var(--dim)', marginTop: 8, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {t.time} — {t.date}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {!t.done && (
                  <div className="font-display" style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${priColors[t.priority]}40`, color: priColors[t.priority], fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', background: `${priColors[t.priority]}15`, boxShadow: `0 0 15px ${priColors[t.priority]}20` }}>
                    {t.priority}
                  </div>
                )}

                {t.src === 'tg' && !t.done && (
                  <div className="liquid-glass" style={{ padding: '6px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={skin.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    <span className="font-ui" style={{ fontSize: 11, color: skin.accent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>BOT</span>
                  </div>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); deleteTask(t.id); }}
                  aria-label="Delete task"
                  style={{ background: 'transparent', border: 'none', padding: '12px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="hoverable"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COMPONENT */}
        <div className="tasks-right liquid-glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '32px 32px 32px 0', borderRadius: 24, overflow: 'hidden' }}>

          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="liquid-glass-accent liquid-glass" style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={skin.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </div>
            <div>
              <div className="font-display" style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '0.02em' }}>MTR CONCIERGE</div>
              <div className="font-ui" style={{ fontSize: 12, color: skin.accent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>Online & Connected</div>
            </div>
          </div>

          <div className="scrollArea" style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {chatMsgs.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'msgIn 0.3s ease-out' }}>
                <div className={msg.role === 'bot' ? "liquid-glass" : ""} style={{
                  maxWidth: '85%', padding: '16px 20px', borderRadius: 20,
                  background: msg.role === 'user' ? '#ffffff20' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: msg.role === 'user' ? `0 4px 12px ${skin.glow}` : 'none',
                  borderBottomRightRadius: msg.role === 'user' ? 4 : 20,
                  borderBottomLeftRadius: msg.role === 'bot' ? 4 : 20,
                }}>
                  <span className="font-ui" style={{ fontSize: 14, fontWeight: msg.role === 'user' ? 600 : 500, lineHeight: 1.5, letterSpacing: '0.02em' }}>
                    {msg.text}
                  </span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: '24px' }}>
            <div className="liquid-glass" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 10px 10px 24px' }}>
              <input
                value={inp}
                onChange={e => setInp(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChat()}
                placeholder="Log objective... (e.g. 'Add Gym 7am')"
                className="font-ui"
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 15, outline: 'none', letterSpacing: '0.05em', fontWeight: 600 }}
              />
              <button className="liquid-glass hoverable" onClick={handleChat} aria-label="Send message" style={{ width: 44, height: 44, borderRadius: 12, color: skin.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Tasks;
