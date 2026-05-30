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
3. package-lock.json, node_modules, dist klasörlerine dokunma.f
