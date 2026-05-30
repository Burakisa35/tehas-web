// ─────────────────────────────────────────────────────────────────────────────
// TEHAŞ Decision Engine — Kamera Lead Scoring / Ön Değerlendirme
//
// Pure JS, no external deps, no eval, no React.
// Input: raw `answers` object from FlowWizard.
// Output: evaluation object with scores, flags, and human-readable insights.
// ─────────────────────────────────────────────────────────────────────────────

// ── Field & value normalisation ───────────────────────────────────────────────
// Maps actual flow field names / values to the canonical engine names/values.
// This lets the engine work with both the spec names used in tests and the
// real field names produced by the current kamera kolay akışı.

const MEKAN_ALIASES = {
  ev:       'ev_villa',
  apartman: 'apartman_site',
  // isyeri, arazi_bahce are already canonical
};

const EV_ALAN_ALIASES = {
  kapi_giris:  'kapi_bina_girisi',
  bahce_arac:  'bahce_arac_girisi',
  // kapi_onu, otopark, evin_cevresi, emin_degil are identical
};

const ISYERI_ALAN_ALIASES = {
  giris: 'giris_kapisi',
  kasa:  'kasa_satis',
  // depo, dis_cephe, tum_isyeri, emin_degil are identical
};

const BEKLENTI_ALIASES = {
  telefon_izleme: 'telefondan_izleme',
  gecmis_goruntu: 'gecmis_kayit',
  // gece_goruntu, sadece_canli, emin_degil are identical
};

function normalizeAnswers(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const a = { ...raw };

  // Field aliases: actual flow names → canonical engine names
  if (!a.kamera_mekan_tipi)      a.kamera_mekan_tipi      = a.kamera_kolay_kullanim;
  if (!a.kamera_ev_alani)        a.kamera_ev_alani        = a.kamera_kolay_alan_ev;
  if (!a.kamera_isyeri_alanlari) a.kamera_isyeri_alanlari = a.kamera_kolay_alan_isyeri;
  if (!a.kamera_apartman_alanlari) a.kamera_apartman_alanlari = a.kamera_kolay_alan_apartman;
  if (!a.kamera_beklenti)        a.kamera_beklenti        = a.kamera_kolay_ihtiyac;

  // Value aliases — mekan tipi
  if (a.kamera_mekan_tipi && MEKAN_ALIASES[a.kamera_mekan_tipi]) {
    a.kamera_mekan_tipi = MEKAN_ALIASES[a.kamera_mekan_tipi];
  }

  // Value aliases — ev alanı (single value)
  if (a.kamera_ev_alani && EV_ALAN_ALIASES[a.kamera_ev_alani]) {
    a.kamera_ev_alani = EV_ALAN_ALIASES[a.kamera_ev_alani];
  }

  // Value aliases — iş yeri alanları (array)
  if (Array.isArray(a.kamera_isyeri_alanlari)) {
    a.kamera_isyeri_alanlari = a.kamera_isyeri_alanlari.map(
      (v) => ISYERI_ALAN_ALIASES[v] || v,
    );
  }

  // Value aliases — beklenti (array)
  if (Array.isArray(a.kamera_beklenti)) {
    a.kamera_beklenti = a.kamera_beklenti.map(
      (v) => BEKLENTI_ALIASES[v] || v,
    );
  }

  return a;
}

// ── Helper ────────────────────────────────────────────────────────────────────
function hasItem(arr, item) {
  return Array.isArray(arr) && arr.includes(item);
}

// ── Rules ─────────────────────────────────────────────────────────────────────
// Each rule: { id, when(answers) → bool, apply(ctx) → void }
// ctx is mutated in-place; rules run in order.

