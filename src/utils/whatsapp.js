import { evaluateCameraLead } from './tehasDecisionEngine.js';

export const WA_PHONE = '905367807059';

// Etiket çözücüler ─────────────────────────────────────────────
const IS_TIPI_LABELS = {
  montaj: 'Montaj', ariza: 'Arıza tamiri', tesisat: 'Tesisat',
  hat_cekme: 'Hat çekme', diger: 'Diğer',
  yeni_sistem: 'Yeni kamera sistemi', ek_kamera: 'Mevcut sisteme kamera ekleme',
  sadece_montaj: 'Sadece montaj (ürün müşteride)', sokum_takma: 'Söküp tekrar takma',
  izleme_sorun: 'Telefondan izleme sorunu', kayit_sorun: 'Kayıt/DVR/NVR sorunu',
  yeni_kurulum: 'Yeni kurulum', kanal_sorunu: 'Kanal/sinyal sorunu',
  santral: 'Santral/multiswitch kurulumu', uydu_internet: 'Uydu-internet entegrasyonu',
  kablo: 'Kablo çekme', switch: 'Switch/Router kurulumu', ap: 'Access point/mesh',
  yeni: 'Yeni sistem kurulumu', kumanda: 'Kumanda/panel değişimi',
  panel: 'Panel/sensör değişimi',
  // Elektrik yeni
  sigorta:      'Sigorta / Kaçak akım',
  pano:         'Pano kontrolü',
  dis_mekan:    'Dış mekan / Bahçe elektriği',
  ev_sarj:      'EV şarj altyapısı',
  solar_on:     'Solar ön keşfi',
  akilli_ev:    'Akıllı ev / otomasyon desteği',
  // Kamera yeni
  ilk_denetim:      'Kamera ilk denetim',
  bakim:            'Kamera bakım',
  apartman_kamera:  'Apartman / Site kamera sistemi',
  isyeri_kamera:    'İşyeri / Fabrika kamera sistemi',
  villa_kamera:     'Villa güvenlik sistemi',
  solar_4g:         'Solar / 4G kamera',
  entegrasyon:      'Kamera + Alarm + İnterkom entegrasyonu',
  // Alarm yeni
  interkom:         'Video interkom / Diyafon',
  ax_pro:           'Hikvision AX Pro alarm',
  kartli_gecis:     'Kartlı geçiş sistemi',
  // Akıllı ev
  anahtar_role:  'Akıllı anahtar / röle',
  priz:          'Akıllı priz',
  aydinlatma:    'Akıllı aydınlatma',
  kapi_garaj:    'Kapı / garaj kontrolü',
  bahce_sulama:  'Bahçe / sulama otomasyonu',
  hub_network:   'Hub / Wi-Fi altyapı',
  kurulum:       'Cihaz kurulumu',
  kesif:         'Keşif / uygunluk kontrolü',
  // Solar
  on_kesif:      'Solar uygunluk ön keşfi',
  ariza_bakim:   'Mevcut GES arıza / bakım',
  altyapi:       'Pano / kablo / koruma desteği',
  off_grid:      'Küçük off-grid sistem',
};

const URUN_LABELS = {
  avize: 'Avize', priz_anahtar: 'Priz/Anahtar', lamba: 'Lamba/Armatür',
  spot: 'Spot', led: 'LED', tv_duvar: 'TV Duvar Montajı',
  sigorta: 'Sigorta/Kaçak Akım', sofben: 'Şofben',
  vantilator: 'Tavan Vantilatörü', uydu_baglanti: 'Uydu/Anten Bağlantısı',
};

const TESISAT_LABELS = {
  tek_nokta: 'Tek nokta', tek_oda: 'Tek oda', daire: 'Daire içi',
  apartman: 'Apartman ortak alan', isyeri: 'İş yeri/Ofis', depo: 'Depo/Atölye',
};

const HAT_LABELS = {
  priz: 'Priz hattı', klima: 'Klima hattı', internet: 'İnternet/TV',
  topraklama: 'Topraklama', avize: 'Avize/Armatür',
};

const YER_LABELS = {
  ev_daire: 'Ev/Daire', isyeri: 'İş yeri/Dükkan', bina: 'Bina/Apartman',
  depo: 'Depo/Atölye', bahce: 'Bahçe/Dış alan',
};

