import React, { useState } from 'react';
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

// 0535 123 45 67 formatına dönüştürür (max 11 rakam)
function formatPhone(raw) {
  const d = extractDigits(raw).slice(0, 11);
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0,4)} ${d.slice(4)}`;
  if (d.length <= 9) return `${d.slice(0,4)} ${d.slice(4,7)} ${d.slice(7)}`;
  return `${d.slice(0,4)} ${d.slice(4,7)} ${d.slice(7,9)} ${d.slice(9)}`;
}

// Türk GSM kuralı: 11 hane, '0' ile başlar, ikinci hane '5'
function isValidTurkishMobile(digits) {
  return digits.length === 11 && digits[0] === '0' && digits[1] === '5';
}

// ── İletişim formu ────────────────────────────────────────────────
function ContactForm({ answers, onChange }) {
  const [telTouched, setTelTouched] = useState(false);

  const digits   = extractDigits(answers.iletisim_tel);
  const hasInput = digits.length > 0;
  const isValid  = isValidTurkishMobile(digits);
  const telError = telTouched && hasInput && !isValid;

  function handleTelChange(e) {
    const formatted = formatPhone(e.target.value);
    onChange('iletisim_tel', formatted);
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
          value={answers.iletisim_ad || ''}
          onChange={(e) => onChange('iletisim_ad', e.target.value)}
        />
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

export { extractDigits, isValidTurkishMobile };

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
function TextareaField({ stepId, answers, onChange }) {
  return (
    <textarea
      className="field-input"
      rows={4}
      style={{ height: 'auto', paddingTop: 14, paddingBottom: 14, resize: 'vertical' }}
      placeholder="Ek bilgi veya not ekleyin…"
      value={answers[stepId] || ''}
      onChange={(e) => onChange(stepId, e.target.value)}
      aria-label="Ek notlar"
    />
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
}) {
  const pct = Math.round(((stepIndex + 1) / totalSteps) * 100);

  // İletişim adımında zorunlu alanlar dolu mu?
  // Telefon: 11 hane, 0 ile başlar, ikinci hane 5 (Türk GSM kuralı)
  const isContactValid =
    step.type !== 'contact' ||
    (answers.iletisim_ad?.trim() && isValidTurkishMobile(extractDigits(answers.iletisim_tel)));

  // İlçe veya mahalle seçiminde değer var mı?
  const hasLocationValue =
    (step.type === 'ilce-select' && !!answers.ilce) ||
    (step.type === 'mahalle-select' && !!answers.mahalle);

  // Seçim adımlarında seçim yapıldı mı?
  const hasChoiceValue =
    (step.type === 'choice' || step.type === 'choice-grid') &&
    !!answers[step.id];

  // İleri butonu aktif mi?
  const canProceed = step.required
    ? isContactValid || hasLocationValue || hasChoiceValue
    : true;

  function handleContactChange(field, val) {
    onAnswer(field, val);
  }

  return (
    <div className="app">
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

        {/* Seçim listesi */}
        {(step.type === 'choice' || step.type === 'choice-grid') && (
          <ChoiceList
            options={step.options}
            value={answers[step.id]}
            onChange={(val) => onAnswer(step.id, val)}
            grid={step.type === 'choice-grid'}
          />
        )}

        {/* İlçe seçimi */}
        {step.type === 'ilce-select' && (
          <IlceSelect
            value={answers.ilce}
            onChange={(val) => onAnswer('ilce', val)}
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

        {/* İletişim */}
        {step.type === 'contact' && (
          <ContactForm answers={answers} onChange={handleContactChange} />
        )}

        {/* Textarea */}
        {step.type === 'textarea' && (
          <TextareaField stepId={step.id} answers={answers} onChange={onAnswer} />
        )}
      </div>

      {/* CTA */}
      <div className="cta-area">
        <button
          className="btn-primary"
          onClick={onNext}
          disabled={!canProceed}
          aria-label="Sonraki adıma geç"
        >
          {step.type === 'contact' ? 'Talep Oluştur →' : 'Devam Et →'}
        </button>
      </div>

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