const KAMERA_RULES = [
  // ── Mekan tipi ────────────────────────────────────────────────
  {
    id: 'mekan_ev_villa',
    when: (a) => a.kamera_mekan_tipi === 'ev_villa',
    apply: (ctx) => { ctx.complexityScore += 1; },
  },
  {
    id: 'mekan_isyeri',
    when: (a) => a.kamera_mekan_tipi === 'isyeri',
    apply: (ctx) => { ctx.complexityScore += 2; },
  },
  {
    id: 'mekan_apartman_site',
    when: (a) => a.kamera_mekan_tipi === 'apartman_site',
    apply: (ctx) => {
      ctx.complexityScore += 3;
      ctx.needsDiscovery = true;
    },
  },
  {
    id: 'mekan_arazi_bahce',
    when: (a) => a.kamera_mekan_tipi === 'arazi_bahce',
    apply: (ctx) => {
      ctx.complexityScore += 3;
      ctx.needsDiscovery = true;
      ctx.needsPhoto = true;
    },
  },

  // ── Ev/villa alanı ────────────────────────────────────────────
  {
    id: 'ev_alan_kapi_onu',
    when: (a) => a.kamera_ev_alani === 'kapi_onu',
    apply: (ctx) => { ctx.complexityScore += 1; },
  },
  {
    id: 'ev_alan_kapi_bina_girisi',
    when: (a) => a.kamera_ev_alani === 'kapi_bina_girisi',
    apply: (ctx) => { ctx.complexityScore += 1; },
  },
  {
    id: 'ev_alan_bahce_arac',
    when: (a) => a.kamera_ev_alani === 'bahce_arac_girisi',
    apply: (ctx) => {
      ctx.complexityScore += 2;
      ctx.needsPhoto = true;
    },
  },
  {
    id: 'ev_alan_otopark',
    when: (a) => a.kamera_ev_alani === 'otopark',
    apply: (ctx) => { ctx.complexityScore += 2; },
  },
  {
    id: 'ev_alan_evin_cevresi',
    when: (a) => a.kamera_ev_alani === 'evin_cevresi',
    apply: (ctx) => {
      ctx.complexityScore += 3;
      ctx.needsDiscovery = true;
      ctx.needsPhoto = true;
    },
  },
  {
    id: 'ev_alan_emin_degil',
    when: (a) => a.kamera_ev_alani === 'emin_degil',
    apply: (ctx) => { ctx.needsDiscovery = true; },
  },

  // ── İş yeri alanları ──────────────────────────────────────────
  {
    id: 'isyeri_giris',
    when: (a) => hasItem(a.kamera_isyeri_alanlari, 'giris_kapisi'),
    apply: (ctx) => { ctx.complexityScore += 1; },
  },
  {
    id: 'isyeri_kasa',
    when: (a) => hasItem(a.kamera_isyeri_alanlari, 'kasa_satis'),
    apply: (ctx) => { ctx.riskScore += 2; },
  },
  {
    id: 'isyeri_depo',
    when: (a) => hasItem(a.kamera_isyeri_alanlari, 'depo'),
    apply: (ctx) => { ctx.complexityScore += 2; },
  },
  {
    id: 'isyeri_dis_cephe',
    when: (a) => hasItem(a.kamera_isyeri_alanlari, 'dis_cephe'),
    apply: (ctx) => {
      ctx.complexityScore += 2;
      ctx.needsPhoto = true;
    },
  },
  {
    id: 'isyeri_tum_isyeri',
    when: (a) => hasItem(a.kamera_isyeri_alanlari, 'tum_isyeri'),
    apply: (ctx) => {
      ctx.complexityScore += 3;
      ctx.needsDiscovery = true;
    },
  },
  {
    id: 'isyeri_emin_degil',
    when: (a) => hasItem(a.kamera_isyeri_alanlari, 'emin_degil'),
    apply: (ctx) => { ctx.needsDiscovery = true; },
  },

  // ── Beklenti ──────────────────────────────────────────────────
  {
    id: 'beklenti_telefondan_izleme',
    when: (a) => hasItem(a.kamera_beklenti, 'telefondan_izleme'),
    apply: (ctx) => { ctx.complexityScore += 1; },
  },
  {
    id: 'beklenti_gecmis_kayit',
    when: (a) => hasItem(a.kamera_beklenti, 'gecmis_kayit'),
    apply: (ctx) => { ctx.complexityScore += 2; },
  },
  {
    id: 'beklenti_gece_goruntu',
    when: (a) => hasItem(a.kamera_beklenti, 'gece_goruntu'),
    apply: (ctx) => {
      ctx.complexityScore += 2;
      ctx.needsPhoto = true;
      ctx.notes.push('Gece görüntüsü beklentisi var; dış mekan ve ışık koşulları değerlendirilmelidir.');
    },
  },
  {
    id: 'beklenti_emin_degil',
    when: (a) => hasItem(a.kamera_beklenti, 'emin_degil'),
    apply: (ctx) => { ctx.needsDiscovery = true; },
  },

  // ── Zaman ─────────────────────────────────────────────────────
  {
    id: 'zaman_acil',
    when: (a) => a.zaman === 'acil',
    apply: (ctx) => {
      ctx.riskScore += 2;
      ctx.notes.push('Acil talep; en kısa sürede dönüş önceliklidir.');
    },
  },
  {
    id: 'zaman_bu_hafta',
    when: (a) => a.zaman === 'bu_hafta',
    apply: (ctx) => { ctx.riskScore += 1; },
  },

  // ── Solar / 4G ────────────────────────────────────────────────
  {
    id: 'solar_4g',
    when: (a) => a.kamera_is_tipi === 'solar_4g',
    apply: (ctx) => {
      ctx.complexityScore += 4;
      ctx.riskScore += 2;
      ctx.needsDiscovery = true;
      ctx.needsPhoto = true;
      ctx.suggestedSystem = 'Solar / 4G kamera uygunluk kontrolü gerekli';
      ctx.notes.push('Solar / 4G kurulum: güneş/sinyal koşulları ve alan uygunluğu keşif gerektirir.');
    },
  },
];

