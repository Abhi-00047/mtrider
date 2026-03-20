import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // 1. Get the primary user profile to identify who we're summarizing for
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .limit(1)
      .single();

    if (profileError || !profile) {
      console.error('[Cron] Profile Error:', profileError);
      return NextResponse.json({ ok: false, error: 'No user profile found' }, { status: 404 });
    }

    const userId = profile.id;

    // Calculate dates
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    // 2. Query habits and count completions for today
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('id, title, completed')
      .eq('user_id', userId);

    if (habitsError) throw habitsError;
    const habitsDone = habits?.filter(h => h.completed).length || 0;
    const totalHabits = habits?.length || 0;

    // 3. Query pending tasks for tomorrow
    const { count: pendingCount, error: tasksError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', false)
      .eq('date', tomorrow);

    if (tasksError) throw tasksError;

    // 4. Get current streak from progress
    const { data: progress, error: progressError } = await supabase
      .from('progress')
      .select('streak')
      .eq('user_id', userId)
      .single();

    if (progressError && progressError.code !== 'PGRST116') throw progressError; // PGRST116 is 'no rows'
    const streak = progress?.streak || 0;

    // 5. Build summary message
    const message = [
      `🏍️ MT Rider Daily Summary`,
      `---`,
      `✅ Habits done today: ${habitsDone}/${totalHabits}`,
      `📋 Pending tasks tomorrow: ${pendingCount || 0}`,
      `🔥 Current streak: ${streak} days`,
      `---`,
      `Keep riding, ${profile.full_name || 'Rider'}.`
    ].join('\n');

    // 6. Send via the Telegram sender API
    // We use the absolute URL because fetch on the server doesn't support relative paths
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const sendResponse = await fetch(`${siteUrl}/api/telegram/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!sendResponse.ok) {
      const errorText = await sendResponse.text();
      console.error(`[Cron] Failed to send via API: ${errorText}`);
      throw new Error(`Failed to send summary via Telegram: ${errorText}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('[Daily Summary Cron Error]:', error);
    return NextResponse.json({ ok: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
