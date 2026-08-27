/**
 * Роут приёма заявок с psytix.ru. CommonJS — подключается через require.
 *
 * Куда положить: ~/sites/golubev-consulting/client-api/ на сервере,
 * рядом с server.js — там же, где живёт роут /lead для консалтинга.
 *
 * Как подключить в server.js:
 *
 *   const leadPsytix = require("./lead-psytix.route.cjs");
 *   app.post("/lead-psytix", leadPsytix);
 *
 * Переменные окружения (в тот же .env, что и у /lead):
 *   PSYTIX_TG_BOT_TOKEN — токен бота psytix (НОВЫЙ, после отзыва старого в @BotFather)
 *   PSYTIX_TG_CHAT_ID   — id чата, куда падают заявки
 *
 * CORS: разрешён только https://psytix.ru — заявки принимаются с сайта,
 * а не откуда угодно.
 */

const ALLOWED_ORIGIN = "https://psytix.ru";
const TG_API = "https://api.telegram.org";

// Длина сообщения в Telegram — 4096 символов. Режем с запасом,
// чтобы длинная заявка из квиза дошла обрезанной, а не потерялась целиком.
const MAX_MESSAGE = 4000;
const MAX_FIELD = 1000;

// Простая защита от спама: не больше 5 заявок с одного IP за 10 минут.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const fresh = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  fresh.push(now);
  hits.set(ip, fresh);

  // Чистим старые записи, чтобы Map не рос бесконечно
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(key);
    }
  }

  return fresh.length > RATE_LIMIT;
}

function escapeHtml(value) {
  return String(value)
    .slice(0, MAX_FIELD)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Формат сообщения повторяет тот, что раньше собирался на клиенте
function buildMessage(data) {
  const now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

  const lines = [
    "🔔 <b>Новая заявка — psytix.ru</b>",
    "",
    `📍 <b>Страница:</b> ${escapeHtml(data.page || "—")}`,
    `🖱 <b>Кнопка:</b> ${escapeHtml(data.button || "—")}`,
    "",
    `👤 <b>Имя:</b> ${escapeHtml(data.name || "—")}`,
    `📧 <b>Email:</b> ${escapeHtml(data.email || "—")}`,
  ];

  if (data.phone) lines.push(`📞 <b>Телефон:</b> ${escapeHtml(data.phone)}`);
  if (data.interest) lines.push(`💬 <b>Интерес:</b> ${escapeHtml(data.interest)}`);
  if (data.messenger) lines.push(`📲 <b>Мессенджер:</b> ${escapeHtml(data.messenger)}`);
  if (data.messengerContact) lines.push(`🔗 <b>Контакт:</b> ${escapeHtml(data.messengerContact)}`);
  if (data.comment) lines.push(`📝 <b>Комментарий:</b> ${escapeHtml(data.comment)}`);
  if (data.quizAnswers) lines.push("", `📋 <b>Ответы квиза:</b>\n${escapeHtml(data.quizAnswers)}`);
  if (data.recommendations) lines.push("", `🎯 <b>Рекомендованные модули:</b>\n${escapeHtml(data.recommendations)}`);

  lines.push("", `⏰ ${now}`);

  return lines.join("\n").slice(0, MAX_MESSAGE);
}

function hasContact(data) {
  return [data.email, data.phone, data.messengerContact].some((v) => v && String(v).trim());
}

module.exports = async function leadPsytix(req, res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();

  const token = process.env.PSYTIX_TG_BOT_TOKEN;
  const chatId = process.env.PSYTIX_TG_CHAT_ID;
  if (!token || !chatId) {
    console.error("[lead-psytix] нет PSYTIX_TG_BOT_TOKEN или PSYTIX_TG_CHAT_ID");
    return res.status(500).json({ ok: false, error: "Сервис временно недоступен" });
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.ip || "unknown";
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: "Слишком много заявок, попробуйте позже" });
  }

  const data = req.body || {};
  if (!hasContact(data)) {
    return res.status(400).json({ ok: false, error: "Нужен хотя бы один контакт" });
  }

  try {
    const tgRes = await fetch(`${TG_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(data),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const json = await tgRes.json().catch(() => ({}));
    if (!tgRes.ok || !json.ok) {
      console.error("[lead-psytix] Telegram отказал:", tgRes.status, json.description || "");
      return res.status(502).json({ ok: false, error: "Не удалось отправить заявку" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("[lead-psytix] сбой отправки:", err.message);
    return res.status(502).json({ ok: false, error: "Не удалось отправить заявку" });
  }
};
