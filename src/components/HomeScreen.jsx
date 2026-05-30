import React, { useState, useRef } from 'react';
import { WA_PHONE } from '../utils/whatsapp.js';
import { queryByRefAndPhone } from '../utils/refcode.js';

const FLOWS = [
  {
    id: 'elektrik',
    label: 'Elektrik',
    sub: 'Montaj, tesisat, arıza ve hat çekme',
    ico: '⚡',
    primary: true,
  },
  {
    id: 'kamera',
    label: 'Güvenlik Kamerası',
    sub: 'Hikvision Partner Pro sertifikalı kurulum',
    ico: '📷',
    primary: true,
  },
  {
    id: 'uydu',
    label: 'Uydu / Anten',
    sub: 'Çanak, multiswitch ve anten sistemleri',
    ico: '📡',
  },
  {
    id: 'ag',
    label: 'Ağ / İnternet',
    sub: 'Kablo, switch, router ve access point',
    ico: '🌐',
  },
  {
    id: 'otomasyon',
    label: 'Kapı / Kepenk',
    sub: 'Otomatik kapı ve kepenk sistemleri',
    ico: '🚪',
  },
  {
    id: 'alarm',
    label: 'Alarm / Diyafon',
    sub: 'Alarm, diyafon ve kartlı geçiş',
    ico: '🔔',
  },
  {
    id: 'basvuru',
    label: 'Teknisyen Başvurusu',
    sub: 'TEHAŞ ekibine katılmak için başvur',
    ico: '🧑‍🔧',
  },
];

export default function HomeScreen({ onFlowStart }) {
  const waHref = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent('Merhaba, TEHAŞ hakkında bilgi almak istiyorum.')}`;

  // ── Referans sorgulama ─────────────────────────────────────────
  const refCodeRef    = useRef(null);
  const districtRef   = useRef(null);
  const phoneRef      = useRef(null);
  const [refResult, setRefResult] = useState(null);
  const [refError,  setRefError]  = useState(null);

  function handleQuery() {
    const refCode    = (refCodeRef.current?.value   || '').trim().toUpperCase();
    const district   = (districtRef.current?.value  || '').trim();
    const phoneLast4 = (phoneRef.current?.value     || '').replace(/\D/g, '');

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

      {/* Hizmet kartları */}
      <nav className="home-actions" aria-label="Hizmet seçimi">
        {FLOWS.map((f) => (
          <button
            key={f.id}
            className={`home-card${f.primary ? ' primary' : ''}`}
            onClick={() => onFlowStart(f.id)}
            aria-label={`${f.label} hizmetini seç`}
          >
            <span className="home-card-ico" aria-hidden="true">{f.ico}</span>
            <div className="home-card-body">
              <div className="home-card-title">{f.label}</div>
              <div className="home-card-sub">{f.sub}</div>
            </div>
            <span className="home-card-arr" aria-hidden="true">›</span>
          </button>
        ))}

        {/* WhatsApp direkt */}
        <a
          className="home-card wa"
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp üzerinden direkt yaz"
        >
          <span className="home-card-ico" aria-hidden="true">💬</span>
          <div className="home-card-body">
            <div className="home-card-title">WhatsApp'tan direkt yaz</div>
            <div className="home-card-sub">Hemen bağlan, birlikte netleştirelim</div>
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

      {/* Referans sorgulama */}
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
    </div>
  );
}
