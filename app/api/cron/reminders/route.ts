import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // 1. Query tasks where scheduled_at is within the next 5 minutes and reminded = false
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .lte('scheduled_at', fiveMinutesFromNow.toISOString())
      .gte('scheduled_at', now.toISOString())
      .eq('reminded', false);

    if (error) throw error;

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ ok: true, count: 0 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // 2. Send Telegram messages
    for (const task of tasks) {
      const message = `🏍️ TIME TO RIDE, Rider! '${task.title}' is due now.`;
      const sendRes = await fetch(`${siteUrl}/api/telegram/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      
      if (sendRes.ok) {
        // 3. Mark as reminded
        await supabase
          .from('tasks')
          .update({ reminded: true })
          .eq('id', task.id);
      }
    }

    return NextResponse.json({ ok: true, count: tasks.length });
  } catch (err: any) {
    console.error('[Reminders Cron Error]:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