const ZAMAN_LABELS = {
  acil:           'Acil — bugün/yarın',
  bu_hafta:       'Bu hafta',
  bu_ay:          'Bu ay içinde',
  gorusmeye_gore: 'Görüşerek belirleriz',
};

const HIZMET_LABELS = {
  elektrik: 'Elektrik', kamera: 'Güvenlik Kamerası',
  uydu: 'Uydu / Anten', ag: 'Ağ / İnternet',
  otomasyon: 'Kapı / Kepenk Otomasyonu', alarm: 'Alarm / Diyafon',
  basvuru: 'Teknisyen Başvurusu',
  apartman: 'Apartman Bakımı',
  akilli_ev: 'Akıllı Ev / Otomasyon',
  solar:     'Solar & Enerji Altyapısı',
};

const EXPERIENCE_MODE_LABELS = {
  simple:    'Kolay Anlatım',
  technical: 'Teknik / Kurumsal',
};

const KOLAY_KULLANIM_LABELS = {
  ev: 'Ev', apartman: 'Apartman', isyeri: 'İş yeri',
};

const KOLAY_ALAN_EV_LABELS = {
  kapi_onu: 'Kapı önü', kapi_giris: 'Kapı girişi', bahce_arac: 'Bahçe / araç',
  otopark: 'Otopark', evin_cevresi: 'Evin çevresi', emin_degil: 'Emin değilim',
};

const KOLAY_ALAN_ISYERI_LABELS = {
  giris: 'Giriş', kasa: 'Kasa / yazar kasa', depo: 'Depo',
  dis_cephe: 'Dış cephe', tum_isyeri: 'Tüm iş yeri', emin_degil: 'Emin değilim',
};

const KOLAY_ALAN_APARTMAN_LABELS = {
  bina_girisi: 'Bina girişi', otopark: 'Otopark', asansor: 'Asansör',
  ortak_alan: 'Ortak alan', dis_cevre: 'Dış çevre', emin_degil: 'Emin değilim',
};

const KOLAY_IHTIYAC_LABELS = {
  telefon_izleme: 'Telefondan izleme', gecmis_goruntu: 'Geçmiş görüntü kaydı',
  gece_goruntu: 'Gece görüntüsü', sadece_canli: 'Sadece canlı izleme',
};

function label(map, val) {
  return map[val] || val || '';
}

