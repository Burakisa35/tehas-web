import React from 'react';

// ── 6 hizmet akışı ───────────────────────────────────────────────
const FLOWS = [
  { id: 'elektrik',  label: 'Elektrik Arıza',    sub: 'Sigorta, priz, hat kontrolü',         ico: '⚡' },
  { id: 'kamera',    label: 'Kamera Sistemi',     sub: 'Kurulum ve arıza kontrolü',            ico: '📷' },
  { id: 'uydu',      label: 'Uydu / Anten',       sub: 'Çanak, multiswitch, anten',            ico: '📡' },
  { id: 'ag',        label: 'İnternet / Network', sub: 'Kablo, switch, router, access point',  ico: '🌐' },
  { id: 'otomasyon', label: 'Kapı / Kepenk',      sub: 'Otomatik kapı ve kepenk',              ico: '🚪' },
  { id: 'alarm',     label: 'Alarm / Diyafon',    sub: 'Alarm, diyafon, kartlı geçiş',         ico: '🔔' },
];

export default function HomeScreen({ onFlowStart }) {
  return (
    <div className="app">
      {/* Header */}
      <header className="hdr">
        <div className="brand">
          <div className="brand-logo" aria-hidden="true" />
          <div>
            <div className="brand-name">TEHAŞ</div>
            <div className="brand-sub">Teknik Hizmetler Asistanınız</div>
          </div>
        </div>
      </header>

      {/* 6 hizmet — 2 sütunlu grid */}
      <div className="home-card-grid" style={{ paddingTop: 16 }}>
        {FLOWS.map((f) => (
          <button
            key={f.id}
            className="home-card"
            onClick={() => onFlowStart(f.id)}
            aria-label={f.label}
          >
            <span className="home-card-ico" aria-hidden="true">{f.ico}</span>
            <div className="home-card-body">
              <div className="home-card-title">{f.label}</div>
              <div className="home-card-sub">{f.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Tam genişlik işlem kartları */}
      <div className="home-actions-secondary">
        <button
          className="home-card-action"
          onClick={() => onFlowStart('apartman')}
          aria-label="Apartman Bakımı Başvurusu"
        >
          <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }} aria-hidden="true">🏢</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="home-card-title">Apartman Bakımı Başvurusu</div>
            <div className="home-card-sub">Ortak alan bakım ve teknik hizmet anlaşması</div>
          </div>
          <span style={{ color: 'var(--t-4)', fontSize: 18, flexShrink: 0 }} aria-hidden="true">›</span>
        </button>

        <button
          className="home-card-action"
          onClick={() => onFlowStart('basvuru')}
          aria-label="Teknisyen Başvurusu"
        >
          <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }} aria-hidden="true">🧑‍🔧</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="home-card-title">Teknisyen Başvurusu</div>
            <div className="home-card-sub">TEHAŞ ekibine katılmak için başvur</div>
          </div>
          <span style={{ color: 'var(--t-4)', fontSize: 18, flexShrink: 0 }} aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );
}
