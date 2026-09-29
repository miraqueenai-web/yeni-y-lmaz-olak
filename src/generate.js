import fs from "node:fs";
import path from "node:path";
import * as P from "./prompts.js";
import * as C from "./claude.js";
import { renderPost } from "./image.js";
import { ROOT, env, readJson, writeJson, loadInventory, allTopicTitles, isPublished, splitBranch, todayIST } from "./util.js";

const cfg = readJson("config.json", {});
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, "").split(/=(.*)/s).slice(0, 2)).map(([k, v]) => [k, v ?? true]));
const STUB = !!env("STUB");

const weekdayIST = () => new Date(Date.now() + 3 * 3600e3).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
const weekNo = () => Math.floor((Date.now() + 3 * 3600e3) / (7 * 864e5));

export function pickSlot() {
  if (args.platform) return { platform: args.platform, liMode: args["li-mode"], igType: args["ig-type"] };
  const slot = (cfg.schedule || []).find((s) => s.day === weekdayIST());
  if (!slot) return null;
  return { ...slot, liMode: slot.liMode === "alternate" ? (weekNo() % 2 ? "kurumsal" : "kisisel") : slot.liMode };
}

async function pickTopic(slot) {
  const platform = slot.platform === "linkedin" ? "linkedin_" + (slot.liMode || "kisisel") : slot.platform;
  const inv = loadInventory();
  if (args.topic) { if (isPublished(inv, args.topic, platform) && !args.force) throw new Error(`Bu konu ${platform} için zaten yayınlanmış (--force ile geç).`); return { topic: args.topic }; }
  const qp = path.join(ROOT, "data/queue.txt");
  if (fs.existsSync(qp)) for (const l of fs.readFileSync(qp, "utf8").split("\n")) { const t = l.trim(); if (t && !t.startsWith("#") && !isPublished(inv, t, platform)) return { topic: t }; }
  if (STUB) return { topic: "Test konusu: kira artış oranı ve itiraz süresi" };
  for (let i = 0; i < 3; i++) { const s = await C.radar(allTopicTitles(), cfg.focusBranches || []); if (!isPublished(inv, s.topic, platform)) { console.log("Radar: " + s.gelisme); return s; } }
  throw new Error("Güncel ve çakışmayan konu bulunamadı.");
}

const section = (t, head) => { const m = t.match(new RegExp(`${head}[^\\n]*\\n([\\s\\S]*?)(?=\\n(?:📱|📝|#️⃣|🎨)|$)`)); return m ? m[1].trim() : ""; };

async function write(platform, topic, opt, res) {
  if (STUB) return `HUKUK_DALI: KİRA HUKUKU\n${topic} | Yılmaz & Çolak Hukuk Bürosu | Karabük Avukat - Safranbolu Avukat\nBu bir test metnidir. Karabük ve Safranbolu.\nhttps://yilmazcolak.av.tr/online-danismanlik`;
  const fb = `BUGÜNÜN TARİHİ: ${todayIST()}. GÜNCEL ARAŞTIRMA (TEK KAYNAĞIN BU; hafızandan somut madde/tarih/künye ekleme, araştırmada olmayanı yazma):\n${res.text}\n\n`;
  if (platform === "google") {
    const fmt = cfg.google?.format === "rotate" ? ["Gündem/Mevzuat", "Aciliyet/Uyarı", "Soru-Cevap/SSS"][weekNo() % 3] : cfg.google.format;
    return C.call({ system: P.GOOGLE, user: `${fb}Konu: ${topic}\nFormat: ${fmt}\nİlk satır HUKUK_DALI olsun. 1500 karakteri aşma.` });
  }
  if (platform === "instagram") return C.call({ system: P.INSTAGRAM, maxTokens: 1600, user: `${fb}Konu: ${topic}\nGönderi türü: ${opt.igType || "Carousel"}` });
  return C.call({ system: opt.liMode === "kurumsal" ? P.LI_KURUMSAL : P.LI_KISISEL, maxTokens: 1600, user: `${fb}Konu: ${topic}${opt.liMode === "kurumsal" ? "\nMakale linki bilmiyorsan https://yilmazcolak.av.tr/ kullan; URL uydurma." : ""}` });
}

