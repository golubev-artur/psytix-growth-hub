import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRequire } from "module";

// Роут CommonJS-ный, он предназначен для копирования на сервер к server.js
const require = createRequire(import.meta.url);

type Handler = (req: unknown, res: unknown) => Promise<unknown>;

function loadRoute(): Handler {
  // Свежий модуль на каждый тест: у него внутри есть состояние rate-limit
  const path = require.resolve("../../server/lead-psytix.route.cjs");
  delete require.cache[path];
  return require(path);
}

function makeRes() {
  const res = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: undefined as unknown,
    setHeader(k: string, v: string) {
      res.headers[k] = v;
    },
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      res.body = payload;
      return res;
    },
    end() {
      return res;
    },
  };
  return res;
}

function makeReq(body: unknown, ip = "1.2.3.4", method = "POST") {
  return { method, body, headers: { "x-forwarded-for": ip }, ip };
}

const validLead = {
  name: "Иван",
  email: "i@example.com",
  page: "https://psytix.ru/",
  button: "Тест",
};

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  process.env.PSYTIX_TG_BOT_TOKEN = "test-token";
  process.env.PSYTIX_TG_CHAT_ID = "-100500";
  fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.PSYTIX_TG_BOT_TOKEN;
  delete process.env.PSYTIX_TG_CHAT_ID;
});

describe("роут /lead-psytix", () => {
  it("пересылает заявку в Telegram и отвечает ok", async () => {
    const res = makeRes();
    await loadRoute()(makeReq(validLead), res);

    expect(res.body).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.telegram.org/bottest-token/sendMessage");
    const payload = JSON.parse(init.body);
    expect(payload.chat_id).toBe("-100500");
    expect(payload.text).toContain("Иван");
    expect(payload.text).toContain("i@example.com");
  });

  it("отдаёт CORS только для psytix.ru", async () => {
    const res = makeRes();
    await loadRoute()(makeReq(validLead), res);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("https://psytix.ru");
  });

  it("отвечает на preflight без обращения к Telegram", async () => {
    const res = makeRes();
    await loadRoute()(makeReq(null, "1.2.3.4", "OPTIONS"), res);

    expect(res.statusCode).toBe(204);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("не принимает заявку без единого контакта", async () => {
    const res = makeRes();
    await loadRoute()(makeReq({ name: "Иван", page: "/", button: "Тест" }), res);

    expect(res.statusCode).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("экранирует HTML в полях — разметка сообщения не ломается", async () => {
    const res = makeRes();
    await loadRoute()(makeReq({ ...validLead, name: "<b>взлом</b>" }), res);

    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.text).toContain("&lt;b&gt;взлом&lt;/b&gt;");
  });

  it("обрезает сообщение до лимита Telegram", async () => {
    const res = makeRes();
    await loadRoute()(makeReq({ ...validLead, quizAnswers: "я".repeat(20000) }), res);

    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.text.length).toBeLessThanOrEqual(4000);
  });

  it("режет спам с одного IP", async () => {
    const route = loadRoute();
    for (let i = 0; i < 5; i += 1) {
      await route(makeReq(validLead), makeRes());
    }

    const res = makeRes();
    await route(makeReq(validLead), res);

    expect(res.statusCode).toBe(429);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it("не блокирует другой IP из-за чужого лимита", async () => {
    const route = loadRoute();
    for (let i = 0; i < 6; i += 1) {
      await route(makeReq(validLead, "1.1.1.1"), makeRes());
    }

    const res = makeRes();
    await route(makeReq(validLead, "2.2.2.2"), res);
    expect(res.body).toEqual({ ok: true });
  });

  it("сообщает об ошибке, если Telegram отказал", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 400, json: async () => ({ ok: false, description: "chat not found" }) });

    const res = makeRes();
    await loadRoute()(makeReq(validLead), res);

    expect(res.statusCode).toBe(502);
    expect(res.body).toMatchObject({ ok: false });
  });

  it("не падает, если токен не настроен", async () => {
    delete process.env.PSYTIX_TG_BOT_TOKEN;

    const res = makeRes();
    await loadRoute()(makeReq(validLead), res);

    expect(res.statusCode).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