// ── WhatsApp mesajı üretici ────────────────────────────────────────
export function buildWaMessage(flowId, answers, refCode) {
  const lines = [];

  lines.push('Merhaba, TEHAŞ sisteminden talep oluşturdum.');
  if (refCode) lines.push(`Referans kodu: ${refCode}`);
  lines.push('');
  lines.push(`Hizmet: ${label(HIZMET_LABELS, flowId)}`);

  // İş tipi
  const isTipiKey = `${flowId}_is_tipi`;
  if (answers[isTipiKey]) {
    lines.push(`İş tipi: ${label(IS_TIPI_LABELS, answers[isTipiKey])}`);
  }

  // Elektrik özeli
  if (flowId === 'elektrik') {
    if (answers.elektrik_urun) {
      lines.push(`Ürün: ${label(URUN_LABELS, answers.elektrik_urun)}`);
    }
    if (answers.elektrik_adet) {
      lines.push(`Adet: ${answers.elektrik_adet}`);
    }
    if (answers.elektrik_tesisat_kapsam) {
      lines.push(`Kapsam: ${label(TESISAT_LABELS, answers.elektrik_tesisat_kapsam)}`);
    }
    if (answers.elektrik_hat_amac) {
      lines.push(`Hat amacı: ${label(HAT_LABELS, answers.elektrik_hat_amac)}`);
    }
    if (answers.elektrik_hat_metre) {
      lines.push(`Hat mesafesi: ${answers.elektrik_hat_metre}`);
    }
  }

  // Başvuru
  if (flowId === 'basvuru') {
    if (answers.basvuru_ad)
      lines.push(`Ad: ${answers.basvuru_ad}`);
    if (answers.basvuru_soyad)
      lines.push(`Soyad: ${answers.basvuru_soyad}`);
    if (answers.basvuru_cinsiyet)
      lines.push(`Cinsiyet: ${answers.basvuru_cinsiyet}`);
    if (answers.basvuru_tel)
      lines.push(`Telefon: ${answers.basvuru_tel}`);
    if (answers.basvuru_rol)
      lines.push(`Rol: ${answers.basvuru_rol}`);
    if (answers.basvuru_alanlar && answers.basvuru_alanlar.length)
      lines.push(`Uzmanlık alanları: ${answers.basvuru_alanlar.map(v => label(HIZMET_LABELS, v) || v).join(', ')}`);
    if (answers.ilce)
      lines.push(`Çalışmak istediği ilçe: ${answers.ilce}`);
    if (answers.basvuru_deneyim)
      lines.push(`Deneyim: ${answers.basvuru_deneyim}`);
  }

  // Apartman
  if (flowId === 'apartman') {
    if (answers.basvuran_sifati)   lines.push(`Başvuran: ${answers.basvuran_sifati}`);
    if (answers.yapi_tipi)         lines.push(`Yapı tipi: ${answers.yapi_tipi}`);
    if (answers.bolum_sayisi)      lines.push(`Bağımsız bölüm: ${answers.bolum_sayisi}`);
    if (answers.anlasma_modeli)    lines.push(`Anlaşma modeli: ${answers.anlasma_modeli}`);
    if (answers.sistemler?.length) lines.push(`Sistemler: ${answers.sistemler.join(', ')}`);
    if (answers.talep_turu)        lines.push(`Talep türü: ${answers.talep_turu}`);
    if (answers.adres_bolge)       lines.push(`Bölge: ${answers.adres_bolge}`);
  }

  // Akıllı ev
  if (flowId === 'akilli_ev') {
    if (answers.akilli_ev_yer)   lines.push(`Yapı tipi: ${answers.akilli_ev_yer}`);
    if (answers.akilli_ev_nokta) lines.push(`Nokta sayısı: ${answers.akilli_ev_nokta}`);
    if (answers.akilli_ev_cihaz) lines.push(`Cihaz: ${answers.akilli_ev_cihaz}`);
  }

  // Solar
  if (flowId === 'solar') {
    if (answers.solar_durum) lines.push(`Sistem durumu: ${answers.solar_durum}`);
    if (answers.solar_yapi)  lines.push(`Yapı tipi: ${answers.solar_yapi}`);
  }

  // Elektrik yeni alanlar
  if (flowId === 'elektrik') {
    if (answers.elektrik_yer)          lines.push(`Yer tipi: ${answers.elektrik_yer}`);
    if (answers.elektrik_risk?.length) lines.push(`Risk: ${answers.elektrik_risk.join(', ')}`);
    if (answers.ev_sarj_tip)           lines.push(`Şarj tipi: ${answers.ev_sarj_tip}`);
  }

  // Kamera — mod ayrımlı blok
  if (flowId === 'kamera') {
    const mod = EXPERIENCE_MODE_LABELS[answers.experience_mode] || answers.experience_mode;
    if (mod) lines.push(`Anlatım modu: ${mod}`);

    if (answers.experience_mode === 'simple') {
      if (answers.kamera_kolay_kullanim)
        lines.push(`Kullanım: ${label(KOLAY_KULLANIM_LABELS, answers.kamera_kolay_kullanim)}`);
      if (answers.kamera_kolay_alan_ev)
        lines.push(`Alan: ${label(KOLAY_ALAN_EV_LABELS, answers.kamera_kolay_alan_ev)}`);
      if (answers.kamera_kolay_alan_isyeri?.length)
        lines.push(`Alan: ${answers.kamera_kolay_alan_isyeri.map((v) => label(KOLAY_ALAN_ISYERI_LABELS, v)).join(', ')}`);
      if (answers.kamera_kolay_alan_apartman?.length)
        lines.push(`Alan: ${answers.kamera_kolay_alan_apartman.map((v) => label(KOLAY_ALAN_APARTMAN_LABELS, v)).join(', ')}`);
      if (answers.kamera_kolay_ihtiyac?.length)
        lines.push(`İhtiyaç: ${answers.kamera_kolay_ihtiyac.map((v) => label(KOLAY_IHTIYAC_LABELS, v)).join(', ')}`);
    } else {
      if (answers.kamera_sistem_tipi) lines.push(`Sistem tipi: ${answers.kamera_sistem_tipi}`);
      if (answers.kamera_adet)        lines.push(`Kamera adedi: ${answers.kamera_adet}`);
      if (answers.kamera_yer)         lines.push(`Kurulum yeri: ${label(YER_LABELS, answers.kamera_yer)}`);
      if (answers.kamera_not)         lines.push(`Detay: ${answers.kamera_not}`);
      if (answers.kamera_detay) {
        lines.push('');
        lines.push('Mevcut Sistem Bilgisi');
        lines.push(answers.kamera_detay);
      }
    }
  }

  // Konum
  if (answers.ilce) {
    const konum = answers.mahalle
      ? `${answers.ilce} / ${answers.mahalle}`
      : answers.ilce;
    lines.push(`Konum: ${konum}`);
  }

  // Zaman
  if (answers.zaman) {
    lines.push(`Zaman: ${label(ZAMAN_LABELS, answers.zaman)}`);
  }

  lines.push('');

  // İletişim
  if (answers.iletisim_ad) {
    lines.push(`Ad: ${answers.iletisim_ad}`);
  }
  if (answers.iletisim_tel) {
    lines.push(`Telefon: ${answers.iletisim_tel}`);
  }

  if (flowId === 'kamera') {
    lines.push('');
    if (answers.experience_mode === 'simple') {
      const ev = evaluateCameraLead(answers);
      const priLabel = { dusuk: 'Düşük', orta: 'Orta', yuksek: 'Yüksek' }[ev.priority] || ev.priority;
      lines.push('— TEHAŞ Ön Değerlendirme —');
      lines.push(`Öncelik: ${priLabel}`);
      lines.push(`Öneri: ${ev.suggestedSystem}`);
      lines.push(`Not: ${ev.whatsappInsight}`);
      if (ev.needsPhoto) {
        lines.push(
          'Fotoğraf notu: Mevcut alan, kamera yeri, DVR/NVR, modem/switch ' +
          'veya arıza ekranı fotoğrafı teşhisi hızlandırır.'
        );
      }
      if (ev.needsDiscovery) {
        lines.push('Keşif/görüşme notu: Talep görüşme veya saha bilgisiyle netleştirilmelidir.');
      }
    } else {
      lines.push(
        'Varsa mevcut sistem fotoğraflarını ve ' +
        'ekran görüntüsünü bu mesaja ekleyebilirsiniz.'
      );
    }
  }

  return lines.join('\n');
}

