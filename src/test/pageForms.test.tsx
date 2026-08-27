import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

const sendLeadToTelegram = vi.fn();
vi.mock("@/lib/telegram", () => ({ sendLeadToTelegram: (data: unknown) => sendLeadToTelegram(data) }));

import BlogPost from "@/pages/BlogPost";
import ModulePage from "@/pages/ModulePage";
import { blogPosts } from "@/data/blogData";

beforeEach(() => {
  sendLeadToTelegram.mockClear();
});

function renderRoute(path: string, pattern: string, element: React.ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={pattern} element={element} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe("Форма заявки на странице статьи", () => {
  const post = blogPosts[blogPosts.length - 1];
  const category = post.category === "psychology" ? "psy" : "sal";

  // Форма появляется после exit-анимации CTA
  async function openForm() {
    renderRoute(`/blog/${category}/${post.slug}`, "/blog/:category/:slug", <BlogPost />);
    fireEvent.click(screen.getAllByRole("button", { name: /Начать обучение/i })[0]);
    return screen.findByPlaceholderText("Ваше имя");
  }

  it("отправляет заявку с названием статьи в теме", async () => {
    const nameInput = await openForm();
    fireEvent.change(nameInput, { target: { value: "Анна" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "a@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Начать обучение/i }));

    expect(sendLeadToTelegram).toHaveBeenCalledTimes(1);
    const data = sendLeadToTelegram.mock.calls[0][0];
    expect(data.name).toBe("Анна");
    expect(data.email).toBe("a@example.com");
    expect(data.button).toContain(post.title);
  });

  it("не отправляет заявку без email", async () => {
    const nameInput = await openForm();
    fireEvent.change(nameInput, { target: { value: "Анна" } });
    fireEvent.click(screen.getByRole("button", { name: /Начать обучение/i }));

    expect(sendLeadToTelegram).not.toHaveBeenCalled();
  });
});

describe("Форма записи на модуль", () => {
  function openForm() {
    renderRoute("/module/psy-1", "/module/:id", <ModulePage />);
    fireEvent.click(screen.getAllByRole("button", { name: /Записаться на модуль|Начать обучение/i })[0]);
  }

  it("отправляет заявку с названием модуля", () => {
    openForm();
    fireEvent.change(screen.getByPlaceholderText("Ваше имя *"), { target: { value: "Игорь" } });
    fireEvent.change(screen.getByPlaceholderText("Email *"), { target: { value: "i@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Отправить заявку/i }));

    expect(sendLeadToTelegram).toHaveBeenCalledTimes(1);
    const data = sendLeadToTelegram.mock.calls[0][0];
    expect(data.name).toBe("Игорь");
    expect(data.button).toContain("Когнитивные искажения");
  });

  it("не отправляет заявку без email", () => {
    openForm();
    fireEvent.change(screen.getByPlaceholderText("Ваше имя *"), { target: { value: "Игорь" } });
    fireEvent.click(screen.getByRole("button", { name: /Отправить заявку/i }));

    expect(sendLeadToTelegram).not.toHaveBeenCalled();
  });
});
