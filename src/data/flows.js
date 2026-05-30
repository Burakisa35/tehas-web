// ─────────────────────────────────────────────────────────────────
// Akış tanımları — her hizmet için step listesi
// condition(answers): true → adım gösterilir
// ─────────────────────────────────────────────────────────────────

// ── Ortak adımlar (tüm akışlarda paylaşılır) ─────────────────────
export const KONUM_ADIMLARI = [
  {
    id: 'ilce',
    label: 'Konum',
    title: 'Hangi ilçedesiniz?',
    subtitle: 'Yalnızca hizmet verdiğimiz bölgeleri listeliyoruz.',
    type: 'ilce-select',
    required: false,
    skipLabel: 'Emin değilim',
  },
  {
    id: 'mahalle',
    label: 'Mahalle',
    title: 'Mahalle seçin',
    subtitle: null,
    type: 'mahalle-select',
    required: false,
    skipLabel: 'Bilmiyorum / Atla',
    condition: (a) => !!a.ilce,
  },
];

export const ZAMAN_ADIMI = {
  id: 'zaman',
  label: 'Zaman',
  title: 'Ne zaman hizmet almak istiyorsunuz?',
  subtitle: null,
  type: 'choice',
  required: false,
  skipLabel: 'Görüşerek belirleriz',
  options: [
    { value: 'acil',          label: 'Acil — bugün / yarın', ico: '⚡',  sub: 'En kısa sürede müdahale' },
    { value: 'bu_hafta',      label: 'Bu hafta',              ico: '📅',  sub: 'Randevu ile uygun gün' },
    { value: 'bu_ay',         label: 'Bu ay içinde',          ico: '🗓️',  sub: 'Esnek zamanlama' },
    { value: 'gorusmeye_gore',label: 'Görüşerek belirleriz',  ico: '💬',  sub: "WhatsApp'tan konuşalım" },
  ],
};

export const ILETISIM_ADIMI = {
  id: 'iletisim',
  label: 'İletişim',
  title: 'Son adım — sizi nasıl arayalım?',
  subtitle: 'Yalnızca bu talep için kullanılır. Üçüncü tarafla paylaşılmaz.',
  type: 'contact',
  required: true,
};

