import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
// @ts-expect-error — утилиты автопубликации без типов, это обычный .mjs для Node
import * as utils from "../../scripts/post-utils.mjs";

const {
  buildEntry,
  insertEntry,
  moscowDate,
  nextId,
  parsePosts,
  pickRelatedIds,
  readTimeFor,
  slugify,
  validatePost,
  wordCount,
} = utils;

const blogSrc = fs.readFileSync(path.resolve("src/data/blogData.ts"), "utf-8");

function makePost(overrides: Record<string, unknown> = {}) {
  return {
    title: "Как отработать возражение о цене",
    excerpt: "Короткий анонс из двух предложений. Он объясняет, о чём текст.",
    content: Array.from({ length: 800 }, (_, i) => `слово${i}`).join(" "),
    chartTitle: "Рост конверсии по неделям",
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

describe("разбор blogData.ts", () => {
  const posts = parsePosts(blogSrc);

  it("находит все посты реального файла", () => {
    expect(posts.length).toBeGreaterThan(70);
    expect(posts.every((p) => p.id && p.slug && p.category)).toBe(true);
  });

  it("выдаёт следующий id по максимальному в категории", () => {
    const id = nextId(posts, "psychology");
    const nums = posts
      .filter((p) => p.category === "psychology")
      .map((p) => Number(p.id.split("-")[1]));
    expect(id).toBe(`psy-${Math.max(...nums) + 1}`);
  });

  it("не путает категории при нумерации", () => {
    const fake = [
      { id: "psy-9", slug: "a", category: "psychology" },
      { id: "sal-3", slug: "b", category: "sales" },
    ];
    expect(nextId(fake, "sales")).toBe("sal-4");
    expect(nextId(fake, "psychology")).toBe("psy-10");
  });

  it("берёт три последних поста категории как связанные", () => {
    const related = pickRelatedIds(posts, "sales");
    expect(related).toHaveLength(3);
    const salesIds = posts.filter((p) => p.category === "sales").map((p) => p.id);
    expect(related).toEqual(salesIds.slice(-3));
  });

  it("добирает связанные из другой категории, если своих мало", () => {
    const fake = [
      { id: "psy-1", slug: "a", category: "psychology" },
      { id: "psy-2", slug: "b", category: "psychology" },
      { id: "sal-1", slug: "c", category: "sales" },
    ];
    expect(pickRelatedIds(fake, "sales")).toHaveLength(3);
  });
});

describe("слаги", () => {
  it("транслитерирует тему в kebab-case", () => {
    expect(slugify("Как отработать возражение «дорого»")).toBe("kak-otrabotat-vozrazhenie-dorogo");
  });

  it("обрезает длинную тему до восьми слов", () => {
    const slug = slugify("один два три четыре пять шесть семь восемь девять десять");
    expect(slug.split("-")).toHaveLength(8);
  });

  it("разводит дубли номером — иначе совпадут адреса постов", () => {
    const taken = ["kak-prodavat"];
    expect(slugify("как продавать", taken)).toBe("kak-prodavat-2");
    expect(slugify("как продавать", [...taken, "kak-prodavat-2"])).toBe("kak-prodavat-3");
  });

  it("не выдаёт слаг, который уже есть в реальных данных", () => {
    const posts = parsePosts(blogSrc);
    const slugs = posts.map((p) => p.slug);
    const slug = slugify(posts[0].slug.replace(/-/g, " "), slugs);
    expect(slugs).not.toContain(slug);
  });
});

describe("проверки правил", () => {
  it("пропускает нормальный пост", () => {
    expect(validatePost(makePost())).toEqual([]);
  });

  it("ловит длинное тире в любом поле", () => {
    expect(validatePost(makePost({ title: "Цена — не главное" }))[0]).toContain("title");
    expect(validatePost(makePost({ chartTitle: "Рост — по неделям" }))[0]).toContain("chartTitle");
  });

  it("ловит запрещённые обороты", () => {
    const post = makePost({ content: `${makePost().content} таким образом мы победили` });
    expect(validatePost(post).join(" ")).toContain("таким образом");
  });

  it("ловит слишком короткий и слишком длинный текст", () => {
    expect(validatePost(makePost({ content: "мало слов" })).join(" ")).toContain("вне диапазона");
    const long = Array.from({ length: 1500 }, (_, i) => `с${i}`).join(" ");
    expect(validatePost(makePost({ content: long })).join(" ")).toContain("вне диапазона");
  });

  it("требует 5-7 точек на графике", () => {
    const few = makePost({ chartPoints: [{ name: "a", value: 1 }] });
    expect(validatePost(few).join(" ")).toContain("точек на графике");
  });
});

describe("сборка и вставка записи", () => {
  const entry = buildEntry({
    id: "sal-99",
    slug: "test-slug",
    category: "sales",
    post: makePost(),
    date: "2026-09-22",
    readTime: "5 мин",
    relatedIds: ["sal-1", "sal-2", "sal-3"],
  });

  it("собирает chartData из метрики и точек", () => {
    expect(entry).toContain('"name":"Неделя 1","конверсия":10');
  });

  it("экранирует кавычки и подстановки, чтобы файл остался валидным", () => {
    const tricky = buildEntry({
      id: "sal-99",
      slug: "s",
      category: "sales",
      post: makePost({
        title: "Возражение «я подумаю»' и апостроф",
        content: "Текст с `бэктиком` и ${подстановкой}. " + makePost().content,
      }),
      date: "2026-09-22",
      readTime: "5 мин",
      relatedIds: ["sal-1", "sal-2", "sal-3"],
    });
    expect(tricky).toContain("\\'");
    expect(tricky).toContain("\\`");
    expect(tricky).toContain("\\${");
  });

  it("вставляет пост последним элементом массива", () => {
    const updated = insertEntry(blogSrc, entry);
    const posts = parsePosts(updated);
    expect(posts[posts.length - 1].id).toBe("sal-99");
    expect(posts).toHaveLength(parsePosts(blogSrc).length + 1);
  });

  it("сохраняет экспорты после массива", () => {
    const updated = insertEntry(blogSrc, entry);
    expect(updated).toContain("export const getPostUrl");
    expect(updated).toContain("export const getRelatedPosts");
  });

  it("падает понятно, если формат файла изменился", () => {
    expect(() => insertEntry("const blogPosts = [];", entry)).toThrow(/формат blogData/);
  });
});

describe("мелочи", () => {
  it("считает время чтения от объёма, но не меньше трёх минут", () => {
    expect(readTimeFor(800)).toBe("5 мин");
    expect(readTimeFor(100)).toBe("3 мин");
  });

  it("считает слова без учёта лишних пробелов", () => {
    expect(wordCount("  два   слова  ")).toBe(2);
  });

  it("берёт дату по Москве, а не по UTC", () => {
    // 22 сентября 22:30 UTC - в Москве уже 23-е
    const utcEvening = Date.parse("2026-09-22T22:30:00Z");
    expect(moscowDate(utcEvening)).toBe("2026-09-23");
  });
});
