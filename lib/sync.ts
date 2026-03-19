import { supabase } from './supabase';
import { useStore, Habit, Task, Idea } from '@/store/useStore';
import { User } from '@supabase/supabase-js';

export const loadUserData = async (user: User) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: progress } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id);

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id);

  const { data: ideas } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', user.id);

  // Map and hydrate store
  useStore.setState({
    userName: profile?.full_name || user.user_metadata?.full_name || 'Rider',
    userInitial: (profile?.full_name || user.user_metadata?.full_name || 'R').charAt(0).toUpperCase(),
    xp: progress?.xp ?? 0,
    level: progress?.level ?? 1,
    streak: progress?.streak ?? 0,
    lastActiveDate: progress?.last_active || new Date().toISOString().split('T')[0],
    habits: (habits || []).map((h: any) => ({
      id: h.id,
      name: h.title,
      done: h.completed,
      xp: h.xp_reward,
      time: 'Any time', // Default if missing
      cat: 'Mind', // Default if missing
      col: '#9b6dff' // Default if missing
    })),
    tasks: (tasks || []).map((t: any) => ({
      id: t.id,
      name: t.title,
      time: t.time || 'Any time',
      done: t.completed,
      priority: t.priority || 'med',
      src: t.via_bot ? 'tg' : 'app',
      date: t.date || 'today'
    })),
    ideas: (ideas || []).map((i: any) => ({
      id: i.id,
      text: i.text,
      status: i.status || 'raw',
      createdAt: i.created_at,
      shippedAt: i.shipped_at
    }))
  });
};

export const saveProgress = async (userId: string) => {
  const { xp, level, streak, lastActiveDate } = useStore.getState();
  await supabase.from('progress').upsert({
    user_id: userId,
    xp,
    level,
    streak,
    last_active: lastActiveDate,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
};

export const saveHabit = async (userId: string, habit: Habit) => {
  await supabase.from('habits').upsert({
    id: habit.id,
    user_id: userId,
    title: habit.name,
    completed: habit.done,
    xp_reward: habit.xp,
    last_completed: habit.done ? new Date().toISOString() : null
  });
};

export const saveTask = async (userId: string, task: Task) => {
  await supabase.from('tasks').upsert({
    id: task.id,
    user_id: userId,
    title: task.name,
    time: task.time,
    date: task.date,
    completed: task.done,
    priority: task.priority,
    via_bot: task.src === 'tg',
    xp_reward: 50 // Default
  });
};

export const deleteTaskFromDB = async (taskId: string | number) => {
  await supabase.from('tasks').delete().eq('id', taskId);
};

export const saveIdea = async (userId: string, idea: Idea) => {
  await supabase.from('ideas').upsert({
    id: idea.id,
    user_id: userId,
    text: idea.text,
    status: idea.status,
    created_at: idea.createdAt,
    shipped_at: idea.shippedAt
  });
};

export const deleteIdeaFromDB = async (ideaId: string) => {
  await supabase.from('ideas').delete().eq('id', ideaId);
};
