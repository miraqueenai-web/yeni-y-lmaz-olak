import { useState, useRef, useEffect } from "react";
// Ortak envanter — koda gömülüdür; kopyalayan/başka kullanıcı da aynı listeyi görür.
const PUBLISHED_TOPICS = [
  "Boşanma Davasında Kusur Tespiti: Hangi Davranışlar Ağır Kusur Sayılır?",
  "İşveren Sigorta Primini Eksik Yatırırsa İşçi Ne Yapabilir?",
  "Boşanmada Ortak Konuttan Kim Ayrılmak Zorunda? Tedbir Kararı ve Evden Çıkarma Süreci",
  "İşveren İzinsiz Ücret Kesintisi Yapabilir mi? SGK, Vergi ve Hukuki Sonuçları",
  "Suça sürüklenen çocuk ceza alır mı? (11. Yargı Paketi)",
  "AYM süresiz nafaka kararı ve etkileri",
  "İşçi hakları ve kıdem tazminatı",
  "12. Yargı Paketi ve İBAN kiralama cezası",
  "2026 trafik cezaları ve itiraz yolları",
  "Yargıtay kararı: yıllık izne denk gelen hafta tatili düşülemez",
  "Trafik kazası sonrası araç değer kaybı ve tazminat",
  "Kiracı tahliye süreçleri",
  "Trafik çevirmesinde haksız ehliyet iptali",
  "Araç değer kaybı nasıl alınır",
  "Ortaklığın giderilmesi (izale-i şuyu) davaları",
  "İş kazası sonrası talep edilebilecek tazminatlar",
  "İşe iade davası ve işçi hakları",
  "Sahte e-ticaret sitesi dolandırıcılığı",
  "Kira tespit davası 2026",
  "Banka hesabı kiralama suçu",
  "WhatsApp mesajları mahkemede delil sayılır mı",
  "Kapora dolandırıcılığı ve sahte ilan",
  "Sosyal medya hakaret suçu ve şikayet süreci",
  "GSM taahhüt iptali cezası",
  "Boşanma davası açmadan önce bilinmesi gereken 5 kritik adım",
  "Velayet davalarında çocuğun görüşü ne zaman ve nasıl alınır?",
  "Mobbing (işyeri psikolojik taciz) nedir, işçi nasıl hak arar?",
];

const IG_PUBLISHED_TOPICS = [
  "İşveren İzinsiz Ücret Kesintisi Yapabilir mi? SGK, Vergi ve Hukuki Sonuçları",
  "Boşanma Davasında Kusur Tespiti: Hangi Davranışlar Ağır Kusur Sayılır?",
  "İşveren Sigorta Primini Eksik Yatırırsa İşçi Ne Yapabilir?",
  "Boşanmada Ortak Konuttan Kim Ayrılmak Zorunda? Tedbir Kararı ve Evden Çıkarma Süreci",
  "12. Yargı Paketi / İBAN kiralama ceza indirimi düzenlemesi",
  "Maaş hesabına bankanın borç tahsili için blokaj koyması",
  "2026 güncel trafik cezaları ve itiraz süreçleri",
  "Yıllık izinde hafta tatili günlerinin düşülememesi",
  "Trafik çevirmesinde haksız ehliyet el koyma ve itiraz süresi",
  "Trafik kazası sonrası araç mahrumiyet bedeli",
  "İşten çıkarılan işçinin yasal hakları",
  "Ücretin düzensiz ödenmesi ve haklı fesih",
  "Taahhütlü sözleşmelerde erken fesih ve cezai şart",
  "CMK 134 / telefon incelemesinde rıza ile elde edilen delil",
  "Atatürk sözü / adalet-bağımsızlık alıntı paylaşımı",
  "Eşin evi terk etmesi ve boşanma süreci",
  "Senetlerde teminat iddiasının geçerliliği",
  "Vergi incelemesi nedir, vergi cezaları",
  "Özel güvenliğin adli arama yetkisi ve delil geçerliliği",
  "WhatsApp mesajlarının mahkemede delil değeri",
  "Ceza yargılamasında kesin ve inandırıcı delil / beraat ilkesi",
  "İhtiyaç sebebiyle tahliye (kendim oturacağım) davası",
  "Konut ihtiyacı nedeniyle kiracının tahliyesi",
  "Banka hesabına yatan paranın haczedilmesi",
  "Kredi kartıyla alınan ürünün gelmemesi / bedel iadesi",
  "Kurumsal: Av. Kürşat Demirelli ruhsat/tebrik gönderisi",
  "Reddi mirasa rağmen emekli maaşı/ikramiyenin mirasçılara ödenmesi",
  "Yeni infaz düzenlemesinden kimlerin yararlanamayacağı",
  "İstinaf sürecinde ikinci ek dilekçe verilebilmesi",
  "İstifa dilekçesi yazarken dikkat edilecekler",
  "İsteyen çalışır isteyen gider sözünün hukuki geçersizliği",
  "2025'te en çok artan suç: internet dolandırıcılığı",
  "Aile hukuku kararı (Yargıtay 2. HD)",
  "Atatürk anma / 10 Kasım alıntı paylaşımı",
  "KVK ihlali / rıza olmadan arama kayıtlarının kullanılması",
  "29 Ekim Cumhuriyet Bayramı kutlaması",
  "Ev sahipleri dikkat / kira konulu Yargıtay 12. HD kararı",
  "Ses kaydının delil olarak kullanılabilirliği",
  "Noter onayı olmayan kat malikleri kararının geçerliliği",
  "AYM'ye bireysel başvuru harç/şart değişikliği",
  "Geç ödenen borçta temerrüt faizi + enflasyon farkı",
  "Fahiş kira artışı hakkında en çok sorulan sorular",
  "Alkollü sürücü yerine aracı ben kullandım demenin suç olması",
  "30 Ağustos Zafer Bayramı kutlaması",
  "Emniyette avukatsız alınan ifadenin geçersizliği",
  "İşyerinde mobbing hakkında bilinmesi gerekenler",
  "Bankanın ödenen bedeli iade zorunluluğu",
  "Emekli maaşına haciz gelip gelmeyeceği",
  "Ceza hukuku kararı (Yargıtay 12. CD)",
  "2025 motosiklet trafik cezaları (kasksız sürüş)",
  "Yargıtay Hukuk Genel Kurulu kararı",
  "Hukukun üstünlüğü / adalet temalı paylaşım",
  "Delil amaçlı video çekmenin suç olup olmadığı",
  "Basit dolandırıcılık suçu nedir",
  "İstinafa başvurulmazsa temyiz hakkının durumu",
  "Kiracı olunan evin satılması ve yeni malikin tahliye hakkı",
  "Mirastan çıkarma / saklı pay",
  "İşe iade davası nedir",
  "Kendi isteğiyle ayrılan işçiye yıllık izin ücreti ödenmesi",
  "2025 İnfaz Yasası değişikliği kapsamlı bilgi",
  "Ortak alanlarda kamera kullanımı",
  "Kasten yaralama suçu nedir",
  "Ortak konutun mahremiyeti / eşler arası karar",
  "Kurumsal: Av. Beyza Nur Topal tanıtımı",
  "Ceza hukuku kararı (Yargıtay 8. CD)",
  "Evlilik dışı doğan çocuklarda velayet ve soyadı hakkı",
  "Kişisel verilerle ilgili Yargıtay 12. CD kararı",
  "Boşanmada mal paylaşımı hakkında bilinmesi gerekenler",
  "İdari gözetim nedir (sınır dışı edilecek yabancılar)",
  "Süresiz nafaka kalkıyor mu / aile hukuku değişikliği",
  "İhbar tazminatı nedir",
  "5 Nisan Avukatlar Günü kutlaması",
  "Kıdem tazminatı nedir",
  "Alkolmetre ölçümünde yapılan hata",
  "Adli arama hakkında bilinmesi gerekenler",
  "İşyerinde dedikodu ve iftiranın tazminatsız fesih sebebi olması",
  "10. Yargı Paketi neleri kapsıyor",
  "Estetik operasyon mağduriyetleri / hasta hakları (malpraktis)",
  "Önleme araması nedir",
  "Trafikte alkol sınırı ve cezaları",
  "Yoksulluk nafakası nedir",
  "Ocak ayı zam / güncel merak edilen konu (TÜİK)",
  "Kurumsal: Av. Ozan Sancar ruhsat/tebrik gönderisi",
  "Kiranın bankaya yatırılma zorunluluğu",
  "Atatürk / tarihî anma paylaşımı",
  "Sınır dışı etme (deport) kararı nedir",
  "10 Kasım Atatürk'ü anma",
  "Boşanma davası devam ederken ölüm hali ve miras hakkı",
  "Cinsiyet temelli şiddet konulu paylaşım",
  "Kurumsal: Av. Derya Betül Özer ruhsat/tebrik gönderisi",
  "Yalan yere yemin suçu",
  "Düğünde takılan takıların kime ait olduğu",
  "Kurumsal: staj tamamlama/tebrik gönderisi",
  "Trafik kazası kusur oranı hesaplaması",
  "Trafik kazasında manevi zararın karşılanması",
  "Arabuluculuk görüşmelerine katılmama halinde sonuçlar",
  "İcra ve İflas Kanunu'nda değişiklik",
  "Boşanmada zina sebebine dayanma şartları",
  "Fazla mesai alacağında faiz başlangıcı",
  "Aile içi şiddette hâkimin verebileceği koruyucu tedbirler",
  "Küçüğün yüksek yararı / velayet-koruma tedbiri",
  "6284 sayılı Kanun (aile içi şiddetin önlenmesi)",
  "Ev sahibinin banka hesabını kapatması durumunda kira ödeme",
  "Kira bedelinin ödenememesinin sonuçları",
  "İşçi ücretinin geç/düzensiz ödenmesi ve fesih hakkı",
  "Vekilin sorumluluğu (Yargıtay 13. HD)",
  "Malpraktis (doktor hatası) tanımı ve hekim sorumluluğu",
  "Kesin ve inandırıcı delil olmadan mahkumiyet verilememesi",
  "Atatürk Ey yükselen yeni nesil / Cumhuriyet paylaşımı",
  "AİHM kararı (2023)",
  "Ceza hukuku genel kurul kararı",
];