// ── Elektrik akışı ────────────────────────────────────────────────
export const ELEKTRIK_FLOW = {
  id: 'elektrik',
  label: 'Elektrik',
  ico: '⚡',
  fiyatBadge: { text: '₺500\'den başlayan fiyatlarla', sub: 'Kesin fiyat keşif sonrası belirlenir' },
  steps: [
    {
      id: 'elektrik_is_tipi',
      label: 'İş tipi',
      title: 'Ne yapmak istiyorsunuz?',
      subtitle: null,
      type: 'choice',
      required: true,
      options: [
        { value: 'montaj',      label: 'Montaj',           ico: '🔧', sub: 'Priz, anahtar, avize, spot, LED, şofben…' },
        { value: 'ariza',       label: 'Arıza tamiri',     ico: '🔍', sub: 'Sigortadan kaçak akıma kadar her arıza' },
        { value: 'tesisat',     label: 'Tesisat',          ico: '🏗️', sub: 'Daire, bina, inşaat, klima hattı' },
        { value: 'hat_cekme',   label: 'Hat çekme',        ico: '📐', sub: 'Priz, klima, internet, topraklama hattı' },
        { value: 'diger',       label: 'Diğer / Emin değilim', ico: '💡', sub: 'WhatsApp\'tan birlikte belirleriz' },
      ],
    },
    // Montaj → ürün
    {
      id: 'elektrik_urun',
      label: 'Ürün',
      title: 'Ne monte edilecek?',
      subtitle: 'Birden fazla ürün varsa en önemlisini seçin.',
      type: 'choice-grid',
      required: false,
      skipLabel: 'Listede yok / Emin değilim',
      condition: (a) => a.elektrik_is_tipi === 'montaj',
      options: [
        { value: 'avize',       label: 'Avize',             ico: '💡' },
        { value: 'priz_anahtar',label: 'Priz / Anahtar',    ico: '🔌' },
        { value: 'lamba',       label: 'Lamba / Armatür',   ico: '🔆' },
        { value: 'spot',        label: 'Spot',              ico: '💫' },
        { value: 'led',         label: 'LED Şerit / Panel', ico: '🌈' },
        { value: 'tv_duvar',    label: 'TV Duvar Montajı',  ico: '📺' },
        { value: 'sigorta',     label: 'Sigorta / Kaçak Akım', ico: '⚙️' },
        { value: 'sofben',      label: 'Şofben',            ico: '🚿' },
        { value: 'vantilator',  label: 'Tavan Vantilatörü', ico: '🌀' },
        { value: 'uydu_baglanti',label: 'Uydu/Anten Bağlantısı', ico: '📡' },
        { value: 'diger',       label: 'Diğer',             ico: '🔩' },
      ],
    },
    // Montaj → adet
    {
      id: 'elektrik_adet',
      label: 'Adet',
      title: 'Kaç adet monte edilecek?',
      subtitle: null,
      type: 'choice-grid',
      required: false,
      skipLabel: 'Emin değilim',
      condition: (a) => a.elektrik_is_tipi === 'montaj' && !!a.elektrik_urun,
      options: [
        { value: '1',    label: '1',         ico: '①' },
        { value: '2-3',  label: '2-3',       ico: '②' },
        { value: '4-5',  label: '4-5',       ico: '③' },
        { value: '6-10', label: '6-10',      ico: '④' },
        { value: '11-20',label: '11-20',     ico: '⑤' },
        { value: '20+',  label: '20+',       ico: '⑥' },
      ],
    },
    // Tesisat → kapsam
    {
      id: 'elektrik_tesisat_kapsam',
      label: 'Kapsam',
      title: 'Tesisat kapsamı nedir?',
      subtitle: null,
      type: 'choice',
      required: false,
      skipLabel: 'Emin değilim',
      condition: (a) => a.elektrik_is_tipi === 'tesisat',
      options: [
        { value: 'tek_nokta',   label: 'Tek nokta',              ico: '📍', sub: 'Bir priz, anahtar veya bağlantı' },
        { value: 'tek_oda',     label: 'Tek oda',                ico: '🚪', sub: 'Bir odanın tesisat işleri' },
        { value: 'daire',       label: 'Daire içi',             ico: '🏠', sub: 'Tüm dairenin tesisatı' },
        { value: 'apartman',    label: 'Apartman ortak alan',    ico: '🏢', sub: 'Merdiven, giriş, otopark' },
        { value: 'isyeri',      label: 'İş yeri / Ofis',        ico: '🏪', sub: 'Dükkan, ofis, showroom' },
        { value: 'depo',        label: 'Depo / Atölye',         ico: '🏭', sub: 'Sanayi veya depo alanı' },
      ],
    },
    // Hat çekme → amaç
    {
      id: 'elektrik_hat_amac',
      label: 'Hat amacı',
      title: 'Hangi amaçla hat çekilecek?',
      subtitle: null,
      type: 'choice-grid',
      required: false,
      skipLabel: 'Emin değilim',
      condition: (a) => a.elektrik_is_tipi === 'hat_cekme',
      options: [
        { value: 'priz',        label: 'Priz hattı',      ico: '🔌' },
        { value: 'klima',       label: 'Klima hattı',     ico: '❄️' },
        { value: 'internet',    label: 'İnternet / TV',   ico: '🌐' },
        { value: 'topraklama',  label: 'Topraklama',      ico: '⚡' },
        { value: 'avize',       label: 'Avize / Armatür', ico: '💡' },
        { value: 'diger',       label: 'Diğer',           ico: '🔧' },
      ],
    },
    // Hat çekme → mesafe
    {
      id: 'elektrik_hat_metre',
      label: 'Mesafe',
      title: 'Tahmini kablo mesafesi?',
      subtitle: 'Kesin değilse yaklaşık bir değer yeterli.',
      type: 'choice-grid',
      required: false,
      skipLabel: 'Bilmiyorum',
      condition: (a) => a.elektrik_is_tipi === 'hat_cekme',
      options: [
        { value: '10m_alti', label: '10m altı',  ico: '📏' },
        { value: '20m',      label: '~20m',      ico: '📏' },
        { value: '30m',      label: '~30m',      ico: '📏' },
        { value: '50m',      label: '~50m',      ico: '📏' },
        { value: '80m',      label: '~80m',      ico: '📏' },
        { value: '100m_ustu',label: '100m+',     ico: '📏' },
      ],
    },
    ILETISIM_ADIMI,
    ...KONUM_ADIMLARI,
    ZAMAN_ADIMI,
  ],
};

