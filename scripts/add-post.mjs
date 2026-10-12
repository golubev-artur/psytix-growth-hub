/**
 * Добавление готового поста в блог - без обращения к API.
 *
 *   node scripts/add-post.mjs psy post.json
 *   cat post.json | node scripts/add-post.mjs sal -
 *
 * Текст пишет тот, кто запускает скрипт (человек или Claude в сессии), а скрипт
 * берёт на себя всё механическое: проверку правил из CLAUDE.md, id, слаг, дату,
 * время чтения, связанные посты и вставку в blogData.ts.
 *
 * Формат post.json:
 * {
 *   "title": "...",
 *   "excerpt": "...",
 *   "content": "Абзац.\n\nАбзац.",
 *   "chartTitle": "...",
 *   "chartType": "bar" | "line" | "area",
 *   "chartMetric": "конверсия",
 *   "chartPoints": [{ "name": "Неделя 1", "value": 10 }, ...],
 *   "topic": "ключевой запрос"   // необязательно: иначе слаг делается из title
 * }
 *
 * Коды выхода: 0 - пост добавлен, 1 - ошибка.
 */

import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import {
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
} from "./post-utils.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const BLOG_DATA = path.join(ROOT, "src/data/blogData.ts");
const STATE_FILE = path.join(ROOT, "content-plan/state.json");

const [, , category, source] = process.argv;

if (category !== "psy" && category !== "sal") {
  console.error("Использование: node scripts/add-post.mjs psy|sal <файл.json|->");
  process.exit(1);
}
if (!source) {
  console.error("Укажите файл с постом или - для чтения из stdin");
  process.exit(1);
}

const FULL_CATEGORY = category === "psy" ? "psychology" : "sales";

// ─── Чтение поста ─────────────────────────────────────────────────────────────

let raw;
try {
  raw = source === "-" ? fs.readFileSync(0, "utf-8") : fs.readFileSync(source, "utf-8");
} catch (error) {
  console.error(`Не смог прочитать пост: ${error.message}`);
  process.exit(1);
}

let post;
try {
  post = JSON.parse(raw);
} catch (error) {
  console.error(`Пост не разобрался как JSON: ${error.message}`);
  process.exit(1);
}

const REQUIRED = ["title", "excerpt", "content", "chartTitle", "chartType", "chartMetric", "chartPoints"];
const missing = REQUIRED.filter((field) => post[field] === undefined);
if (missing.length) {
  console.error(`В посте нет полей: ${missing.join(", ")}`);
  process.exit(1);
}
if (!["bar", "line", "area"].includes(post.chartType)) {
  console.error(`chartType должен быть bar, line или area, а не «${post.chartType}»`);
  process.exit(1);
}
if (!Array.isArray(post.chartPoints)) {
  console.error("chartPoints должен быть массивом");
  process.exit(1);
}
for (const point of post.chartPoints) {
  if (typeof point?.name !== "string" || typeof point?.value !== "number") {
    console.error("Каждая точка графика - это { name: строка, value: число }");
    process.exit(1);
  }
}

// ─── Проверки правил из CLAUDE.md ─────────────────────────────────────────────

const problems = validatePost(post);
if (problems.length) {
  console.error("Пост не прошёл проверку:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

// ─── Запись ───────────────────────────────────────────────────────────────────

const blogSrc = fs.readFileSync(BLOG_DATA, "utf-8");
const posts = parsePosts(blogSrc);
if (!posts.length) {
  console.error("Не нашёл ни одного поста в blogData.ts - проверь формат файла");
  process.exit(1);
}

const id = nextId(posts, FULL_CATEGORY);
const slug = slugify(post.topic || post.title, posts.map((p) => p.slug));
const words = wordCount(post.content);

const entry = buildEntry({
  id,
  slug,
  category: FULL_CATEGORY,
  post,
  date: moscowDate(),
  readTime: readTimeFor(words),
  relatedIds: pickRelatedIds(posts, FULL_CATEGORY),
});

fs.writeFileSync(BLOG_DATA, insertEntry(blogSrc, entry));

// Счётчик контент-плана двигаем, только если тема пришла из плана
if (post.topic && fs.existsSync(STATE_FILE)) {
  const planFile = path.join(ROOT, `content-plan/${category}.txt`);
  if (fs.existsSync(planFile)) {
    const topics = fs
      .readFileSync(planFile, "utf-8")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const found = topics.indexOf(post.topic.trim());
    if (found !== -1) {
      const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
      state[category] = Math.max(state[category] ?? 0, found + 1);
      fs.writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`);
      console.log(`Счётчик ${category} сдвинут на ${state[category]}/${topics.length}`);
    }
  }
}

console.log(`Добавлен ${id}: ${post.title}`);
console.log(`  /blog/${category}/${slug} · ${words} слов · ${readTimeFor(words)}`);