// ── Suggested system resolver ─────────────────────────────────────────────────
function resolveSuggestedSystem(a, ctx) {
  if (ctx.suggestedSystem) return ctx.suggestedSystem; // already set by a rule

  const mekan    = a.kamera_mekan_tipi;
  const evAlan   = a.kamera_ev_alani;
  const isyeriAl = a.kamera_isyeri_alanlari || [];
  const beklenti = a.kamera_beklenti || [];

  if (mekan === 'apartman_site') return 'Ortak alan kamera keşfi gerekli';
  if (mekan === 'arazi_bahce')   return 'Dış alan uygunluk kontrolü gerekli';

  if (mekan === 'ev_villa') {
    const gece = beklenti.includes('gece_goruntu');
    if (evAlan === 'bahce_arac_girisi' || gece) return 'Dış mekan gece görüş destekli sistem';
    if (evAlan === 'kapi_onu' || evAlan === 'kapi_bina_girisi') return 'Giriş odaklı temel kamera sistemi';
    return 'Ev güvenlik sistemi';
  }

  if (mekan === 'isyeri') {
    const kasaVeKayit =
      isyeriAl.includes('kasa_satis') && beklenti.includes('gecmis_kayit');
    if (kasaVeKayit) return 'İş yeri kayıt öncelikli kamera sistemi';
    if (isyeriAl.includes('depo') || isyeriAl.includes('dis_cephe'))
      return 'İş yeri çevre ve kayıt odaklı kamera sistemi';
    return 'İş yeri kayıt öncelikli kamera sistemi';
  }

  return 'Görüşme ile netleştirilecek kamera sistemi';
}

