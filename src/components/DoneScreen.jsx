import React from 'react';
import { buildWaUrl, buildSummaryRows } from '../utils/whatsapp.js';

export default function DoneScreen({ flowId, answers, onRestart, onHome }) {
  const waUrl   = buildWaUrl(flowId, answers);
  const rows    = buildSummaryRows(flowId, answers);

  const hasContact = answers.iletisim_ad || answers.iletisim_tel;

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
        <button className="hdr-back" onClick={onHome} aria-label="Ana sayfaya dön">
          Ana sayfa
        </button>
      </header>

      <div className="done-screen">
        {/* Başlık */}
        <div className="done-mark" aria-hidden="true">✅</div>
        <h2 className="done-h">Talebiniz hazır!</h2>
        <p className="done-p">
          {hasContact
            ? 'Aşağıdaki özeti WhatsApp ile gönderin. En kısa sürede dönüş yapılır.'
            : 'Talebinizin özetini WhatsApp ile gönderin, birlikte netleştirelim.'}
        </p>

        {/* Özet kartı */}
        <div className="summary-card" role="region" aria-label="Talep özeti">
          {rows.map((r) => (
            <div key={r.k} className="summary-row">
              <div className="summary-k">{r.k}</div>
              <div className="summary-v">{r.v}</div>
            </div>
          ))}
        </div>

        {/* CTA'lar */}
        <div className="done-actions">
          <a
            className="btn-wa"
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp üzerinden talep gönder"
          >
            <span aria-hidden="true">💬</span>
            WhatsApp ile Gönder
          </a>
          <button
            className="btn-secondary"
            onClick={onRestart}
            aria-label="Yeni talep oluştur"
          >
            + Yeni Talep
          </button>
          <button
            className="btn-secondary"
            onClick={onHome}
            aria-label="Ana sayfaya dön"
          >
            Ana Sayfa
          </button>
        </div>

        {/* KVKK notu */}
        <p style={{ fontSize: 11, color: 'var(--t-4)', lineHeight: 1.6, marginTop: 24, textAlign: 'center' }}>
          Kişisel verileriniz KVKK kapsamında yalnızca bu hizmet talebi için kullanılır.
          Üçüncü taraflarla paylaşılmaz.
        </p>
      </div>
    </div>
  );
}
