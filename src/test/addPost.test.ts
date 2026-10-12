import { describe, it, expect } from "vitest";
import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

// Скрипт добавления готового поста запускаем как настоящий CLI, но на копии
// данных во временной папке (PSYTIX_ROOT): тесты идут параллельно, и правка
// настоящего blogData.ts, даже с откатом, ломала бы соседние файлы тестов.

const REPO = process.cwd();
const SCRIPT = path.join(REPO, "scripts/add-post.mjs");
const BLOG_DATA = path.join(REPO, "src/data/blogData.ts");

function validPost(overrides: Record<string, unknown> = {}) {
  return {
    title: "Как отработать возражение о цене",
    excerpt: "Анонс из двух предложений. Второе предложение анонса.",
    content: Array.from({ length: 800 }, (_, i) => `слово${i}`).join(" "),
    chartTitle: "Конверсия по неделям",
    chartType: "line",
    chartMetric: "конверсия",
    chartPoints: [
      { name: "Неделя 1", value: 10 },
      { name: "Неделя 2", value: 14 },
      { name: "Неделя 3", value: 19 },
      { name: "Неделя 4", value: 23 },
      { name: "Неделя 5", value: 28 },
    ],
    ...overrides,
  };
}

/** Запускает скрипт на копии данных и возвращает код выхода, вывод и новый blogData. */
function run(category: string, post: unknown) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "addpost-"));
  fs.mkdirSync(path.join(root, "src/data"), { recursive: true });
  fs.mkdirSync(path.join(root, "content-plan"), { recursive: true });

  const original = fs.readFileSync(BLOG_DATA, "utf-8");
  const copy = path.join(root, "src/data/blogData.ts");
  fs.writeFileSync(copy, original);
  fs.writeFileSync(path.join(root, "content-plan/state.json"), '{"psy": 0, "sal": 0}\n');

  const postFile = path.join(root, "post.json");
  fs.writeFileSync(postFile, JSON.stringify(post));

  let status = 0;
  let output = "";
  try {
    output = execFileSync("node", [SCRIPT, category, postFile], {
      cwd: REPO,
      encoding: "utf-8",
      env: { ...process.env, PSYTIX_ROOT: root },
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const e = error as { status?: number; stdout?: string; stderr?: string };
    status = e.status ?? 1;
    output = `${e.stdout ?? ""}${e.stderr ?? ""}`;
  }

  const result = fs.readFileSync(copy, "utf-8");
  fs.rmSync(root, { recursive: true, force: true });

  return { status, output, blogData: result, unchanged: result === original };
}

describe("scripts/add-post.mjs", () => {
  it("добавляет корректный пост и сообщает его адрес", () => {
    const { status, output, blogData } = run("sal", validPost());

    expect(status).toBe(0);
    expect(output).toContain("/blog/sal/");
    expect(blogData).toContain("Как отработать возражение о цене");
  });

  it("не трогает файл, если в посте нет обязательного поля", () => {
    const post = validPost();
    delete (post as Record<string, unknown>).excerpt;

    const { status, output, unchanged } = run("sal", post);

    expect(status).toBe(1);
    expect(output).toContain("excerpt");
    expect(unchanged).toBe(true);
  });

  it("не пропускает длинное тире", () => {
    const { status, output, unchanged } = run("sal", validPost({ title: "Цена — не главное" }));

    expect(status).toBe(1);
    expect(output).toContain("длинное тире");
    expect(unchanged).toBe(true);
  });

  it("не пропускает запрещённый оборот", () => {
    const post = validPost({ content: `таким образом ${validPost().content}` });
    const { status, output, unchanged } = run("sal", post);

    expect(status).toBe(1);
    expect(output).toContain("таким образом");
    expect(unchanged).toBe(true);
  });

  it("отвергает неизвестный тип графика", () => {
    const { status, output, unchanged } = run("sal", validPost({ chartType: "pie" }));

    expect(status).toBe(1);
    expect(output).toContain("chartType");
    expect(unchanged).toBe(true);
  });

  it("отвергает точку графика без числового значения", () => {
    const post = validPost({
      chartPoints: [
        { name: "Неделя 1", value: "много" },
        { name: "Неделя 2", value: 14 },
        { name: "Неделя 3", value: 19 },
        { name: "Неделя 4", value: 23 },
        { name: "Неделя 5", value: 28 },
      ],
    });

    const { status, unchanged } = run("sal", post);
    expect(status).toBe(1);
    expect(unchanged).toBe(true);
  });

  it("не трогает настоящий blogData.ts", () => {
    const before = fs.readFileSync(BLOG_DATA, "utf-8");
    run("sal", validPost());
    expect(fs.readFileSync(BLOG_DATA, "utf-8")).toBe(before);
  });

  it("требует категорию psy или sal", () => {
    const { status, output, unchanged } = run("marketing", validPost());

    expect(status).toBe(1);
    expect(output).toContain("psy|sal");
    expect(unchanged).toBe(true);
  });
});
