# CLAUDE.md — tehas-web

## Kritik Kural
package-lock.json dosyasını ASLA okuma. node_modules klasörüne ASLA girme.

## Proje
React + Vite. Mobil öncelikli müşteri talep wizard uygulaması.

## Dosya Haritası
- src/data/flows.js — tüm akış tanımları
- src/data/ilceler.js — ilçe/mahalle listesi
- src/components/ — UI bileşenleri
- src/utils/whatsapp.js — WA mesaj üretici
- src/utils/refcode.js — referans kodu
- src/styles/global.css — tüm stiller

## Görev Kuralları
1. Önce sadece ilgili dosyayı oku, tümünü değil.
2. Minimal değişiklik yap.
3. package-lock.json, node_modules, dist klasörlerine dokunma.

## Son Eklenen Özellikler
- Teknisyen başvuru akışı: src/data/flows.js — BASVURU_FLOW (6 adım)
- Başvuru bileşenleri: src/components/StepScreen.jsx — SplashStep, MultiChoiceList, BasvuruContactForm
- Geçiş animasyonları: src/styles/global.css — screen-enter, screen-exit, choice-tap
- Animasyon state makinesi: src/components/FlowWizard.jsx
- Başvuru WA mesajı: src/utils/whatsapp.js — basvuru bloğu

## Tamamlanan Düzeltmeler
- basvuru_alanlar condition eklendi (idari seçince görünmüyor)
- ilce-select otomatik geçiş eklendi
- choice/choice-grid Devam Et butonu kaldırıldı
- HomeScreen primary kart vurgusu kaldırıldı

## Bekleyen
- Başvuru akışı kullanıcı testi
- Google Sheets entegrasyonu (refcode localStorage sorunu)
- Pazartesi listesi belirlenecek
