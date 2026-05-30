import React, { useState, useRef } from 'react';
import { WA_PHONE } from '../utils/whatsapp.js';
import { queryByRefAndPhone } from '../utils/refcode.js';

// ── Grup 1: Teknik destek hizmetleri ─────────────────────────────
const DESTEK_KARTLARI = [
  {
    id: 'elektrik',
    label: 'Elektrik',
    sub: 'Montaj, tesisat, arıza ve hat çekme',
    ico: '⚡',
  },
  {
    id: 'kamera',
    label: 'Güvenlik Kamerası',
    sub: 'Hikvision Partner Pro sertifikalı kurulum',
    ico: '📷',
  },
  {
    id: 'ag',
    label: 'Ağ / İnternet',
    sub: 'Kablo, switch, router ve access point',
    ico: '🌐',
  },
];

// İkinci katman — "Emin Değilim" seçilince açılır
const DIGER_TEKNIK = [
  { id: 'uydu',      label: 'Uydu / Anten',    sub: 'Çanak, multiswitch ve anten sistemleri', ico: '📡' },
  { id: 'otomasyon', label: 'Kapı / Kepenk',    sub: 'Otomatik kapı ve kepenk sistemleri',     ico: '🚪' },
  { id: 'alarm',     label: 'Alarm / Diyafon',  sub: 'Alarm, diyafon ve kartlı geçiş',          ico: '🔔' },
];

// ── Grup 2: Diğer işlemler ────────────────────────────────────────
const DIGER_ISLEMLER = [
  {
    id: 'basvuru',
    label: 'Teknisyen Başvurusu',
    sub: 'TEHAŞ ekibine katılmak için başvur',
    ico: '🧑‍🔧',
  },
];