async function main() {
  const slot = pickSlot();
  if (!slot) { console.log("Bugün için planlı paylaşım yok."); return; }
  const { platform } = slot;
  const picked = await pickTopic(slot);
  const { topic } = picked;
  console.log(`Platform: ${platform} | Konu: ${topic}`);

  let res = { text: "", sources: [] };
  if (!STUB) {
    try { res = await C.research(topic); }
    catch (e) { if (!env("ALLOW_NO_RESEARCH")) throw e; console.warn("UYARI: araştırma yok, hafızadan üretilecek."); }
    console.log(`Araştırma: ${res.sources.length} kaynak`);
  }
  let raw = await write(platform, topic, slot, res);
  let { branch, text } = splitBranch(raw);
  branch = branch || picked.branch || "AİLE HUKUKU";

  const limit = cfg.google?.maxChars || 1500;
  if (platform === "google") {
    for (let i = 0; i < 2 && text.length > limit; i++) { console.log(`Metin ${text.length} kr, kısaltılıyor...`); text = await C.shorten(text, limit, cfg.google.targetMax || 1430); }
    if (text.length > limit) throw new Error(`Google metni ${text.length} karakter; 1500 sınırı aşıldı.`);
  }

  let comp = STUB ? { durum: "uyumlu", bulgular: [], ozet: "stub" } : await C.checkCompliance(P.COMPLIANCE, text);
  if (comp.durum === "ihlal" && !STUB) {
    console.log("Reklam denetimi İHLAL buldu; düzeltilerek yeniden yazılıyor.");
    text = splitBranch(await C.call({ system: P.GOOGLE.split("KURALLAR")[0], maxTokens: 1600, user: `Aşağıdaki gönderide reklam yasağı ihlali var: ${JSON.stringify(comp.bulgular)}\nİhlalleri kaldırıp aynı içeriği yeniden yaz, uzunluk/biçimi koru. SADECE metni ver.\n\n${text}` })).text;
    comp = await C.checkCompliance(P.COMPLIANCE, text);
  }
  // Doğruluk denetimi: desteklenmeyen iddia varsa bir kez düzelt, yine sorunluysa incelemeye al
  let fact = { durum: "dogru", sorunlar: [] };
  if (!STUB && res.text) {
    fact = await C.factCheck(text, res.text);
    if (fact.durum !== "dogru") {
      console.log("Doğrulama sorun buldu, düzeltiliyor:", JSON.stringify(fact.sorunlar));
      text = splitBranch(await C.call({ maxTokens: 1600, user: `Aşağıdaki gönderide araştırmayla desteklenmeyen iddialar var: ${JSON.stringify(fact.sorunlar)}\nBu iddiaları ARAŞTIRMA'ya göre düzelt veya çıkar; başka bilgi ekleme; biçimi/uzunluğu koru. SADECE metni ver.\n\nARAŞTIRMA:\n${res.text}\n\nGÖNDERİ:\n${text}` })).text;
      fact = await C.factCheck(text, res.text);
    }
    if (platform === "google" && text.length > limit) text = await C.shorten(text, limit, cfg.google.targetMax || 1430);
  }
  const blocked = comp.durum === "ihlal";
  const needsReview = fact.durum !== "dogru";

  // Instagram: caption ve görsel başlığı bölümlerden
  let caption = "", imgTitle = topic;
  if (platform === "instagram") {
    imgTitle = section(text, "📱") || topic;
    caption = [section(text, "📝"), section(text, "#️⃣")].filter(Boolean).join("\n\n") || text;
  }

  const id = `${todayIST()}-${platform}${platform === "linkedin" ? "-" + (slot.liMode || "kisisel") : ""}`;
  const imagePath = `docs/media/${id}.png`;
  fs.mkdirSync(path.join(ROOT, "docs/media"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, imagePath), await renderPost(imgTitle.slice(0, 140), branch));

  const draft = { id, platform, liMode: slot.liMode, igType: slot.igType, topic, branch, text, caption, imagePath, compliance: comp, factCheck: fact, sources: res.sources, researchedOn: todayIST(),
    charCount: text.length, status: blocked ? "blocked" : needsReview ? "needs_review" : "draft", createdAt: new Date().toISOString() };
  writeJson(`drafts/${id}.json`, draft);
  console.log(`Taslak: drafts/${id}.json | ${text.length} kr | denetim: ${comp.durum} | durum: ${draft.status} | kaynak: ${res.sources.length}`);
  if (needsReview) { console.error("Doğrulama tamamen geçmedi: taslak needs_review. Kaynakları kontrol edip status alanını draft yapın."); process.exitCode = 3; }
  if (blocked) { console.error("Reklam yasağı ihlali giderilemedi — yayın engellendi. Taslağı elle düzenleyin."); process.exitCode = 2; }
}
if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e.message); process.exit(1); });