// ── Kamera akışı ──────────────────────────────────────────────────
export const KAMERA_FLOW = {
  id: 'kamera',
  label: 'Kamera',
  ico: '📷',
  fiyatBadge: { text: 'Kamera adedine göre teklif', sub: 'Hikvision Partner Pro sertifikalı kurulum' },
  steps: [
    {
      id: 'kamera_is_tipi',
      label: 'İş tipi',
      title: 'Kamera için ne lazım?',
      subtitle: null,
      type: 'choice',
      required: true,
      options: [
        { value: 'yeni_sistem',  label: 'Yeni kamera sistemi',         ico: '🆕', sub: 'Kamera, kayıt cihazı ve kurulum' },
        { value: 'ek_kamera',    label: 'Mevcut sisteme kamera ekleme',ico: '➕', sub: 'Mevcut DVR/NVR kapasitesi var' },
        { value: 'sadece_montaj',label: 'Sadece montaj (ürün bende)',  ico: '🔧', sub: 'Kamera ve cihaz hazır, kurulum lazım' },
        { value: 'sokum_takma',  label: 'Söküp tekrar takma',         ico: '🔄', sub: 'Taşınma, tadilat sonrası yeniden kurulum' },
        { value: 'ariza',        label: 'Kamera sistemi arızalı',      ico: '🔍', sub: 'Görüntü yok, kayıt durdu, vb.' },
        { value: 'izleme_sorun', label: 'Telefondan izleme sorunu',    ico: '📱', sub: 'Uygulama, şifre, erişim problemi' },
        { value: 'kayit_sorun',  label: 'Kayıt / DVR / NVR sorunu',   ico: '💾', sub: 'Kayıt olmuyor, disk dolu, vb.' },
        { value: 'diger',        label: 'Diğer / Emin değilim',       ico: '💬', sub: 'Konuşarak netleştirelim' },
      ],
    },
    // Adet (yeni / ek / montaj için)
    {
      id: 'kamera_adet',
      label: 'Kamera adedi',
      title: 'Kaç kamera olacak?',
      subtitle: '4, 8, 16 kanal eşikleri fiyatı ve cihaz seçimini etkiler.',
      type: 'choice-grid',
      required: false,
      skipLabel: 'Emin değilim',
      condition: (a) => ['yeni_sistem', 'ek_kamera', 'sadece_montaj'].includes(a.kamera_is_tipi),
      options: [
        { value: '1',    label: '1 kamera',   ico: '1️⃣' },
        { value: '2',    label: '2 kamera',   ico: '2️⃣' },
        { value: '3-4',  label: '3-4 kamera', ico: '3️⃣' },
        { value: '5-8',  label: '5-8 kamera', ico: '4️⃣' },
        { value: '9-16', label: '9-16 kamera',ico: '5️⃣' },
        { value: '20+',  label: '20+ kamera', ico: '6️⃣' },
      ],
    },
    // Kurulum yeri
    {
      id: 'kamera_yer',
      label: 'Kurulum yeri',
      title: 'Nereye kurulacak?',
      subtitle: null,
      type: 'choice-grid',
      required: false,
      skipLabel: 'Emin değilim',
      condition: (a) => ['yeni_sistem', 'ek_kamera', 'sadece_montaj', 'sokum_takma'].includes(a.kamera_is_tipi),
      options: [
        { value: 'ev_daire',   label: 'Ev / Daire',       ico: '🏠' },
        { value: 'isyeri',     label: 'İş yeri / Dükkan', ico: '🏪' },
        { value: 'bina',       label: 'Bina / Apartman',  ico: '🏢' },
        { value: 'depo',       label: 'Depo / Atölye',    ico: '🏭' },
        { value: 'bahce',      label: 'Bahçe / Dış alan', ico: '🌳' },
        { value: 'diger',      label: 'Diğer',            ico: '📍' },
      ],
    },
    // Ek not (opsiyonel textarea)
    {
      id: 'kamera_not',
      label: 'Detay',
      title: 'Eklemek istediğiniz bir detay var mı?',
      subtitle: 'Opsiyonel — iç/dış mekan, gece görüşü, kat bilgisi, kablo mesafesi…',
      type: 'textarea',
      required: false,
      skipLabel: 'Hayır, yeterli',
      condition: (a) => ['yeni_sistem', 'ek_kamera', 'sadece_montaj'].includes(a.kamera_is_tipi),
    },
    ...KONUM_ADIMLARI,
    ZAMAN_ADIMI,
    {
      id: 'kamera_detay',
      label: 'Mevcut Sistem',
      title: 'Mevcut sistem hakkında bilgi verin',
      subtitle: null,
      type: 'textarea',
      required: false,
      skipLabel: 'Bilgim yok / Atla',
    },
    ILETISIM_ADIMI,
  ],
};

