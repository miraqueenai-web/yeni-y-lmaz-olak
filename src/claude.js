import { env } from "./util.js";

const URL = "https://api.anthropic.com/v1/messages";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function call({ system, user, maxTokens = 1500, tools }) {
  const body = { model: env("CLAUDE_MODEL") || "claude-sonnet-5-5", max_tokens: maxTokens, messages: [{ role: "user", content: user }] };
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

/** Güncel mevzuat taraması (isteğe bağlı; başarısız olursa boş döner, üretimi durdurmaz). */
export async function freshInfo(topic) {
  try {
    return await Promise.race([
      call({ maxTokens: 1200, tools: [{ type: "web_search_20250305", name: "web_search" }],
        user: `"${topic}" konusunda TÜRKİYE'deki GÜNCEL hukuki durumu araştır: yürürlükteki kanun/madde, son değişiklik, Resmî Gazete tarih/sayı, güncel Yargıtay/AYM kararı, kritik süreler. Kısa maddeler. Emin olmadığını yazma.` }),
      new Promise((res) => setTimeout(() => res(""), 40000)),
    ]);
  } catch { return ""; }
}

export async function checkCompliance(system, text) {
  const out = await call({ system, maxTokens: 800, user: `GÖNDERİ:\n${text}` });
  const m = out.match(/\{[\s\S]*\}/);
  try { return JSON.parse(m[0]); } catch { return { durum: "riskli", bulgular: [], ozet: "Denetim yanıtı okunamadı" }; }
}

export async function shorten(text, limit, target) {
  return call({ maxTokens: 1100, user: `Aşağıdaki gönderi ${text.length} karakter; ${limit} sınırını aşıyor. ${target - 180}-${target} karaktere indir. Başlığı AYNEN koru; kanun maddesi/süre gibi somut veriyi, Karabük ve Safranbolu'yu ve kapanıştaki imza + https://yilmazcolak.av.tr/online-danismanlik satırını koru. SADECE nihai metni ver.\n\nMETİN:\n${text}` });
}

export async function suggestTopic(existing, branches) {
  const out = await call({ maxTokens: 400, user: `Yılmaz & Çolak (Karabük/Safranbolu) için tek bir yeni sosyal medya konusu öner. Öncelik: ${branches.join(", ")}. Reklam yasağına uygun, bilgilendirici olsun. AŞAĞIDAKİLER ZATEN YAYINLANDI, bunlara benzer önerme:\n${existing.slice(-400).map((t) => "- " + t).join("\n")}\n\nSADECE JSON: {"topic":"...","branch":"..."}` });
  return JSON.parse(out.match(/\{[\s\S]*\}/)[0]);
}
