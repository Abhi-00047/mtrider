import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();


    const { message } = body;

    // Telegram sends multiple updates, we only care about new messages
    if (!message || !message.chat || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id.toString();
    const allowedChatId = process.env.TELEGRAM_CHAT_ID || process.env.ALLOWED_CHAT_ID;

    // Security: Only process messages from the authorized chat ID
    if (chatId !== allowedChatId) {
      console.log(`[Telegram] Unauthorized chat ID: ${chatId}`);
      return NextResponse.json({ ok: false, error: 'Unauthorized chat ID' }, { status: 401 });
    }

    const fullText = message.text;
    const lowerText = fullText.toLowerCase().trim();
    let replyText = "🏍️ Command not recognized, Rider. Try: 'add gym 7am' or 'done meditation'";

    // Using the user_id directly from environmental variables as requested
    const userId = process.env.TELEGRAM_USER_ID;

    if (!userId) {
      console.error('[Telegram] Missing TELEGRAM_USER_ID in environment');
      return NextResponse.json({ ok: false, error: 'User configuration missing' }, { status: 500 });
    }

    // Command: add <task title>
    if (lowerText.startsWith('add ')) {
      let taskTitle = fullText.substring(4).trim();
      
      // Basic time parsing logic
      const parseTime = (text: string) => {
        const timeRegex = /(\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b)/i;
        const tomorrowRegex = /\btomorrow\b/i;
        const timeMatch = text.match(timeRegex);
        if (!timeMatch) return { timeStr: null, scheduledAt: null };

        const timeStr = timeMatch[1].toLowerCase().replace(/\s+/g, '');
        const isTomorrow = tomorrowRegex.test(text);
        let [hours, minutes] = [0, 0];
        const digits = timeStr.replace(/(am|pm)/, '');
        if (digits.includes(':')) {
          const parts = digits.split(':');
          hours = parseInt(parts[0]);
          minutes = parseInt(parts[1]);
        } else {
          hours = parseInt(digits);
        }
        if (timeStr.includes('pm') && hours < 12) hours += 12;
        if (timeStr.includes('am') && hours === 12) hours = 0;

        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istNow = new Date(now.getTime() + istOffset);
        const scheduled = new Date(istNow);
        if (isTomorrow) scheduled.setDate(scheduled.getDate() + 1);
        scheduled.setHours(hours, minutes, 0, 0);
        
        // Convert back to UTC for Supabase
        return { 
          timeStr: timeMatch[1], 
          scheduledAt: new Date(scheduled.getTime() - istOffset).toISOString() 
        };
      };

      const { timeStr, scheduledAt } = parseTime(taskTitle);
      // Clean up title (remove time patterns)
      if (timeStr) {
        taskTitle = taskTitle.replace(timeStr, '').replace(/\btomorrow\b/i, '').replace(/\s+/g, ' ').trim();
      }

      const { error } = await supabase.from('tasks').insert({
        user_id: userId,
        title: taskTitle,
        completed: false,
        via_bot: true,
        date: new Date().toISOString().split('T')[0],
        time: timeStr || 'Any time',
        priority: 'med',
        xp_reward: 50,
        scheduled_at: scheduledAt,
        reminded: false
      });

      if (error) {
        replyText = `❌ Error adding task: ${error.message}`;
      } else {
        replyText = timeStr 
          ? `⚡ Logged, Rider. I'll remind you at ${timeStr}. 🏍️`
          : `⚡ Logged to the grid, Rider. '${taskTitle}' is on your ops list. Stay locked in. 🏍️`;
      }
    } 
    // Command: done <habit name>
    else if (lowerText.startsWith('done ')) {
      const habitName = fullText.substring(5).trim();
      
      // Find habit by name (case-insensitive) for the specific user
      const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .ilike('title', habitName);

      if (habits && habits.length > 0) {
        const habit = habits[0];
        const { error } = await supabase
          .from('habits')
          .update({ 
            completed: true,
            last_completed: new Date().toISOString() 
          })
          .eq('id', habit.id);

        if (error) {
          replyText = `❌ Error updating habit: ${error.message}`;
        } else {
          replyText = `🔥 Habit crushed, Rider. '${habit.title}' marked complete. Keep the streak alive.`;
        }
      } else {
        replyText = `❓ Habit "${habitName}" not found. Check the title spelling.`;
      }
    }
    // Command: habits
    else if (lowerText === 'habits') {
      const { data: habits, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        replyText = `❌ Error fetching habits: ${error.message}`;
      } else if (habits && habits.length > 0) {
        const list = habits.map((h: any, i: number) => `${i + 1}. ${h.title} ${h.completed ? '✅' : '⬜'}`).join('\n');
        replyText = `🏍️ Today's Habits:\n${list}`;
      } else {
        replyText = "📭 No habits found, Rider. Stay disciplined.";
      }
    }
    // Command: remind habits <time>
    else if (lowerText.startsWith('remind habits ')) {
      const timeStr = fullText.substring(14).trim();
      const { error } = await supabase
        .from('profiles')
        .update({ habit_reminder_time: timeStr })
        .eq('id', userId);

      if (error) {
        replyText = `❌ Error setting reminder: ${error.message}`;
      } else {
        replyText = `⚡ Reminder locked, Rider. I'll ping you for habits at ${timeStr}. 🏍️`;
      }
    }
    // Command: stats
    else if (lowerText === 'stats') {
      const { data: progress } = await supabase
        .from('progress')
        .select('xp, level, streak, last_active, updated_at')
        .eq('user_id', userId)
        .single();
      
      if (progress) {
        replyText = [
          `🏍️ RIDER STATS`,
          `⚡ XP: ${progress.xp}`,
          `🎯 Level: ${progress.level}`,
          `🔥 Streak: ${progress.streak} days`,
          `Keep riding, Rider.`
        ].join('\n');

      } else {
        replyText = "📭 Progress record not found, Rider. Get on the road.";
      }
    }
    // Command: list tasks
    else if (lowerText === 'list tasks') {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('title')
        .eq('user_id', userId)
        .eq('completed', false);
      
      if (tasks && tasks.length > 0) {
        const list = tasks.map((t: any, i: number) => `${i + 1}. ${t.title}`).join('\n');
        replyText = `📋 ACTIVE OPERATIONS:\n${list}`;
      } else {
        replyText = "✅ No active operations, Rider.";
      }
    }
    // Command: delete task [name]
    else if (lowerText.startsWith('delete task ')) {
      const taskTitle = fullText.substring(12).trim();
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('user_id', userId)
        .ilike('title', `%${taskTitle}%`);
      
      if (error) {
        replyText = `❌ Error scrubbing task: ${error.message}`;
      } else {
        replyText = "🗑️ Operation scrubbed from the grid, Rider.";
      }
    }


    // Send the reply back to Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (botToken) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: replyText,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Telegram Webhook Error]:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
