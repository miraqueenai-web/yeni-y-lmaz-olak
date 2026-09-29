import fs from "node:fs";
import path from "node:path";
import { env, escapeLinkedIn, ROOT } from "../util.js";

const H = () => ({ authorization: `Bearer ${env("LINKEDIN_ACCESS_TOKEN", true)}`, "LinkedIn-Version": "202411", "X-Restli-Protocol-Version": "2.0.0", "content-type": "application/json" });

/** author: kişisel için urn:li:person:XXXX, kurumsal için urn:li:organization:XXXX */
export async function publishLinkedIn(draft) {
  const author = draft.liMode === "kurumsal" ? env("LINKEDIN_ORG_URN", true) : env("LINKEDIN_PERSON_URN", true);
  let r = await fetch("https://api.linkedin.com/rest/images?action=initializeUpload", { method: "POST", headers: H(), body: JSON.stringify({ initializeUploadRequest: { owner: author } }) });
  let j = await r.json();
  if (!r.ok) throw new Error(`LinkedIn init ${r.status}: ${JSON.stringify(j)}`);
  const { uploadUrl, image } = j.value;
  r = await fetch(uploadUrl, { method: "PUT", headers: { authorization: `Bearer ${env("LINKEDIN_ACCESS_TOKEN")}` }, body: fs.readFileSync(path.join(ROOT, draft.imagePath)) });
  if (!r.ok) throw new Error(`LinkedIn görsel yükleme ${r.status}`);
  r = await fetch("https://api.linkedin.com/rest/posts", { method: "POST", headers: H(), body: JSON.stringify({
    author, commentary: escapeLinkedIn(draft.text).slice(0, 3000), visibility: "PUBLIC",
    distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
    content: { media: { id: image, altText: draft.topic.slice(0, 120) } }, lifecycleState: "PUBLISHED", isReshareDisabledByAuthor: false }) });
  if (!r.ok) throw new Error(`LinkedIn post ${r.status}: ${await r.text()}`);
  return r.headers.get("x-restli-id") || "ok";
}