// ── Grup başlığı ──────────────────────────────────────────────────
function GrupBaslik({ children }) {
  return (
    <div
      style={{
        fontFamily: 'var(--f-mono)',
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: '.2em',
        color: 'var(--t-3)',
        textTransform: 'uppercase',
        padding: '0 22px',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span
        style={{
          width: 12,
          height: 1,
          background: 'var(--t-4)',
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {children}
    </div>
  );
}

// ── Tek kart ──────────────────────────────────────────────────────
function Kart({ id, label, sub, ico, onClick, dim = false }) {
  return (
    <button
      className="home-card"
      onClick={onClick}
      aria-label={`${label} seç`}
      style={dim ? { opacity: 0.72 } : undefined}
    >
      <span className="home-card-ico" aria-hidden="true">{ico}</span>
      <div className="home-card-body">
        <div className="home-card-title">{label}</div>
        <div className="home-card-sub">{sub}</div>
      </div>
      <span className="home-card-arr" aria-hidden="true">›</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
export default function HomeScreen({ onFlowStart }) {
  const waHref        = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent('Merhaba, TEHAŞ hakkında bilgi almak istiyorum.')}`;
  const waBildirimHref = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent('Merhaba, bir geri bildirim iletmek istiyorum.')}`;

  const [showDetay, setShowDetay] = useState(false);  // "Emin Değilim" ikinci katman
  const [showRef,   setShowRef]   = useState(false);  // "Talebimi Sorgula" ref-section

  // ── Referans sorgulama ─────────────────────────────────────────
  const refCodeRef  = useRef(null);
  const districtRef = useRef(null);
  const phoneRef    = useRef(null);
  const [refResult, setRefResult] = useState(null);
  const [refError,  setRefError]  = useState(null);

  function handleQuery() {
    const refCode    = (refCodeRef.current?.value  || '').trim().toUpperCase();
    const district   = (districtRef.current?.value || '').trim();
    const phoneLast4 = (phoneRef.current?.value    || '').replace(/\D/g, '');

    if (!refCode || phoneLast4.length !== 4) {
      setRefError('Referans kodu ve telefon son 4 hane zorunludur.');
      setRefResult(null);
      return;
    }

    const result = queryByRefAndPhone(refCode, phoneLast4, district);
    if (result) {
      setRefResult(result);
      setRefError(null);
    } else {
      setRefResult(null);
      setRefError('Kayıt bulunamadı. Referans kodu ve telefon bilgilerini kontrol edin.');
    }
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
        <a className="hdr-wa" href={waHref} target="_blank" rel="noopener noreferrer">
          <span>💬</span> WhatsApp
        </a>
      </header>

      {/* Hero */}
      <section className="home-hero">
        <div className="home-badge">
          <span className="home-badge-dot" />
          Kemalpaşa ve çevresi
        </div>
        <h1 className="home-h">
          Ne yapmamızı<br />istersiniz?
        </h1>
        <p className="home-p">
          3-5 adımda talebinizi oluşturun,<br />
          WhatsApp üzerinden bağlanalım.
        </p>
      </section>

      {/* ── Grup 1: Ne konuda destek istiyorsunuz? ── */}
      <GrupBaslik>Ne konuda destek istiyorsunuz?</GrupBaslik>
      <nav className="home-actions" aria-label="Teknik destek hizmetleri">
        {DESTEK_KARTLARI.map((f) => (
          <Kart key={f.id} {...f} onClick={() => onFlowStart(f.id)} />
        ))}

        {/* Emin Değilim — ikinci katmanı açar/kapatır */}
        <button
          className="home-card"
          onClick={() => setShowDetay((v) => !v)}
          aria-expanded={showDetay}
          aria-label="Emin Değilim / Diğer Teknik Destek"
        >
          <span className="home-card-ico" aria-hidden="true">💡</span>
          <div className="home-card-body">
            <div className="home-card-title">Emin Değilim / Diğer</div>
            <div className="home-card-sub">Uydu, kapı, alarm ve daha fazlası</div>
          </div>
          <span
            className="home-card-arr"
            aria-hidden="true"
            style={{ transition: 'transform .2s', transform: showDetay ? 'rotate(90deg)' : 'none' }}
          >
            ›
          </span>
        </button>

        {/* İkinci katman — uydu / otomasyon / alarm */}
        {showDetay && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '4px 0 4px 16px',
              borderLeft: '2px solid var(--line)',
              marginLeft: 4,
            }}
          >
            {DIGER_TEKNIK.map((f) => (
              <Kart key={f.id} {...f} dim onClick={() => onFlowStart(f.id)} />
            ))}
          </div>
        )}

        {/* WhatsApp — güncellenmiş metin */}
        <a
          className="home-card wa"
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Emin değilsen WhatsApp'tan yaz"
        >
          <span className="home-card-ico" aria-hidden="true">💬</span>
          <div className="home-card-body">
            <div className="home-card-title">Emin değilsen WhatsApp'tan yaz</div>
            <div className="home-card-sub">Talep oluşturmadan önce birlikte netleştirelim</div>
          </div>
          <span className="home-card-arr" aria-hidden="true">↗</span>
        </a>
      </nav>

      {/* Güven unsurları */}
      <div className="trust-bar" role="list" aria-label="Güven bilgileri">
        <div className="trust-item" role="listitem">
          <span className="trust-ico">🏅</span>
          <div>
            <div className="trust-text">Hikvision Partner Pro</div>
            <div className="trust-sub">Sertifikalı kurulum</div>
          </div>
        </div>
        <div className="trust-item" role="listitem">
          <span className="trust-ico">🛠️</span>
          <div>
            <div className="trust-text">7+ yıl saha deneyimi</div>
            <div className="trust-sub">Kemalpaşa bölgesi</div>
          </div>
        </div>
        <div className="trust-item" role="listitem">
          <span className="trust-ico">📋</span>
          <div>
            <div className="trust-text">Her iş kayıt altında</div>
            <div className="trust-sub">Yazılı görev kartı</div>
          </div>
        </div>
        <div className="trust-item" role="listitem">
          <span className="trust-ico">✅</span>
          <div>
            <div className="trust-text">Onaysız işlem yok</div>
            <div className="trust-sub">Fiyat önceden paylaşılır</div>
          </div>
        </div>
      </div>

      {/* ── Grup 2: Diğer İşlemler ── */}
      <GrupBaslik>Diğer İşlemler</GrupBaslik>
      <nav
        className="home-actions"
        aria-label="Diğer işlemler"
        style={{ marginTop: 0 }}
      >
        {/* Teknisyen Başvurusu */}
        {DIGER_ISLEMLER.map((f) => (
          <Kart key={f.id} {...f} onClick={() => onFlowStart(f.id)} />
        ))}

        {/* Talebimi Sorgula — ref-section'ı açar/kapatır */}
        <button
          className="home-card"
          onClick={() => setShowRef((v) => !v)}
          aria-expanded={showRef}
          aria-label="Talebimi Sorgula"
        >
          <span className="home-card-ico" aria-hidden="true">🔍</span>
          <div className="home-card-body">
            <div className="home-card-title">Talebimi Sorgula</div>
            <div className="home-card-sub">Referans koduyla mevcut talebini takip et</div>
          </div>
          <span
            className="home-card-arr"
            aria-hidden="true"
            style={{ transition: 'transform .2s', transform: showRef ? 'rotate(90deg)' : 'none' }}
          >
            ›
          </span>
        </button>

        {/* Geri Bildirim / Çözüm Talebi → WA */}
        <a
          className="home-card"
          href={waBildirimHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Geri Bildirim veya Çözüm Talebi"
        >
          <span className="home-card-ico" aria-hidden="true">📢</span>
          <div className="home-card-body">
            <div className="home-card-title">Geri Bildirim / Çözüm Talebi</div>
            <div className="home-card-sub">Şikayet, memnuniyet veya önerinizi iletin</div>
          </div>
          <span className="home-card-arr" aria-hidden="true">↗</span>
        </a>
      </nav>

      {/* Referans sorgulama — "Talebimi Sorgula" seçilince görünür */}
      {showRef && (
        <section className="ref-section" aria-label="Referans sorgulama">
          <div className="ref-eye">Referans Sorgulama</div>
          <h2 className="ref-h">Referans kodunuz var mı?</h2>
          <p className="ref-p">Önceki talebinizin durumunu sorgulayın.</p>

          <div className="ref-fields">
            <input
              ref={refCodeRef}
              id="ref-code-input"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              placeholder="TEH-K7M-4Q9"
            />
            <input
              ref={districtRef}
              id="ref-district-input"
              type="text"
              autoComplete="off"
              placeholder="İlçe / Bölge"
            />
            <input
              ref={phoneRef}
              id="ref-phone-input"
              type="tel"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              placeholder="Telefon son 4 hane"
            />
          </div>

          <button
            className="ref-submit"
            type="button"
            data-action="query-ref"
            onClick={handleQuery}
          >
            Talebi Sorgula
          </button>

          {refResult && (
            <div id="ref-result" className="ref-result" role="region" aria-label="Sorgu sonucu">
              <div className="ref-result-row">
                <span className="ref-result-k">Referans</span>
                <span className="ref-result-v ref-result-code">{refResult.refCode}</span>
              </div>
              <div className="ref-result-row">
                <span className="ref-result-k">Durum</span>
                <span className="ref-result-v">{refResult.status || 'Talep alındı'}</span>
              </div>
              <div className="ref-result-row">
                <span className="ref-result-k">Teknisyen</span>
                <span className="ref-result-v">Atanıyor...</span>
              </div>
              <div className="ref-result-row">
                <span className="ref-result-k">Hizmet</span>
                <span className="ref-result-v">{refResult.flowId || '—'}</span>
              </div>
            </div>
          )}

          {refError && (
            <p id="ref-error" className="ref-error-msg" role="alert">
              {refError}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
