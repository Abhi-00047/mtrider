import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    // Validate request
    if (!message) {
      return NextResponse.json({ ok: false, error: 'Message is required' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || process.env.ALLOWED_CHAT_ID;

    // Ensure environment variables are present
    if (!botToken || !chatId) {
      console.error('[Telegram Send] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
      return NextResponse.json({ ok: false, error: 'Telegram configuration missing' }, { status: 500 });
    }

    // Call Telegram API
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[Telegram Send API Error]:', result);
      return NextResponse.json({ 
        ok: false, 
        error: result.description || 'Failed to send message' 
      }, { status: response.status });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Telegram Send Error]:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
