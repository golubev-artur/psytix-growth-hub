import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SITE = "https://psytix.ru";
const DEFAULT_IMAGE = `${SITE}/og-image.png`;

const blogSrc = fs.readFileSync(path.join(ROOT, "src/data/blogData.ts"), "utf-8");
const coursesSrc = fs.readFileSync(path.join(ROOT, "src/data/courses.ts"), "utf-8");
const detailsSrc = fs.readFileSync(path.join(ROOT, "src/data/moduleDetails.ts"), "utf-8");

// ─── Посты блога ──────────────────────────────────────────────────────────────

const posts = [];
const postRegex =
  /\{\s*id:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*category:\s*'([^']+)',\s*title:\s*'([^']+)',\s*excerpt:\s*(?:'([^']*(?:\\.[^']*)*)'|`([^`]*)`),/g;

let match;
while ((match = postRegex.exec(blogSrc)) !== null) {
  const category = match[3];
  const catPrefix = category === "psychology" ? "psy" : "sal";
  posts.push({
    id: match[1],
    slug: match[2],
    category: catPrefix,
    title: match[4],
    excerpt: (match[5] || match[6] || "").replace(/\\'/g, "'"),
  });
}

console.log(`Found ${posts.length} blog posts`);

// ─── Модули курса (/module/:id) ───────────────────────────────────────────────

const modules = [];
const moduleRegex =
  /\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*icon:\s*\w+,\s*category:\s*"([^"]+)",\s*badgeText:\s*"([^"]*)",[\s\S]*?benefitText:\s*"([^"]*)",/g;

while ((match = moduleRegex.exec(coursesSrc)) !== null) {
  modules.push({
    id: match[1],
    title: match[2],
    description: match[3],
    category: match[4],
    badgeText: match[5],
    benefitText: match[6],
  });
}

console.log(`Found ${modules.length} course modules`);

// fullDescription и FAQ модуля — для пререндера тела и FAQPage-разметки
function moduleDetail(id) {
  const start = detailsSrc.indexOf(`"${id}": {`);
  if (start === -1) return { fullDescription: "", faq: [] };
  const next = detailsSrc.indexOf('\n  "', start + 1);
  const chunk = detailsSrc.slice(start, next === -1 ? undefined : next);

  const descMatch = chunk.match(/fullDescription:\s*`([\s\S]*?)`\s*,/);
  const faqMatch = chunk.match(/faq:\s*\[([\s\S]*?)\],/);
  const faq = [];
  if (faqMatch) {
    const itemRegex = /\{\s*q:\s*"((?:[^"\\]|\\.)*)",\s*a:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
    let f;
    while ((f = itemRegex.exec(faqMatch[1])) !== null) {
      faq.push({ q: f[1].replace(/\\"/g, '"'), a: f[2].replace(/\\"/g, '"') });
    }
  }
  return { fullDescription: descMatch ? descMatch[1] : "", faq };
}

// ─── Утилиты ──────────────────────────────────────────────────────────────────

const template = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeText(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Найти значение поля, идущего после данного slug в blogData.ts
function fieldAfterSlug(slug, re) {
  const i = blogSrc.indexOf(`slug: '${slug}'`);
  if (i === -1) return null;
  const m = blogSrc.slice(i).match(re);
  return m ? m[1] : null;
}

function paragraphs(text) {
  return String(text)
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeText(p)}</p>`)
    .join("\n");
}

function siteNav() {
  return (
    `<nav><ul>` +
    `<li><a href="/">Главная</a></li>` +
    `<li><a href="/blog">Блог Psytix</a></li>` +
    `<li><a href="/mariyalozovaya">Мария Лозовая — Клинический психолог</a></li>` +
    `<li><a href="/arturgolubev">Артур Голубев — Преподаватель по продажам</a></li>` +
    `<li><a href="/reviews">Отзывы</a></li>` +
    `</ul></nav>`
  );
}

function breadcrumbSchema(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Записывает статическую HTML-страницу для маршрута SPA.
 * Без неё GitHub Pages отдаёт по адресу 404.html со статусом 404 —
 * такие URL не индексируются, даже если бот выполняет JS.
 */
function writePage(route, { title, description, ogType = "website", image = DEFAULT_IMAGE, body = "", schemas = [], noindex = false }) {
  const url = route === "/" ? `${SITE}/` : `${SITE}${route}`;
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);

  let html = template;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${safeDesc}" />`
  );
  if (noindex) {
    html = html.replace(
      /<meta name="robots" content="[^"]*"\s*\/?>/,
      `<meta name="robots" content="noindex, follow" />`
    );
  }
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta property="og:type" content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="${ogType}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}" />`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/?>/,
    () => `<meta property="og:image" content="${image}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/?>/,
    () => `<meta name="twitter:image" content="${image}" />`
  );

  // og:locale — вставляем если отсутствует
  if (!/<meta property="og:locale"/.test(html)) {
    html = html.replace(
      /<meta property="og:site_name" content="[^"]*"\s*\/?>/,
      (m) => `${m}\n    <meta property="og:locale" content="ru_RU" />`
    );
  }

  // Канонический адрес: в шаблоне его нет — вставляем, иначе заменяем
  if (/<link rel="canonical"/.test(html)) {
    html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`);
  } else {
    html = html.replace("</head>", () => `  <link rel="canonical" href="${url}" />\n  </head>`);
  }

  if (schemas.length) {
    const ld = schemas
      .map((s) => `  <script type="application/ld+json">${JSON.stringify(s)}</script>\n`)
      .join("");
    html = html.replace("</head>", () => ld + "  </head>");
  }

  if (body) {
    html = html.replace(
      '<div id="root"></div>',
      () => `<div id="root"></div>\n    <noscript>${body}${siteNav()}</noscript>`
    );
  }

  const dir = route === "/" ? DIST : path.join(DIST, route.replace(/^\//, ""));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

// ─── Страницы постов ──────────────────────────────────────────────────────────

const postEntries = [];

for (const post of posts) {
  const fullTitle = `${post.title} - Psytix`;
  const route = `/blog/${post.category}/${post.slug}`;
  const url = `${SITE}${route}`;

  const content = fieldAfterSlug(post.slug, /content:\s*`([\s\S]*?)`\s*,/);
  const date = fieldAfterSlug(post.slug, /date:\s*'([^']+)'/) || "";
  const imgField = fieldAfterSlug(post.slug, /image:\s*'([^']+)'/);
  const img = imgField ? `${SITE}${imgField}` : DEFAULT_IMAGE;
  const author = post.category === "psy" ? "Лозовая Мария Александровна" : "Голубев Артур Артурович";
  const authorLink = post.category === "psy"
    ? `<a href="/mariyalozovaya">Лозовая Мария Александровна</a>`
    : `<a href="/arturgolubev">Голубев Артур Артурович</a>`;

  if (!content) console.warn(`  ! Нет content для ${post.slug} — тело не пререндерено`);

  const body = content
    ? `<article><h1>${escapeText(post.title)}</h1>\n<p>Автор: ${authorLink}</p>\n<p>${escapeText(post.excerpt)}</p>\n${paragraphs(content)}</article>`
    : "";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: date,
    dateModified: date,
    url,
    image: img,
    inLanguage: "ru-RU",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: {
      "@type": "Organization",
      name: "Psytix",
      logo: { "@type": "ImageObject", url: `${SITE}/favicon.svg` },
    },
    author: { "@type": "Person", name: author },
  };

  writePage(route, {
    title: fullTitle,
    description: post.excerpt,
    ogType: "article",
    image: img,
    body,
    schemas: [
      articleSchema,
      breadcrumbSchema([
        { name: "Главная", url: SITE },
        { name: "Блог", url: `${SITE}/blog` },
        { name: post.title, url },
      ]),
    ],
  });

  postEntries.push({ route, lastmod: date, changefreq: "monthly", priority: "0.7" });
}

console.log(`Generated ${posts.length} blog post pages in dist/blog/`);

// ─── Страницы модулей ─────────────────────────────────────────────────────────

const moduleEntries = [];

for (const mod of modules) {
  const route = `/module/${mod.id}`;
  const url = `${SITE}${route}`;
  const categoryLabel = mod.category === "psychology" ? "Психология" : "Продажи";
  const detail = moduleDetail(mod.id);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: mod.title,
      description: mod.description,
      url,
      inLanguage: "ru-RU",
      about: categoryLabel,
      provider: { "@type": "Organization", name: "Psytix", url: SITE },
    },
    breadcrumbSchema([
      { name: "Главная", url: SITE },
      { name: categoryLabel, url: SITE },
      { name: mod.title, url },
    ]),
  ];

  if (detail.faq.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: detail.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  const faqHtml = detail.faq
    .map((f) => `<h2>${escapeText(f.q)}</h2>\n<p>${escapeText(f.a)}</p>`)
    .join("\n");

  writePage(route, {
    title: `${mod.title} — ${categoryLabel} | Psytix`,
    description: `${mod.description} Узнайте этапы обучения, реальные кейсы и статистику результатов. ${mod.benefitText}.`,
    ogType: "article",
    body: `<article><h1>${escapeText(mod.title)}</h1>\n<p>${escapeText(mod.description)}</p>\n${paragraphs(detail.fullDescription)}\n${faqHtml}</article>`,
    schemas,
  });

  moduleEntries.push({ route, changefreq: "monthly", priority: "0.8" });
}

console.log(`Generated ${modules.length} module pages in dist/module/`);

// ─── Остальные маршруты SPA ───────────────────────────────────────────────────

const psyCount = modules.filter((m) => m.category === "psychology").length;
const salesCount = modules.length - psyCount;

const staticRoutes = [
  {
    route: "/",
    title: "Psytix — Психология и продажи в одной системе",
    description:
      "Образовательная платформа нового поколения. 16 научных модулей по психологии и продажам с реальными метриками, практическими инструментами и измеримым результатом.",
    priority: "1.0",
    changefreq: "weekly",
    body:
      `<h1>Psytix — обучение психологии и продажам</h1>\n` +
      `<p>Образовательная платформа нового поколения: ${psyCount} модулей по психологии и ${salesCount} модулей по продажам с научной базой, реальными метриками и практическими инструментами для роста.</p>\n` +
      `<h2>Наши специалисты</h2>\n` +
      `<ul><li><a href="/mariyalozovaya">Мария Лозовая — Клинический психолог, КПТ, гипнотерапия, гештальт</a></li>` +
      `<li><a href="/arturgolubev">Артур Голубев — Преподаватель по продажам, SPIN, работа с возражениями</a></li></ul>\n` +
      `<h2>Модули обучения</h2>\n` +
      `<ul>${modules.map((m) => `<li><a href="/module/${m.id}">${escapeText(m.title)}</a> — ${escapeText(m.description)}</li>`).join("")}</ul>`,
    schemas: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Psytix",
        url: SITE,
        logo: `${SITE}/favicon.svg`,
        description:
          "Образовательная платформа по психологии и продажам. 16 научных модулей с реальными метриками и практическими инструментами.",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: "Russian",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Psytix",
        url: SITE,
        inLanguage: "ru-RU",
      },
    ],
  },
  {
    route: "/blog",
    title: "Блог Psytix — Статьи по психологии и продажам",
    description:
      "Экспертные статьи о психологии влияния, когнитивных искажениях, техниках продаж и эмоциональном интеллекте. Данные, графики, реальные кейсы.",
    priority: "0.9",
    changefreq: "daily",
    body:
      `<h1>Блог Psytix — статьи по психологии и продажам</h1>\n` +
      `<p>Экспертные статьи с графиками и статистикой: психология влияния, когнитивные искажения, эмоциональный интеллект, техники продаж и переговоров.</p>\n` +
      `<p>Авторы блога: <a href="/mariyalozovaya">Мария Лозовая</a> (психология) и <a href="/arturgolubev">Артур Голубев</a> (продажи).</p>\n` +
      `<ul>${posts
        .slice()
        .reverse()
        .map(
          (p) =>
            `<li><a href="/blog/${p.category}/${p.slug}">${escapeText(p.title)}</a> — ${escapeText(p.excerpt)}</li>`
        )
        .join("")}</ul>`,
    schemas: [
      breadcrumbSchema([
        { name: "Главная", url: SITE },
        { name: "Блог", url: `${SITE}/blog` },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Блог Psytix",
        url: `${SITE}/blog`,
        inLanguage: "ru-RU",
        publisher: { "@type": "Organization", name: "Psytix", url: SITE },
      },
    ],
  },
  {
    route: "/reviews",
    title: "Отзывы — Psytix",
    description: "Отзывы студентов платформы Psytix. Реальные результаты обучения психологии и продажам.",
    priority: "0.7",
    changefreq: "monthly",
    body:
      `<h1>Отзывы студентов Psytix</h1>\n` +
      `<p>Реальные результаты обучения психологии и продажам: как выпускники применяют модули Psytix в работе и какие метрики выросли.</p>`,
    schemas: [
      breadcrumbSchema([
        { name: "Главная", url: SITE },
        { name: "Отзывы", url: `${SITE}/reviews` },
      ]),
    ],
  },
  {
    route: "/mariyalozovaya",
    title: "Мария Лозовая — Клинический психолог в Москве | Психотерапия КПТ",
    description:
      "Мария Лозовая — клинический психолог, член Ассоциации когнитивно-поведенческой психотерапии. Более 2 500 часов практики. Психотерапия со взрослыми, детьми и семьями. КПТ, гипнотерапия, гештальт. Приём в Москве и онлайн.",
    priority: "0.9",
    changefreq: "monthly",
    body:
      `<h1>Мария Лозовая — Клинический психолог в Москве</h1>\n` +
      `<p>Клинический психолог, член Ассоциации когнитивно-поведенческой психотерапии. Более 2 500 часов практики. Магистратура — Московский институт психоанализа (клиническая психология). Переквалификация — Первый МГМУ им. И.М. Сеченова (медицинская психология).</p>\n` +
      `<h2>Направления работы</h2>\n` +
      `<ul>\n` +
      `<li>Психотерапия со взрослыми — КПТ, гипнотерапия, гештальт (50–60 мин.)</li>\n` +
      `<li>Психотерапия с детьми и подростками — сказкотерапия, техники Станиславского (50–60 мин.)</li>\n` +
      `<li>Семейная и парная терапия — системный подход (60–90 мин.)</li>\n` +
      `</ul>\n` +
      `<h2>С чем обращаются</h2>\n` +
      `<ul>\n` +
      `<li>Тревожные расстройства и панические атаки</li>\n` +
      `<li>Депрессивные состояния</li>\n` +
      `<li>Низкая самооценка и неуверенность</li>\n` +
      `<li>Проблемы в отношениях</li>\n` +
      `<li>Детские и подростковые трудности</li>\n` +
      `</ul>\n` +
      `<p>Приём в Москве (м. Маяковская) и онлайн. Запись на бесплатную 15-минутную консультацию.</p>`,
    schemas: [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Лозовая Мария Александровна",
        url: `${SITE}/mariyalozovaya`,
        jobTitle: "Клинический психолог",
        description: "Клинический психолог, член Ассоциации когнитивно-поведенческой психотерапии. Более 2 500 часов практики.",
        worksFor: { "@type": "Organization", name: "Psytix", url: SITE },
        address: { "@type": "PostalAddress", addressLocality: "Москва", addressCountry: "RU" },
        knowsAbout: ["КПТ", "когнитивно-поведенческая терапия", "гипнотерапия", "гештальт-терапия", "семейная терапия", "детская психология"],
      },
      breadcrumbSchema([
        { name: "Главная", url: SITE },
        { name: "Мария Лозовая", url: `${SITE}/mariyalozovaya` },
      ]),
    ],
  },
  {
    route: "/arturgolubev",
    title: "Артур Голубев — Бизнес-консультант, эксперт по продажам | Psytix",
    description:
      "Артур Голубев — бизнес-консультант с 12+ годами опыта. 150+ проектов, 87 клиентов. Системный консалтинг: продажи, маркетинг, бизнес-процессы, автоматизация. Обучение продажам и управлению.",
    priority: "0.9",
    changefreq: "monthly",
    body:
      `<h1>Артур Голубев — Бизнес-консультант, эксперт по продажам</h1>\n` +
      `<p>Основатель компании ГОЛУБЕВ КОНСАЛТИНГ. Более 12 лет помогаю бизнесу расти системно — выстраиваю отделы продаж, оптимизирую процессы, внедряю инструменты управления и автоматизации. За плечами 150+ проектов и 87 клиентов из самых разных отраслей.</p>\n` +
      `<h2>Направления экспертизы</h2>\n` +
      `<ul>\n` +
      `<li>Продажи и CRM — аудит отдела продаж, воронки, CRM, скрипты, KPI, мотивация</li>\n` +
      `<li>Бизнес-процессы — описание, оптимизация, регламенты, контроль качества</li>\n` +
      `<li>Маркетинг — стратегия, аналитика, позиционирование, рекламные каналы</li>\n` +
      `<li>Управление и стратегия — OKR, управленческая отчётность, финмодель, антикризис</li>\n` +
      `<li>Персонал и команда — найм, оценка, корпкультура, обучение, кадровый резерв</li>\n` +
      `<li>Технологии и автоматизация — IT-аудит, интеграции, ИИ-инструменты, телефония</li>\n` +
      `<li>Клиентский сервис — CJM, стандарты обслуживания, NPS, программы лояльности</li>\n` +
      `<li>Стратегические сессии — фасилитация, командная синхронизация, план действий</li>\n` +
      `</ul>\n` +
      `<h2>Обучение продажам</h2>\n` +
      `<ul>\n` +
      `<li>Построение отдела продаж с нуля</li>\n` +
      `<li>SPIN-продажи и работа с возражениями</li>\n` +
      `<li>Холодные звонки и лидогенерация</li>\n` +
      `<li>Up-sell, cross-sell, повышение среднего чека</li>\n` +
      `<li>CRM-аналитика и метрики эффективности</li>\n` +
      `<li>Воронка продаж и оптимизация конверсии</li>\n` +
      `<li>Переговоры о цене и тактики закрытия сделок</li>\n` +
      `<li>Автоматизация процессов продаж</li>\n` +
      `</ul>\n` +
      `<h2>Консалтинг</h2>\n` +
      `<ul>\n` +
      `<li>Системный аудит бизнеса — выявление точек роста</li>\n` +
      `<li>Разработка стратегии развития на 1-3 года</li>\n` +
      `<li>Оптимизация бизнес-процессов и регламенты</li>\n` +
      `<li>Внедрение OKR и системы управления по целям</li>\n` +
      `<li>Автоматизация рутинных процессов</li>\n` +
      `</ul>\n` +
      `<h2>Образование</h2>\n` +
      `<ul>\n` +
      `<li>МИРЭА — Российский технологический университет, факультет кибернетики</li>\n` +
      `<li>УРАО — Университет Российской академии образования, факультет экономики и бизнеса</li>\n` +
      `</ul>\n` +
      `<p>Консалтинг и обучение — очно и онлайн. Работаю с бизнесом по всей России и СНГ. Москва, м. Красные ворота, Мясницкая ул., 46 стр. 1.</p>`,
    schemas: [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Голубев Артур Артурович",
        givenName: "Артур",
        familyName: "Голубев",
        url: `${SITE}/arturgolubev`,
        image: `${SITE}/arturgolubev-photo.jpg`,
        jobTitle: "Бизнес-консультант",
        description: "Бизнес-консультант с 12+ годами опыта. Системный консалтинг: продажи, маркетинг, бизнес-процессы, управление, автоматизация.",
        worksFor: { "@type": "Organization", name: "ГОЛУБЕВ КОНСАЛТИНГ" },
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "МИРЭА — Российский технологический университет" },
          { "@type": "CollegeOrUniversity", name: "УРАО — Университет Российской академии образования" },
        ],
        knowsAbout: ["Продажи", "CRM", "Бизнес-процессы", "Маркетинг", "Управление", "OKR", "Автоматизация", "Клиентский сервис"],
        address: { "@type": "PostalAddress", streetAddress: "Мясницкая ул., 46 стр. 1", addressLocality: "Москва", addressCountry: "RU" },
      },
      breadcrumbSchema([
        { name: "Главная", url: SITE },
        { name: "Артур Голубев", url: `${SITE}/arturgolubev` },
      ]),
    ],
  },
  {
    route: "/privacy",
    title: "Политика обработки персональных данных — Psytix",
    description: "Политика обработки персональных данных и использования cookies на платформе Psytix.",
    noindex: true,
    body:
      `<h1>Политика обработки персональных данных</h1>\n` +
      `<p>Условия обработки персональных данных и использования cookies на платформе Psytix.</p>`,
  },
];

const staticEntries = [];

for (const page of staticRoutes) {
  writePage(page.route, page);
  if (!page.noindex) {
    staticEntries.push({ route: page.route, changefreq: page.changefreq, priority: page.priority });
  }
}

console.log(`Generated ${staticRoutes.length} static route pages`);

// ─── sitemap.xml ──────────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10);
const entries = [...staticEntries, ...moduleEntries, ...postEntries];

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  entries
    .map((e) => {
      const loc = e.route === "/" ? `${SITE}/` : `${SITE}${e.route}`;
      return (
        `  <url>\n` +
        `    <loc>${loc}</loc>\n` +
        `    <lastmod>${e.lastmod || today}</lastmod>\n` +
        `    <changefreq>${e.changefreq || "monthly"}</changefreq>\n` +
        `    <priority>${e.priority || "0.5"}</priority>\n` +
        `  </url>\n`
      );
    })
    .join("") +
  `</urlset>\n`;

fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);
console.log(`Generated sitemap.xml with ${entries.length} URLs`);
