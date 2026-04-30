const TG_BOT_TOKEN = "8697543831:AAH2ZKA4EHnP78w-MPoShV5xRxmVppD_ZuY";
const TG_CHAT_ID = "-5294418961";

interface LeadData {
  name: string;
  email: string;
  interest?: string;
  comment?: string;
  page: string;
  button: string;
}

export async function sendLeadToTelegram(data: LeadData): Promise<void> {
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

  lines.push("", `⏰ ${now}`);

  try {
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: lines.join("\n"),
        parse_mode: "HTML",
      }),
    });
  } catch {
    // не блокируем форму если TG недоступен
  }
}
