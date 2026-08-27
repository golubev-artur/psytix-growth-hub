import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendLeadToTelegram } from "@/lib/telegram";
import { hasContact } from "@/lib/leadContact";

describe("sendLeadToTelegram", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // Транспорт: GET на api.telegram.org, параметры лежат в query-строке
  function lastCall() {
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [rawUrl, init] = fetchMock.mock.calls[0];
    const url = new URL(rawUrl as string);
    return { url, init, params: url.searchParams };
  }

  it("дёргает sendMessage нужного бота", () => {
    sendLeadToTelegram({ name: "Иван", email: "i@example.com", page: "/", button: "Тест" });

    const { url, init } = lastCall();
    expect(url.origin).toBe("https://api.telegram.org");
    expect(url.pathname).toMatch(/^\/bot[^/]+\/sendMessage$/);
    expect(init.mode).toBe("no-cors");
  });

  it("кладёт chat_id и текст заявки в параметры запроса", () => {
    sendLeadToTelegram({
      name: "Иван",
      email: "i@example.com",
      phone: "+79990000000",
      interest: "Продажи",
      messenger: "Telegram",
      messengerContact: "@ivan",
      comment: "Комментарий",
      page: "https://psytix.ru/blog",
      button: "Начать обучение",
    });

    const { params } = lastCall();
    expect(params.get("chat_id")).toBeTruthy();
    expect(params.get("parse_mode")).toBe("HTML");

    const text = params.get("text") ?? "";
    for (const fragment of [
      "Иван",
      "i@example.com",
      "+79990000000",
      "Продажи",
      "Telegram",
      "@ivan",
      "Комментарий",
      "https://psytix.ru/blog",
      "Начать обучение",
    ]) {
      expect(text).toContain(fragment);
    }
  });

  it("добавляет ответы квиза и рекомендации, когда они переданы", () => {
    sendLeadToTelegram({
      name: "Иван",
      email: "i@example.com",
      page: "/",
      button: "Квиз",
      quizAnswers: "1. Вопрос\n   → Ответ",
      recommendations: "• Когнитивные искажения",
    });

    const text = lastCall().params.get("text") ?? "";
    expect(text).toContain("Ответы квиза");
    expect(text).toContain("→ Ответ");
    expect(text).toContain("Рекомендованные модули");
    expect(text).toContain("Когнитивные искажения");
  });

  // Известное ограничение: длинная заявка уезжает в query-строку целиком.
  // Лимит сообщения Telegram — 4096 символов, длина URL тоже не бесконечна,
  // поэтому такие заявки могут не дойти. Фиксируем поведение как есть —
  // чинится переносом отправки на серверный прокси (см. CLAUDE.md).
  it("передаёт длинную заявку целиком в URL", () => {
    sendLeadToTelegram({
      name: "Иван",
      email: "i@example.com",
      page: "/",
      button: "Квиз",
      quizAnswers: "я".repeat(5000),
    });

    const { url, params } = lastCall();
    expect((params.get("text") ?? "").length).toBeGreaterThan(4096);
    expect(url.href.length).toBeGreaterThan(8000);
  });

  it("не роняет форму, если сеть недоступна", () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    expect(() =>
      sendLeadToTelegram({ name: "Иван", email: "i@example.com", page: "/", button: "Тест" })
    ).not.toThrow();
  });
});

describe("hasContact", () => {
  it("считает заявку контактной, если заполнено хотя бы одно поле", () => {
    expect(hasContact("", "", "@ivan")).toBe(true);
    expect(hasContact("i@example.com")).toBe(true);
  });

  it("отклоняет пустые значения и пробелы", () => {
    expect(hasContact("", undefined, "   ")).toBe(false);
    expect(hasContact()).toBe(false);
  });
});
