import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SITE = "https://psytix.ru";

const blogSrc = fs.readFileSync(path.join(ROOT, "src/data/blogData.ts"), "utf-8");

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

const template = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

function escapeHtml(str) {
  return str
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

// Тело статьи: h1 + excerpt + абзацы (mirrors BlogPost.tsx: content.split("\n\n") -> <p>)
function renderBody(title, excerpt, content) {
  const paras = content
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeText(p)}</p>`)
    .join("\n");
  return `<article><h1>${escapeText(title)}</h1>\n<p>${escapeText(excerpt)}</p>\n${paras}</article>`;
}

for (const post of posts) {
  const fullTitle = `${post.title} - Psytix`;
  const url = `${SITE}/blog/${post.category}/${post.slug}`;
  const safeTitle = escapeHtml(fullTitle);
  const safeDesc = escapeHtml(post.excerpt);

  let html = template;

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${safeTitle}</title>`
  );

  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${safeDesc}" />`
  );

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
    `<meta property="og:type" content="article" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}" />`
  );

  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${safeDesc}" />`
  );

  // ── Данные поста для тела и разметки ──
  const content = fieldAfterSlug(post.slug, /content:\s*`([\s\S]*?)`\s*,/);
  const date = fieldAfterSlug(post.slug, /date:\s*'([^']+)'/) || "";
  const imgField = fieldAfterSlug(post.slug, /image:\s*'([^']+)'/);
  const img = imgField ? `${SITE}${imgField}` : `${SITE}/og-image.png`;
  const author = post.category === "psy" ? "Лозовая Мария Александровна" : "Голубев Артур Артурович";

  // og:image — заменяем дефолт на картинку поста (без дублей)
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/?>/,
    () => `<meta property="og:image" content="${img}" />`
  );

  // Тело статьи в #root (бот видит полный текст без JS)
  if (content) {
    html = html.replace(
      '<div id="root"></div>',
      () => `<div id="root">${renderBody(post.title, post.excerpt, content)}</div>`
    );
  } else {
    console.warn(`  ! Нет content для ${post.slug} — тело не пререндерено`);
  }

  // Article + BreadcrumbList schema (в статике их не было — bot видел 0)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: date,
    url,
    image: img,
    publisher: {
      "@type": "Organization",
      name: "Psytix",
      logo: { "@type": "ImageObject", url: `${SITE}/favicon.svg` },
    },
    author: { "@type": "Person", name: author },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE },
      { "@type": "ListItem", position: 2, name: "Блог", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };
  const headExtra =
    `  <link rel="canonical" href="${url}" />\n` +
    `  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>\n` +
    `  <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>\n  `;
  html = html.replace("</head>", () => headExtra + "</head>");

  const dir = path.join(DIST, "blog", post.category, post.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

console.log(`Generated ${posts.length} blog post pages in dist/blog/`);
