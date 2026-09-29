import test from "node:test";
import assert from "node:assert/strict";
import { parseResearch, research } from "../src/claude.js";
import { loadInventory, isPublished } from "../src/util.js";

test("parseResearch kaynak URL'lerini çıkarır", () => {
  const r = parseResearch([
    { type: "web_search_tool_result", content: [{ url: "https://www.resmigazete.gov.tr/x" }] },
    { type: "text", text: "Madde 1", citations: [{ url: "https://mevzuat.gov.tr/y" }] },
  ]);
  assert.equal(r.text, "Madde 1"); assert.equal(r.sources.length, 2);
});
test("kaynak yoksa research() hata verir (hafızadan üretim yok)", async () => {
  process.env.ANTHROPIC_API_KEY = "x";
  const orig = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ content: [{ type: "text", text: "hafızadan cevap" }] }) });
  try { await assert.rejects(research("deneme"), /kaynak bulunamadı/); } finally { globalThis.fetch = orig; }
});
test("kaynak varsa research() metin+kaynak döner", async () => {
  process.env.ANTHROPIC_API_KEY = "x";
  const orig = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ content: [{ type: "web_search_tool_result", content: [{ url: "https://a.gov.tr" }] }, { type: "text", text: "Bulgu" }] }) });
  try { const r = await research("deneme"); assert.deepEqual(r.sources, ["https://a.gov.tr"]); } finally { globalThis.fetch = orig; }
});
test("envanter: platforma özel çakışma (google≠linkedin_kurumsal)", () => {
  const inv = loadInventory();
  assert.ok(isPublished(inv, "HAGB Nedir, Yeni Düzenlemeyle Ne Değişti?", "google"));
  assert.ok(!isPublished(inv, "HAGB Nedir, Yeni Düzenlemeyle Ne Değişti?", "linkedin_kurumsal"));
  assert.ok(isPublished(inv, "ceza davasında uzlaşma nedir? uzlaşmayı kabul etmeden önce bilinmesi gereken 5 risk", "instagram"));
});
