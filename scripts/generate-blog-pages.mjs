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

for (const post of posts) {
  const fullTitle = `${post.title} — Psytix`;
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

  const dir = path.join(DIST, "blog", post.category, post.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

console.log(`Generated ${posts.length} blog post pages in dist/blog/`);
