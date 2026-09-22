/**
 * Генерация и публикация одного поста блога.
 *
 *   node scripts/publish-post.mjs psy
 *   node scripts/publish-post.mjs sal
 *
 * Тема берётся из content-plan/<кат>.txt по счётчику в content-plan/state.json.
 * Текст пишет Claude по правилам из CLAUDE.md, всё остальное (id, slug, дата,
 * время чтения, связанные посты) считается детерминированно здесь - модели
 * отдаём только то, что она действительно должна сочинить.
 *
 * Скрипт правит файлы, но не коммитит: коммит, проверку сборки и пуш
 * делает .github/workflows/publish.yml.
 *
 * Коды выхода: 0 - пост добавлен, 2 - контент-план исчерпан, 1 - всё остальное.
 */

import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";
import { jsonSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/json-schema";
import {
  BANNED_PHRASES,
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
const PLAN_DIR = path.join(ROOT, "content-plan");
const STATE_FILE = path.join(PLAN_DIR, "state.json");

const CATEGORY = process.argv[2];
if (CATEGORY !== "psy" && CATEGORY !== "sal") {
  console.error("Укажите категорию: psy или sal");
  process.exit(1);
}

const FULL_CATEGORY = CATEGORY === "psy" ? "psychology" : "sales";

const MODULES = {
  psy: [
    "Когнитивные искажения",
    "Эмоциональный интеллект",
    "Психология влияния",
    "Нейробиология привычек",
    "Управление стрессом",
    "Поведенческая экономика",
    "Психология мотивации",
    "Нейромаркетинг",
  ],
  sal: [
    "Система SPIN-продаж",
    "Построение воронки",
    "Работа с возражениями",
    "Холодные продажи",
    "Социальные продажи",
    "Переговоры и закрытие",
    "Продажи через ценность",
    "Аналитика продаж",
  ],
};

const SYSTEM_PROMPT = `Ты пишешь статьи для блога образовательной платформы Psytix (psytix.ru).
Платформа учит ${CATEGORY === "psy" ? "психологии" : "продажам"}. Модули курса: ${MODULES[CATEGORY].join(" · ")}.

Пиши как живой эксперт-практик, а не как генератор текста. Жёсткие правила:

- Объём статьи 700-900 слов.
- Длинное тире (—) запрещено везде: в тексте, заголовке, анонсе. Только дефис (-).
- Запрещённые обороты: ${BANNED_PHRASES.map((p) => `«${p}»`).join(", ")}.
- Не начинай абзацы одинаково. Не строй симметричные перечисления.
  Максимум один короткий список на статью, и только если он правда нужен.
- Конкретные примеры, реальные цифры и исследования, предложения разной длины,
  где уместно - лёгкая разговорность.
- Ключевой запрос входит в заголовок и первый абзац естественно, без переспама.
- Никаких мета-фраз про «эту статью», «этот пост», «наш блог».
- Статья опирается на релевантный модуль курса и упоминает знания из него.
- Абзацы разделяются пустой строкой.

График к статье не декоративный: он рендерится на странице поста. Придумай
осмысленную метрику по теме, её название по-русски (одно-два слова, например
«влияние» или «конверсия»), и 5-7 точек с подписями по оси X.`;

// Схема ответа: модель возвращает только то, что действительно сочиняет.
// JSON Schema, а не zod - скрипт не должен зависеть от версии zod в приложении.
const POST_FORMAT = jsonSchemaOutputFormat({
  type: "object",
  properties: {
    title: { type: "string", description: "Заголовок статьи с ключевым запросом" },
    excerpt: { type: "string", description: "Анонс на 2-3 предложения" },
    content: { type: "string", description: "Текст статьи, абзацы через пустую строку" },
    chartTitle: { type: "string", description: "Подпись графика" },
    chartType: { type: "string", enum: ["bar", "line", "area"] },
    chartMetric: { type: "string", description: "Название метрики по-русски, одно-два слова" },
    chartPoints: {
      type: "array",
      description: "5-7 точек графика",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "Подпись точки по оси X" },
          value: { type: "number" },
        },
        required: ["name", "value"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "title",
    "excerpt",
    "content",
    "chartTitle",
    "chartType",
    "chartMetric",
    "chartPoints",
  ],
  additionalProperties: false,
});

// ─── Что уже опубликовано ─────────────────────────────────────────────────────

const blogSrc = fs.readFileSync(BLOG_DATA, "utf-8");
const posts = parsePosts(blogSrc);

if (!posts.length) {
  console.error("Не нашёл ни одного поста в blogData.ts - проверь формат файла");
  process.exit(1);
}

// ─── Тема из контент-плана ────────────────────────────────────────────────────

const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
const topics = fs
  .readFileSync(path.join(PLAN_DIR, `${CATEGORY}.txt`), "utf-8")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const index = state[CATEGORY] ?? 0;
if (index >= topics.length) {
  console.error(
    `Контент-план ${CATEGORY} исчерпан: использовано ${index} из ${topics.length} тем. ` +
      `Допишите новые запросы в content-plan/${CATEGORY}.txt`
  );
  process.exit(2);
}

const topic = topics[index];
console.log(`Тема ${index + 1}/${topics.length}: ${topic}`);

// ─── Генерация ────────────────────────────────────────────────────────────────

const client = new Anthropic();

console.log("Генерирую текст...");

let response;
try {
  response = await client.messages.parse({
    model: "claude-opus-5",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: POST_FORMAT,
    },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Напиши статью по запросу: «${topic}».\n\nЭтот запрос должен естественно войти в заголовок и первый абзац.`,
      },
    ],
  });
} catch (error) {
  if (error instanceof Anthropic.AuthenticationError) {
    console.error("Ключ ANTHROPIC_API_KEY не принят");
  } else if (error instanceof Anthropic.RateLimitError) {
    console.error("Упёрлись в лимит запросов, попробуйте позже");
  } else if (error instanceof Anthropic.APIError) {
    console.error(`Ошибка API ${error.status}: ${error.message}`);
  } else {
    console.error("Сбой обращения к API:", error.message);
  }
  process.exit(1);
}

if (response.stop_reason === "refusal") {
  console.error("Модель отказалась отвечать:", response.stop_details?.explanation ?? "");
  process.exit(1);
}

const post = response.parsed_output;
if (!post) {
  console.error("Не удалось разобрать ответ модели по схеме");
  process.exit(1);
}

// ─── Проверки правил ──────────────────────────────────────────────────────────

const problems = validatePost(post);
if (problems.length) {
  console.error("Пост не прошёл проверку:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

// ─── Запись ───────────────────────────────────────────────────────────────────

const id = nextId(posts, FULL_CATEGORY);
const slug = slugify(topic, posts.map((p) => p.slug));
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

state[CATEGORY] = index + 1;
fs.writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`);

// Заголовок нужен workflow для сообщения коммита
fs.writeFileSync(path.join(ROOT, ".post-title"), post.title);

console.log(`Добавлен ${id}: ${post.title}`);
console.log(`  /blog/${CATEGORY}/${slug} · ${words} слов · ${readTimeFor(words)}`);
