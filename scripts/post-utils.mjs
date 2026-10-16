/**
 * Чистые функции автопубликации: разбор blogData.ts, слаги, проверки, сборка записи.
 * Вынесены отдельно от publish-post.mjs, чтобы покрыть тестами без обращения к API.
 */

export const BANNED_PHRASES = [
  "в современном мире",
  "в наши дни",
  "не секрет, что",
  "важно понимать",
  "важно отметить",
  "стоит отметить",
  "в этой статье мы рассмотрим",
  "давайте разберёмся",
  "в заключение",
  "подводя итог",
  "таким образом",
  "в конечном счёте",
];

const TRANSLIT = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/** Все посты из blogData.ts: id, слаг, категория и дата - в порядке следования в файле. */
export function parsePosts(blogSrc) {
  const posts = [];
  const re = /id: '([^']+)',\s*\n\s*slug: '([^']+)',\s*\n\s*category: '([^']+)'/g;
  const matches = [...blogSrc.matchAll(re)];
  matches.forEach((m, i) => {
    // Дата лежит дальше в той же записи, после длинного content
    const end = i + 1 < matches.length ? matches[i + 1].index : blogSrc.length;
    const date = blogSrc.slice(m.index, end).match(/date: '([\d-]+)'/);
    posts.push({ id: m[1], slug: m[2], category: m[3], date: date ? date[1] : "" });
  });
  return posts;
}

// ─── График выкладки ──────────────────────────────────────────────────────────

/** Пн, ср, пт (getUTCDay: 0 - воскресенье). */
export const SCHEDULE_DAYS = [1, 3, 5];
/** Час выкладки по Москве. */
export const SCHEDULE_HOUR_MSK = 7;

const DAY_MS = 24 * 60 * 60 * 1000;
const MSK_OFFSET_MS = 3 * 60 * 60 * 1000; // в России нет перехода на летнее время

/**
 * Даты (YYYY-MM-DD, по Москве) плановых выпусков, которые уже должны были выйти
 * к моменту now. Выпуск считается наступившим через graceHours после 07:00 МСК
 * своего дня. Самые свежие - первыми.
 */
export function dueSlots(now = Date.now(), { graceHours = 0, lookbackDays = 21 } = {}) {
  const mskNow = now + MSK_OFFSET_MS;
  const todayStart = Math.floor(mskNow / DAY_MS) * DAY_MS;
  const slots = [];

  for (let d = 0; d <= lookbackDays; d += 1) {
    const dayStart = todayStart - d * DAY_MS;
    const weekday = new Date(dayStart).getUTCDay();
    if (!SCHEDULE_DAYS.includes(weekday)) continue;

    const slotTime = dayStart + (SCHEDULE_HOUR_MSK + graceHours) * 60 * 60 * 1000;
    if (slotTime <= mskNow) slots.push(new Date(dayStart).toISOString().slice(0, 10));
  }
  return slots;
}

/** Сколько плановых выпусков прошло после последнего поста категории. */
export function missedSlots(lastPostDate, slots) {
  return slots.filter((slot) => !lastPostDate || slot > lastPostDate).length;
}

/** Дата последнего поста категории (по полю date, а не по порядку в файле). */
export function lastPostDate(posts, category) {
  return posts
    .filter((p) => p.category === category && p.date)
    .reduce((max, p) => (p.date > max ? p.date : max), "");
}

/** Следующий id в категории: максимальный существующий + 1. */
export function nextId(posts, category) {
  const prefix = category === "psychology" ? "psy" : "sal";
  const max = posts
    .filter((p) => p.category === category)
    .reduce((acc, p) => {
      const n = Number(p.id.split("-")[1]);
      return Number.isFinite(n) && n > acc ? n : acc;
    }, 0);
  return `${prefix}-${max + 1}`;
}

/** Три последних поста той же категории; если их меньше - добираем любыми. */
export function pickRelatedIds(posts, category) {
  const same = posts.filter((p) => p.category === category).map((p) => p.id);
  const ids = same.slice(-3);
  if (ids.length < 3) {
    for (const p of posts.slice().reverse()) {
      if (ids.length >= 3) break;
      if (!ids.includes(p.id)) ids.push(p.id);
    }
  }
  return ids;
}

/**
 * Слаг из темы: транслит, kebab-case, не длиннее восьми слов.
 * Слаг входит в URL поста, поэтому дубль недопустим - к повтору добавляется номер.
 */
export function slugify(text, takenSlugs = []) {
  const base = text
    .toLowerCase()
    .split("")
    .map((ch) => (ch in TRANSLIT ? TRANSLIT[ch] : ch))
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .filter(Boolean)
    .slice(0, 8)
    .join("-");

  const taken = new Set(takenSlugs);
  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

/** Список нарушений правил из CLAUDE.md; пустой массив - пост годен. */
export function validatePost(post) {
  const problems = [];

  const words = post.content.trim().split(/\s+/).filter(Boolean).length;
  if (words < 600 || words > 1100) {
    problems.push(`объём ${words} слов вне диапазона 600-1100`);
  }

  for (const field of ["title", "excerpt", "content", "chartTitle"]) {
    if (String(post[field] ?? "").includes("—")) {
      problems.push(`длинное тире в поле ${field}`);
    }
  }

  const lower = post.content.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) problems.push(`запрещённый оборот «${phrase}»`);
  }

  // Страница поста выводит текст простыми абзацами (content.split("\n\n") -> <p>),
  // markdown там не рендерится: «## Заголовок» или «**жирный**» показались бы как есть
  if (/^\s*#{1,6}\s/m.test(post.content) || /\*\*[^*]+\*\*/.test(post.content)) {
    problems.push("markdown-разметка в тексте: страница выводит только простые абзацы");
  }

  if (post.chartPoints.length < 5 || post.chartPoints.length > 7) {
    problems.push(`точек на графике ${post.chartPoints.length}, нужно 5-7`);
  }

  return problems;
}

export function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function readTimeFor(words) {
  return `${Math.max(3, Math.round(words / 150))} мин`;
}

/** Дата по Москве в формате YYYY-MM-DD. */
export function moscowDate(now = Date.now()) {
  return new Date(now + 3 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

const quoted = (s) => String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
const templated = (s) =>
  String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

/** Литерал объекта поста - ровно в том виде, в каком он лежит в blogData.ts. */
export function buildEntry({ id, slug, category, post, date, readTime, relatedIds }) {
  const chartData = post.chartPoints.map((p) => ({ name: p.name, [post.chartMetric]: p.value }));

  return `  {
    id: '${id}',
    slug: '${slug}',
    category: '${category}',
    title: '${quoted(post.title)}',
    excerpt: '${quoted(post.excerpt)}',
    content: \`${templated(post.content.trim())}\`,
    date: '${date}',
    readTime: '${readTime}',
    chartData: ${JSON.stringify(chartData)},
    chartType: '${post.chartType}',
    chartTitle: '${quoted(post.chartTitle)}',
    relatedIds: ${JSON.stringify(relatedIds)},
  },
`;
}

const ARRAY_END = "\n];\n\nexport const getPsychologyPosts";

/** Вставляет запись последним элементом массива blogPosts. */
export function insertEntry(blogSrc, entry) {
  if (!blogSrc.includes(ARRAY_END)) {
    throw new Error("Не нашёл конец массива blogPosts - формат blogData.ts изменился");
  }
  return blogSrc.replace(ARRAY_END, `\n${entry}];\n\nexport const getPsychologyPosts`);
}
