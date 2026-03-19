'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useStore, Idea, IdeaStatus, SKINS } from '@/store/useStore';
import Image from 'next/image';
import Topbar from './Topbar';
import { motion, AnimatePresence } from 'framer-motion';

const GearUp = memo(function GearUp() {
  const { ideas, addIdea, updateIdeaStatus, deleteIdea, shipStreak, activeSkin, reorderIdeas } = useStore();
  const skin = SKINS[activeSkin] || SKINS[0];

  const [inputText, setInputText] = useState('');
  const [sparkMode, setSparkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [revShake, setRevShake] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [gyroPos, setGyroPos] = useState({ x: 0, y: 0 });
  const [capturing, setCapturing] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const canvasRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Parallax logic
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 10
      });
    };

    const handleGyro = (e: DeviceOrientationEvent) => {
      if (e.beta && e.gamma) {
        setGyroPos({
          x: (e.gamma / 45) * 15,
          y: (e.beta / 90) * 8
        });
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('deviceorientation', handleGyro);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('deviceorientation', handleGyro);
    };
  }, []);

  const triggerRev = useCallback(() => {
    setRevShake(true);
    try {
      const revSound = new Audio('https://www.soundjay.com/transportation/sounds/motorcycle-starting-1.mp3');
      revSound.volume = 0.5;
      const playPromise = revSound.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Audio playback failed or unsupported:', error);
        });
      }
    } catch (e) {
      console.warn('Audio construction failed', e);
    }
    setTimeout(() => setRevShake(false), 500);
  }, []);

  const handleCapture = useCallback((text: string = inputText) => {
    if (!text.trim()) return;
    setCapturing(true);
    triggerRev();
    addIdea(text.trim());
    setInputText('');
    setTimeout(() => setCapturing(false), 600);
  }, [inputText, addIdea, triggerRev]);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
        setTimeout(() => handleCapture(transcript), 500);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, [handleCapture]);

  const handleMicPress = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'g') {
      e.preventDefault();
      setSparkMode(true);
    }
    if (e.key === 'Escape') {
      setSparkMode(false);
    }
  };

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (inputText.endsWith('\n')) {
        handleCapture();
      }
    }
  };

  useEffect(() => {
    setIsTyping(inputText.length > 0);
  }, [inputText]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setMousePos(prev => ({ ...prev, x: prev.x + (destination.index > source.index ? 5 : -5) }));

    const newStatus = destination.droppableId as IdeaStatus;

    if (newStatus === 'shipped' && source.droppableId !== 'shipped') {
      setShipping(true);
      setTimeout(() => setShipping(false), 1000);
    }

    useStore.getState().moveIdea(draggableId, newStatus, destination.index);
  };

  const isIdeaOld = (date: string) => {
    const created = new Date(date);
    const now = new Date();
    const diff = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);
    return diff >= 7;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#050709', position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <style>{`
        .header-transparent .liquid-glass { background: transparent !important; border-color: transparent !important; backdrop-filter: none !important; box-shadow: none !important; margin: 8px 16px 0 !important; }
        .card-container { position: relative; transition: all 0.2s ease; }
        .card-container:hover .delete-btn { opacity: 1; }
        .delete-btn { opacity: 0; transition: opacity 0.2s; background: transparent; border: none; color: rgba(255,255,255,0.2); cursor: pointer; padding: 4px; }
        .delete-btn:hover { color: #ff5555; }
        .column-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .column-scroll::-webkit-scrollbar { display: none; }
        @keyframes sparkPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .shipped-stamp {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg);
          border: 2px solid #22c55e; color: #22c55e; padding: 2px 8px;
          font-family: var(--font-display); font-size: 14px; font-weight: 900;
          text-transform: uppercase; opacity: 0.3; letter-spacing: 0.1em;
          pointer-events: none;
        }
        /* Custom styling for the library's internal placeholder */
        [data-rbd-placeholder-context-id] {
          background: rgba(0, 212, 255, 0.03) !important;
          border: 1px dashed rgba(0, 212, 255, 0.15) !important;
          border-radius: 12px !important;
          margin-top: 10px !important;
          height: 60px !important; /* Matches approximate minimal card height */
        }
      `}</style>

      {/* FIX 1: BIKE IMAGE FULL SCREEN BACKGROUND */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <motion.div
          animate={{
            x: (mousePos.x || gyroPos.x),
            y: (mousePos.y || gyroPos.y),
            rotateY: (mousePos.x || gyroPos.x) / 10,
            scale: revShake ? 1.05 : 1
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 150 }}
          style={{ position: 'absolute', inset: -50 }}
        >
          <Image
            src="/bike.png"
            alt="Background Bike"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.9) contrast(1)' }}
            priority
          />
        </motion.div>
        {/* DARK OVERLAY */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(5, 7, 9, 0.85) 0%, rgba(5, 7, 9, 0.4) 20%, rgba(5, 7, 9, 0.5) 50%, rgba(5, 7, 9, 0.92) 75%, rgba(5, 7, 9, 1) 100%)'
        }} />
      </div>

      <AnimatePresence>
        {sparkMode && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <textarea
              autoFocus
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              placeholder="What are you building next, Rider?"
              className="font-ui"
              style={{
                width: '80%', background: 'transparent', border: 'none', color: '#fff',
                fontSize: 32, textAlign: 'center', outline: 'none', resize: 'none', fontWeight: 600
              }}
            />
            <div className="font-ui" style={{ position: 'absolute', bottom: 40, color: 'rgba(255,255,255,0.2)', fontSize: 12, letterSpacing: '0.2em' }}>ESCAPE TO EXIT</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* FIX 5: HEADER CLEANUP */}
        <div className="header-transparent" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)', position: 'relative', zIndex: 50 }}>
          <Topbar title="GEAR UP" />
        </div>

        {/* TOP 55% SPACING */}
        <div style={{ height: '55vh', cursor: 'pointer' }} onClick={triggerRev} />

        {/* BOTTOM 45% CONTENT */}
        <div style={{ height: '45vh', display: 'flex', flexDirection: 'column', paddingBottom: 24 }}>

          {/* FIX 3: IDEA CANVAS CLEANUP */}
          <div style={{ padding: '0 32px', marginBottom: 20 }}>
            <div style={{
              background: 'rgba(5, 7, 9, 0.6)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '20px 24px',
              display: 'flex',
              position: 'relative'
            }}>
              <textarea
                ref={canvasRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                placeholder="What are you building next, Rider?"
                className="font-ui"
                style={{
                  flex: 1, minHeight: 60, background: 'transparent', border: 'none', color: '#fff',
                  fontSize: 18, outline: 'none', resize: 'none', lineHeight: 1.5, fontWeight: 500
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 16 }}>
                <button
                  onClick={handleMicPress}
                  style={{ background: 'transparent', border: 'none', color: isRecording ? '#ff4b4b' : 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                </button>
                <button
                  onClick={() => handleCapture()}
                  style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 10 4 15 9 20" /><path d="M20 4v7a4 4 0 0 1-4 4H4" /></svg>
                </button>
              </div>
              <div style={{ position: 'absolute', bottom: 8, right: 24, fontSize: 9, fontFamily: 'monospace', color: '#444', letterSpacing: '0.05em' }}>ENTER ×2 TO CAPTURE</div>
            </div>
          </div>

          {/* FIX 4: BUILD BOARD CLEANUP */}
          <div style={{ flex: 1, padding: '0 24px', minHeight: 0 }}>
            <DragDropContext onDragEnd={onDragEnd}>
              <div style={{ display: 'flex', gap: 10, height: '100%', overflowX: 'auto' }} className="column-scroll">
                {(['raw', 'building', 'shipped'] as IdeaStatus[]).map((status) => (
                  <div key={status} style={{ minWidth: 300, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingLeft: 8 }}>
                      <div className="font-ui" style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                        {status === 'raw' ? 'RAW 🔥' : status === 'building' ? 'BUILDING ⚙️' : 'SHIPPED ✅'}
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 6, fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                        {ideas.filter(i => i.status === status).length}
                      </div>
                    </div>

                    <Droppable droppableId={status}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10,
                            padding: '10px', margin: '-10px', borderRadius: '16px',
                            background: snapshot.isDraggingOver ? 'rgba(0, 212, 255, 0.02)' : 'transparent',
                            border: snapshot.isDraggingOver ? '1px solid rgba(0, 212, 255, 0.2)' : '1px solid transparent',
                            transition: 'all 150ms ease'
                          }}
                          className="column-scroll"
                        >
                          {ideas.filter(i => i.status === status).map((idea, index) => (
                            <Draggable key={idea.id} draggableId={idea.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="card-container"
                                  style={{
                                    ...provided.draggableProps.style,
                                    padding: '14px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: snapshot.isDragging ? '1px solid rgba(0, 243, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.07)',
                                    borderRadius: '12px',
                                    opacity: snapshot.isDragging ? 0.9 : (idea.status === 'shipped' ? 0.6 : 1),
                                    boxShadow: snapshot.isDragging ? '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0, 212, 255, 0.15)' : '0 4px 15px rgba(0,0,0,0.1)',
                                    transform: snapshot.isDragging
                                      ? `${provided.draggableProps.style?.transform || ''} scale(1.02)`.trim()
                                      : provided.draggableProps.style?.transform,
                                    transition: provided.draggableProps.style?.transition
                                      ? `${provided.draggableProps.style.transition}, box-shadow 0.2s, border 0.2s, background 0.2s, opacity 0.2s`
                                      : 'box-shadow 0.2s, border 0.2s, background 0.2s, opacity 0.2s',
                                    zIndex: snapshot.isDragging ? 9999 : 1,
                                    backdropFilter: snapshot.isDragging ? 'blur(8px)' : 'none',
                                  }}
                                >
                                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 500, lineHeight: 1.5 }}>{idea.text}</div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                                    <div style={{ fontSize: 10, color: '#555', fontFamily: 'monospace' }}>
                                      {new Date(idea.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).toUpperCase()}
                                    </div>
                                  </div>
                                  <button
                                    className="delete-btn"
                                    onClick={() => deleteIdea(idea.id)}
                                    style={{ position: 'absolute', top: 10, right: 10 }}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                  </button>
                                  {idea.status === 'shipped' && <div className="shipped-stamp">SHIPPED</div>}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
});

export default GearUp;
