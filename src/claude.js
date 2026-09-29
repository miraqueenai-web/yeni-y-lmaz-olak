import { env } from "./util.js";

const URL = "https://api.anthropic.com/v1/messages";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function call({ system, user, maxTokens = 1500, tools }) {
  const body = { model: process.env.CLAUDE_MODEL || "claude-sonnet-5-5", max_tokens: maxTokens, messages: [{ role: "user", content: user }] };
  if (system) body.system = system;
  if (tools) body.tools = tools;
  for (let i = 0; i < 4; i++) {
    const r = await fetch(URL, { method: "POST", headers: { "content-type": "application/json", "x-api-key": env("ANTHROPIC_API_KEY", true), "anthropic-version": "2023-06-01" }, body: JSON.stringify(body) });
    const j = await r.json();
    if (r.ok) return (j.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
    if ([429, 500, 502, 503, 529].includes(r.status) && i < 3) { await sleep(2000 * 2 ** i); continue; }
    throw new Error(`Claude API ${r.status}: ${j.error?.message || JSON.stringify(j)}`);
  }
}

const SEARCH = [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }];
const today = () => new Date().toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul", day: "numeric", month: "long", year: "numeric" });
const MODEL = () => env("CLAUDE_MODEL") || "claude-sonnet-5-5";

/** Ham API yanıtından metin + kaynak URL'lerini çıkarır (web_search sonuçları ve atıflar). */
export function parseResearch(content = []) {
  const text = content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  const urls = new Set();
  for (const b of content) {
    if (b.type === "web_search_tool_result" && Array.isArray(b.content)) for (const r of b.content) if (r.url) urls.add(r.url);
    if (b.type === "text") for (const c of b.citations || []) if (c.url) urls.add(c.url);
  }
  return { text, sources: [...urls] };
}

async function raw(body) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(URL, { method: "POST", headers: { "content-type": "application/json", "x-api-key": env("ANTHROPIC_API_KEY", true), "anthropic-version": "2023-06-01" }, body: JSON.stringify(body) });
    const j = await r.json();
    if (r.ok) return j;
    if ([429, 500, 502, 503, 529].includes(r.status) && i < 3) { await sleep(2000 * 2 ** i); continue; }
    throw new Error(`Claude API ${r.status}: ${j.error?.message || JSON.stringify(j)}`);
  }
}

/** ZORUNLU güncel araştırma: kaynak bulunamazsa hata fırlatır (hafızadan yazmaya izin verilmez). */
export async function research(topic) {
  const j = await raw({ model: MODEL(), max_tokens: 2500, tools: SEARCH,
    system: `Bugünün tarihi: ${today()}. Türk hukuku araştırmacısısın. Yalnızca web aramasında GÖRDÜĞÜN bilgiyi yaz; hafızandan tamamlama yapma. Resmî kaynakları (Resmî Gazete, mevzuat.gov.tr, yargitay.gov.tr, anayasa.gov.tr, TBMM, bakanlık siteleri) tercih et.`,
    messages: [{ role: "user", content: `"${topic}" konusunda Türkiye'deki YÜRÜRLÜKTEKİ güncel durumu araştır: ilgili kanun ve madde numarası, en son değişiklik (hangi kanun/paket, Resmî Gazete tarih-sayı, yürürlük tarihi), güncel Yargıtay/AYM içtihadı, kritik süreler/zamanaşımı/parasal sınırlar. Her maddenin yanına kaynağı yaz. Bulamadığını "bulunamadı" diye belirt. Kısa maddeler.` }] });
  const r = parseResearch(j.content);
  if (!r.text || !r.sources.length) throw new Error(`"${topic}" için güncel kaynak bulunamadı; hafızadan içerik üretilmiyor (ALLOW_NO_RESEARCH=1 ile aşılabilir).`);
  return r;
}

/** Yazılan metindeki her somut iddiayı araştırma metniyle karşılaştırır. */
export async function factCheck(text, researchText) {
  const out = await call({ maxTokens: 900, system: "Titiz bir hukuk doğrulayıcısısın. Yalnızca verilen ARAŞTIRMA'ya dayan.",
    user: `ARAŞTIRMA:\n${researchText}\n\nGÖNDERİ:\n${text}\n\nGönderideki her somut iddiayı (kanun/madde no, tarih, süre, tutar, karar künyesi, "yeni düzenleme" beyanı) araştırmayla karşılaştır. Araştırmada DESTEKLENMEYEN veya ÇELİŞEN iddiaları listele. SADECE JSON: {"durum":"dogru|sorunlu","sorunlar":[{"iddia":"...","neden":"..."}]}` });
  try { return JSON.parse(out.match(/\{[\s\S]*\}/)[0]); } catch { return { durum: "sorunlu", sorunlar: [{ iddia: "-", neden: "Doğrulama yanıtı okunamadı" }] }; }
}

/** Yasa/karar radarı: son 45 günde çıkan gelişmelerden envanterde olmayan tek konu seçer. */
export async function radar(existing, branches) {
  const j = await raw({ model: MODEL(), max_tokens: 2500, tools: SEARCH,
    system: `Bugünün tarihi: ${today()}. Yalnızca web aramasında gördüğün gelişmeleri kullan.`,
    messages: [{ role: "user", content: `Türkiye'de SON 45 GÜNDE yürürlüğe giren veya kamuoyunda öne çıkan yeni yasa, yargı paketi, yönetmelik, Resmî Gazete düzenlemesi ve önemli Yargıtay/AYM/Danıştay kararlarını araştır. Öncelik: ${branches.join(", ")}. Halkın en çok merak edeceği, bir hukuk bürosunun bilgilendirme paylaşımı yapabileceği tek konuyu seç. Aşağıdaki YAYINLANMIŞ konulara benzeyenleri seçme:\n${existing.slice(-300).map((t) => "- " + t).join("\n")}\n\nCevabın SON satırı SADECE şu JSON olsun: {"topic":"gönderi başlığı","branch":"HUKUK DALI","gelisme":"ne oldu, tarih"}` }] });
  const r = parseResearch(j.content);
  try { return { ...JSON.parse(r.text.match(/\{[^{}]*"topic"[^{}]*\}/)[0]), sources: r.sources }; } catch { throw new Error("Radar konu seçemedi."); }
}

export async function checkCompliance(system, text) {
  const out = await call({ system, maxTokens: 800, user: `GÖNDERİ:\n${text}` });
  const m = out.match(/\{[\s\S]*\}/);
  try { return JSON.parse(m[0]); } catch { return { durum: "riskli", bulgular: [], ozet: "Denetim yanıtı okunamadı" }; }
}

export async function shorten(text, limit, target) {
  return call({ maxTokens: 1100, user: `Aşağıdaki gönderi ${text.length} karakter; ${limit} sınırını aşıyor. ${target - 180}-${target} karaktere indir. Başlığı AYNEN koru; kanun maddesi/süre gibi somut veriyi, Karabük ve Safranbolu'yu ve kapanıştaki imza + https://yilmazcolak.av.tr/online-danismanlik satırını koru. SADECE nihai metni ver.\n\nMETİN:\n${text}` });
}
