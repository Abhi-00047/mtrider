'use client';
import { create } from 'zustand';

export type Screen = 'dashboard' | 'habits' | 'tasks' | 'streak' | 'garage' | 'analytics' | 'health';

export interface Habit {
  id: number;
  name: string;
  time: string;
  xp: number;
  cat: string;
  col: string;
  done: boolean;
}

export interface Task {
  id: number;
  name: string;
  time: string;
  src: 'app' | 'tg';
  priority: 'high' | 'med' | 'low';
  done: boolean;
  date: string;
}

export interface ChatMsg {
  role: 'user' | 'bot';
  text: string;
}

interface AppState {
  screen: Screen;
  setScreen: (s: Screen) => void;

  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  combo: number;
  comboActive: boolean;
  xpToday: number;
  bestCombo: number;
  tgLinked: boolean;
  activeSkin: number;
  soundOn: boolean;

  addXp: (amount: number) => void;
  setCombo: (c: number) => void;
  setComboActive: (v: boolean) => void;
  setStreak: (s: number) => void;
  setTgLinked: (v: boolean) => void;
  setActiveSkin: (i: number) => void;
  toggleSound: () => void;

  habits: Habit[];
  toggleHabit: (id: number) => void;

  tasks: Task[];
  addTask: (name: string, time?: string, src?: 'app' | 'tg', priority?: 'high' | 'med' | 'low') => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;

  chatMsgs: ChatMsg[];
  addChatMsg: (msg: ChatMsg) => void;

  savedTips: number[];
  toggleSavedTip: (id: number) => void;

  profileOpen: boolean;
  setProfileOpen: (v: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  screen: 'dashboard',
  setScreen: (s) => set({ screen: s, profileOpen: false }),

  xp: 2340,
  level: 8,
  streak: 12,
  bestStreak: 31,
  combo: 1,
  comboActive: false,
  xpToday: 0,
  bestCombo: 1,
  tgLinked: false,
  activeSkin: 0,
  soundOn: true,

  addXp: (amount) => {
    const { xp, level, combo, bestCombo } = get();
    const earned = Math.round(amount * combo);
    const newXp = xp + earned;
    const newLevel = Math.floor(newXp / 1000) + 1;
    const newBestCombo = combo > bestCombo ? combo : bestCombo;
    set({ xp: newXp, level: newLevel > level ? newLevel : level, xpToday: get().xpToday + earned, bestCombo: newBestCombo });
  },
  setCombo: (c) => set({ combo: Math.min(c, 3) }),
  setComboActive: (v) => set({ comboActive: v }),
  setStreak: (s) => set({ streak: s, bestStreak: s > get().bestStreak ? s : get().bestStreak }),
  setTgLinked: (v) => set({ tgLinked: v }),
  setActiveSkin: (i) => set({ activeSkin: i }),
  toggleSound: () => set({ soundOn: !get().soundOn }),

  habits: [
    { id: 1, name: 'Morning meditation', time: '6:00 AM', xp: 60, cat: 'Mind', col: '#9b6dff', done: false },
    { id: 2, name: 'Cold shower', time: '6:30 AM', xp: 50, cat: 'Body', col: '#3ddc84', done: false },
    { id: 3, name: 'Workout — push day', time: '7:00 AM', xp: 100, cat: 'Body', col: '#3ddc84', done: false },
    { id: 4, name: 'Read 20 pages', time: '8:30 AM', xp: 70, cat: 'Focus', col: '#4a9eff', done: false },
    { id: 5, name: 'Protein intake', time: '12:00 PM', xp: 40, cat: 'Fuel', col: '#d4a843', done: false },
    { id: 6, name: 'Evening ride / walk', time: '6:00 PM', xp: 80, cat: 'Ride', col: '#ff6b35', done: false },
    { id: 7, name: 'Journal & plan', time: '9:00 PM', xp: 65, cat: 'Focus', col: '#4a9eff', done: false },
  ],
  toggleHabit: (id) => {
    const { habits, addXp, setCombo, setComboActive, combo } = get();
    const h = habits.find(x => x.id === id);
    if (!h || h.done) return;
    addXp(h.xp);
    setCombo(combo + 0.5);
    setComboActive(true);
    setTimeout(() => { setComboActive(false); setCombo(1); }, 5000);
    set({ habits: habits.map(x => x.id === id ? { ...x, done: true } : x) });
  },

  tasks: [
    { id: 1, name: 'Morning ride check-up', time: '6:30 AM', src: 'app', priority: 'high', done: false, date: 'today' },
    { id: 2, name: 'Review project proposal', time: '10:00 AM', src: 'app', priority: 'high', done: false, date: 'today' },
    { id: 3, name: 'Buy protein powder', time: '12:00 PM', src: 'app', priority: 'med', done: false, date: 'today' },
    { id: 4, name: 'Oil change — MT-15', time: '3:00 PM', src: 'app', priority: 'high', done: true, date: 'today' },
  ],
  addTask: (name, time = 'Any time', src = 'app', priority = 'med') => {
    const newTask: Task = { id: Date.now(), name, time, src, priority, done: false, date: 'today' };
    set({ tasks: [newTask, ...get().tasks] });
  },
  toggleTask: (id) => set({ tasks: get().tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) }),
  deleteTask: (id) => set({ tasks: get().tasks.filter(t => t.id !== id) }),

  chatMsgs: [
    { role: 'bot', text: 'Hey Rider 🏍️ Send tasks in plain English — I\'ll add them to your tracker.' },
    { role: 'bot', text: 'Try: "add gym tomorrow 7am" or "done with morning ride"' },
  ],
  addChatMsg: (msg) => set({ chatMsgs: [...get().chatMsgs, msg] }),

  savedTips: [],
  toggleSavedTip: (id) => {
    const { savedTips } = get();
    set({ savedTips: savedTips.includes(id) ? savedTips.filter(x => x !== id) : [...savedTips, id] });
  },

  profileOpen: false,
  setProfileOpen: (v) => set({ profileOpen: v }),
}));
