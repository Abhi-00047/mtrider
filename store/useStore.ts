'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';
import { 
  saveProgress, 
  saveHabit, 
  saveTask, 
  deleteTaskFromDB, 
  saveIdea, 
  deleteIdeaFromDB 
} from '@/lib/sync';

export const SKINS = [
  { id: '1', name: 'Obsidian Stealth', primary: '#1a1a24', accent: '#3ddc84', glow: 'rgba(61,220,132,0.6)', hover: 'rgba(61,220,132,0.1)' },
  { id: '2', name: 'Liquid Titanium', primary: '#e0e0e0', accent: '#4a9eff', glow: 'rgba(74,158,255,0.6)', hover: 'rgba(74,158,255,0.1)' },
  { id: '3', name: 'Cobalt Abyss', primary: '#0a192f', accent: '#4a9eff', glow: 'rgba(74,158,255,0.6)', hover: 'rgba(74,158,255,0.1)' },
  { id: '4', name: 'Solar Flare', primary: '#2a220a', accent: '#d4a843', glow: 'rgba(212,168,67,0.6)', hover: 'rgba(212,168,67,0.1)' },
  { id: '5', name: 'Crimson Apex', primary: '#2a0a0a', accent: '#ff5555', glow: 'rgba(255,85,85,0.6)', hover: 'rgba(255,85,85,0.1)' },
  { id: '6', name: 'Cyber Emerald', primary: '#0a2a1a', accent: '#00ff88', glow: 'rgba(0,255,136,0.6)', hover: 'rgba(0,255,136,0.1)' }
];

export type Screen = 'dashboard' | 'habits' | 'tasks' | 'streak' | 'gearup' | 'analytics' | 'health' | 'settings';
export type IdeaStatus = 'raw' | 'building' | 'shipped';

