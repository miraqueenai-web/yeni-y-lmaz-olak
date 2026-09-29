import { env } from "../util.js";

async function accessToken() {
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: env("GOOGLE_CLIENT_ID", true), client_secret: env("GOOGLE_CLIENT_SECRET", true), refresh_token: env("GOOGLE_REFRESH_TOKEN", true), grant_type: "refresh_token" }) });
  const j = await r.json();
  if (!j.access_token) throw new Error("Google token alınamadı: " + JSON.stringify(j));
  return j.access_token;
}

/** Google İşletme Profili "localPosts" (v4). GBP API erişimi Google onayı gerektirir. */
export async function publishGoogle(draft, imageUrl, linkUrl) {
  const token = await accessToken();
  const parent = `accounts/${env("GBP_ACCOUNT_ID", true)}/locations/${env("GBP_LOCATION_ID", true)}`;
  const body = { languageCode: "tr", topicType: "STANDARD", summary: draft.text,
    callToAction: { actionType: "LEARN_MORE", url: linkUrl }, media: [{ mediaFormat: "PHOTO", sourceUrl: imageUrl }] };
  const r = await fetch(`https://mybusiness.googleapis.com/v4/${parent}/localPosts`, { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error(`GBP ${r.status}: ${JSON.stringify(j)}`);
  return j.name;
}
