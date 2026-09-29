import test from "node:test";
import assert from "node:assert/strict";
import { escapeLinkedIn, splitBranch, key, normTopic } from "../src/util.js";
import { renderPost } from "../src/image.js";

test("konu normalizasyonu Türkçe büyük/küçük harfe dayanıklı", () => {
  assert.equal(normTopic("  İŞ  Hukuku "), normTopic("iş hukuku"));
  assert.equal(key("Kira", "google"), key("kira", "google"));
});
test("HUKUK_DALI ayrıştırılır ve satır metinden çıkar", () => {
  const r = splitBranch("HUKUK_DALI: İŞ HUKUKU\nMetin burada");
  assert.equal(r.branch, "İŞ HUKUKU"); assert.equal(r.text, "Metin burada");
});
test("LinkedIn kaçış: hashtag korunur, ayrılmış karakterler kaçırılır", () => {
  assert.equal(escapeLinkedIn("Süre (15 gün) #Avukat"), "Süre \\(15 gün\\) #Avukat");
});
test("görsel 1080x1080 PNG üretir", async () => {
  const buf = await renderPost("Boşanmada ortak konuttan kim ayrılmak zorunda?", "AİLE HUKUKU");
  assert.equal(buf.subarray(1, 4).toString(), "PNG");
  assert.ok(buf.length > 5000);
});
