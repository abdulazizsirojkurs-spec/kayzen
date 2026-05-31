// Kayzen Bot — Vercel serverless function
// Telegram webhook handler. /start ga "Ochish" tugmasi bilan javob beradi.
//
// Setup:
//   1. Bu fayl loyiha root'idagi /api/ papkasida bo'lishi kerak.
//   2. Vercel Environment Variables'da BOT_TOKEN qo'shing.
//   3. Webhook'ni o'rnatish:
//      https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://kayzen-rho.vercel.app/api/bot

const MINI_APP_URL = 'https://kayzen-rho.vercel.app';

module.exports = async (req, res) => {
  // Sog'lik tekshirish — GET bilan ochilsa
  if (req.method !== 'POST') {
    return res.status(200).json({
      status: 'Kayzen bot ishlamoqda',
      hint: 'Telegram webhook POST orqali yuboradi',
    });
  }

  const update = req.body || {};

  try {
    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallback(update.callback_query);
    }
  } catch (e) {
    console.error('Bot error:', e);
  }

  // Telegram'ga har doim 200 qaytarish (xato bo'lsa ham — retry qilmasligi uchun)
  return res.status(200).send('OK');
};

async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = (message.text || '').trim();
  const firstName = (message.from && message.from.first_name) || "do'st";

  // /start yoki /start <payload>
  if (text === '/start' || text.startsWith('/start ')) {
    const welcome =
      `Salom, ${escapeHtml(firstName)}! 👋\n\n` +
      `<b>Kayzen</b> — sizning shaxsiy samaradorlik ilovangiz.\n\n` +
      `📋 Vazifalar va subtasklar\n` +
      `✅ 14 ta kunlik odat (chek list)\n` +
      `🧘 Kunlik kayzen tahlili\n` +
      `📊 Statistika, streak va Pomodoro\n` +
      `☁️ Telefon ↔ noutbuk avtomatik sinxron\n\n` +
      `Ochish uchun pastdagi tugmani bosing 👇`;

    await sendMessage(chatId, welcome, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Kayzen ilovasini ochish', web_app: { url: MINI_APP_URL } }],
        ],
      },
    });
    return;
  }

  // /help
  if (text === '/help' || text === '/yordam') {
    const helpText =
      `<b>Foydalanish:</b>\n\n` +
      `• Pastdagi <b>Kayzen</b> tugmasi — har doim ilovani ochadi\n` +
      `• /start — qayta xush kelibsiz xabari\n` +
      `• /sync — sync kalitingizni ko'rish\n` +
      `• /yangilash — botni qayta ishga tushirish\n\n` +
      `Ma'lumotlar Supabase'da xavfsiz saqlanadi.`;

    await sendMessage(chatId, helpText, {
      reply_markup: {
        inline_keyboard: [[{ text: '🚀 Ochish', web_app: { url: MINI_APP_URL } }]],
      },
    });
    return;
  }

  // /sync — telegram ID asosida sync kalit qaytaradi
  if (text === '/sync') {
    const userId = message.from && message.from.id;
    const syncKey = 'tg-' + userId;
    const msg =
      `<b>Sizning sync kalitingiz:</b>\n\n` +
      `<code>${escapeHtml(syncKey)}</code>\n\n` +
      `Brauzer (PWA)dagi Sozlamalar → Cloud Sync → "📥 Boshqa qurilmadan ulanish" ga shu kalitni kiriting. ` +
      `Shunda telefondagi (Telegram) va kompyuterdagi (brauzer) ma'lumotlar avtomatik sinxron bo'ladi.`;

    await sendMessage(chatId, msg, {});
    return;
  }

  // Boshqa har qanday xabar — yumshoq eslatma
  await sendMessage(chatId, `Quyidagi tugma orqali ilovani oching:`, {
    reply_markup: {
      inline_keyboard: [[{ text: '🚀 Kayzen', web_app: { url: MINI_APP_URL } }]],
    },
  });
}

async function handleCallback(callbackQuery) {
  // Hozircha inline callback ishlatmaymiz, lekin Telegram qayta yuborishini to'xtatish uchun answer
  const cbId = callbackQuery.id;
  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: cbId }),
  }).catch(() => {});
}

async function sendMessage(chatId, text, extra) {
  const token = process.env.BOT_TOKEN;
  if (!token) {
    console.error('BOT_TOKEN o\'rnatilmagan');
    return;
  }
  const body = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...(extra || {}),
  };
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const err = await r.text();
    console.error('sendMessage failed:', r.status, err);
  }
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