// ── WhatsApp insight text ─────────────────────────────────────────────────────
function buildWhatsappInsight(a, ctx) {
  const mekan    = a.kamera_mekan_tipi;
  const beklenti = a.kamera_beklenti || [];
  const isyeriAl = a.kamera_isyeri_alanlari || [];

  if (ctx.suggestedSystem && ctx.suggestedSystem.includes('Solar')) {
    return (
      'Ön değerlendirme: Solar / 4G kamera için alan uygunluğu ve ' +
      'güneş ışığı koşulları değerlendirilmesi gerekiyor. ' +
      'Fotoğraf ve alan bilgisi keşifi hızlandırır.'
    );
  }
  if (mekan === 'apartman_site') {
    return (
      'Ön değerlendirme: Ortak alan kamera sistemi için keşif ve ' +
      'site yönetimi onayı gerekebilir. Görüşmede detaylar netleştirilecektir.'
    );
  }
  if (mekan === 'arazi_bahce') {
    return (
      'Ön değerlendirme: Dış alan kamera kurulumu için saha koşulları ' +
      've güç kaynağı değerlendirilmesi gerekiyor. ' +
      'Fotoğraf paylaşırsanız uygunluk daha hızlı netleşir.'
    );
  }
  if (mekan === 'isyeri') {
    if (isyeriAl.includes('kasa_satis')) {
      return (
        'Ön değerlendirme: İş yeri için kayıt öncelikli bir sistem ' +
        'ihtiyacı görünüyor. Kasa, giriş ve depo alanları ' +
        'görüşmede netleştirilebilir.'
      );
    }
    return (
      'Ön değerlendirme: İş yeri kamera sistemi için alan ve kayıt ' +
      'ihtiyacı görüşmede detaylandırılacaktır.'
    );
  }
  if (mekan === 'ev_villa') {
    if (beklenti.includes('gece_goruntu')) {
      return (
        'Ön değerlendirme: Dış mekan ve gece görüntüsü ihtiyacı var. ' +
        'Fotoğraf paylaşırsanız kamera açısı ve kablo güzergahı daha hızlı netleşir.'
      );
    }
    if (beklenti.includes('gecmis_kayit')) {
      return (
        'Ön değerlendirme: Giriş ve kayıt ihtiyacı var. ' +
        'Görüşmede sistem tipi ve kamera sayısı netleştirilecektir.'
      );
    }
    return (
      'Ön değerlendirme: Ev güvenlik sistemi için giriş ve izleme ' +
      'ihtiyacı değerlendirilecektir.'
    );
  }

  return 'Ön değerlendirme: Seçimlerinize göre en uygun sistem görüşmede netleştirilecektir.';
}

// ── Recommended path text ─────────────────────────────────────────────────────
function resolveRecommendedPath(a) {
  const mekan = a.kamera_mekan_tipi;
  const labels = {
    ev_villa:       'Kolay mod — Ev / Villa',
    isyeri:         'Kolay mod — İş yeri',
    apartman_site:  'Kolay mod — Apartman / Site',
    arazi_bahce:    'Kolay mod — Arazi / Bahçe',
  };
  return labels[mekan] || 'Kamera talebi — görüşme ile netleşir';
}

// ── Priority ──────────────────────────────────────────────────────────────────
function calcPriority(total) {
  if (total >= 6) return 'yuksek';
  if (total >= 3) return 'orta';
  return 'dusuk';
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Evaluate a kamera lead from raw FlowWizard answers.
 *
 * @param {object} answers - Raw answers object (may be empty / partial).
 * @returns {{
 *   riskScore: number,
 *   complexityScore: number,
 *   priority: 'dusuk'|'orta'|'yuksek',
 *   recommendedPath: string,
 *   suggestedSystem: string,
 *   needsDiscovery: boolean,
 *   needsPhoto: boolean,
 *   notes: string[],
 *   whatsappInsight: string
 * }}
 */
export function evaluateCameraLead(answers) {
  const a = normalizeAnswers(answers);

  // Mutable evaluation context
  const ctx = {
    riskScore:       0,
    complexityScore: 0,
    needsDiscovery:  false,
    needsPhoto:      false,
    suggestedSystem: '',
    notes:           [],
  };

  // Run rules safely — a failing rule must not crash the engine
  for (const rule of KAMERA_RULES) {
    try {
      if (rule.when(a)) rule.apply(ctx);
    } catch (_) {
      // silently skip broken rule
    }
  }

  ctx.suggestedSystem  = resolveSuggestedSystem(a, ctx);
  const total          = ctx.riskScore + ctx.complexityScore;
  const priority       = calcPriority(total);
  const whatsappInsight = buildWhatsappInsight(a, ctx);
  const recommendedPath = resolveRecommendedPath(a);

  return {
    riskScore:       ctx.riskScore,
    complexityScore: ctx.complexityScore,
    priority,
    recommendedPath,
    suggestedSystem: ctx.suggestedSystem,
    needsDiscovery:  ctx.needsDiscovery,
    needsPhoto:      ctx.needsPhoto,
    notes:           ctx.notes,
    whatsappInsight,
  };
}
