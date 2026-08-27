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

  // Контент в #root: бот видит текст страницы без выполнения JS,
  // React затем перерисовывает разметку при гидратации.
  if (body) {
    html = html.replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
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

  if (!content) console.warn(`  ! Нет content для ${post.slug} — тело не пререндерено`);

  const body = content
    ? `<article><h1>${escapeText(post.title)}</h1>\n<p>${escapeText(post.excerpt)}</p>\n${paragraphs(content)}</article>`
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
    title: "Мария Лозовая — преподаватель психологии | Psytix",
    description:
      "Мария Лозовая — эксперт по психологии, автор модулей Psytix: когнитивные искажения, эмоциональный интеллект, психология влияния.",
    priority: "0.8",
    changefreq: "monthly",
    body:
      `<h1>Мария Лозовая</h1>\n` +
      `<p>Преподаватель психологии на платформе Psytix. Автор модулей по когнитивным искажениям, эмоциональному интеллекту и психологии влияния.</p>`,
    schemas: [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Лозовая Мария Александровна",
        url: `${SITE}/mariyalozovaya`,
        jobTitle: "Преподаватель психологии",
        worksFor: { "@type": "Organization", name: "Psytix", url: SITE },
      },
      breadcrumbSchema([
        { name: "Главная", url: SITE },
        { name: "Мария Лозовая", url: `${SITE}/mariyalozovaya` },
      ]),
    ],
  },
  {
    route: "/arturgolubev",
    title: "Артур Голубев — преподаватель по продажам | Psytix",
    description:
      "Артур Голубев — эксперт по продажам и переговорам, автор модулей Psytix: SPIN-продажи, работа с возражениями, построение воронки.",
    priority: "0.8",
    changefreq: "monthly",
    body:
      `<h1>Артур Голубев</h1>\n` +
      `<p>Преподаватель по продажам на платформе Psytix. Автор модулей по SPIN-продажам, работе с возражениями и построению воронки.</p>`,
    schemas: [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Голубев Артур Артурович",
        url: `${SITE}/arturgolubev`,
        jobTitle: "Преподаватель по продажам",
        worksFor: { "@type": "Organization", name: "Psytix", url: SITE },
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
