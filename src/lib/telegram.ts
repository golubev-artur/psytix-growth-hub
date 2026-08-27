// Заявки уходят через серверный прокси, а не напрямую в Telegram.
// Причины: api.telegram.org заблокирован у посетителей из РФ (прямой fetch
// из браузера не проходит), токен бота не должен попадать в клиентский бандл,
// а длинная заявка из квиза не влезала в query-строку GET-запроса.
// Сервер — ~/sites/golubev-consulting/client-api/server.js,
// готовый роут лежит в server/lead-psytix.route.cjs этого репозитория.
// НЕ переписывай обратно на прямой вызов Telegram API — заявки перестанут доходить.
const LEAD_ENDPOINT = "https://api.golubev-consulting.ru/lead-psytix";

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  comment?: string;
  page: string;
  button: string;
  quizAnswers?: string;
  recommendations?: string;
  messenger?: string;
  messengerContact?: string;
}

/**
 * Отправляет заявку fire-and-forget: формы показывают успех сразу,
 * не дожидаясь ответа сервера — как и раньше. keepalive нужен, чтобы
 * запрос пережил уход со страницы сразу после отправки.
 * Текст сообщения собирает сервер, клиент шлёт только поля заявки.
 */
export function sendLeadToTelegram(data: LeadData): void {
  fetch(LEAD_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    keepalive: true,
  }).catch(() => {});
}
