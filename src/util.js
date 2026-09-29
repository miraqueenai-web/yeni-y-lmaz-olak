import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8")); } catch { return d; } };
export const writeJson = (p, v) => { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), JSON.stringify(v, null, 2)); };
export const env = (k, req = false) => { const v = process.env[k]; if (req && !v) throw new Error(`Eksik ortam değişkeni: ${k}`); return v; };

export const LAW_BRANCHES = ["AİLE HUKUKU", "CEZA HUKUKU", "İŞ HUKUKU", "KİRA HUKUKU", "TÜKETİCİ HUKUKU", "KVKK", "İCRA-İFLAS HUKUKU", "MİRAS HUKUKU", "TRAFİK & TAZMİNAT", "GAYRİMENKUL HUKUKU", "KURUMSAL"];

const tr = (s) => s.toLocaleLowerCase("tr-TR").replace(/\s+/g, " ").trim();
export const normTopic = (s) => tr(s || "");
export const key = (topic, platform) => `${normTopic(topic)}|${platform}`;

/** Yayınlanmış envanter: data/published.json + data/inventory/*.txt (her satır bir konu; dosya adı = platform) */
export function loadInventory() {
  const set = new Set();
  const list = readJson("data/published.json", []);
  for (const e of list) set.add(key(e.topic, e.platform));
  const dir = path.join(ROOT, "data/inventory");
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".txt")) continue;
      const platform = f.replace(/\.txt$/, "");
      for (const line of fs.readFileSync(path.join(dir, f), "utf8").split("\n")) {
        const t = line.trim(); if (t) set.add(key(t, platform));
      }
    }
  }
  return set;
}
export const allTopicTitles = () => {
  const out = new Set(readJson("data/published.json", []).map((e) => e.topic));
  const dir = path.join(ROOT, "data/inventory");
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) if (f.endsWith(".txt"))
    for (const l of fs.readFileSync(path.join(dir, f), "utf8").split("\n")) if (l.trim()) out.add(l.trim());
  return [...out];
};
export const isPublished = (inv, topic, platform) => inv.has(key(topic, platform));

/** LinkedIn "little text" biçiminde ayrılmış karakterleri kaçırır (# hashtag için bırakılır). */
export const escapeLinkedIn = (s) => s.replace(/([\\|{}@\[\]()<>*_~])/g, "\\$1");

/** Sonucu HUKUK_DALI satırından ayrıştırır. */
export function splitBranch(text) {
  const m = text.match(/^\s*HUKUK_DALI:\s*(.+)$/im);
  let branch = null;
  if (m) {
    const b = tr(m[1]).toLocaleUpperCase("tr-TR");
    branch = LAW_BRANCHES.find((x) => x === b) || LAW_BRANCHES.find((x) => b.includes(x.split(" ")[0])) || null;
    text = text.replace(/^\s*HUKUK_DALI:.*$/im, "").replace(/^\s+/, "");
  }
  return { branch, text: text.trim() };
}

export const todayIST = () => new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10);
