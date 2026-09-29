import { env } from "../util.js";

const G = "https://graph.facebook.com/v21.0";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Tek görselli Instagram gönderisi (Business/Creator hesap + Meta uygulaması gerekir). */
export async function publishInstagram(draft, imageUrl) {
  const id = env("IG_USER_ID", true), token = env("IG_ACCESS_TOKEN", true);
  const caption = draft.caption.slice(0, 2200);
  let r = await fetch(`${G}/${id}/media`, { method: "POST", body: new URLSearchParams({ image_url: imageUrl, caption, access_token: token }) });
  let j = await r.json();
  if (!r.ok) throw new Error(`IG media ${r.status}: ${JSON.stringify(j)}`);
  const creation = j.id;
  for (let i = 0; i < 10; i++) {
    const s = await (await fetch(`${G}/${creation}?fields=status_code&access_token=${token}`)).json();
    if (s.status_code === "FINISHED") break;
    if (s.status_code === "ERROR") throw new Error("IG medya işlenemedi: " + JSON.stringify(s));
    await sleep(3000);
  }
  r = await fetch(`${G}/${id}/media_publish`, { method: "POST", body: new URLSearchParams({ creation_id: creation, access_token: token }) });
  j = await r.json();
  if (!r.ok) throw new Error(`IG publish ${r.status}: ${JSON.stringify(j)}`);
  return j.id;
}