const LI_KURUMSAL_TOPICS = [
  "İşveren İzinsiz Ücret Kesintisi Yapabilir mi? SGK, Vergi ve Hukuki Sonuçları",
  "Boşanma Davasında Kusur Tespiti: Hangi Davranışlar Ağır Kusur Sayılır?",
  "İşveren Sigorta Primini Eksik Yatırırsa İşçi Ne Yapabilir?",
  "Boşanmada Ortak Konuttan Kim Ayrılmak Zorunda? Tedbir Kararı ve Evden Çıkarma Süreci",
  "12. Yargı Paketi – İBAN kiralama cezaları (TCK 158)",
  "2026 güncel trafik cezaları – şirket filoları ve ticari risk",
  "Yıllık izinde hafta tatili günlerinin düşülememesi",
  "Sürücü belgelerinin haksız geri alınması – hak düşürücü süre",
  "Trafik kazalarında araç mahrumiyet zararı",
  "İşe iade – feshin son çare olması ilkesi",
  "MedDietCongress 2026 katılımı (etkinlik paylaşımı)",
  "Ücretin düzensiz ödenmesi – haklı fesih",
  "İş sağlığı ve güvenliği sunumu (etkinlik)",
  "CMK 134 – telefon incelemesi",
  "Vergi incelemesi ve hukuki süreç",
  "GPS/delil – somut delil olmadan mahkumiyet verilememesi",
  "Kredi kartıyla alınan ürünün teslim edilmemesi",
  "Adli sicil ve arşiv kaydı nasıl silinir (rehber)",
  "İstifa dilekçesine ne yazılmamalı",
  "Tahliye kararı ve kira sözleşmesinin yenilenmesi",
  "Mobbinge uğrayan işçi ve ihbar süresi",
];

const LI_KISISEL_TOPICS = [
  "İşveren İzinsiz Ücret Kesintisi Yapabilir mi? SGK, Vergi ve Hukuki Sonuçları",
  "Boşanma Davasında Kusur Tespiti: Hangi Davranışlar Ağır Kusur Sayılır?",
  "İşveren Sigorta Primini Eksik Yatırırsa İşçi Ne Yapabilir?",
  "Boşanmada Ortak Konuttan Kim Ayrılmak Zorunda? Tedbir Kararı ve Evden Çıkarma Süreci",
  "İşverenin işçinin onayı olmadan ücretini düşürmesi",
  "12. Yargı Paketi – İBAN kiralama cezaları (TCK 158)",
  "2026 trafik cezaları – şirket filoları ve ticari risk",
  "Yıllık izinde hafta tatili sayılmaz",
  "Sürücü belgesi geri alma – hak düşürücü süre (15 gün)",
  "Araç mahrumiyet bedeli faturasız istenebilir",
  "Safranbolu Belediyesi / EuroTürk Derneği paylaşımı",
  "Senetlerde teminat iddiası her zaman geçerli değil",
  "Vergi incelemesi – ceza kesinleşti mi",
  "Ceza yargılamasında hukuka uygun delil ilkesi",
  "Dijital yazışmalar (WhatsApp) delil değeri",
  "Karabük Ceza Hukuku Avukatı iş ilanı (CMK)",
  "Mahkumiyet ancak kesin/somut delille (beraat)",
  "İhtiyaç sebebiyle tahliyede 3 yıl kuralı",
  "İhtiyaç nedeniyle tahliye (Yargıtay)",
  "Miras reddi her şeyi kapsamaz",
  "Adli sicil / arşiv kaydı silme rehberi",
  "İnfaz yasası – kapsam dışı suçlar",
  "İstinafta ikinci (ek) dilekçe verilebilir",
  "İstifa dilekçesine ne yazılmamalı",
  "İsteyen çalışır cümlesi fesih sayılır",
  "Sadakat yükümlülüğü boşanma sonrası da sürer",
];

// Bu araçla onaylanmış (2026-08-25 → 2026-09-20) 43 kayıt. platform: google | instagram | linkedin_kisisel | linkedin_kurumsal
const E = (topic, platform, type, branch, date) => ({ topic, platform, type, branch, date, content: "" });
const MIRAS_BORC = "Miras Bırakanın Borçları Mirasçılara Geçer mi? Mirası Kabul Etmeden Önce Dikkat Edilmesi Gerekenler";
const MIRAS_BORC_IG = "Miras Bırakanın Borçları Mirasçılara Geçer mi?MİRASI KABUL ETMEDEN ÖNCE BİLİNMESİ GEREKENLER";
const SUSPHELI = "Şüpheli Sıfatıyla İfade Vermeye Çağrıldığınızda Avukat Tutmadan Girilmemesi Gereken 5 Durum";
const SOSYAL = "Boşanma Davasında Sosyal Medya Paylaşımları Delil Olarak Kullanılabilir mi?";
const REKABET = "İş Sözleşmesinde Rekabet Yasağı Maddesi Geçerli midir? İşçi Hangi Koşullarda Bağlıdır?";
const MAL = "Boşanma Davası Açmadan Önce Mal Varlığı Tespiti: Eşin Mal Kaçırmasını Önlemenin Hukuki Yolları";
const DEPOZITO = "Kiracı Depozito İadesini Alamıyorsa Ne Yapabilir? İcra Yoluyla Geri Alma ve Dikkat Edilmesi Gereken Süreler";
const FAIZ = "Trafik Kazası veya İş Kazasında Tazminat Faizi Artık Ne Zaman Başlıyor? TBK m.55 Değişikliği";
const VELAYET = "Velayet Değişikliği Davası Ne Zaman Açılabilir? Koşullar ve Mahkemenin Aradığı Değişiklikler";
const UZLASMA = "Ceza Davasında Uzlaşma Nedir? Uzlaşmayı Kabul Etmeden Önce Bilinmesi Gereken 5 Risk";
const GORUS = "Çocukla Kişisel İlişki (Görüş) Kararına Uyulmaması: Şikayet Yolları ve Aile Mahkemesinin Yaptırımları";
const TUTUKLAMA = "Şüpheli veya Sanık Tutuklanabilmek İçin Hangi Koşullar Gerekir? Tutuklulukta Azami Süreler ve Tahliye Talebi";
const KAMERA = "İşyerinde Kamera Kaydı İşçinin Rızası Olmadan Delil Olarak Kullanılabilir mi? KVKK ve İş Hukuku Boyutuyla";
const TANIK = "Boşanma Davasında Tanık Beyanının Gücü ve Sınırları: Hangi Tanık İfadesi Mahkemeyi Bağlar?";

const SEED_CUSTOM = [
  E(MIRAS_BORC, "google", "C", "MİRAS HUKUKU", "2026-08-25"),
  E(MIRAS_BORC_IG, "instagram", "Yargıtay Kartı", "MİRAS HUKUKU", "2026-08-25"),
  E(MIRAS_BORC_IG, "linkedin_kisisel", "Kişisel", "MİRAS HUKUKU", "2026-08-25"),
  E(MIRAS_BORC_IG, "linkedin_kurumsal", "Kurumsal", "MİRAS HUKUKU", "2026-08-25"),
  E("Anlaşmalı Boşanmada Protokol Şartları Sonradan Değiştirilebilir mi?", "instagram", "Carousel", "AİLE HUKUKU", "2026-08-28"),
  E(SUSPHELI, "google", "C", "CEZA HUKUKU", "2026-08-29"),
  E(SUSPHELI, "instagram", "Uzun Rehber", "CEZA HUKUKU", "2026-08-29"),
  E(SUSPHELI, "linkedin_kisisel", "Kişisel", "CEZA HUKUKU", "2026-09-02"),
  E(SOSYAL, "google", "C", "AİLE HUKUKU", "2026-09-02"),
  E(SOSYAL, "instagram", "Yargıtay Kartı", "AİLE HUKUKU", "2026-09-02"),
  E(SOSYAL, "linkedin_kisisel", "Kişisel", "AİLE HUKUKU", "2026-09-02"),
  E(REKABET, "google", "C", "İŞ HUKUKU", "2026-09-02"),
  E(REKABET, "instagram", "Kurumsal", "İŞ HUKUKU", "2026-09-02"),
  E(REKABET, "linkedin_kisisel", "Kişisel", "İŞ HUKUKU", "2026-09-02"),
  E(MAL, "instagram", "Yargıtay Kartı", "AİLE HUKUKU", "2026-09-08"),
  E(MAL, "linkedin_kisisel", "Kişisel", "AİLE HUKUKU", "2026-09-08"),
  E(MAL, "google", "C", "AİLE HUKUKU", "2026-09-08"),
  E(DEPOZITO, "google", "C", "KİRA HUKUKU", "2026-09-08"),
  E(DEPOZITO, "instagram", "Kurumsal", "KİRA HUKUKU", "2026-09-08"),
  E(DEPOZITO, "linkedin_kisisel", "Kişisel", "KİRA HUKUKU", "2026-09-08"),
  E(FAIZ, "google", "C", "TRAFİK & TAZMİNAT", "2026-09-08"),
  E(FAIZ, "instagram", "Kurumsal", "TRAFİK & TAZMİNAT", "2026-09-08"),
  E(FAIZ, "linkedin_kisisel", "Kişisel", "TRAFİK & TAZMİNAT", "2026-09-08"),
  E("HAGB Nedir, Yeni Düzenlemeyle Ne Değişti?", "google", "C", "CEZA HUKUKU", "2026-09-13"),
  E(VELAYET, "google", "C", "AİLE HUKUKU", "2026-09-13"),
  E(VELAYET, "instagram", "Yargıtay Kartı", "AİLE HUKUKU", "2026-09-13"),
  E(VELAYET, "linkedin_kisisel", "Kişisel", "AİLE HUKUKU", "2026-09-13"),
  E(UZLASMA, "google", "C", "CEZA HUKUKU", "2026-09-17"),
  E(UZLASMA, "instagram", "Carousel", "CEZA HUKUKU", "2026-09-17"),
  E(UZLASMA, "linkedin_kisisel", "Kişisel", "CEZA HUKUKU", "2026-09-17"),
  E(GORUS, "google", "C", "AİLE HUKUKU", "2026-09-19"),
  E(GORUS, "instagram", "Yargıtay Kartı", "AİLE HUKUKU", "2026-09-19"),
  E(GORUS, "linkedin_kisisel", "Kişisel", "AİLE HUKUKU", "2026-09-19"),
  E(TUTUKLAMA, "google", "C", "CEZA HUKUKU", "2026-09-20"),
  E(TUTUKLAMA, "instagram", "Yargıtay Kartı", "CEZA HUKUKU", "2026-09-20"),
  E(TUTUKLAMA, "linkedin_kisisel", "Kişisel", "CEZA HUKUKU", "2026-09-20"),
  E(KAMERA, "google", "C", "KVKK", "2026-09-20"),
  E(KAMERA, "instagram", "Reels", "İŞ HUKUKU", "2026-09-20"),
  E(KAMERA, "linkedin_kisisel", "Kişisel", "İŞ HUKUKU", "2026-09-20"),
  E(TANIK, "google", "C", "AİLE HUKUKU", "2026-09-20"),
  E(TANIK, "instagram", "Yargıtay Kartı", "AİLE HUKUKU", "2026-09-20"),
  E(TANIK, "linkedin_kisisel", "Kişisel", "AİLE HUKUKU", "2026-09-20"),
  E("Miras Kalan Taşınmazda Mirasçılar Anlaşamazsa Ne Olur? Satışa Zorlama ve Paylaşım Davası Süreci", "google", "C", "MİRAS HUKUKU", "2026-09-20"),
];