export function buildWaUrl(flowId, answers, refCode) {
  const msg = buildWaMessage(flowId, answers, refCode);
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
}

// ── Özet satırları (done screen için) ────────────────────────────
export function buildSummaryRows(flowId, answers) {
  const rows = [];

  rows.push({ k: 'Hizmet', v: label(HIZMET_LABELS, flowId) });

  const isTipiKey = `${flowId}_is_tipi`;
  if (answers[isTipiKey]) {
    rows.push({ k: 'İş tipi', v: label(IS_TIPI_LABELS, answers[isTipiKey]) });
  }

  if (flowId === 'elektrik') {
    if (answers.elektrik_yer)
      rows.push({ k: 'Yer tipi', v: answers.elektrik_yer });
    if (answers.elektrik_risk?.length)
      rows.push({ k: 'Risk', v: answers.elektrik_risk.join(', ') });
    if (answers.ev_sarj_tip)
      rows.push({ k: 'Şarj tipi', v: answers.ev_sarj_tip });
    if (answers.elektrik_urun)
      rows.push({ k: 'Ürün', v: label(URUN_LABELS, answers.elektrik_urun) });
    if (answers.elektrik_adet)
      rows.push({ k: 'Adet', v: answers.elektrik_adet });
    if (answers.elektrik_tesisat_kapsam)
      rows.push({ k: 'Kapsam', v: label(TESISAT_LABELS, answers.elektrik_tesisat_kapsam) });
    if (answers.elektrik_hat_amac)
      rows.push({ k: 'Hat amacı', v: label(HAT_LABELS, answers.elektrik_hat_amac) });
    if (answers.elektrik_hat_metre)
      rows.push({ k: 'Mesafe', v: answers.elektrik_hat_metre });
  }

  if (flowId === 'kamera') {
    const mod = EXPERIENCE_MODE_LABELS[answers.experience_mode] || answers.experience_mode;
    if (mod) rows.push({ k: 'Anlatım modu', v: mod });

    if (answers.experience_mode === 'simple') {
      if (answers.kamera_kolay_kullanim)
        rows.push({ k: 'Kullanım', v: label(KOLAY_KULLANIM_LABELS, answers.kamera_kolay_kullanim) });
      if (answers.kamera_kolay_alan_ev)
        rows.push({ k: 'Alan', v: label(KOLAY_ALAN_EV_LABELS, answers.kamera_kolay_alan_ev) });
      if (answers.kamera_kolay_alan_isyeri?.length)
        rows.push({ k: 'Alan', v: answers.kamera_kolay_alan_isyeri.map((v) => label(KOLAY_ALAN_ISYERI_LABELS, v)).join(', ') });
      if (answers.kamera_kolay_alan_apartman?.length)
        rows.push({ k: 'Alan', v: answers.kamera_kolay_alan_apartman.map((v) => label(KOLAY_ALAN_APARTMAN_LABELS, v)).join(', ') });
      if (answers.kamera_kolay_ihtiyac?.length)
        rows.push({ k: 'İhtiyaç', v: answers.kamera_kolay_ihtiyac.map((v) => label(KOLAY_IHTIYAC_LABELS, v)).join(', ') });
    } else {
      if (answers.kamera_sistem_tipi)
        rows.push({ k: 'Sistem tipi', v: answers.kamera_sistem_tipi });
      if (answers.kamera_adet)
        rows.push({ k: 'Kamera adedi', v: answers.kamera_adet });
      if (answers.kamera_yer)
        rows.push({ k: 'Kurulum yeri', v: label(YER_LABELS, answers.kamera_yer) });
      if (answers.kamera_not)
        rows.push({ k: 'Detay', v: answers.kamera_not });
      if (answers.kamera_detay)
        rows.push({ k: 'Mevcut Sistem', v: answers.kamera_detay });
    }
  }

  if (flowId === 'apartman') {
    if (answers.basvuran_sifati)   rows.push({ k: 'Başvuran', v: answers.basvuran_sifati });
    if (answers.yapi_tipi)         rows.push({ k: 'Yapı tipi', v: answers.yapi_tipi });
    if (answers.bolum_sayisi)      rows.push({ k: 'Bölüm', v: answers.bolum_sayisi });
    if (answers.anlasma_modeli)    rows.push({ k: 'Model', v: answers.anlasma_modeli });
    if (answers.sistemler?.length) rows.push({ k: 'Sistemler', v: answers.sistemler.join(', ') });
    if (answers.talep_turu)        rows.push({ k: 'Talep türü', v: answers.talep_turu });
    if (answers.adres_bolge)       rows.push({ k: 'Bölge', v: answers.adres_bolge });
  }

  if (flowId === 'akilli_ev') {
    if (answers.akilli_ev_yer)   rows.push({ k: 'Yapı tipi', v: answers.akilli_ev_yer });
    if (answers.akilli_ev_nokta) rows.push({ k: 'Nokta', v: answers.akilli_ev_nokta });
    if (answers.akilli_ev_cihaz) rows.push({ k: 'Cihaz', v: answers.akilli_ev_cihaz });
  }

  if (flowId === 'solar') {
    if (answers.solar_durum) rows.push({ k: 'Sistem durumu', v: answers.solar_durum });
    if (answers.solar_yapi)  rows.push({ k: 'Yapı tipi', v: answers.solar_yapi });
  }

  if (answers.ilce) {
    const konum = answers.mahalle
      ? `${answers.ilce} / ${answers.mahalle}`
      : answers.ilce;
    rows.push({ k: 'Konum', v: konum });
  }

  if (answers.zaman)
    rows.push({ k: 'Zaman', v: label(ZAMAN_LABELS, answers.zaman) });

  if (answers.iletisim_ad)
    rows.push({ k: 'Ad', v: answers.iletisim_ad });
  if (answers.iletisim_tel)
    rows.push({ k: 'Telefon', v: answers.iletisim_tel });

  return rows;
}