// ── Uydu / Anten akışı ────────────────────────────────────────────
export const UYDU_FLOW = {
  id: 'uydu',
  label: 'Uydu / Anten',
  ico: '📡',
  fiyatBadge: { text: '₺800\'den başlayan fiyatlarla', sub: 'Çanak, anten ve multiswitch kurulumu' },
  steps: [
    {
      id: 'uydu_is_tipi',
      label: 'İş tipi',
      title: 'Uydu / anten için ne lazım?',
      subtitle: null,
      type: 'choice',
      required: true,
      options: [
        { value: 'yeni_kurulum', label: 'Yeni çanak / anten kurulumu', ico: '📡', sub: 'Kurulum ve ayarlama dahil' },
        { value: 'ariza',        label: 'Mevcut sistem arızalı',       ico: '🔍', sub: 'Sinyal yok, görüntü bozuk' },
        { value: 'kanal_sorunu', label: 'Kanal bulunamıyor / sinyal sorunu', ico: '📶', sub: 'Yayın veya uydu ayarı' },
        { value: 'santral',      label: 'Santral / multiswitch kurulumu', ico: '🔀', sub: 'Bina ve apartman dağıtımı' },
        { value: 'uydu_internet',label: 'Uydu → internet entegrasyonu', ico: '🌐', sub: 'Uydu üzerinden internet bağlantısı' },
        { value: 'diger',        label: 'Diğer / Emin değilim',        ico: '💬', sub: '' },
      ],
    },
    ILETISIM_ADIMI,
    ...KONUM_ADIMLARI,
    ZAMAN_ADIMI,
  ],
};