// Şablon görseli: eski dosyanızdaki TEMPLATE_BG satırını buraya yapıştırın. Boş kalırsa yerleşik kahverengi şablon çizilir.
const TEMPLATE_BG = "";

const MODEL = "claude-sonnet-4-6";
const LAW_BRANCHES = ["AİLE HUKUKU", "CEZA HUKUKU", "İŞ HUKUKU", "KİRA HUKUKU", "TÜKETİCİ HUKUKU", "KVKK", "İCRA-İFLAS HUKUKU", "MİRAS HUKUKU", "TRAFİK & TAZMİNAT", "GAYRİMENKUL HUKUKU"];
const PLATFORM_LABEL = { google: "Google", instagram: "Instagram", linkedin_kisisel: "LinkedIn Kişisel", linkedin_kurumsal: "LinkedIn Kurumsal" };
const PLATFORM_COLOR = { google: "#8a7034", instagram: "#c13584", linkedin_kisisel: "#0a66c2", linkedin_kurumsal: "#0a66c2" };
const STATIC_BY_PLATFORM = { google: PUBLISHED_TOPICS, instagram: IG_PUBLISHED_TOPICS, linkedin_kisisel: LI_KISISEL_TOPICS, linkedin_kurumsal: LI_KURUMSAL_TOPICS };

// ---------- Güvenli depolama (Claude artifact'ında window.storage, başka yerde localStorage) ----------
const store = {
  async get(k, shared) {
    try { if (window.storage) { const r = await window.storage.get(k, shared); return r && r.value != null ? r.value : null; } } catch {}
    try { return localStorage.getItem(k); } catch { return null; }
  },
  async set(k, v, shared) {
    try { if (window.storage) { await window.storage.set(k, v, shared); return true; } } catch {}
    try { localStorage.setItem(k, v); return true; } catch { return false; }
  },
};

const keyOf = (t, p) => (t || "").trim().toLowerCase() + "|" + (p || "google");
// Gömülü envanter + kaydedilenler; aynı konu+platform tekrarlanmaz (kayıtlı içerik olan sürüm öne alınır).
function mergeInventory(...lists) {
  const seen = new Set(), out = [];
  for (const l of lists) for (const x of l || []) {
    const it = typeof x === "string" ? { topic: x } : x;
    if (!it.topic) continue;
    const k = keyOf(it.topic, it.platform);
    if (seen.has(k)) continue;
    seen.add(k); out.push({ ...it, platform: it.platform || "google" });
  }
  return out;
}
const staticKeys = new Set(Object.entries(STATIC_BY_PLATFORM).flatMap(([p, arr]) => arr.map((t) => keyOf(t, p))));

// ---------- Panoya kopyalama ----------
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    const ok = document.execCommand("copy"); document.body.removeChild(ta); return ok;
  } catch { return false; }
}
function CopyBtn({ text, label = "Kopyala", primary, small }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={async (e) => { e.stopPropagation(); const r = await copyText(text); setOk(r ? "ok" : "err"); setTimeout(() => setOk(false), 1800); }}
      style={{ padding: small ? "4px 10px" : "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", border: primary ? "1px solid #bf9b51" : "1px solid #ddd", background: ok === "ok" ? "#27ae60" : primary ? "rgba(191,155,81,0.12)" : "#fff", color: ok === "ok" ? "#fff" : primary ? "#8a7034" : "#444" }}>
      {ok === "ok" ? "✓ Kopyalandı" : ok === "err" ? "Kopyalanamadı" : label}
    </button>
  );
}

// ---------- Prompt'lar ----------
const KUNYE_KURALI = `KARAR KÜNYESİ KURALI (ZORUNLU): Yargıtay/AYM/Danıştay künyesini (daire, E., K., tarih) YALNIZCA "ARAŞTIRMA" bölümünde aynen geçen kararlardan al. Araştırmada tam künye varsa mutlaka kullan. Künyeyi ASLA uydurma, tahmin etme, "[teyit edilecek]" gibi yer tutucu yazma. Araştırmada uygun karar yoksa kararı hiç anma; içeriği güncel mevzuat ve süreç bilgisiyle kur.`;

const SYSTEM_PROMPT = `ROL: Sen Yılmaz & Çolak Avukat Ortaklığı (Karabük / Safranbolu) için Google İşletme Profili gönderisi yazan uzman hukuk içeriği editörüsün. Bilgilendirici, güven veren, sade Türkçe kullanırsın.

İÇERİK ODAĞI: Ana alanlar AİLE, CEZA, İŞ HUKUKU. Ağırlıklı bunlardan üret; güçlü fırsatta diğerleri de.

⚖️ REKLAM YASAĞI (TBB Yön., Av.K. m.55) — KESİN YASAK: "en iyi/uzman/deneyimli avukat", "garantili/kesin kazanç/davanızı kazandırırız", başarı oranı, "hemen arayın/acele edin", ücret avantajı, müvekkil referansı, geçmiş dava/başarı öyküsü, rakip kötüleme. İZİN: nesnel bilgilendirme, mevzuat/süreç aktarımı, "hukuki destek için iletişime geçebilirsiniz".

GÖREV: Verilen konu için tek bir gönderi üret.
FORMAT: A) Gündem/Mevzuat, B) Aciliyet/Uyarı (süre uyarısı, ısrarcı değil; emoji ölçülü ⚖️📞), C) Soru-Cevap/SSS.

KURALLAR:
1. Başlık: [Konu] | Yılmaz & Çolak Hukuk Bürosu | Karabük Avukat - Safranbolu Avukat
2. UZUNLUK — EN KRİTİK KURAL: Metnin TAMAMI 1500 KARAKTERİ ASLA AŞMAYACAK. 1250-1430 hedefle.
3. Somut: kanun maddesi, süre, zamanaşımı, Resmî Gazete/karar tarihi — YALNIZCA araştırmadan.
4. ${KUNYE_KURALI}
5. En az bir kez Karabük ve Safranbolu. Yapı: giriş → soru başlıklar/madde → kapanış.
6. Kapanış: (a) "Yılmaz & Çolak Hukuk Bürosu olarak..." (b) sade iletişim yönlendirmesi (c) https://yilmazcolak.av.tr/online-danismanlik
7. Emoji yalnız Format B.

ÇIKTI: İlk satır SADECE "HUKUK_DALI: <DAL>" (AİLE HUKUKU, CEZA HUKUKU, İŞ HUKUKU, KİRA HUKUKU, TÜKETİCİ HUKUKU, KVKK, İCRA-İFLAS HUKUKU, MİRAS HUKUKU, TRAFİK & TAZMİNAT, GAYRİMENKUL HUKUKU). Sonra yayına hazır metin. Başka açıklama yok.`;

const IG_SYSTEM_PROMPT = `ROL: Sen Yılmaz & Çolak Hukuk Bürosu (Karabük/Safranbolu) için Instagram içerik yazarısın.

TON: Profesyonel, otoriter ama halkın anlayacağı sadelikte. Resmî -mektedir/-maktadır kipleri. "Siz" hitabı. Retorik soruyla açılış. Hak kaybı ve SÜRE vurgusu (kritik süreleri BÜYÜK HARFLE).
EMOJİ işlevsel: ⚖️ 🏛️ 🔍 ⚠️ 🚨 📍 📥 ✔️ ❓ ➡️ 👇 1️⃣2️⃣3️⃣.

⚖️ REKLAM YASAĞI (Av.K. m.55): "en iyi/uzman/deneyimli avukat", "garantili", başarı oranı, "hemen arayın", ücret avantajı, müvekkil referansı, rakip kötüleme YASAK.

HASHTAG: 4-6 adet, İLK SIRADA #YılmazÇolakHukuk, sonra konuya özel + genel. Türkçe, küçük harf ağırlıklı.
CTA: "Detaylı bilgi ve hukuki danışmanlık için iletişime geçebilirsiniz." + uygunsa https://yilmazcolak.av.tr/online-danismanlik

${KUNYE_KURALI}

TÜRE GÖRE:
- Carousel: kapak slaytı büyük SORU başlığı; sonra "Slayt 1, Slayt 2..." soru+kısa özet; ardından caption, hashtag.
- Reels: dikey kapak için vurgulu SORU başlığı + 2-4 emojili satır; kısa caption; CTA; hashtag.
- Yargıtay Kartı: 📍 künye (Yargıtay X. Daire, E. …, K. …, T. …) + karar özeti + kilit cümle (yalnızca araştırmada geçiyorsa tırnak içinde). Araştırmada künye varsa MUTLAKA kullan.
- Uzun Rehber: çok başlıklı, numaralı maddeler, varsa somut hesap örneği; sonda CTA + hashtag.
- Kurumsal/Kutlama: sıcak, kısa, hukuki içeriksiz duyuru.

ÇIKTI BİÇİMİ (ZORUNLU, başlıklar aynen):
İlk satır: "HUKUK_DALI: <DAL>" (Kurumsal türde "KURUMSAL").
📱 GÖRSEL METNİ
📝 AÇIKLAMA
#️⃣ HASHTAG
🎨 GÖRSEL ÖNERİSİ
Başka açıklama ekleme.`;

