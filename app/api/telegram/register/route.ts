import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    // The production URL for the webhook
    const webhookUrl = 'https://mt-rider-iota.vercel.app/api/telegram/webhook';

    if (!botToken) {
      console.error('[Telegram Register] Missing TELEGRAM_BOT_TOKEN');
      return NextResponse.json({ ok: false, error: 'TELEGRAM_BOT_TOKEN environment variable missing' }, { status: 500 });
    }

    // Call Telegram API to set the webhook
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}`;
    const response = await fetch(telegramApiUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error('[Telegram Register API Error]:', data);
    }

    // Return the response directly from Telegram
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Telegram Registration Error]:', error);
    return NextResponse.json({ ok: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
