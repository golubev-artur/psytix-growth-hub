import { describe, it, expect } from "vitest";
import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import * as utils from "../../scripts/post-utils.mjs";

const { dueSlots, missedSlots, lastPostDate, parsePosts } = utils;

const REPO = process.cwd();
const SCRIPT = path.join(REPO, "scripts/check-freshness.mjs");

// Время в тестах задаём по Москве, чтобы было видно, о каком моменте речь
const msk = (iso: string) => Date.parse(`${iso}+03:00`);

describe("dueSlots: какие выпуски уже должны были выйти", () => {
  it("в понедельник до 07:00 последним выпуском считается пятница", () => {
    expect(dueSlots(msk("2026-10-19T06:30:00"))[0]).toBe("2026-10-16");
  });

  it("в понедельник после 07:00 наступает понедельничный выпуск", () => {
    expect(dueSlots(msk("2026-10-19T07:05:00"))[0]).toBe("2026-10-19");
  });

  it("запас по времени откладывает наступление выпуска", () => {
    const at = msk("2026-10-19T09:00:00");
    expect(dueSlots(at, { graceHours: 4 })[0]).toBe("2026-10-16");
    expect(dueSlots(msk("2026-10-19T11:30:00"), { graceHours: 4 })[0]).toBe("2026-10-19");
  });

  it("берёт только пн, ср и пт", () => {
    const slots = dueSlots(msk("2026-10-18T12:00:00"), { lookbackDays: 7 }); // воскресенье
    expect(slots).toEqual(["2026-10-16", "2026-10-14", "2026-10-12"]);
  });

  it("не ошибается с датой поздно вечером по UTC", () => {
    // 23:30 МСК пятницы - это ещё пятница, хотя в UTC уже 20:30 того же дня
    expect(dueSlots(msk("2026-10-16T23:30:00"))[0]).toBe("2026-10-16");
  });
});

describe("missedSlots: сколько выпусков пропущено", () => {
  const slots = ["2026-10-16", "2026-10-14", "2026-10-12"];

  it("ноль, если последний пост вышел в последний выпуск", () => {
    expect(missedSlots("2026-10-16", slots)).toBe(0);
  });

  it("ловит пропуск 14 октября: на утро среды после ретрая постов нет", () => {
    // Так было на самом деле: последние посты 12-го, выпуск 14-го оборвался
    const wednesday = dueSlots(msk("2026-10-14T11:30:00"), { graceHours: 4 });
    expect(missedSlots("2026-10-12", wednesday)).toBe(1);
  });

  it("досыпание в другой день закрывает пропущенный выпуск", () => {
    // Пост, опубликованный во вторник, покрывает понедельничный выпуск
    expect(missedSlots("2026-10-13", ["2026-10-12"])).toBe(0);
  });

  it("категория без постов отстаёт на все выпуски", () => {
    expect(missedSlots("", slots)).toBe(3);
  });
});

describe("lastPostDate и даты в parsePosts", () => {
  const src = fs.readFileSync(path.join(REPO, "src/data/blogData.ts"), "utf-8");
  const posts = parsePosts(src);

  it("parsePosts достаёт дату у каждого поста", () => {
    expect(posts.every((p: { date: string }) => /^\d{4}-\d{2}-\d{2}$/.test(p.date))).toBe(true);
  });

  it("берёт максимальную дату категории, а не последнюю запись в файле", () => {
    const fake = [
      { id: "psy-2", category: "psychology", date: "2026-10-16" },
      { id: "psy-1", category: "psychology", date: "2026-01-01" },
      { id: "sal-1", category: "sales", date: "2026-10-20" },
    ];
    expect(lastPostDate(fake, "psychology")).toBe("2026-10-16");
  });
});

describe("scripts/check-freshness.mjs", () => {
  function run(now: string, dates: { psy: string; sal: string }, args: string[] = []) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "freshness-"));
    fs.mkdirSync(path.join(root, "src/data"), { recursive: true });
    fs.writeFileSync(
      path.join(root, "src/data/blogData.ts"),
      `export const blogPosts = [
  {
    id: 'psy-1',
    slug: 'a',
    category: 'psychology',
    title: 'A',
    date: '${dates.psy}',
  },
  {
    id: 'sal-1',
    slug: 'b',
    category: 'sales',
    title: 'B',
    date: '${dates.sal}',
  },
];
`
    );

    let status = 0;
    let output = "";
    try {
      output = execFileSync("node", [SCRIPT, ...args], {
        encoding: "utf-8",
        env: { ...process.env, PSYTIX_ROOT: root, PSYTIX_NOW: `${now}+03:00` },
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (error) {
      const e = error as { status?: number; stdout?: string; stderr?: string };
      status = e.status ?? 1;
      output = `${e.stdout ?? ""}${e.stderr ?? ""}`;
    }
    fs.rmSync(root, { recursive: true, force: true });
    return { status, output };
  }

  it("молчит, когда всё в графике", () => {
    const { status, output } = run("2026-10-16T12:00:00", { psy: "2026-10-16", sal: "2026-10-16" }, ["--grace", "4", "--fail"]);
    expect(status).toBe(0);
    expect(output).toContain("due psy=0 sal=0");
  });

  it("падает, если выпуск не вышел - это и есть письмо от GitHub", () => {
    const { status, output } = run("2026-10-14T11:30:00", { psy: "2026-10-12", sal: "2026-10-12" }, ["--grace", "4", "--fail"]);
    expect(status).toBe(1);
    expect(output).toContain("due psy=1 sal=1");
    expect(output).toContain("Плановый выпуск блога не вышел");
  });

  it("видит отставание одной категории", () => {
    const { output } = run("2026-10-16T08:00:00", { psy: "2026-10-16", sal: "2026-10-12" });
    expect(output).toContain("due psy=0 sal=2");
  });

  it("без --fail только сообщает, не падая", () => {
    const { status } = run("2026-10-14T11:30:00", { psy: "2026-10-12", sal: "2026-10-12" });
    expect(status).toBe(0);
  });
});