const LI_KISISEL_PROMPT = `ROL: Sen Av. Yusuf Çolak'ın (Yılmaz & Çolak Hukuk Bürosu, Karabük/Safranbolu) KİŞİSEL LinkedIn profili için gönderi yazıyorsun. Birinci ağızdan, avukatın mesleki sesiyle.

TON: Resmî-profesyonel ama erişilebilir. Terimi kullan, hemen sade açıkla. Kapanış yumuşak.
⚖️ REKLAM YASAĞI (Av.K. m.55): "en iyi/uzman/deneyimli", "garantili", başarı oranı, "hemen arayın", ücret avantajı, referans, rakip kötüleme YASAK.

YAPI: 1) [EMOJI] dikkat çekici/soru başlık 2) 1-2 cümle güncel gelişme 3) Yargıtay/mahkeme kararı + künye (varsa) 4) 🔹 maddeler 5) kritik SÜRE/UYARI (büyük harf) 6) CTA + https://yilmazcolak.av.tr/online-danismanlik 7) Hashtag: İLK #YılmazÇolakHukuk, 5-9 adet PascalCase.
${KUNYE_KURALI}

ÇIKTI (ZORUNLU sırayla):
İlk satır: "HUKUK_DALI: <DAL>"
Kişisel gönderi metni (başlık→gövde→CTA→hashtag).
Ayırıcı satır: "──────────"
Başlık satırı: "🔗 KURUMSAL SAYFADA PAYLAŞIRKEN (kişisel gönderi linkinin üstüne yazılacak metin):"
Büro ağzından ("Yılmaz & Çolak Hukuk Bürosu olarak...") 2-3 cümlelik kurumsal giriş; online danışmanlığa sade yönlendirme. Kişisel gönderinin linkini SEN yazma.
Başka açıklama ekleme.`;

const LI_KURUMSAL_PROMPT = `ROL: Sen Yılmaz & Çolak Hukuk Bürosu'nun KURUMSAL LinkedIn şirket sayfası için gönderi yazıyorsun. Büro ağzından, "biz" diliyle. Kurumsal, güven veren, bilgilendirici.
⚖️ REKLAM YASAĞI (Av.K. m.55): "en iyi/uzman/deneyimli", "garantili", başarı oranı, "hemen arayın", ücret avantajı, referans, rakip kötüleme YASAK.

YAPI: 1) [EMOJI ⚖️/📌] kurumsal başlık 2) kısa tanım/güncel gelişme 3) 🔹 hukuki çerçeve; künye varsa 4) pratik sonuç + kritik süre 5) GERÇEK MAKALE LİNKİ: araştırmadaki "SİTE MAKALESİ" satırındaki URL; "yok" ise https://yilmazcolak.av.tr/ — ASLA URL uydurma 6) CTA → https://yilmazcolak.av.tr/online-danismanlik 7) Hashtag: İLK #YılmazÇolakHukukBürosu, 5-9 adet PascalCase.
${KUNYE_KURALI}

ÇIKTI: İlk satır "HUKUK_DALI: <DAL>". Sonra yayına hazır metin. Başka açıklama yok.`;

// ---------- Görsel şablonu ----------
function drawSpaced(ctx, text, cx, y, spacing) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width + spacing);
  const total = widths.reduce((a, b) => a + b, 0) - spacing;
  let x = cx - total / 2; ctx.textAlign = "left";
  chars.forEach((c, i) => { ctx.fillText(c, x, y); x += widths[i]; });
  ctx.textAlign = "center";
}
function wrapText(ctx, text, maxWidth, font) {
  ctx.font = font;
  const words = text.split(" "), lines = []; let cur = "";
  for (const w of words) { const t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxWidth && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}
function drawTemplate(canvas, img, title, lawText, o) {
  const ctx = canvas.getContext("2d");
  const W = img ? img.naturalWidth || 1080 : 1080, H = img ? img.naturalHeight || 1080 : 1080;
  canvas.width = W; canvas.height = H;
  const s = W / 1080;
  if (img) ctx.drawImage(img, 0, 0, W, H);
  else {
    ctx.fillStyle = "#4a3a29"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#bf9b51"; ctx.lineWidth = 4 * s; ctx.strokeRect(36 * s, 36 * s, W - 72 * s, H - 72 * s);
    ctx.fillStyle = "#f5f1e8"; ctx.fillRect(170 * s, 440 * s, 740 * s, 110 * s);
    ctx.fillStyle = "#d9b968"; ctx.font = `600 ${28 * s}px ${o.fontFamily}`; ctx.textAlign = "center";
    drawSpaced(ctx, "YILMAZ & ÇOLAK HUKUK BÜROSU", 540 * s, 960 * s, 6 * s);
  }
  ctx.textAlign = "center"; ctx.fillStyle = o.titleColor;
  const tFont = `${o.titleWeight} ${o.titleSize * s}px ${o.fontFamily}`; ctx.font = tFont;
  const lines = wrapText(ctx, title, o.titleMaxW * s, tFont);
  const lh = o.titleSize * s * o.lineHeight;
  let cy = o.titleY * s - ((lines.length - 1) * lh) / 2;
  lines.forEach((ln) => { ctx.fillText(ln, o.titleX * s, cy); cy += lh; });
  if (lawText) { ctx.fillStyle = o.labelColor; ctx.font = `${o.labelWeight} ${o.labelSize * s}px ${o.fontFamily}`; drawSpaced(ctx, lawText, o.labelX * s, o.labelY * s, o.labelSpacing * s); }
}
const DEFAULT_OPTS = { fontFamily: "'Playfair Display', Georgia, serif", titleColor: "#ffffff", titleWeight: "600", titleSize: 66, lineHeight: 1.18, titleX: 540, titleY: 225, titleMaxW: 680, labelColor: "#2b2b2b", labelWeight: "600", labelSize: 40, labelSpacing: 9, labelX: 540, labelY: 495 };

// ---------- API ----------
const getKey = () => { try { return localStorage.getItem("yc-api-key") || ""; } catch { return ""; } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function callAPI(body, _try = 0) {
  let data;
  try {
    const key = getKey();
    const headers = { "Content-Type": "application/json" };
    if (key) { headers["x-api-key"] = key; headers["anthropic-version"] = "2023-06-01"; headers["anthropic-dangerous-direct-browser-access"] = "true"; }
    const resp = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers, body: JSON.stringify(body) });
    data = await resp.json();
  } catch (e) { data = { error: { message: e.message } }; }
  const msg = (data?.error?.message || data?.error?.type || "").toString().toLowerCase();
  if (data?.error && /overload|rate|429|500|503|529|timeout/.test(msg) && _try < 2) { await sleep(2500 * (_try + 1)); return callAPI(body, _try + 1); }
  return data;
}
// Web aramalı çağrı: pause_turn gelirse devam ettirir; metni ve kaynak URL'lerini toplar.
async function callWithSearch(body, maxContinue = 4) {
  let messages = body.messages, blocks = [], data;
  for (let i = 0; i <= maxContinue; i++) {
    data = await callAPI({ ...body, messages });
    if (data?.error) return { error: data.error, text: "", sources: [] };
    blocks = blocks.concat(data.content || []);
    if (data.stop_reason !== "pause_turn") break;
    messages = [...messages, { role: "assistant", content: data.content }];
  }
  const text = blocks.filter((b) => b.type === "text").map((b) => b.text || "").join("").trim();
  const sources = [];
  blocks.forEach((b) => { if (b.type === "web_search_tool_result" && Array.isArray(b.content)) b.content.forEach((r) => r.url && !sources.find((x) => x.url === r.url) && sources.push({ url: r.url, title: r.title || r.url })); });
  return { text, sources };
}
const textOf = (d) => (d?.content || []).filter((b) => b.type === "text").map((b) => b.text || "").join("").trim();
const today = () => new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });

async function researchTopic(tp, { needCase, needSite }) {
  const prompt = `Bugünün tarihi: ${today()}. Konu: "${tp}"

Web'de ARAŞTIR (en az 3 farklı arama; resmi kaynak önce: mevzuat.gov.tr, resmigazete.gov.tr, karararama.yargitay.gov.tr, anayasa.gov.tr, TBMM, ardından Kazancı/Lexpera/hukuki haber siteleri). Türkiye'deki YÜRÜRLÜKTEKİ ve EN GÜNCEL durumu bul.

ÇIKTI (kısa, maddeli, uydurma YOK; bulamadığını "bulunamadı" yaz):
1) DÜZENLEME: ilgili kanun/madde no, son değişiklik ve yürürlük tarihi, Resmî Gazete tarih/sayı.
2) KRİTİK SÜRELER: hak düşürücü süre, zamanaşımı, başvuru süreleri.
3) YARGI KARARLARI: ${needCase ? "Bu konuda 2-3 GERÇEK, mümkünse son 2 yıla ait Yargıtay (veya AYM/Danıştay) kararı BUL. Her biri için künyeyi kaynakta göründüğü HALİYLE yaz: 'Yargıtay X. Hukuk/Ceza Dairesi (veya Genel Kurulu), E. yyyy/n, K. yyyy/n, T. gg.aa.yyyy' + 1-2 cümle özeti + kaynak URL. Künye eksikse başka aramayla tamamla; tam künyeyi bulamadığın kararı LİSTELEME." : "Varsa 1-2 önemli güncel karar, künyesi kaynakta görünen haliyle + kaynak URL."}
4) KAYNAKLAR: kullandığın URL'ler.
${needSite ? `5) SİTE MAKALESİ: "site:yilmazcolak.av.tr ${tp}" araması yap; bu konuyla ilgili GERÇEK bir sayfa/makale URL'si bulursan 'SİTE MAKALESİ: <url>' yaz, bulamazsan 'SİTE MAKALESİ: yok'.` : ""}`;
  const r = await callWithSearch({ model: MODEL, max_tokens: 2500, tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 8 }], messages: [{ role: "user", content: prompt }] });
  return r;
}
// Metindeki E./K. numaralarının araştırmada geçip geçmediğini denetler.
function unverifiedCites(text, research) {
  const norm = (s) => (s || "").replace(/\s+/g, "").toLowerCase();
  const R = norm(research);
  const found = [...(text || "").matchAll(/\b([EK])\.?\s*(\d{4}\s*\/\s*\d+)/g)].map((m) => m[2].replace(/\s+/g, ""));
  return [...new Set(found)].filter((n) => !R.includes(norm(n)));
}
const alanToBranch = (a) => ({ Aile: "AİLE HUKUKU", Ceza: "CEZA HUKUKU", İş: "İŞ HUKUKU" }[a] || null);

