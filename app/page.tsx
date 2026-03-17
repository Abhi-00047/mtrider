'use client';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import dynamic from 'next/dynamic';
const Habits = dynamic(() => import('@/components/Habits'));
const Tasks = dynamic(() => import('@/components/Tasks'));
const Streak = dynamic(() => import('@/components/Streak'));
const Garage = dynamic(() => import('@/components/Garage'));
const Analytics = dynamic(() => import('@/components/Analytics'));
const Health = dynamic(() => import('@/components/Health'));

export default function Home() {
  const { screen } = useStore();
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {screen === 'dashboard' && <Dashboard />}
        {screen === 'habits' && <Habits />}
        {screen === 'tasks' && <Tasks />}
        {screen === 'streak' && <Streak />}
        {screen === 'garage' && <Garage />}
        {screen === 'analytics' && <Analytics />}
        {screen === 'health' && <Health />}
      </div>
    </div>
  );
}
