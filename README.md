# Yılmaz & Çolak — Otomatik Sosyal Medya Sistemi

Haftada 3 gün (varsayılan: **Pzt Google İşletme · Çar Instagram · Cum LinkedIn**, 09:00 İstanbul) şunları yapar:

1. Envanterde **olmayan** yeni konuyu seçer (`data/queue.txt` → yoksa Claude önerir; 4 platform için çakışma kontrolü).
2. **Zorunlu** web araştırması yapar (Resmî Gazete/mevzuat/Yargıtay kaynaklı, kaynak URL'leri taslağa kaydedilir). Kaynak bulunamazsa hafızadan yazmaz, durur. Konu kuyrukta yoksa "Yasa Radarı" son 45 günün gelişmelerinden yeni konu seçer. Sonra metni yazar (Google ≤1500 kr otomatik kısaltma).
2b. **Doğruluk denetimi**: metindeki her madde/tarih/süre/künye araştırmayla karşılaştırılır; desteklenmeyen iddia düzeltilir, düzelmezse taslak `needs_review` olur ve yayınlanmaz.
3. **Reklam yasağı denetimi** (Av.K. m.55 / TBB Yön.) yapar; ihlal varsa düzeltir, düzelmezse yayını **engeller**.
4. Şablonunuzdan 1080×1080 görseli üretir (Canva yerine; `assets/template.png` koyun).
5. `config.json` → `mode`:
   - `draft` (**önerilen**): taslağı `drafts/` altına yazar, siz onaylayınca yayınlanır (Actions → *Run workflow* → `publish_draft`).
   - `auto`: onaysız doğrudan yayınlar. Reklam yasağı sorumluluğu size ait olduğundan başlangıçta `draft` kullanın.

## Kurulum (bir kerelik)
1. Depoyu GitHub'a koyun, **Settings → Pages → Branch: main, /docs** açın (Instagram/Google görsel için herkese açık URL ister). *Settings → Variables*: `PUBLIC_BASE_URL = https://KULLANICI.github.io/DEPO`
2. `assets/template.png` (1080×1080 boş şablon) ve isterseniz `assets/fonts/PlayfairDisplay-*.ttf` ekleyin.
3. Eski yayın listelerinizi içe aktarın (ör. Instagram'ın ~110 konusu): `npm run import -- instagram ig.txt` (platform: `google|instagram|linkedin_kurumsal|linkedin_kisisel`, her satır bir konu). Google ve LinkedIn listeleri hazır yüklendi.
4. **Settings → Secrets** ekleyin:

| Secret | Nereden |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN`, `GBP_ACCOUNT_ID`, `GBP_LOCATION_ID` | Google Cloud OAuth + **Business Profile API erişim onayı** (Google'a başvuru gerekir) |
| `IG_USER_ID`, `IG_ACCESS_TOKEN` | Instagram **Business/Creator** hesabı + Meta uygulaması (`instagram_content_publish`); uzun ömürlü token ~60 günde yenilenir |
| `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_URN` (`urn:li:person:…`), `LINKEDIN_ORG_URN` (`urn:li:organization:…`) | LinkedIn uygulaması: *Share on LinkedIn*; kurumsal sayfa için *Community Management API* onayı; token ~60 gün |

5. Deneme: Actions → *Haftalık paylaşım* → *Run workflow* (`platform=google`). Anahtarsız yerel test: `STUB=1 DRY_RUN=1 PUBLIC_BASE_URL=https://x node src/generate.js --platform=google`.

## Sınırlar (dürüst not)
- Canva bağlantısı yok: Canva'nın otomatik doldurma API'si yalnızca Enterprise planda. Görsel yerel şablondan üretilir.
- Instagram şimdilik **tek görselli** gönderi yayınlar (carousel/Reels yayını yok; Carousel metni tek kapak + caption olarak çıkar).
- Token süreleri (Instagram/LinkedIn ~60 gün) dolunca yenilenmesi gerekir; yayın hatası Actions'ta kırmızı görünür.
- Uydurma karar künyesi riskine karşı model "[teyit edilecek]" yazar; `draft` modunda yayın öncesi gözden geçirin.
- Gün/saat: `config.json → schedule` ve workflow'daki `cron` (UTC).