export interface Idea {
  id: string;
  text: string;
  status: IdeaStatus;
  createdAt: string;
  shippedAt?: string;
}

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
  comboTimeoutId: ReturnType<typeof setTimeout> | null;
  tgLinked: boolean;
  activeSkin: number;
  soundOn: boolean;
  lastActiveDate: string;
  userName: string;
  userInitial: string;

  addXp: (amount: number) => void;
  setCombo: (c: number) => void;
  setComboActive: (v: boolean) => void;
  setStreak: (s: number) => void;
  setTgLinked: (v: boolean) => void;
  setActiveSkin: (i: number) => void;
  toggleSound: () => void;
  resetCombo: () => void;
  checkDailyReset: () => void;
  setUserName: (n: string) => void;
  setUserInitial: (i: string) => void;
  resetAppData: () => void;

  habits: Habit[];
  toggleHabit: (id: number) => void;

  tasks: Task[];
  addTask: (name: string, time?: string, src?: 'app' | 'tg', priority?: 'high' | 'med' | 'low') => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;

  chatMsgs: ChatMsg[];
  setTasks: (tasks: Task[]) => void;
  addChatMsg: (msg: ChatMsg) => void;

  savedTips: number[];
  toggleSavedTip: (id: number) => void;

  profileOpen: boolean;
  setProfileOpen: (v: boolean) => void;

  // New Gear Up state
  ideas: Idea[];
  addIdea: (text: string) => void;
  updateIdeaStatus: (id: string, status: IdeaStatus) => void;
  deleteIdea: (id: string) => void;
  shipStreak: number;
  lastShippedAt: string | null;
  reorderIdeas: (newIdeas: Idea[]) => void;
  moveIdea: (id: string, newStatus: IdeaStatus, newIndex: number) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
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
      comboTimeoutId: null,
      tgLinked: false,
      activeSkin: 0,
      soundOn: true,
      lastActiveDate: new Date().toISOString().split('T')[0],
      userName: 'Rider K',
      userInitial: 'RK',

      addXp: (amount) => {
        const { xp, level, combo, bestCombo } = get();
        const earned = Math.round(amount * combo);
        const newXp = xp + earned;
        const newLevel = Math.floor(newXp / 1000) + 1;
        const newBestCombo = combo > bestCombo ? combo : bestCombo;
        set({ xp: newXp, level: newLevel > level ? newLevel : level, xpToday: get().xpToday + earned, bestCombo: newBestCombo });
        
        const { user } = get();
        if (user) saveProgress(user.id);
      },
      setCombo: (c) => set({ combo: Math.min(c, 3) }),
      setComboActive: (v) => set({ comboActive: v }),
      setStreak: (s) => {
        set({ streak: s, bestStreak: s > get().bestStreak ? s : get().bestStreak });
        const { user } = get();
        if (user) saveProgress(user.id);
      },
      setTgLinked: (v) => set({ tgLinked: v }),
      setActiveSkin: (i) => set({ activeSkin: i }),
      toggleSound: () => set({ soundOn: !get().soundOn }),
      resetCombo: () => {
        const { comboTimeoutId } = get();
        if (comboTimeoutId) clearTimeout(comboTimeoutId);
        set({ comboActive: false, combo: 1, comboTimeoutId: null });
      },

      checkDailyReset: () => {
        const { lastActiveDate, habits, streak, bestStreak } = get();
        const today = new Date().toISOString().split('T')[0];
        if (lastActiveDate === today) return; // same day, no reset

        // Check if ALL habits were completed yesterday
        const allDoneYesterday = habits.every(h => h.done);
        const newStreak = allDoneYesterday ? streak + 1 : 0;
        const newBest = newStreak > bestStreak ? newStreak : bestStreak;

        // Reset habits and xpToday for the new day
        set({
          lastActiveDate: today,
          habits: habits.map(h => ({ ...h, done: false })),
          xpToday: 0,
          streak: newStreak,
          bestStreak: newBest,
          combo: 1,
          comboActive: false,
        });
      },

      setUserName: (n) => set({ userName: n }),
      setUserInitial: (i) => set({ userInitial: i }),
      resetAppData: () => {
        localStorage.removeItem('mtrider-storage');
        window.location.reload();
      },

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
        const { habits, addXp, setCombo, setComboActive, combo, comboTimeoutId, resetCombo, xp } = get();
        const h = habits.find(x => x.id === id);
        if (!h) return;

        if (h.done) {
          // Unchecking — reverse XP
          const newXp = Math.max(0, xp - h.xp);
          set({ habits: habits.map(x => x.id === id ? { ...x, done: false } : x), xp: newXp });
        } else {
          // Checking — award XP & combo
          addXp(h.xp);
          setCombo(combo + 0.5);
          setComboActive(true);
          if (comboTimeoutId) clearTimeout(comboTimeoutId);
          const tid = setTimeout(() => { resetCombo(); }, 5000);
          set({ habits: habits.map(x => x.id === id ? { ...x, done: true } : x), comboTimeoutId: tid });
        }

        const { user } = get();
        const updatedHabit = get().habits.find(x => x.id === id);
        if (user && updatedHabit) saveHabit(user.id, updatedHabit);
      },

      tasks: [
        { id: 1, name: 'Morning ride check-up', time: '6:30 AM', src: 'app', priority: 'high', done: false, date: 'today' },
        { id: 2, name: 'Review project proposal', time: '10:00 AM', src: 'app', priority: 'high', done: false, date: 'today' },
        { id: 3, name: 'Buy protein powder', time: '12:00 PM', src: 'app', priority: 'med', done: false, date: 'today' },
        { id: 4, name: 'Oil change — MT-15', time: '3:00 PM', src: 'app', priority: 'high', done: true, date: 'today' },
      ],
      addTask: (name, time = 'Any time', src = 'app', priority = 'med') => {
        const newTask: Task = {
          id: Math.floor(Math.random() * 1000000) + Date.now(),
          name, time, src, priority, done: false, date: 'today'
        };
        set({ tasks: [newTask, ...get().tasks] });

        const { user } = get();
        if (user) saveTask(user.id, newTask);
      },
      toggleTask: (id) => {
        set({ tasks: get().tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) });
        const { user } = get();
        const updatedTask = get().tasks.find(t => t.id === id);
        if (user && updatedTask) saveTask(user.id, updatedTask);
      },
      deleteTask: (id) => {
        set({ tasks: get().tasks.filter(t => t.id !== id) });
        deleteTaskFromDB(id);
      },

      chatMsgs: [
        { role: 'bot', text: 'Hey Rider 🏍️ Send tasks in plain English — I\'ll add them to your tracker.' },
        { role: 'bot', text: 'Try: "add gym tomorrow 7am" or "done with morning ride"' },
      ],
      setTasks: (tasks) => set({ tasks }),
      addChatMsg: (msg) => set({ chatMsgs: [...get().chatMsgs, msg] }),

      savedTips: [],
      toggleSavedTip: (id) => {
        const { savedTips } = get();
        set({ savedTips: savedTips.includes(id) ? savedTips.filter(x => x !== id) : [...savedTips, id] });
      },

      profileOpen: false,
      setProfileOpen: (v) => set({ profileOpen: v }),

      // Gear Up Logic
      ideas: [],
      addIdea: (text) => {
        const newIdea: Idea = {
          id: Math.random().toString(36).substring(2, 9),
          text,
          status: 'raw',
          createdAt: new Date().toISOString()
        };
        set({ ideas: [newIdea, ...get().ideas] });

        const { user } = get();
        if (user) saveIdea(user.id, newIdea);
      },
      updateIdeaStatus: (id, status) => {
        const { ideas, shipStreak, lastShippedAt } = get();
        const now = new Date();
        let newStreak = shipStreak;
        let newLastShipped = lastShippedAt;

        if (status === 'shipped') {
          // Check if it's the 3rd shipping in a row or within 3 days
          const lastDate = lastShippedAt ? new Date(lastShippedAt) : null;
          const diffDays = lastDate ? (now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24) : 0;

          if (lastDate && diffDays <= 3) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
          newLastShipped = now.toISOString();
        }

        set({
          ideas: ideas.map(i => i.id === id ? { ...i, status, shippedAt: status === 'shipped' ? now.toISOString() : i.shippedAt } : i),
          shipStreak: newStreak,
          lastShippedAt: newLastShipped
        });

        const { user } = get();
        const updatedIdea = get().ideas.find(i => i.id === id);
        if (user && updatedIdea) saveIdea(user.id, updatedIdea);
      },
      deleteIdea: (id) => {
        set({ ideas: get().ideas.filter(i => i.id !== id) });
        deleteIdeaFromDB(id);
      },
      shipStreak: 0,
      lastShippedAt: null,
      moveIdea: (id, newStatus, newIndex) => {
        const { ideas, shipStreak, lastShippedAt } = get();
        const updatedIdeas = Array.from(ideas);
        const currentIndex = updatedIdeas.findIndex(i => i.id === id);
        if (currentIndex === -1) return;

        const [moved] = updatedIdeas.splice(currentIndex, 1);
        const oldStatus = moved.status;
        moved.status = newStatus;

        let newStreak = shipStreak;
        let newLastShipped = lastShippedAt;
        const now = new Date();

        if (newStatus === 'shipped' && oldStatus !== 'shipped') {
          const lastDate = lastShippedAt ? new Date(lastShippedAt) : null;
          const diffDays = lastDate ? (now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24) : 0;

          if (lastDate && diffDays <= 3) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
          newLastShipped = now.toISOString();
          moved.shippedAt = newLastShipped;
        }

        // Find the insertion point in the overall list
        const destLists = updatedIdeas.filter(i => i.status === newStatus);
        const insertBefore = destLists[newIndex];

        let insertIndex = updatedIdeas.length;
        if (insertBefore) {
          insertIndex = updatedIdeas.findIndex(i => i.id === insertBefore.id);
        } else if (newIndex === 0) {
          insertIndex = 0;
        }

        updatedIdeas.splice(insertIndex, 0, moved);
        
        set({
          ideas: updatedIdeas,
          shipStreak: newStreak,
          lastShippedAt: newLastShipped
        });

        const { user } = get();
        if (user) saveIdea(user.id, moved);
      },
      reorderIdeas: (newIdeas) => set({ ideas: newIdeas })
    }),
    {
      name: 'mtrider-storage',
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        bestStreak: state.bestStreak,
        tgLinked: state.tgLinked,
        activeSkin: state.activeSkin,
        ideas: state.ideas,
        shipStreak: state.shipStreak,
        lastShippedAt: state.lastShippedAt,
        tasks: state.tasks,
        habits: state.habits,
        chatMsgs: state.chatMsgs,
        savedTips: state.savedTips,
        lastActiveDate: state.lastActiveDate,
        xpToday: state.xpToday,
        soundOn: state.soundOn,
        userName: state.userName,
        userInitial: state.userInitial,
        user: state.user
      }),
    }
  )
);
