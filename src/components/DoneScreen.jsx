import React, { useState, useEffect } from 'react';
import { buildWaUrl, buildSummaryRows } from '../utils/whatsapp.js';
import { generateRefCode, saveToLocal } from '../utils/refcode.js';

export default function DoneScreen({ flowId, answers, onRestart, onHome }) {
  const [refCode, setRefCode] = useState('');

  // Mount'ta bir kez çalışır — ref kodu üret ve localStorage'a kaydet
  useEffect(() => {
    const code = generateRefCode();
    saveToLocal(code, { flowId, phone: answers.iletisim_tel, ...answers });
    setRefCode(code);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const waUrl = buildWaUrl(flowId, answers, refCode);
  const rows  = buildSummaryRows(flowId, answers);

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

        {/* Referans kodu */}
        {refCode && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 14px',
              background: 'rgba(52,229,197,.06)',
              border: '1px solid rgba(52,229,197,.2)',
              borderRadius: 10,
              marginBottom: 16,
            }}
            role="note"
            aria-label="Referans kodu"
          >
            <span style={{ fontSize: 15, lineHeight: 1 }} aria-hidden="true">🔖</span>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--f-mono)', letterSpacing: '.18em', color: 'var(--t-3)', textTransform: 'uppercase', marginBottom: 3 }}>
                Referans kodu
              </div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 15, fontWeight: 600, letterSpacing: '.12em', color: 'var(--cyan)' }}>
                {refCode}
              </div>
            </div>
          </div>
        )}

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