// ── Ağ altyapısı akışı ────────────────────────────────────────────
export const AG_FLOW = {
  id: 'ag',
  label: 'Ağ / İnternet',
  ico: '🌐',
  fiyatBadge: { text: 'Keşif sonrası fiyatlandırma', sub: 'Kablo mesafesine ve ekipmana göre değişir' },
  steps: [
    {
      id: 'ag_is_tipi',
      label: 'İş tipi',
      title: 'Ağ / internet için ne lazım?',
      subtitle: null,
      type: 'choice',
      required: true,
      options: [
        { value: 'kablo',   label: 'İnternet kablosu çekme',       ico: '🔌', sub: 'Cat6/Cat7 altyapı tesisatı' },
        { value: 'switch',  label: 'Switch / Router kurulumu',     ico: '🔀', sub: 'Cihaz montajı ve yapılandırma' },
        { value: 'ap',      label: 'Access point / mesh kurulumu', ico: '📶', sub: 'Geniş alan kapsama çözümü' },
        { value: 'ariza',   label: 'Mevcut ağ sorunu',             ico: '🔍', sub: 'Bağlantı yok, hız düşüklüğü' },
        { value: 'diger',   label: 'Diğer / Emin değilim',        ico: '💬', sub: '' },
      ],
    },
    // Kablo seçilince mesafe sorusu
    {
      id: 'ag_kablo_metre',
      label: 'Mesafe',
      title: 'Tahmini kablo mesafesi?',
      subtitle: null,
      type: 'choice-grid',
      required: false,
      skipLabel: 'Bilmiyorum',
      condition: (a) => a.ag_is_tipi === 'kablo',
      options: [
        { value: '10m_alti', label: '10m altı', ico: '📏' },
        { value: '20m',      label: '~20m',     ico: '📏' },
        { value: '30m',      label: '~30m',     ico: '📏' },
        { value: '50m',      label: '~50m',     ico: '📏' },
        { value: '80m',      label: '~80m',     ico: '📏' },
        { value: '100m_ustu',label: '100m+',    ico: '📏' },
      ],
    },
    ILETISIM_ADIMI,
    ...KONUM_ADIMLARI,
    ZAMAN_ADIMI,
  ],
};

// ── Kapı otomasyonu akışı ─────────────────────────────────────────
export const OTOMASYON_FLOW = {
  id: 'otomasyon',
  label: 'Kapı / Kepenk',
  ico: '🚪',
  fiyatBadge: { text: 'Keşif sonrası fiyatlandırma', sub: 'Marka ve modele göre değişir' },
  steps: [
    {
      id: 'otomasyon_is_tipi',
      label: 'İş tipi',
      title: 'Kapı / kepenk için ne lazım?',
      subtitle: null,
      type: 'choice',
      required: true,
      options: [
        { value: 'yeni',   label: 'Yeni otomatik kapı / kepenk', ico: '🆕', sub: 'Komple kurulum' },
        { value: 'ariza',  label: 'Mevcut sistem arızalı',       ico: '🔍', sub: 'Kapı açılmıyor, motor sorunu' },
        { value: 'kumanda',label: 'Kumanda / panel değişimi',    ico: '🎮', sub: 'Uzaktan kumanda, tuş takımı' },
        { value: 'diger',  label: 'Diğer / Emin değilim',       ico: '💬', sub: '' },
      ],
    },
    ILETISIM_ADIMI,
    ...KONUM_ADIMLARI,
    ZAMAN_ADIMI,
  ],
};

// ── Alarm / Diyafon / Kartlı geçiş akışı ─────────────────────────
export const ALARM_FLOW = {
  id: 'alarm',
  label: 'Alarm / Diyafon',
  ico: '🔔',
  fiyatBadge: { text: 'Keşif sonrası fiyatlandırma', sub: 'Sistem kapsamına göre belirlenir' },
  steps: [
    {
      id: 'alarm_is_tipi',
      label: 'İş tipi',
      title: 'Alarm / diyafon için ne lazım?',
      subtitle: null,
      type: 'choice',
      required: true,
      options: [
        { value: 'yeni',      label: 'Yeni sistem kurulumu',     ico: '🆕', sub: 'Alarm, diyafon veya kartlı geçiş' },
        { value: 'ariza',     label: 'Mevcut sistem arızalı',    ico: '🔍', sub: 'Alarm çalışmıyor, diyafon sorunlu' },
        { value: 'panel',     label: 'Panel / sensör değişimi',  ico: '🔧', sub: 'Parça değişimi veya güncelleme' },
        { value: 'diger',     label: 'Diğer / Emin değilim',    ico: '💬', sub: '' },
      ],
    },
    ILETISIM_ADIMI,
    ...KONUM_ADIMLARI,
    ZAMAN_ADIMI,
  ],
};

