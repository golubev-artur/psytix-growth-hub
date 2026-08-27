import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const sendLeadToTelegram = vi.fn();
vi.mock("@/lib/telegram", () => ({ sendLeadToTelegram: (data: unknown) => sendLeadToTelegram(data) }));

import Footer from "@/components/psytix/Footer";
import ValueCalculator from "@/components/psytix/ValueCalculator";
import QuizTest from "@/components/psytix/QuizTest";
import AIChatAssistant from "@/components/psytix/AIChatAssistant";

beforeEach(() => {
  sendLeadToTelegram.mockClear();
});

function lead() {
  expect(sendLeadToTelegram).toHaveBeenCalledTimes(1);
  return sendLeadToTelegram.mock.calls[0][0];
}

// ─── Футер: подписка одним полем ─────────────────────────────────────────────

describe("Форма в футере", () => {
  it("отправляет заявку с email", () => {
    render(<Footer />);
    fireEvent.change(screen.getByPlaceholderText("Ваш email"), {
      target: { value: "  lead@example.com  " },
    });
    fireEvent.click(screen.getByRole("button", { name: /Начать/i }));

    expect(lead()).toMatchObject({
      email: "lead@example.com",
      button: "Footer → Начать (email)",
    });
    expect(screen.getByText(/Заявка отправлена/i)).toBeInTheDocument();
  });

  it("не отправляет пустую форму и остаётся на месте", () => {
    render(<Footer />);
    fireEvent.click(screen.getByRole("button", { name: /Начать/i }));

    expect(sendLeadToTelegram).not.toHaveBeenCalled();
    expect(screen.getByPlaceholderText("Ваш email")).toBeInTheDocument();
  });
});

// ─── Калькулятор ценности: ROI-отчёт ─────────────────────────────────────────

describe("Форма ROI-отчёта в калькуляторе", () => {
  function openForm() {
    render(<ValueCalculator />);
    fireEvent.click(screen.getByRole("button", { name: /Получить персональный расчёт|ROI-отчёт/i }));
  }

  it("отправляет заявку с контактом и расчётом", () => {
    openForm();
    fireEvent.change(screen.getByPlaceholderText("Ваше имя"), { target: { value: "Пётр" } });
    fireEvent.change(screen.getByPlaceholderText(/Телефон/), { target: { value: "+79990000000" } });
    fireEvent.click(screen.getByRole("button", { name: /Отправить|Получить расчёт/i }));

    const data = lead();
    expect(data.name).toBe("Пётр");
    expect(data.phone).toBe("+79990000000");
    expect(data.comment).toContain("Оборот");
    expect(data.button).toContain("ROI");
  });

  it("не отправляет заявку без единого контакта", () => {
    openForm();
    fireEvent.change(screen.getByPlaceholderText("Ваше имя"), { target: { value: "Пётр" } });
    fireEvent.click(screen.getByRole("button", { name: /Отправить|Получить расчёт/i }));

    expect(sendLeadToTelegram).not.toHaveBeenCalled();
  });
});

// ─── Квиз ────────────────────────────────────────────────────────────────────

describe("Форма после квиза", () => {
  // Между вопросами компонент ждёт 300 мс перед переключением экрана
  async function passQuiz() {
    const { container } = render(<QuizTest />);
    for (let guard = 0; guard < 20; guard += 1) {
      const options = container.querySelectorAll<HTMLButtonElement>("button.text-left");
      if (!options.length) break;
      fireEvent.click(options[0]);
      await waitFor(() => {
        const advanced =
          screen.queryByRole("button", { name: /Начать обучение/i }) ||
          container.querySelectorAll("button.text-left")[0] !== options[0];
        expect(advanced).toBeTruthy();
      });
      if (screen.queryByRole("button", { name: /Начать обучение/i })) return;
    }
    throw new Error("Квиз не дошёл до экрана с рекомендациями");
  }

  it("передаёт ответы квиза и рекомендации в заявку", async () => {
    await passQuiz();
    fireEvent.click(screen.getByRole("button", { name: /Начать обучение/i }));

    fireEvent.change(screen.getByPlaceholderText(/Ваше имя/), { target: { value: " Мария " } });
    fireEvent.change(screen.getByPlaceholderText(/Email/), { target: { value: "m@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Отправить заявку/i }));

    const data = lead();
    expect(data.name).toBe("Мария");
    expect(data.email).toBe("m@example.com");
    expect(data.quizAnswers).toBeTruthy();
    expect(data.recommendations).toBeTruthy();
    expect(data.button).toBe("Квиз → Начать обучение");
  });

  it("не ломается, если быстро кликнуть два варианта подряд", async () => {
    const { container } = render(<QuizTest />);
    const options = container.querySelectorAll<HTMLButtonElement>("button.text-left");
    fireEvent.click(options[0]);
    fireEvent.click(options[1]);

    // Текст разбит на несколько узлов — сверяем по содержимому секции
    await waitFor(() => expect(container.textContent).toContain("Вопрос 2 из"));
    expect(container.textContent).not.toContain("Вопрос 3 из");
  });

  it("не отправляет заявку без email", async () => {
    await passQuiz();
    fireEvent.click(screen.getByRole("button", { name: /Начать обучение/i }));

    fireEvent.change(screen.getByPlaceholderText(/Ваше имя/), { target: { value: "Мария" } });
    fireEvent.click(screen.getByRole("button", { name: /Отправить заявку/i }));

    expect(sendLeadToTelegram).not.toHaveBeenCalled();
  });
});

// ─── AI-чат ──────────────────────────────────────────────────────────────────

describe("Форма в AI-чате", () => {
  it("требует email и затем отправляет заявку", () => {
    render(
      <MemoryRouter>
        <AIChatAssistant />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.click(screen.getByRole("button", { name: /Оставить заявку/i }));

    const nameInput = screen.getByPlaceholderText(/Ваше имя/);
    fireEvent.change(nameInput, { target: { value: "Олег" } });

    const form = nameInput.closest("form") as HTMLFormElement;
    fireEvent.submit(form);
    expect(sendLeadToTelegram).not.toHaveBeenCalled();

    fireEvent.change(within(form).getByPlaceholderText(/Email/), {
      target: { value: "o@example.com" },
    });
    fireEvent.submit(form);

    expect(lead()).toMatchObject({
      name: "Олег",
      email: "o@example.com",
      button: "AI-чат → Оставить заявку",
    });
  });
});
