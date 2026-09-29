import { readJson, writeJson, env, todayIST } from "./util.js";
import { publishGoogle } from "./publishers/google.js";
import { publishInstagram } from "./publishers/instagram.js";
import { publishLinkedIn } from "./publishers/linkedin.js";

const cfg = readJson("config.json", {});
const file = process.argv[2];
if (!file) { console.error("Kullanım: node src/publish.js drafts/<id>.json"); process.exit(1); }
const draft = readJson(file);
if (!draft) { console.error("Taslak okunamadı: " + file); process.exit(1); }
if (draft.status === "published") { console.log("Zaten yayınlanmış."); process.exit(0); }
if (draft.status === "needs_review") { console.error("Taslak doğrulamadan geçmedi (needs_review). Kaynakları kontrol edip status alanını draft yapın."); process.exit(3); }
if (draft.status === "blocked") { console.error("Bu taslak reklam denetiminde engellendi; yayınlanamaz."); process.exit(2); }

const base = env("PUBLIC_BASE_URL", true).replace(/\/$/, "");   // ör. https://KULLANICI.github.io/DEPO
const imageUrl = `${base}/${draft.imagePath.replace(/^docs\//, "")}`;
try {
  let ref;
  if (env("DRY_RUN")) { console.log(`[DRY_RUN] ${draft.platform} yayınlanacaktı. Görsel: ${imageUrl}`); process.exit(0); }
  if (draft.platform === "google") ref = await publishGoogle(draft, imageUrl, cfg.linkUrl);
  else if (draft.platform === "instagram") ref = await publishInstagram(draft, imageUrl);
  else if (draft.platform === "linkedin") ref = await publishLinkedIn(draft);
  else throw new Error("Bilinmeyen platform");
  draft.status = "published"; draft.publishedAt = new Date().toISOString(); draft.ref = ref;
  writeJson(file, draft);
  const pub = readJson("data/published.json", []);
  pub.push({ topic: draft.topic, platform: draft.platform === "linkedin" ? "linkedin_" + (draft.liMode || "kisisel") : draft.platform, branch: draft.branch, date: todayIST(), ref });
  writeJson("data/published.json", pub);
  console.log(`Yayınlandı: ${draft.platform} (${ref})`);
} catch (e) { console.error("Yayın hatası:", e.message); process.exit(1); }