// ── Flow kaydı ────────────────────────────────────────────────────
// ── Teknisyen Başvuru Akışı (6 adım) ─────────────────────────────
export const BASVURU_FLOW = {
  id: 'basvuru',
  label: 'Teknisyen Başvurusu',
  ico: '🧑‍🔧',
  fiyatBadge: null,
  steps: [
    // Adım 1: Karşılama — 3 saniye otomatik geçiş
    {
      id: 'basvuru_giris',
      label: '',
      title: '',
      subtitle: null,
      type: 'splash',
      required: false,
      skipLabel: null,
    },
    // Adım 2: Rol — seçince otomatik geçiş
    {
      id: 'basvuru_rol',
      label: 'Rol',
      title: 'Nasıl bir pozisyon arıyorsunuz?',
      subtitle: null,
      type: 'choice',
      required: true,
      skipLabel: null,
      options: [
        { value: 'saha',       label: 'Saha Teknisyeni',  ico: '🔧', sub: 'Saha kurulum ve arıza müdahalesi' },
        { value: 'idari',      label: 'İdari',            ico: '📋', sub: 'Koordinasyon, müşteri iletişimi, teklif ve takip' },
        { value: 'her_ikisi',  label: 'Her İkisi',        ico: '⚡', sub: 'Esnek, her iki rolde çalışabilirim' },
      ],
    },
    // Adım 3: Alan — çoklu seçim, Devam Et ile (yalnızca saha/her_ikisi rolünde göster)
    {
      id: 'basvuru_alanlar',
      label: 'Uzmanlık Alanları',
      title: 'Hangi alanlarda deneyiminiz var?',
      subtitle: 'Birden fazla seçebilirsiniz.',
      type: 'multi-choice',
      required: true,
      skipLabel: null,
      condition: (a) => a.basvuru_rol === 'saha' || a.basvuru_rol === 'her_ikisi',
      options: [
        { value: 'elektrik',  label: 'Elektrik Tesisatı',  ico: '⚡' },
        { value: 'kamera',    label: 'Güvenlik Kamerası',   ico: '📷' },
        { value: 'uydu',      label: 'Uydu / Anten',        ico: '📡' },
        { value: 'ag',        label: 'Ağ / İnternet',       ico: '🌐' },
        { value: 'otomasyon', label: 'Kapı / Kepenk',       ico: '🚪' },
        { value: 'alarm',     label: 'Alarm / Diyafon',     ico: '🔔' },
      ],
    },
    // Adım 4: İlçe — seçince otomatik geçiş
    {
      id: 'ilce',
      label: 'Çalışma Bölgesi',
      title: 'Hangi ilçede çalışmak istersiniz?',
      subtitle: 'Seçtiğiniz ilçede konumlandırılırsınız.',
      type: 'ilce-select',
      required: true,
      skipLabel: null,
    },
    // Adım 5: Deneyim — seçince otomatik geçiş
    {
      id: 'basvuru_deneyim',
      label: 'Deneyim',
      title: 'Kaç yıldır bu iştesiniz?',
      subtitle: null,
      type: 'choice-grid',
      required: true,
      skipLabel: null,
      options: [
        { value: 'yeni',  label: 'Yeni başlıyorum', ico: '🌱' },
        { value: '1',     label: '1 yıl',           ico: '①' },
        { value: '2-3',   label: '2-3 yıl',         ico: '②' },
        { value: '4-5',   label: '4-5 yıl',         ico: '③' },
        { value: '6-10',  label: '6-10 yıl',        ico: '④' },
        { value: '10+',   label: '10+ yıl',         ico: '⑤' },
      ],
    },
    // Adım 6: İletişim — Ad + Soyad + Tel + Cinsiyet, Gönder butonu
    {
      id: 'basvuru_iletisim',
      label: 'İletişim',
      title: 'Son adım — nasıl ulaşalım?',
      subtitle: 'Bilgileriniz yalnızca başvuru sürecinde kullanılır.',
      type: 'basvuru-contact',
      required: true,
      skipLabel: null,
    },
  ],
};

export const FLOWS = {
  elektrik:  ELEKTRIK_FLOW,
  kamera:    KAMERA_FLOW,
  uydu:      UYDU_FLOW,
  ag:        AG_FLOW,
  otomasyon: OTOMASYON_FLOW,
  alarm:     ALARM_FLOW,
  basvuru:   BASVURU_FLOW,
};

export default FLOWS;
