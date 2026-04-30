const TG_BOT_TOKEN = "8697543831:AAH2ZKA4EHnP78w-MPoShV5xRxmVppD_ZuY";
const TG_CHAT_ID = "-5294418961";

interface LeadData {
  name: string;
  email: string;
  interest?: string;
  comment?: string;
  page: string;
  button: string;
  quizAnswers?: string;
  recommendations?: string;
}

export function sendLeadToTelegram(data: LeadData): void {
  const now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

  const lines = [
    "🔔 <b>Новая заявка — psytix.ru</b>",
    "",
    `📍 <b>Страница:</b> ${data.page}`,
    `🖱 <b>Кнопка:</b> ${data.button}`,
    "",
    `👤 <b>Имя:</b> ${data.name}`,
    `📧 <b>Email:</b> ${data.email}`,
  ];

  if (data.interest) lines.push(`💬 <b>Интерес:</b> ${data.interest}`);
  if (data.comment) lines.push(`📝 <b>Комментарий:</b> ${data.comment}`);
  if (data.quizAnswers) lines.push("", `📋 <b>Ответы квиза:</b>\n${data.quizAnswers}`);
  if (data.recommendations) lines.push("", `🎯 <b>Рекомендованные модули:</b>\n${data.recommendations}`);

  lines.push("", `⏰ ${now}`);

  const text = lines.join("\n");
  const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${encodeURIComponent(TG_CHAT_ID)}&text=${encodeURIComponent(text)}&parse_mode=HTML`;

  // GET-запрос — не требует CORS preflight, fire-and-forget
  fetch(url, { mode: "no-cors" }).catch(() => {});
}