// ---------- Metni kopyalanabilir bölümlere ayır ----------
function splitSections(platform, content, igType) {
  if (!content) return [];
  if (platform === "instagram") {
    const marks = [["📱 GÖRSEL METNİ", "Görsel metni"], ["📝 AÇIKLAMA", "Açıklama"], ["#️⃣ HASHTAG", "Hashtag"], ["🎨 GÖRSEL ÖNERİSİ", "Görsel önerisi"]];
    const pos = marks.map(([m]) => content.indexOf(m));
    const parts = [];
    marks.forEach(([m, label], i) => {
      if (pos[i] < 0) return;
      const next = pos.filter((p) => p > pos[i]).sort((a, b) => a - b)[0] ?? content.length;
      parts.push({ label, text: content.slice(pos[i] + m.length, next).trim() });
    });
    const cap = parts.find((p) => p.label === "Açıklama"), tag = parts.find((p) => p.label === "Hashtag");
    if (cap && tag) parts.unshift({ label: "Açıklama + Hashtag (paylaşıma hazır)", text: cap.text + "\n\n" + tag.text });
    return parts;
  }
  if (platform === "linkedin") {
    const i = content.indexOf("──────────");
    if (i > 0) {
      const kis = content.slice(0, i).trim();
      const kur = content.slice(i).replace(/^─+\s*/, "").replace(/^🔗[^\n]*\n?/, "").trim();
      return [{ label: "Kişisel gönderi", text: kis }, { label: "Kurumsal sayfa giriş metni", text: kur }];
    }
  }
  return [];
}

