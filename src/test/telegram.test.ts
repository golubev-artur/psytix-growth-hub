import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendLeadToTelegram } from "@/lib/telegram";
import { hasContact } from "@/lib/leadContact";

describe("sendLeadToTelegram", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function lastCall() {
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    return { url: url as string, init, body: JSON.parse(init.body as string) };
  }

  it("шлёт заявку POST-ом на серверный прокси, а не в Telegram напрямую", () => {
    sendLeadToTelegram({ name: "Иван", email: "i@example.com", page: "/", button: "Тест" });

    const { url, init } = lastCall();
    expect(url).toBe("https://api.golubev-consulting.ru/lead-psytix");
    expect(url).not.toContain("api.telegram.org");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.keepalive).toBe(true);
  });

  it("передаёт все поля заявки", () => {
    const lead = {
      name: "Иван",
      email: "i@example.com",
      phone: "+79990000000",
      interest: "Продажи",
      messenger: "Telegram",
      messengerContact: "@ivan",
      comment: "Комментарий",
      page: "https://psytix.ru/blog",
      button: "Начать обучение",
      quizAnswers: "1. Вопрос\n   → Ответ",
      recommendations: "• Когнитивные искажения",
    };
    sendLeadToTelegram(lead);

    expect(lastCall().body).toEqual(lead);
  });

  it("длинная заявка уходит целиком в теле запроса", () => {
    sendLeadToTelegram({
      name: "Иван",
      email: "i@example.com",
      page: "/",
      button: "Квиз",
      quizAnswers: "я".repeat(20000),
    });

    const { url, body } = lastCall();
    expect(body.quizAnswers).toHaveLength(20000);
    expect(url.length).toBeLessThan(100);
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
