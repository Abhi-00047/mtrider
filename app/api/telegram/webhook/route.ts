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
    let replyText = 'Unknown command. Use "add <task>" or "done <habit>".';

    // Command: add <task title>
    if (lowerText.startsWith('add ')) {
      const taskTitle = fullText.substring(4).trim();
      
      // Since it's a private bot, we fetch the first profile to get the user_id
      const { data: profile } = await supabase.from('profiles').select('id').limit(1).single();
      
      if (profile) {
        const { error } = await supabase.from('tasks').insert({
          user_id: profile.id,
          title: taskTitle,
          completed: false,
          via_bot: true,
          date: new Date().toISOString().split('T')[0],
          time: 'Any time',
          priority: 'med',
          xp_reward: 50
        });

        if (error) {
          replyText = `❌ Error adding task: ${error.message}`;
        } else {
          replyText = `🚀 Task added: "${taskTitle}"`;
        }
      } else {
        replyText = '❌ Error: No user profile found in database.';
      }
    } 
    // Command: done <habit name>
    else if (lowerText.startsWith('done ')) {
      const habitName = fullText.substring(5).trim();
      const { data: profile } = await supabase.from('profiles').select('id').limit(1).single();
      
      if (profile) {
        // Find habit by name (case-insensitive)
        const { data: habits } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', profile.id)
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
            replyText = `🔥 Daily habit complete: "${habit.title}"!`;
          }
        } else {
          replyText = `❓ Habit "${habitName}" not found. Check the title spelling.`;
        }
      } else {
        replyText = '❌ Error: No user profile found in database.';
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
