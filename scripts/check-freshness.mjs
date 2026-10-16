/**
 * Проверка, что плановые выпуски блога вышли.
 *
 *   node scripts/check-freshness.mjs                 # что пора публиковать прямо сейчас
 *   node scripts/check-freshness.mjs --grace 4 --fail
 *
 * График: пн/ср/пт в 07:00 МСК, по посту в психологию и в продажи.
 * Для каждой категории считает, сколько плановых выпусков прошло после
 * её последнего поста, и печатает строку для машины:
 *
 *   due psy=0 sal=1
 *
 * --grace N  выпуск считается наступившим через N часов после 07:00 МСК
 *            (сторожу нужен запас, чтобы не поднимать тревогу раньше, чем
 *            отработает повторный запуск расписания);
 * --fail     выйти с кодом 1, если хоть одна категория отстаёт - так
 *            workflow-сторож падает и GitHub присылает письмо владельцу.
 */

import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import { dueSlots, lastPostDate, missedSlots, parsePosts } from "./post-utils.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.PSYTIX_ROOT ? path.resolve(process.env.PSYTIX_ROOT) : path.resolve(HERE, "..");
const BLOG_DATA = path.join(ROOT, "src/data/blogData.ts");

const args = process.argv.slice(2);
const graceIndex = args.indexOf("--grace");
const graceHours = graceIndex === -1 ? 0 : Number(args[graceIndex + 1]);
const shouldFail = args.includes("--fail");

if (!Number.isFinite(graceHours) || graceHours < 0) {
  console.error("--grace ожидает неотрицательное число часов");
  process.exit(1);
}

// PSYTIX_NOW - только для тестов: зафиксировать «сейчас»
const now = process.env.PSYTIX_NOW ? Date.parse(process.env.PSYTIX_NOW) : Date.now();

const posts = parsePosts(fs.readFileSync(BLOG_DATA, "utf-8"));
const slots = dueSlots(now, { graceHours });

const report = {};
for (const [short, full, label] of [
  ["psy", "psychology", "психология"],
  ["sal", "sales", "продажи"],
]) {
  const last = lastPostDate(posts, full);
  const missed = missedSlots(last, slots);
  report[short] = missed;
  const status = missed === 0 ? "в графике" : `пропущено выпусков: ${missed}`;
  console.log(`${label}: последний пост ${last || "нет"}, ${status}`);
}

console.log(`Последний плановый выпуск: ${slots[0] ?? "нет в окне проверки"}`);
console.log(`due psy=${report.psy} sal=${report.sal}`);

if (shouldFail && (report.psy > 0 || report.sal > 0)) {
  console.error(
    "::error::Плановый выпуск блога не вышел. Проверьте расписание Claude Code (Routines) - " +
      "см. раздел «Автопубликация» в CLAUDE.md."
  );
  process.exit(1);
}