// ---------- Uygulama ----------
export default function StudioApp() {
  const [topic, setTopic] = useState("");
  const [lawBranch, setLawBranch] = useState("AİLE HUKUKU");
  const [format, setFormat] = useState("C");
  const [platform, setPlatform] = useState("google");
  const [igType, setIgType] = useState("Carousel");
  const [liMode, setLiMode] = useState("kisisel");
  const [content, setContent] = useState("");
  const [research, setResearch] = useState("");
  const [sources, setSources] = useState([]);
  const [citeWarn, setCiteWarn] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [staleOffer, setStaleOffer] = useState(null);
  const [view, setView] = useState("create");
  const [custom, setCustom] = useState(() => mergeInventory(SEED_CUSTOM));
  const [error, setError] = useState("");
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [lawLoading, setLawLoading] = useState(false);
  const [lawRaw, setLawRaw] = useState("");
  const [backlog, setBacklog] = useState([]);
  const [compLoading, setCompLoading] = useState(false);
  const [compResult, setCompResult] = useState(null);
  const [bgImg, setBgImg] = useState(null);
  const [opts, setOpts] = useState(DEFAULT_OPTS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openArch, setOpenArch] = useState({});
  const [openItem, setOpenItem] = useState(null);
  const [importText, setImportText] = useState("");
  const [fontReady, setFontReady] = useState(false);
  const [keyOpen, setKeyOpen] = useState(() => !getKey());
  const [keyVal, setKeyVal] = useState(getKey());
  const canvasRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link"); link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Cormorant+Garamond:wght@500;600;700&display=swap";
    document.head.appendChild(link);
    if (document.fonts) Promise.all([document.fonts.load("600 66px 'Playfair Display'"), document.fonts.load("600 40px 'Cormorant Garamond'")]).then(() => document.fonts.ready).then(() => setFontReady(true)).catch(() => setFontReady(true));
    else setFontReady(true);
  }, []);
  useEffect(() => { if (TEMPLATE_BG) { const img = new Image(); img.onload = () => setBgImg(img); img.src = TEMPLATE_BG; } }, []);
  useEffect(() => {
    (async () => {
      const raw = await store.get("yc-gbp-topics", true);
      if (raw) { try { setCustom(mergeInventory(JSON.parse(raw), SEED_CUSTOM)); } catch {} }
      const bl = await store.get("yc-gbp-backlog", true); if (bl) { try { setBacklog(JSON.parse(bl)); } catch {} }
      const t = await store.get("yc-gbp-opts-clean"); if (t) { try { setOpts({ ...DEFAULT_OPTS, ...JSON.parse(t) }); } catch {} }
    })();
  }, []);

  const staticCount = Object.values(STATIC_BY_PLATFORM).reduce((a, b) => a + b.length, 0);
  const totalCount = staticCount + custom.filter((c) => !staticKeys.has(keyOf(c.topic, c.platform))).length;
  const platformKey = platform === "linkedin" ? "linkedin_" + liMode : platform;
  const isPublishedOn = (tp, p) => { const k = keyOf(tp, p); return staticKeys.has(k) || custom.some((c) => keyOf(c.topic, c.platform) === k); };
  const isDuplicate = topic.trim() && isPublishedOn(topic, platformKey);
  const allTitles = [...new Set([...Object.values(STATIC_BY_PLATFORM).flat(), ...custom.map((c) => c.topic)])];

  useEffect(() => { if (canvasRef.current && topic.trim()) drawTemplate(canvasRef.current, bgImg, topic.trim(), lawBranch, opts); }, [topic, lawBranch, bgImg, opts, fontReady, view, platform]);
  const setOpt = (k, v) => setOpts((o) => ({ ...o, [k]: v }));
  const onUpload = (e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => { const img = new Image(); img.onload = () => setBgImg(img); img.src = ev.target.result; }; r.readAsDataURL(f); };

  const saveCustom = async (list) => { setCustom(list); await store.set("yc-gbp-topics", JSON.stringify(list), true); };

  // ---------- Üretim (tek akış: zorunlu güncel araştırma → yaz → kontrol) ----------
  const generate = async (o = {}) => {
    const tp = (o.topic ?? topic).trim(); if (!tp) return;
    const plat = o.platform ?? platform, ty = o.igType ?? igType, md = o.liMode ?? liMode, fmt = o.format ?? format;
    setLoading(true); setError(""); setContent(""); setCompResult(null); setStaleOffer(null); setCiteWarn([]); setSources([]); setResearch("");
    try {
      let rs = { text: "", sources: [] };
      if (!o.skipResearch) {
        setStatus("🔍 Güncel mevzuat ve kararlar web'de taranıyor (30-60 sn sürebilir)...");
        rs = await researchTopic(tp, { needCase: plat === "instagram" && ty === "Yargıtay Kartı" || plat === "linkedin", needSite: plat === "linkedin" && md === "kurumsal" });
        if (!rs.text || rs.text.length < 200) { // bir kez daha dene
          setStatus("🔍 İlk tarama sonuç vermedi, yeniden deneniyor...");
          rs = await researchTopic(tp, { needCase: true, needSite: plat === "linkedin" && md === "kurumsal" });
        }
        if (!rs.text || rs.text.length < 200) {
          setError("Güncel web taraması yapılamadı" + (rs.error ? " (" + (rs.error.message || rs.error.type) + ")" : "") + ". Güncel olmayan bilgiyle yayın riskine karşı içerik üretilmedi.");
          setStaleOffer({ topic: tp, platform: plat, igType: ty, liMode: md, format: fmt });
          setLoading(false); setStatus(""); return;
        }
        setResearch(rs.text); setSources(rs.sources);
      }
      const block = rs.text ? `ARAŞTIRMA (${today()} tarihli web taraması — ESAS AL; künyeyi yalnızca buradan al):\n${rs.text}\n\n` : `NOT: Güncel araştırma yapılamadı; hafızadan yazıyorsun, künye YAZMA, tarih/madde konusunda temkinli ol.\n\n`;
      setStatus("✍️ İçerik yazılıyor...");
      let system, user, max = 1500;
      if (plat === "google") { system = SYSTEM_PROMPT; max = 1200; user = `${block}Konu: ${tp}\nFormat: ${fmt === "A" ? "Gündem/Mevzuat" : fmt === "B" ? "Aciliyet/Uyarı" : "Soru-Cevap/SSS"}\n\nGönderiyi yaz. İlk satır HUKUK_DALI. 1500 karakteri aşma.`; }
      else if (plat === "instagram") { system = IG_SYSTEM_PROMPT; user = `${block}Konu: ${tp}\nGönderi türü: ${ty}\n\n${ty} türünde Instagram gönderisi üret. İlk satır HUKUK_DALI.`; }
      else { system = md === "kurumsal" ? LI_KURUMSAL_PROMPT : LI_KISISEL_PROMPT; max = 1800; user = `${block}Konu: ${tp}\n\n${md === "kurumsal" ? "Kurumsal LinkedIn gönderisi yaz." : "Av. Yusuf Çolak'ın kişisel LinkedIn gönderisini yaz."} İlk satır HUKUK_DALI.`; }
      let d = await callAPI({ model: MODEL, max_tokens: max, system, messages: [{ role: "user", content: user }] });
      let text = textOf(d);
      if (!text) { d = await callAPI({ model: MODEL, max_tokens: max, system, messages: [{ role: "user", content: user }] }); text = textOf(d); }
      if (!text) { setError("İçerik üretilemedi (" + (d?.error?.message || "boş yanıt") + "). Tekrar deneyin."); setLoading(false); setStatus(""); return; }
      const m = text.match(/^\s*HUKUK_DALI:\s*(.+)$/im);
      if (m) {
        const br = m[1].trim().toUpperCase();
        const match = LAW_BRANCHES.find((b) => b === br) || LAW_BRANCHES.find((b) => br.includes(b.split(" ")[0]));
        if (match) setLawBranch(match);
        text = text.replace(/^\s*HUKUK_DALI:.*$/im, "").replace(/^\s+/, "");
      }
      if (plat === "google" && text.length > 1500) {
        setStatus(`✂️ Metin ${text.length} karakter — 1500'e sığdırılıyor...`);
        const sr = await callAPI({ model: MODEL, max_tokens: 1100, messages: [{ role: "user", content: `Bu Google İşletme gönderisi ${text.length} karakter; 1250-1430 karaktere indir. Başlığı, kanun maddesi/süre/künye gibi somut verileri, Karabük ve Safranbolu'yu ve kapanıştaki imza + https://yilmazcolak.av.tr/online-danismanlik satırını KORU. Yalnızca nihai metni ver.\n\n${text}` }] });
        const st = textOf(sr); if (st && st.length < text.length) text = st;
      }
      setCiteWarn(unverifiedCites(text, rs.text));
      setContent(text);
      if (plat === "instagram") setIgType(ty);
    } catch (e) { setError("Hata: " + e.message); }
    setLoading(false); setStatus("");
  };

  const checkCompliance = async () => {
    if (!content.trim()) return; setCompLoading(true); setCompResult(null);
    try {
      const data = await callAPI({ model: MODEL, max_tokens: 1000, messages: [{ role: "user", content: `Sen TBB Reklam Yasağı Denetçisisin (Av.K. m.55 + TBB Yön. 09.08.2024).
YASAK: "en iyi/uzman/deneyimli avukat", "garantili/kesin kazanç", başarı oranı, "hemen arayın", ücret avantajı, müvekkil referansı, rakip kötüleme, geçmiş davaları öne çıkarma. İZİN: hizmet listesi, nesnel süreç/mevzuat, "iletişime geçebilirsiniz". GRİ: "deneyimli kadro", istatistik, başlıkta lokasyon kelime yığını.
SADECE JSON: {"durum":"uyumlu|riskli|ihlal","bulgular":[{"tip":"ihlal|gri","ifade":"...","madde":"...","oneri":"..."}],"ozet":"1 cümle"}
GÖNDERİ:\n${content}` }] });
      const mm = textOf(data).match(/\{[\s\S]*\}/); setCompResult(mm ? JSON.parse(mm[0]) : { durum: "hata", bulgular: [], ozet: "Yanıt okunamadı" });
    } catch (e) { setError("Denetim hatası: " + e.message); }
    setCompLoading(false);
  };

  const suggestTopics = async () => {
    setSuggestLoading(true); setSuggestions([]); setError("");
    try {
      const r = await callWithSearch({ model: MODEL, max_tokens: 1500, tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 4 }], messages: [{ role: "user", content: `Bugün ${today()}. Yılmaz & Çolak (Karabük/Safranbolu) için, GÜNCEL gelişmelere dayanan 5 yeni sosyal medya konusu öner (ana odak: Aile, Ceza, İş; ikincil: kira, tüketici, KVKK, icra, miras, trafik). Önce kısaca web'de son gelişmeleri ara.
ŞUNLAR YAYINLANDI, önerme:\n${allTitles.map((t) => "- " + t).join("\n")}
Reklam yasağına uygun. En sonda SADECE şu JSON dizisini ver: [{"topic":"...","format":"A|B|C","branch":"AİLE HUKUKU|...","reason":"1 cümle"}]` }] });
      const mm = r.text.match(/\[[\s\S]*\]/); if (!mm) throw new Error("Öneri ayrıştırılamadı");
      setSuggestions(JSON.parse(mm[0]));
    } catch (e) { setError("Öneri hatası: " + e.message); }
    setSuggestLoading(false);
  };

  const watchNewLaws = async () => {
    setLawLoading(true); setLawRaw(""); setError("");
    try {
      const r1 = await callWithSearch({ model: MODEL, max_tokens: 2500, tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 8 }], messages: [{ role: "user", content: `Bugün ${today()}. Türkiye'de SON 60 GÜNDE yürürlüğe giren veya kamuoyunda konuşulan yeni yasa, yönetmelik, yargı paketi ve önemli Yargıtay/AYM/Danıştay kararlarını web'de araştır (Resmî Gazete, TBMM, resmi kurumlar önce). Odak: Aile, Ceza, İş (ikincil: kira, tüketici, KVKK, icra, trafik). Her gelişmeyi tarihi ve kaynağıyla kısa yaz; bulamadığını uydurma.` }] });
      if (r1.error) { setError("API: " + (r1.error.message || JSON.stringify(r1.error))); setLawLoading(false); return; }
      if (!r1.text) { setError("Web taraması sonuç döndürmedi; tekrar deneyin."); setLawLoading(false); return; }
      const r2 = await callAPI({ model: MODEL, max_tokens: 1800, messages: [{ role: "user", content: `Araştırma metninden hukuk bürosunun gönderi yapabileceği konuları çıkar. ŞUNLAR YAYINLANDI, benzerini atla:\n${allTitles.map((t) => "- " + t).join("\n")}\n\nSADECE JSON dizisi ver: [{"gelisme":"kısa","tarih":"tarih","alan":"Aile|Ceza|İş|Diğer","onerilen_baslik":"...","format":"A|B|C","aciliyet":"yüksek|orta|düşük"}]. Uygun yoksa [].\n\nARAŞTIRMA:\n${r1.text}` }] });
      const mm = textOf(r2).match(/\[[\s\S]*\]/); let arr = null; if (mm) { try { arr = JSON.parse(mm[0]); } catch {} }
      if (Array.isArray(arr) && arr.length) {
        let cur = backlog; const b = await store.get("yc-gbp-backlog", true); if (b) { try { cur = JSON.parse(b); } catch {} }
        const have = new Set([...allTitles.map((t) => t.toLowerCase()), ...cur.map((x) => (x.onerilen_baslik || "").toLowerCase())]);
        const fresh = arr.filter((f) => f.onerilen_baslik && !have.has(f.onerilen_baslik.toLowerCase()));
        const merged = [...cur, ...fresh]; setBacklog(merged); await store.set("yc-gbp-backlog", JSON.stringify(merged), true);
        if (!fresh.length) setError("Bulunanlar zaten envanterde/kuyrukta; yeni konu eklenmedi.");
      } else { setLawRaw(r1.text); setError("Kartlara ayrıştırılamadı; ham araştırma aşağıda."); }
    } catch (e) { setError("Yasa tarama hatası: " + e.message); }
    setLawLoading(false);
  };

  const removeBacklog = async (i) => { const nb = backlog.filter((_, x) => x !== i); setBacklog(nb); await store.set("yc-gbp-backlog", JSON.stringify(nb), true); };
  const produceFor = (plat, mode, f) => {
    const tp = f.onerilen_baslik; setTopic(tp); const br = alanToBranch(f.alan); if (br) setLawBranch(br);
    setPlatform(plat); if (mode) setLiMode(mode); if (f.format) setFormat(f.format); setView("create");
    generate({ topic: tp, platform: plat, liMode: mode || liMode, format: f.format || "A" });
  };

  const markPublished = async () => {
    if (!topic.trim() || isDuplicate) return;
    const entry = { topic: topic.trim(), content, branch: lawBranch, platform: platformKey, type: platform === "instagram" ? igType : platform === "linkedin" ? (liMode === "kurumsal" ? "Kurumsal" : "Kişisel") : format, date: new Date().toISOString().slice(0, 10) };
    let base = custom; const raw = await store.get("yc-gbp-topics", true); if (raw) { try { base = mergeInventory(JSON.parse(raw), custom); } catch {} }
    await saveCustom(mergeInventory([entry], base));
    const nb = backlog.filter((b) => (b.onerilen_baslik || "").trim().toLowerCase() !== topic.trim().toLowerCase());
    if (nb.length !== backlog.length) { setBacklog(nb); await store.set("yc-gbp-backlog", JSON.stringify(nb), true); }
  };

  // ---------- Envanter dışa/içe aktarım ----------
  const inventoryAsText = () => Object.keys(PLATFORM_LABEL).map((p) => {
    const items = [...custom.filter((c) => c.platform === p).map((c) => c.topic), ...STATIC_BY_PLATFORM[p]];
    return `## ${PLATFORM_LABEL[p]} (${items.length})\n` + items.map((t) => "- " + t).join("\n");
  }).join("\n\n");
  const seedBlock = () => "export const SEED_CUSTOM = " + JSON.stringify(custom.map(({ topic, platform: pl, type, branch, date }) => ({ topic, platform: pl, type, branch, date, content: "" })), null, 1) + ";";
  const applyImport = async () => {
    try {
      const j = JSON.parse(importText); const arr = Array.isArray(j) ? j : j.custom;
      if (!Array.isArray(arr)) throw new Error("dizi bekleniyordu");
      await saveCustom(mergeInventory(arr, custom)); setImportText(""); setError("");
    } catch (e) { setError("İçe aktarma hatası: " + e.message); }
  };

  const sections = splitSections(platform, content, igType);
  const charCount = content.length, overLimit = platform === "google" && charCount > 1500;
  const C = { gold: "#bf9b51", cream: "#f8f7f4" };
  const btn = { padding: "5px 12px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", fontSize: 12, cursor: "pointer", color: "#666" };

  const renderFull = () => { const cv = document.createElement("canvas"); drawTemplate(cv, bgImg, topic.trim(), lawBranch, opts); return cv; };
  const downloadVisual = () => {
    const cv = renderFull(); const name = `yc-gonderi-${topic.trim().slice(0, 30).replace(/\s+/g, "-")}.png`;
    const go = (url, rev) => { const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { try { document.body.removeChild(a); } catch {} if (rev) URL.revokeObjectURL(url); }, 1500); };
    try { cv.toBlob((b) => (b ? go(URL.createObjectURL(b), true) : go(cv.toDataURL("image/png"), false)), "image/png"); } catch { setError("İndirme engellendi — 'Yeni sekmede aç' ile kaydedin."); }
  };
  const openInTab = () => { try { const w = window.open(); if (w) w.document.write(`<img src="${renderFull().toDataURL("image/png")}" style="max-width:100%">`); else setError("Açılır pencere engellendi."); } catch { setError("Açılamadı."); } };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.cream, minHeight: "100vh", color: "#1a1a1a" }}>
      <div style={{ background: "linear-gradient(135deg,#2a1f16,#4a3a29)", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ color: C.gold, fontSize: 20, fontWeight: 700, letterSpacing: 1, fontFamily: "Georgia, serif" }}>YILMAZ & ÇOLAK</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 }}>İçerik Stüdyosu — Google · Instagram · LinkedIn</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setKeyOpen((k) => !k)} style={{ padding: "8px 14px", borderRadius: 6, border: "none", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer" }}>🔑 API</button>
          {[["create", "İçerik Üret"], ["watch", `Yasa Radarı${backlog.length ? " (" + backlog.length + ")" : ""}`], ["archive", `Yayınlananlar (${totalCount})`]].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: view === v ? C.gold : "rgba(255,255,255,0.1)", color: view === v ? "#2a1f16" : "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
      </div>

      {keyOpen && <div style={{ maxWidth: 1150, margin: "16px auto 0", padding: "12px 16px", background: "#fffbeb", border: "1px solid #f5e0a3", borderRadius: 8, fontSize: 13, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <b>🔑 Anthropic API anahtarı</b>
        <input type="password" value={keyVal} onChange={(e) => setKeyVal(e.target.value)} placeholder="sk-ant-..." style={{ flex: 1, minWidth: 220, padding: "8px 10px", borderRadius: 6, border: "1px solid #ddd" }} />
        <button onClick={() => { try { localStorage.setItem("yc-api-key", keyVal.trim()); } catch {} setKeyOpen(false); setError(""); }} style={{ ...btn, borderColor: "#27ae60", color: "#1e7e4f" }}>Kaydet</button>
        <span style={{ fontSize: 11, color: "#92600a", flexBasis: "100%" }}>Anahtar yalnızca bu tarayıcıda saklanır (console.anthropic.com → API Keys). Claude içinde açıyorsanız boş bırakabilirsiniz.</span>
      </div>}
      {error && <div style={{ maxWidth: 1150, margin: "16px auto 0", padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#991b1b", fontSize: 13, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ flex: 1 }}>{error}</span>
        {staleOffer && <button onClick={() => generate({ ...staleOffer, skipResearch: true })} style={{ ...btn, borderColor: "#c0392b", color: "#991b1b" }}>Yine de hafızadan üret (güncel değil, künyesiz)</button>}
        {staleOffer && <button onClick={() => generate(staleOffer)} style={{ ...btn, borderColor: "#27ae60", color: "#1e7e4f" }}>↻ Taramayı tekrar dene</button>}
      </div>}

      {view === "create" && (
        <div style={{ maxWidth: 1150, margin: "24px auto", padding: "0 24px" }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e6e1", padding: 24, marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {[["google", "Google İşletme", "#bf9b51"], ["instagram", "Instagram", "#c13584"], ["linkedin", "LinkedIn", "#0a66c2"]].map(([p, l, col]) => (
                <button key={p} onClick={() => { setPlatform(p); setContent(""); setCompResult(null); }} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", border: platform === p ? `2px solid ${col}` : "1px solid #ddd", background: platform === p ? col + "15" : "#fff", color: platform === p ? col : "#888" }}>{l}</button>
              ))}
              <span style={{ marginLeft: "auto", alignSelf: "center", fontSize: 12, color: "#1e7e4f", background: "#f0f9f4", border: "1px solid #bfe3cd", padding: "4px 10px", borderRadius: 12 }}>🔍 Her üretimde güncel web taraması otomatik</span>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>Gönderi konusu (görselin başlığı)</label>
                <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="ör. Velayet davasında çocuğun görüşü alınır mı?" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 15, marginTop: 6, boxSizing: "border-box", outline: "none" }} />
                {isDuplicate && <div style={{ color: "#c0392b", fontSize: 12, marginTop: 6 }}>⚠ Bu konu {PLATFORM_LABEL[platformKey]} için zaten yayınlanmış.</div>}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: 0.5, display: "block" }}>Hukuk dalı (otomatik)</label>
                <select value={lawBranch} onChange={(e) => setLawBranch(e.target.value)} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginTop: 6, background: "#fff" }}>{LAW_BRANCHES.map((b) => <option key={b}>{b}</option>)}</select>
              </div>
              {platform === "google" && (<>
                <div><label style={{ fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", display: "block" }}>Format</label>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>{[["A", "Mevzuat", "#4a90a4"], ["B", "Aciliyet", "#c0392b"], ["C", "Soru-Cevap", "#27ae60"]].map(([k, l, col]) => (<button key={k} onClick={() => setFormat(k)} style={{ padding: "8px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", border: format === k ? `2px solid ${col}` : "1px solid #ddd", background: format === k ? col + "12" : "#fff", color: format === k ? col : "#666" }}>{l}</button>))}</div></div>
                <button onClick={() => generate()} disabled={loading || !topic.trim()} style={{ padding: "10px 24px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", background: loading ? "#ccc" : "linear-gradient(135deg,#bf9b51,#a07d2e)", color: "#fff" }}>{loading ? "Üretiliyor..." : "İçerik Üret"}</button>
              </>)}
              {platform === "instagram" && (
                <div style={{ flexBasis: "100%" }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Gönderi türü (tıkla → üret)</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{["Carousel", "Reels", "Yargıtay Kartı", "Uzun Rehber", "Kurumsal"].map((t) => (<button key={t} onClick={() => { setIgType(t); generate({ igType: t }); }} disabled={loading || !topic.trim()} style={{ padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: loading ? "wait" : "pointer", border: "none", background: loading ? "#ccc" : "linear-gradient(135deg,#c13584,#833ab4)", color: "#fff" }}>{t}</button>))}</div>
                </div>
              )}
              {platform === "linkedin" && (
                <div style={{ flexBasis: "100%", display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
                  <div><label style={{ fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Hesap türü</label>
                    <div style={{ display: "flex", gap: 6 }}>{[["kisisel", "Kişisel (Av. Yusuf Çolak)"], ["kurumsal", "Kurumsal (Büro)"]].map(([m, l]) => (<button key={m} onClick={() => setLiMode(m)} style={{ padding: "8px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", border: liMode === m ? "2px solid #0a66c2" : "1px solid #ddd", background: liMode === m ? "#0a66c215" : "#fff", color: liMode === m ? "#0a66c2" : "#666" }}>{l}</button>))}</div></div>
                  <button onClick={() => generate()} disabled={loading || !topic.trim()} style={{ padding: "10px 24px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", background: loading ? "#ccc" : "linear-gradient(135deg,#0a66c2,#084d94)", color: "#fff" }}>{loading ? "Üretiliyor..." : "İçerik Üret"}</button>
                </div>
              )}
            </div>
            <div style={{ marginTop: 16, borderTop: "1px solid #f0eeea", paddingTop: 14 }}>
              <button onClick={suggestTopics} disabled={suggestLoading} style={{ ...btn, padding: "6px 16px", fontSize: 13 }}>{suggestLoading ? "Güncel gelişmeler taranıyor..." : "🤖 Güncel konu önerisi (web taramalı)"}</button>
              {suggestions.length > 0 && <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>{suggestions.map((s, i) => (
                <div key={i} onClick={() => { setTopic(s.topic); setFormat(s.format || "A"); if (s.branch) setLawBranch(s.branch); setSuggestions([]); }} style={{ padding: "10px 14px", background: "#fafaf8", borderRadius: 8, border: "1px solid #e8e6e1", cursor: "pointer", display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div><div style={{ fontSize: 14, fontWeight: 600 }}>{s.topic}</div><div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.reason}</div></div>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, background: "#bf9b5115", color: "#8a7034", fontWeight: 600, whiteSpace: "nowrap", alignSelf: "center" }}>{s.branch || ""}</span>
                </div>))}</div>}
            </div>
          </div>

          {status && <div style={{ padding: "10px 14px", background: "#fffbeb", border: "1px solid #f5e0a3", borderRadius: 8, color: "#92600a", fontSize: 13, marginBottom: 12 }}>{status}</div>}
          {citeWarn.length > 0 && <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#991b1b", fontSize: 13, marginBottom: 12 }}>⚠ Metindeki şu esas/karar numaraları web araştırmasında doğrulanamadı: <b>{citeWarn.join(", ")}</b>. Yayından önce karararama.yargitay.gov.tr'den kontrol edin veya bu satırı silin.</div>}

          <div style={{ display: "grid", gridTemplateColumns: content ? "1fr 1fr" : "1fr", gap: 20 }}>
            {(platform === "google" || (platform === "instagram" && content)) && topic.trim() && (
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e6e1", overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0eeea", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>GÖRSEL (1080×1080)</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setShowAdvanced((s) => !s)} style={btn}>⚙ İnce ayar</button>
                    <button onClick={() => fileRef.current?.click()} style={btn}>Şablon değiştir</button>
                    <button onClick={openInTab} style={btn}>↗ Yeni sekme</button>
                    <button onClick={downloadVisual} style={{ ...btn, borderColor: "#bf9b51", color: "#8a7034", background: "rgba(191,155,81,0.1)" }}>⬇ PNG</button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} style={{ display: "none" }} />
                </div>
                <div style={{ padding: 16, display: "flex", justifyContent: "center" }}><canvas ref={canvasRef} style={{ width: "100%", maxWidth: 460, borderRadius: 6, background: "#eee" }} /></div>
                {showAdvanced && <div style={{ padding: "0 16px 16px" }}><div style={{ background: "#fafaf8", borderRadius: 8, padding: 14, border: "1px solid #eee", fontSize: 12 }}>
                  {[["titleY", "Başlık dikey", 100, 380], ["titleX", "Başlık yatay", 300, 780], ["titleSize", "Başlık boyut", 30, 100], ["titleMaxW", "Başlık genişlik", 400, 800], ["labelY", "Etiket dikey", 420, 580], ["labelSize", "Etiket boyut", 20, 60], ["labelSpacing", "Harf aralığı", 0, 20]].map(([k, l, mn, mx]) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><span style={{ color: "#666", width: 100 }}>{l}</span><input type="range" min={mn} max={mx} value={opts[k]} onChange={(e) => setOpt(k, +e.target.value)} style={{ flex: 1 }} /><span style={{ color: "#999", width: 34, textAlign: "right" }}>{opts[k]}</span></div>))}
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <select value={opts.fontFamily} onChange={(e) => setOpt("fontFamily", e.target.value)} style={{ padding: 4, fontSize: 12 }}><option value="'Playfair Display', Georgia, serif">Playfair Display</option><option value="'Cormorant Garamond', Georgia, serif">Cormorant Garamond</option><option value="Georgia, serif">Georgia</option></select>
                    <input type="color" value={opts.titleColor} onChange={(e) => setOpt("titleColor", e.target.value)} /><input type="color" value={opts.labelColor} onChange={(e) => setOpt("labelColor", e.target.value)} />
                    <button onClick={() => store.set("yc-gbp-opts-clean", JSON.stringify(opts))} style={{ ...btn, marginLeft: "auto", borderColor: "#27ae60", color: "#1e7e4f" }}>Ayarı kaydet</button>
                  </div></div></div>}
              </div>
            )}
            {content && (
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e6e1", overflow: "hidden", display: "flex", flexDirection: "column", gridColumn: platform === "linkedin" ? "1 / -1" : "auto" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0eeea", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>{platform.toUpperCase()} İÇERİĞİ <span style={{ marginLeft: 6, fontWeight: 700, color: overLimit ? "#c0392b" : "#888" }}>{platform === "google" ? charCount + "/1500" : charCount + " karakter"}</span></span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button onClick={checkCompliance} disabled={compLoading} style={{ ...btn, borderColor: "#8e44ad", background: "#8e44ad12", color: "#6c3483" }}>{compLoading ? "..." : "⚖️ Reklam denetimi"}</button>
                    <CopyBtn text={content} label="Tümünü kopyala" primary />
                    <button onClick={markPublished} style={{ ...btn, borderColor: "#bf9b51", background: "rgba(191,155,81,0.1)", color: "#8a7034" }}>Onayla ✓</button>
                  </div>
                </div>
                {sections.length > 0 && <div style={{ padding: "10px 16px", borderBottom: "1px solid #f0eeea", display: "flex", gap: 6, flexWrap: "wrap", background: "#fafaf8", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#999" }}>Parça parça kopyala:</span>{sections.map((s, i) => <CopyBtn key={i} text={s.text} label={s.label} small />)}</div>}
                {overLimit && <div style={{ padding: "8px 16px", background: "#fef2f2", color: "#991b1b", fontSize: 12 }}>⚠ 1500 karakter aşıldı ({charCount}).</div>}
                {compResult && <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0eeea", background: compResult.durum === "uyumlu" ? "#f0f9f4" : compResult.durum === "ihlal" ? "#fef2f2" : "#fffbeb" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: compResult.durum === "uyumlu" ? "#1e7e4f" : compResult.durum === "ihlal" ? "#991b1b" : "#92600a" }}>{compResult.durum === "uyumlu" ? "✅ UYUMLU" : compResult.durum === "ihlal" ? "⛔ İHLAL" : "⚠️ RİSKLİ"} — {compResult.ozet}</div>
                  {compResult.bulgular?.map((b, i) => (<div key={i} style={{ marginTop: 8, fontSize: 12, color: "#555", paddingLeft: 8, borderLeft: `2px solid ${b.tip === "ihlal" ? "#c0392b" : "#e67e22"}` }}><b>"{b.ifade}"</b> {b.madde && <span style={{ color: "#999" }}>({b.madde})</span>}<br />→ {b.oneri}</div>))}</div>}
                <textarea value={content} onChange={(e) => setContent(e.target.value)} style={{ padding: 16, flex: 1, minHeight: 340, border: "none", resize: "vertical", fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.7, color: "#333", outline: "none" }} />
                {sources.length > 0 && <div style={{ padding: "10px 16px", borderTop: "1px solid #f0eeea", background: "#fafaf8" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 4 }}>KAYNAKLAR (yayından önce göz atın)</div>
                  {sources.slice(0, 8).map((s, i) => <div key={i} style={{ fontSize: 12 }}><a href={s.url} target="_blank" rel="noreferrer" style={{ color: "#0a66c2" }}>{s.title}</a></div>)}
                  {research && <details style={{ marginTop: 6 }}><summary style={{ fontSize: 12, cursor: "pointer", color: "#666" }}>Araştırma özeti</summary><pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#555" }}>{research}</pre><CopyBtn text={research} label="Araştırmayı kopyala" small /></details>}
                </div>}
              </div>
            )}
          </div>
        </div>
      )}

      {view === "watch" && (
        <div style={{ maxWidth: 800, margin: "32px auto", padding: "0 24px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#2a1f16" }}>Yeni Yasa & Karar Radarı</h2>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>Son 60 günün gelişmelerini web'de tarar, yayınlananlarla karşılaştırıp yeni konular önerir. Konular kuyruğa eklenir; üretilip onaylanınca düşer.</p>
          <button onClick={watchNewLaws} disabled={lawLoading} style={{ padding: "10px 24px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 700, cursor: lawLoading ? "wait" : "pointer", background: lawLoading ? "#ccc" : "linear-gradient(135deg,#c0392b,#8e2820)", color: "#fff" }}>{lawLoading ? "🔍 Web taranıyor (1 dk kadar sürebilir)..." : "🚨 Yeni Gelişmeleri Tara"}</button>
          {backlog.length > 0 && <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>{backlog.map((f, i) => (
            <div key={i} style={{ padding: 16, background: "#fff", borderRadius: 10, border: "1px solid #e8e6e1", borderLeft: `4px solid ${f.aciliyet === "yüksek" ? "#c0392b" : f.aciliyet === "orta" ? "#e67e22" : "#95a5a6"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><div style={{ fontSize: 15, fontWeight: 700 }}>{f.gelisme}</div><span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 8, background: "#f0eeea", color: "#666", whiteSpace: "nowrap" }}>{f.tarih}</span></div>
              <div style={{ fontSize: 13, color: "#666", marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><span><b>Başlık:</b> {f.onerilen_baslik}</span><CopyBtn text={f.onerilen_baslik} small /></div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #f4f2ee", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {[["google", null, "Google"], ["instagram", null, "Instagram"], ["linkedin", "kisisel", "LinkedIn Kişisel"], ["linkedin", "kurumsal", "LinkedIn Kurumsal"]].map(([pl, md, label]) => {
                  const pk = pl === "linkedin" ? "linkedin_" + md : pl; const done = isPublishedOn(f.onerilen_baslik, pk);
                  return <button key={label} disabled={done} onClick={() => produceFor(pl, md, f)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: done ? "default" : "pointer", border: `1px solid ${done ? "#ddd" : PLATFORM_COLOR[pk]}`, background: done ? "#f4f4f2" : PLATFORM_COLOR[pk] + "12", color: done ? "#aaa" : PLATFORM_COLOR[pk] }}>{done ? "✓ " : "→ "}{label}</button>;
                })}
                <button onClick={() => removeBacklog(i)} style={{ ...btn, marginLeft: "auto" }}>Kaldır</button>
              </div></div>))}</div>}
          {lawRaw && <div style={{ marginTop: 20, padding: 16, background: "#fff", borderRadius: 10, border: "1px solid #e8e6e1" }}><div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: 12, color: "#8a7034" }}>HAM ARAŞTIRMA</b><CopyBtn text={lawRaw} small /></div><pre style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.6, color: "#444" }}>{lawRaw}</pre></div>}
          {!lawLoading && backlog.length === 0 && !lawRaw && <p style={{ marginTop: 24, fontSize: 13, color: "#999", fontStyle: "italic" }}>Kuyruk boş.</p>}
        </div>
      )}

      {view === "archive" && (
        <div style={{ maxWidth: 860, margin: "32px auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#2a1f16", margin: 0 }}>Yayınlanmış Konular — {totalCount}</h2>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
              <CopyBtn text={inventoryAsText()} label="Tüm envanteri kopyala (metin)" primary />
              <CopyBtn text={seedBlock()} label="Kod bloğunu kopyala (SEED_CUSTOM)" />
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Envanter <b>koda gömülüdür</b>: dosyayı kopyalayan herkes aynı {totalCount} kaydı görür. Bu araçla yeni onayladıklarınız kayıt alanında saklanır; başkasına devretmek için "Kod bloğunu kopyala" ile <code>SEED_CUSTOM</code> listesini güncelleyin veya aşağıdan JSON içe aktarın.</p>
          {Object.keys(PLATFORM_LABEL).map((p) => {
            const cs = custom.filter((c) => c.platform === p && !staticKeys.has(keyOf(c.topic, p)));
            const st = STATIC_BY_PLATFORM[p]; const n = cs.length + st.length; const open = openArch[p];
            return (
              <div key={p} style={{ marginBottom: 10 }}>
                <div onClick={() => setOpenArch((o) => ({ ...o, [p]: !o[p] }))} style={{ padding: "12px 16px", background: "#fff", borderRadius: 8, border: "1px solid #e8e6e1", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <span style={{ color: PLATFORM_COLOR[p], fontSize: 10 }}>●</span><b style={{ flex: 1 }}>{PLATFORM_LABEL[p]}</b><span style={{ fontSize: 12, color: "#999" }}>{n} konu ({st.length} eski + {cs.length} araçla)</span>
                  <CopyBtn text={[...cs.map((c) => c.topic), ...st].join("\n")} label="Listeyi kopyala" small /><span style={{ fontSize: 12, color: "#999" }}>{open ? "▲" : "▼"}</span>
                </div>
                {open && <div style={{ marginTop: 6, maxHeight: 460, overflow: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                  {cs.map((it, i) => { const id = p + i; return (
                    <div key={id} style={{ background: "#fff", borderRadius: 8, border: "1px solid #e8e6e1" }}>
                      <div onClick={() => setOpenItem(openItem === id ? null : id)} style={{ padding: "8px 14px", fontSize: 13, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                        <span style={{ color: "#27ae60", fontSize: 9 }}>●</span><span style={{ flex: 1 }}>{it.topic}</span>
                        {it.type && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "#f0eeea", color: "#666" }}>{it.type}</span>}
                        {it.branch && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "#bf9b5115", color: "#8a7034" }}>{it.branch}</span>}
                        <span style={{ fontSize: 11, color: "#aaa" }}>{it.date}</span><CopyBtn text={it.content || it.topic} label={it.content ? "Metni kopyala" : "Başlığı kopyala"} small />
                      </div>
                      {openItem === id && <div style={{ borderTop: "1px solid #f0eeea", padding: "10px 14px", background: "#fafaf8" }}>{it.content ? <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.6, color: "#444", margin: 0 }}>{it.content}</pre> : <span style={{ fontSize: 12, color: "#999" }}>Bu kayıt için metin saklanmamış (yalnızca başlık).</span>}</div>}
                    </div>); })}
                  {st.map((t, i) => <div key={"s" + i} style={{ padding: "7px 14px", background: "#fff", borderRadius: 8, border: "1px solid #f0eeea", fontSize: 13, color: "#555", display: "flex", gap: 8 }}><span style={{ color: PLATFORM_COLOR[p], fontSize: 9, marginTop: 4 }}>●</span>{t}</div>)}
                </div>}
              </div>);
          })}
          <div style={{ marginTop: 20, padding: 16, background: "#fff", borderRadius: 10, border: "1px solid #e8e6e1" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Envanteri içe aktar (JSON dizisi: [{"{"}topic, platform, type, branch, date, content{"}"}])</div>
            <textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Başka kullanıcının 'Kod bloğunu kopyala' çıktısındaki [ ... ] kısmını yapıştırın" style={{ width: "100%", minHeight: 80, boxSizing: "border-box", padding: 10, borderRadius: 8, border: "1px solid #ddd", fontSize: 12 }} />
            <button onClick={applyImport} disabled={!importText.trim()} style={{ ...btn, marginTop: 8 }}>İçe aktar ve birleştir</button>
          </div>
        </div>
      )}
    </div>
  );
}
