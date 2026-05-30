import React from 'react';

// ── 6 hizmet akışı (2x3 grid) ────────────────────────────────────
const FLOWS = [
  { id: 'elektrik',  label: 'Enerji & Aydınlatma', sub: 'Priz, sigorta, pano, ışık',    ico: '⚡' },
  { id: 'kamera',    label: 'Güvenlik & İzleme',    sub: 'Kamera, kayıt, mobil izleme',   ico: '📷' },
  { id: 'uydu',      label: 'TV & Uydu',            sub: 'Çanak, sinyal, merkezi sistem', ico: '📡' },
  { id: 'ag',        label: 'İnternet & Bağlantı',  sub: 'Wi-Fi, modem, kablo, ağ',       ico: '🌐' },
  { id: 'otomasyon', label: 'Kapı & Geçiş',         sub: 'Kapı, kepenk, bariyer',         ico: '🚪' },
  { id: 'alarm',     label: 'Giriş & Haberleşme',   sub: 'Alarm, diyafon, interkom',      ico: '🔔' },
];

// ── Tam genişlik işlem kartları ──────────────────────────────────
const SECONDARY = [
  { id: 'apartman', label: 'Apartman Bakımı Başvurusu', sub: 'Ortak alan, pano, kamera, kapı ve diyafon işleri', ico: '🏢' },
  { id: 'basvuru',  label: 'Teknisyen Başvurusu',       sub: 'TEHAŞ ekibine katılmak için başvur',               ico: '🧑‍🔧' },
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

      {/* Kolay Hizmet CTA — tam genişlik, üst konumda */}
      <div style={{ padding: '16px 16px 0' }}>
        <button
          className="home-card-action"
          onClick={() => onFlowStart('kolay_hizmet')}
          aria-label="Kolay Hizmet İstiyorum"
          style={{
            background: 'linear-gradient(135deg, rgba(52,229,197,.12) 0%, rgba(52,229,197,.06) 100%)',
            border: '1.5px solid rgba(52,229,197,.35)',
            borderRadius: 14,
          }}
        >
          <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }} aria-hidden="true">🧭</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="home-card-title" style={{ color: 'var(--cyan)', fontWeight: 700 }}>
              Kolay Hizmet İstiyorum
            </div>
            <div className="home-card-sub">
              Teknik bilmiyorum — sadece durumu anlat, yönlendirelim
            </div>
          </div>
          <span style={{ color: 'var(--cyan)', fontSize: 18, flexShrink: 0 }} aria-hidden="true">›</span>
        </button>
      </div>

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
        {SECONDARY.map((s) => (
          <button
            key={s.id}
            className="home-card-action"
            onClick={() => onFlowStart(s.id)}
            aria-label={s.label}
          >
            <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }} aria-hidden="true">{s.ico}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="home-card-title">{s.label}</div>
              <div className="home-card-sub">{s.sub}</div>
            </div>
            <span style={{ color: 'var(--t-4)', fontSize: 18, flexShrink: 0 }} aria-hidden="true">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
