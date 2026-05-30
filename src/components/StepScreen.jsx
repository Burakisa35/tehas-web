import React, { useState, useEffect } from 'react';
import { ILCELER, ILCE_LISTESI } from '../data/ilceler.js';

// ── Seçim listesi ─────────────────────────────────────────────────
function ChoiceList({ options, value, onChange, grid = false }) {
  return (
    <div className={grid ? 'choices choices-grid' : 'choices'}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`choice${value === opt.value ? ' selected' : ''}`}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
        >
          {opt.ico && (
            <span className="choice-ico" aria-hidden="true">{opt.ico}</span>
          )}
          <div className="choice-body">
            <div className="choice-title">{opt.label}</div>
            {opt.sub && <div className="choice-sub">{opt.sub}</div>}
          </div>
          <span className="choice-check" aria-hidden="true">
            {value === opt.value && (
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4.5L4 7.5L10 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

// Sadece rakamları çıkartır — boşluk, tire, + gibi karakterleri atar
function extractDigits(val) {
  return (val || '').replace(/\D/g, '');
}

// 0535 123 45 67 formatına dönüştürür — 0 ve 5 ön-eki korumalı
function formatPhone(raw) {
  let digits = (raw || '').replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (!digits.startsWith('0')) digits = '0' + digits;
  if (digits.length >= 2 && digits[1] !== '5') digits = '05' + digits.slice(2);
  digits = digits.slice(0, 11);
  const d = digits;
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0,4)} ${d.slice(4)}`;
  if (d.length <= 9) return `${d.slice(0,4)} ${d.slice(4,7)} ${d.slice(7)}`;
  return `${d.slice(0,4)} ${d.slice(4,7)} ${d.slice(7,9)} ${d.slice(9)}`;
}

// Türk GSM kuralı: 11 hane, '0' ile başlar, ikinci hane '5'
function isValidTurkishMobile(digits) {
  return digits.length === 11 && digits[0] === '0' && digits[1] === '5';
}

// Ad: min 2 karakter, yalnızca harf ve boşluk (Türkçe dahil)
const AD_REGEX = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,}$/;
function isValidName(val) {
  return AD_REGEX.test((val || '').trim());
}

// ── Splash ekranı — 3 sn otomatik geçiş ──────────────────────────
function SplashStep({ onNext }) {
  useEffect(() => {
    const t = setTimeout(onNext, 3000);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <div
      className="app"
      style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 28px' }}
    >
      <div>
        <div
          className="brand-logo"
          style={{ width: 64, height: 64, borderRadius: 18, margin: '0 auto 22px', flexShrink: 0 }}
          aria-hidden="true"
        />
        <div
          className="brand-name"
          style={{ fontSize: 18, letterSpacing: '.22em', marginBottom: 16, display: 'block' }}
        >
          TEHAŞ
        </div>
        <h1
          style={{
            fontSize: 28, fontWeight: 700, color: '#fff',
            lineHeight: 1.2, letterSpacing: '-.02em', marginBottom: 12,
          }}
        >
          Yuvaya hoş geldiniz.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--t-3)', marginBottom: 40 }}>
          Başvuru formuna yönlendiriliyorsunuz…
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i === 0 ? 'var(--cyan)' : 'var(--line-2)',
                animation: `dot-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Çoklu seçim listesi ───────────────────────────────────────────
function MultiChoiceList({ options, values, onChange }) {
  const sel = values || [];
  return (
    <div className="choices">
      {options.map((opt) => {
        const isSelected = sel.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            className={`choice${isSelected ? ' selected' : ''}`}
            onClick={() => {
              const next = isSelected
                ? sel.filter((v) => v !== opt.value)
                : [...sel, opt.value];
              onChange(next);
            }}
            aria-pressed={isSelected}
          >
            {opt.ico && <span className="choice-ico" aria-hidden="true">{opt.ico}</span>}
            <div className="choice-body">
              <div className="choice-title">{opt.label}</div>
              {opt.sub && <div className="choice-sub">{opt.sub}</div>}
            </div>
            <span className="choice-check" aria-hidden="true">
              {isSelected && (
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4.5L4 7.5L10 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Başvuru iletişim formu ────────────────────────────────────────
function BasvuruContactForm({ answers, onChange }) {
  const [adTouched,  setAdTouched]  = useState(false);
  const [soyTouched, setSoyTouched] = useState(false);
  const [telTouched, setTelTouched] = useState(false);

  const adVal   = answers.basvuru_ad   || '';
  const soyVal  = answers.basvuru_soyad || '';
  const adErr   = adTouched  && adVal.length  > 0 && !isValidName(adVal);
  const soyErr  = soyTouched && soyVal.length > 0 && !isValidName(soyVal);
  const digits  = extractDigits(answers.basvuru_tel || '');
  const telErr  = telTouched && digits.length > 2 && !isValidTurkishMobile(digits);

  const errStyle = { borderColor: 'rgba(248,113,113,.65)' };
  const errMsg   = (id, msg) => (
    <p role="alert" style={{ fontSize: 12, color: 'var(--red)', marginTop: 6, lineHeight: 1.4 }}
       id={id}>{msg}</p>
  );

  return (
    <div className="field-group">
      <div>
        <label className="field-label" htmlFor="bav_ad">Ad</label>
        <input id="bav_ad" className="field-input" type="text" autoComplete="given-name"
          placeholder="Ahmet" style={adErr ? errStyle : undefined}
          value={adVal} onChange={(e) => onChange('basvuru_ad', e.target.value)}
          onBlur={() => setAdTouched(true)} />
        {adErr && errMsg('bav-ad-err', 'Yalnızca harf girin (en az 2 karakter)')}
      </div>
      <div>
        <label className="field-label" htmlFor="bav_soyad">Soyad</label>
        <input id="bav_soyad" className="field-input" type="text" autoComplete="family-name"
          placeholder="Yılmaz" style={soyErr ? errStyle : undefined}
          value={soyVal} onChange={(e) => onChange('basvuru_soyad', e.target.value)}
          onBlur={() => setSoyTouched(true)} />
        {soyErr && errMsg('bav-soy-err', 'Yalnızca harf girin (en az 2 karakter)')}
      </div>
      <div>
        <label className="field-label" htmlFor="bav_tel">Telefon</label>
        <input id="bav_tel" className="field-input" type="tel" inputMode="numeric"
          autoComplete="tel" placeholder="05XX XXX XX XX" maxLength={14}
          style={telErr ? errStyle : undefined}
          value={answers.basvuru_tel || ''}
          onChange={(e) => onChange('basvuru_tel', formatPhone(e.target.value))}
          onFocus={() => { if (!answers.basvuru_tel) onChange('basvuru_tel', '05'); }}
          onBlur={() => setTelTouched(true)} />
        {telErr && errMsg('bav-tel-err', 'Geçerli bir Türk cep numarası girin (05XX XXX XX XX)')}
      </div>
      <div>
        <label className="field-label" htmlFor="bav_cinsiyet">Cinsiyet</label>
        <select id="bav_cinsiyet" className="field-select"
          value={answers.basvuru_cinsiyet || ''}
          onChange={(e) => onChange('basvuru_cinsiyet', e.target.value)}>
          <option value="">Seçin…</option>
          <option value="erkek">Erkek</option>
          <option value="kadin">Kadın</option>
          <option value="belirtmiyorum">Belirtmek istemiyorum</option>
        </select>
      </div>
      <p style={{ fontSize: 11, color: 'var(--t-4)', lineHeight: 1.5, marginTop: 4 }}>
        Bilgileriniz yalnızca başvuru sürecinde kullanılır. KVKK kapsamında korunur.
      </p>
    </div>
  );
}

// ── İletişim formu ────────────────────────────────────────────────
function ContactForm({ answers, onChange }) {
  const [adTouched,  setAdTouched]  = useState(false);
  const [telTouched, setTelTouched] = useState(false);

  const adVal    = answers.iletisim_ad || '';
  const adError  = adTouched && adVal.length > 0 && !isValidName(adVal);

  const digits   = extractDigits(answers.iletisim_tel || '');
  const hasInput = digits.length > 2;   // '05' gibi yarım değerlerde hata gösterme
  const isValid  = isValidTurkishMobile(digits);
  const telError = telTouched && hasInput && !isValid;

  function handleTelChange(e) {
    const raw         = e.target.value;
    const currentDigs = extractDigits(answers.iletisim_tel || '');
    const newDigs     = raw.replace(/\D/g, '');
    const isDeleting  = newDigs.length < currentDigs.length;
    void isDeleting; // silme/ekleme ayrımı; her iki durumda da formatPhone çalışır
    onChange('iletisim_tel', formatPhone(raw));
  }

  return (
    <div className="field-group">
      <div>
        <label className="field-label" htmlFor="iletisim_ad">Ad Soyad</label>
        <input
          id="iletisim_ad"
          className="field-input"
          type="text"
          autoComplete="name"
          placeholder="Ahmet Yılmaz"
          style={adError ? { borderColor: 'rgba(248,113,113,.65)' } : undefined}
          value={adVal}
          onChange={(e) => onChange('iletisim_ad', e.target.value)}
          onBlur={() => setAdTouched(true)}
          aria-invalid={adError}
          aria-describedby={adError ? 'ad-error' : undefined}
        />
        {adError && (
          <p
            id="ad-error"
            role="alert"
            style={{ fontSize: 12, color: 'var(--red)', marginTop: 6, lineHeight: 1.4 }}
          >
            Yalnızca harf ve boşluk girin (en az 2 karakter)
          </p>
        )}
      </div>
      <div>
        <label className="field-label" htmlFor="iletisim_tel">Telefon</label>
        <input
          id="iletisim_tel"
          className="field-input"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="05XX XXX XX XX"
          maxLength={14}
          style={telError ? { borderColor: 'rgba(248,113,113,.65)' } : undefined}
          value={answers.iletisim_tel || ''}
          onChange={handleTelChange}
          onFocus={() => {
            if (!answers.iletisim_tel) onChange('iletisim_tel', '05');
          }}
          onBlur={() => setTelTouched(true)}
          aria-invalid={telError}
          aria-describedby={telError ? 'tel-error' : undefined}
        />
        {telError && (
          <p
            id="tel-error"
            role="alert"
            style={{ fontSize: 12, color: 'var(--red)', marginTop: 6, lineHeight: 1.4 }}
          >
            Geçerli bir Türk cep numarası girin (05XX XXX XX XX)
          </p>
        )}
      </div>
      <p style={{ fontSize: 11, color: 'var(--t-4)', lineHeight: 1.5, marginTop: 4 }}>
        Yalnızca bu talep için kullanılır. Üçüncü tarafla paylaşılmaz. KVKK kapsamında korunur.
      </p>
    </div>
  );
}

export { extractDigits, isValidTurkishMobile, isValidName };

// ── Konum seçimi ──────────────────────────────────────────────────
function IlceSelect({ value, onChange }) {
  return (
    <select
      className="field-select"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      aria-label="İlçe seçin"
    >
      <option value="">İlçe seçin…</option>
      {ILCE_LISTESI.map((ilce) => (
        <option key={ilce} value={ilce}>{ilce}</option>
      ))}
    </select>
  );
}

function MahalleSelect({ ilce, value, onChange }) {
  const mahalleler = ILCELER[ilce] || [];
  return (
    <select
      className="field-select"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Mahalle seçin"
    >
      <option value="">Mahalle seçin…</option>
      {mahalleler.map((m) => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  );
}

// ── Textarea ──────────────────────────────────────────────────────
const KAMERA_DETAY_SORULAR = [
  'Mevcut kamera sistemi var mı?',
  'Marka / model biliniyor mu?',
  'Mevcutta kaç kamera var?',
  'Yeni kaç kamera eklenecek?',
  'Kayıt cihazı (DVR/NVR) mevcut mu?',
  'İç mekan mı, dış mekan mı?',
  'Gece görüşü isteniyor mu?',
  'Yaklaşık kablo mesafesi nedir?',
];

const KAMERA_DETAY_ORNEK =
  'Örn: Mevcutta 4 kameralı Hikvision sistem var. ' +
  '2 adet dış mekan kamera eklenecek. ' +
  'Kayıt cihazı mevcut. Gece görüşü istiyorum. ' +
  'Kablo mesafesi yaklaşık 20 metre.';

function TextareaField({ stepId, answers, onChange }) {
  const isKameraDetay = stepId === 'kamera_detay';

  return (
    <div>
      {isKameraDetay && (
        <div
          style={{
            marginBottom: 14,
            padding: '12px 14px',
            background: 'rgba(52,229,197,.06)',
            border: '1px solid rgba(52,229,197,.15)',
            borderRadius: 10,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '.18em',
              color: 'var(--cyan)',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Bize şunları anlatın
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 0, listStyle: 'none' }}>
            {KAMERA_DETAY_SORULAR.map((q) => (
              <li
                key={q}
                style={{ fontSize: 13, color: 'var(--t-2)', lineHeight: 1.5, display: 'flex', gap: 8, alignItems: 'flex-start' }}
              >
                <span style={{ color: 'var(--cyan)', flexShrink: 0 }}>›</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      <textarea
        className="field-input"
        rows={isKameraDetay ? 5 : 4}
        style={{ height: 'auto', paddingTop: 14, paddingBottom: 14, resize: 'vertical' }}
        placeholder={isKameraDetay ? KAMERA_DETAY_ORNEK : 'Ek bilgi veya not ekleyin…'}
        value={answers[stepId] || ''}
        onChange={(e) => onChange(stepId, e.target.value)}
        aria-label={isKameraDetay ? 'Mevcut kamera sistemi hakkında bilgi' : 'Ek notlar'}
      />

      {isKameraDetay && (
        <p
          style={{
            marginTop: 10,
            fontSize: 12,
            color: 'var(--t-3)',
            lineHeight: 1.6,
            padding: '10px 13px',
            background: 'var(--bg-1)',
            border: '1px solid var(--line)',
            borderRadius: 9,
          }}
        >
          📷 Varsa mevcut kamera, DVR/NVR, modem/switch veya
          arıza ekranının fotoğrafını WhatsApp üzerinden
          göndermeniz teşhisi hızlandırır.
        </p>
      )}
    </div>
  );
}

// ── Ana StepScreen bileşeni ───────────────────────────────────────
export default function StepScreen({
  step,
  stepIndex,
  totalSteps,
  answers,
  onAnswer,
  onNext,
  onBack,
  onSkip,
  isFirst,
  transitionClass,
}) {
  // Splash: 3 saniye otomatik geçiş — tüm render'ı döndür
  if (step.type === 'splash') {
    return <SplashStep onNext={onNext} />;
  }

  const pct = Math.round(((stepIndex + 1) / totalSteps) * 100);

  // İletişim validasyonu
  const isContactValid =
    step.type === 'contact'
      ? isValidName(answers.iletisim_ad) && isValidTurkishMobile(extractDigits(answers.iletisim_tel))
      : step.type === 'basvuru-contact'
        ? isValidName(answers.basvuru_ad) &&
          isValidName(answers.basvuru_soyad) &&
          isValidTurkishMobile(extractDigits(answers.basvuru_tel || ''))
        : true;

  // İlçe veya mahalle seçiminde değer var mı?
  const hasLocationValue =
    (step.type === 'ilce-select' && !!answers.ilce) ||
    (step.type === 'mahalle-select' && !!answers.mahalle);

  // Seçim adımlarında seçim yapıldı mı?
  const hasChoiceValue =
    (step.type === 'choice' || step.type === 'choice-grid') &&
    !!answers[step.id];

  // Çoklu seçimde en az 1 seçim var mı?
  const hasMultiChoice =
    step.type === 'multi-choice' &&
    (answers[step.id] || []).length > 0;

  // İlçe seçilmemişse Devam Et disabled (required=true ise zaten hasLocationValue kapatıyor)
  const ilceBlocked = step.type === 'ilce-select' && !answers.ilce;

  // İleri butonu aktif mi?
  const canProceed = step.required
    ? isContactValid || hasLocationValue || hasChoiceValue || hasMultiChoice
    : !ilceBlocked;

  // Otomatik geçiş: tek seçimli adımlarda seçince 300ms sonra ilerle
  function handleAutoChoice(val) {
    onAnswer(step.id, val);
    setTimeout(onNext, 300);
  }

  function handleIlceAutoAdvance(val) {
    onAnswer('ilce', val);
    if (val) setTimeout(onNext, 300);
  }

  function handleContactChange(field, val) {
    onAnswer(field, val);
  }

  return (
    <div className={`app${transitionClass ? ` ${transitionClass}` : ''}`}>
      {/* Header */}
      <header className="hdr">
        <div className="brand">
          <div className="brand-logo" aria-hidden="true" />
          <div>
            <div className="brand-name">TEHAŞ</div>
            <div className="brand-sub">Teknik Hizmetler</div>
          </div>
        </div>
        {!isFirst && (
          <button className="hdr-back" onClick={onBack} aria-label="Önceki adıma dön">
            ‹ Geri
          </button>
        )}
      </header>

      {/* Progress */}
      <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="progress-label">{stepIndex + 1}/{totalSteps}</span>
      </div>

      {/* Step content */}
      <div className="step-screen">
        {step.label && (
          <div className="step-eye">{step.label}</div>
        )}
        <h2 className="step-h">{step.title}</h2>
        {step.subtitle && (
          <p className="step-p">{step.subtitle}</p>
        )}

        {/* Fiyat badge */}
        {step.fiyatBadge && (
          <div className="fiyat-badge" role="note">
            <span className="fiyat-badge-ico">💰</span>
            <div>
              <div className="fiyat-badge-text">{step.fiyatBadge.text}</div>
              {step.fiyatBadge.sub && (
                <div className="fiyat-badge-sub">{step.fiyatBadge.sub}</div>
              )}
            </div>
          </div>
        )}

        {/* Seçim listesi — seçince otomatik ilerle */}
        {(step.type === 'choice' || step.type === 'choice-grid') && (
          <ChoiceList
            options={step.options}
            value={answers[step.id]}
            onChange={handleAutoChoice}
            grid={step.type === 'choice-grid'}
          />
        )}

        {/* Çoklu seçim — Devam Et ile */}
        {step.type === 'multi-choice' && (
          <MultiChoiceList
            options={step.options}
            values={answers[step.id]}
            onChange={(val) => onAnswer(step.id, val)}
          />
        )}

        {/* İlçe seçimi — seçince otomatik ilerle */}
        {step.type === 'ilce-select' && (
          <IlceSelect
            value={answers.ilce}
            onChange={handleIlceAutoAdvance}
          />
        )}

        {/* Mahalle seçimi */}
        {step.type === 'mahalle-select' && (
          <MahalleSelect
            ilce={answers.ilce}
            value={answers.mahalle}
            onChange={(val) => onAnswer('mahalle', val)}
          />
        )}

        {/* Müşteri iletişim */}
        {step.type === 'contact' && (
          <ContactForm answers={answers} onChange={handleContactChange} />
        )}

        {/* Başvuru iletişim */}
        {step.type === 'basvuru-contact' && (
          <BasvuruContactForm answers={answers} onChange={handleContactChange} />
        )}

        {/* Textarea */}
        {step.type === 'textarea' && (
          <TextareaField stepId={step.id} answers={answers} onChange={onAnswer} />
        )}
      </div>

      {/* CTA — choice/choice-grid/ilce-select auto-advance kullanır, buton gösterilmez */}
      {!['choice', 'choice-grid', 'ilce-select'].includes(step.type) && (
        <div className="cta-area">
          <button
            className="btn-primary"
            onClick={onNext}
            disabled={!canProceed}
            aria-label="Sonraki adıma geç"
          >
            {step.type === 'basvuru-contact' ? 'Gönder →' : step.type === 'contact' ? 'Talep Oluştur →' : 'Devam Et →'}
          </button>
        </div>
      )}

      {/* Geri + Atla */}
      <div className="nav-row">
        {!isFirst ? (
          <button className="btn-back" onClick={onBack} aria-label="Önceki adım">
            ‹ Geri
          </button>
        ) : (
          <span />
        )}
        {!step.required && step.skipLabel && (
          <button className="btn-skip" onClick={onSkip} aria-label={step.skipLabel}>
            {step.skipLabel} →
          </button>
        )}
      </div>
    </div>
  );
}
