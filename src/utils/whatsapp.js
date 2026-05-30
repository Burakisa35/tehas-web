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

  // Kamera özeli
  if (flowId === 'kamera') {
    if (answers.kamera_adet) {
      lines.push(`Kamera adedi: ${answers.kamera_adet}`);
    }
    if (answers.kamera_yer) {
      lines.push(`Kurulum yeri: ${label(YER_LABELS, answers.kamera_yer)}`);
    }
    if (answers.kamera_not) {
      lines.push(`Detay: ${answers.kamera_not}`);
    }
    if (answers.kamera_detay) {
      lines.push('');
      lines.push('Mevcut Sistem Bilgisi');
      lines.push(answers.kamera_detay);
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
    lines.push(
      'Varsa mevcut sistem fotoğraflarını ve ' +
      'ekran görüntüsünü bu mesaja ekleyebilirsiniz.'
    );
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
    if (answers.kamera_adet)
      rows.push({ k: 'Kamera adedi', v: answers.kamera_adet });
    if (answers.kamera_yer)
      rows.push({ k: 'Kurulum yeri', v: label(YER_LABELS, answers.kamera_yer) });
    if (answers.kamera_not)
      rows.push({ k: 'Detay', v: answers.kamera_not });
    if (answers.kamera_detay)
      rows.push({ k: 'Mevcut Sistem', v: answers.kamera_detay });
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
