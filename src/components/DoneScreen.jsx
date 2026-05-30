import React, { useState, useEffect } from 'react';
import { buildWaUrl, buildSummaryRows } from '../utils/whatsapp.js';
import { generateRefCode, saveToLocal } from '../utils/refcode.js';

// buildSummaryRows'un döndürdüğü satırlardan 3 blok üretir
function buildFis(rows) {
  const get = (k) => rows.find(r => r.k === k)?.v;

  // Blok 1 — Talep: Hizmet / İş tipi — detaylar
  const hizmet  = get('Hizmet');
  const isTipi  = get('İş tipi');
  const urun    = get('Ürün');
  const adet    = get('Adet');
  const kapsam  = get('Kapsam');
  const kamera  = get('Kamera adedi');
  const kurYer  = get('Kurulum yeri');

  const talepBase = [hizmet, isTipi].filter(Boolean).join(' / ');
  const detay     = [
    urun,
    adet  ? adet + ' adet' : null,
    kapsam,
    kamera,
    kurYer,
  ].filter(Boolean).join(' · ');
  const talepV = talepBase + (detay ? ' — ' + detay : '') || '—';

  // Blok 2 — Planlama: Zaman · Konum
  const zaman = get('Zaman');
  const konum = get('Konum');
  const planV = [zaman, konum].filter(Boolean).join(' · ') || '—';

  // Blok 3 — İletişim: Ad · Telefon
  const ad  = get('Ad');
  const tel = get('Telefon');
  const iletV = [ad, tel].filter(Boolean).join(' · ') || '—';

  return { talepV, planV, iletV };
}

export default function DoneScreen({ flowId, answers, onRestart, onHome }) {
  const [refCode,  setRefCode]  = useState('');
  const [copied,   setCopied]   = useState(false);
  const [showAnim, setShowAnim] = useState(true); // 3 sn animasyon, sonra normal görünüm

  useEffect(() => {
    const code = generateRefCode();
    saveToLocal(code, { flowId, phone: answers.iletisim_tel, ...answers });
    setRefCode(code);
    const t = setTimeout(() => setShowAnim(false), 3000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const waUrl = buildWaUrl(flowId, answers, refCode);
  const rows  = buildSummaryRows(flowId, answers);
  const { talepV, planV, iletV } = buildFis(rows);

  const hasContact = answers.iletisim_ad || answers.iletisim_tel;

  function handleCopy() {
    navigator.clipboard.writeText(refCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
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

        {/* Referans kodu — animasyon (3sn) → normal */}
        {refCode && showAnim && (
          <div
            role="note"
            aria-label="Referans kodu hazırlandı"
            style={{
              textAlign: 'center',
              padding: '20px 16px',
              background: 'rgba(52,229,197,.07)',
              border: '1px solid rgba(52,229,197,.3)',
              borderRadius: 14,
              marginBottom: 16,
              animation: 'screen-enter .4s ease-out both',
            }}
          >
            <div style={{ fontSize: 13, color: 'var(--t-3)', marginBottom: 10 }}>
              📸 Referans kodunuz hazırlandı — lütfen ekran görüntüsü alın
            </div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 28, fontWeight: 700, letterSpacing: '.12em', color: 'var(--cyan)', lineHeight: 1.2 }}>
              {refCode}
            </div>
          </div>
        )}

        {refCode && !showAnim && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
            <button
              onClick={handleCopy}
              aria-label="Referans kodunu kopyala"
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 11,
                letterSpacing: '.1em',
                color: copied ? 'var(--green)' : 'var(--cyan)',
                border: '1px solid',
                borderColor: copied ? 'rgba(34,197,94,.35)' : 'rgba(52,229,197,.3)',
                borderRadius: 7,
                padding: '6px 11px',
                background: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color .2s, border-color .2s',
              }}
            >
              {copied ? 'Kopyalandı ✓' : 'Kopyala'}
            </button>
          </div>
        )}

        {/* Talep fişi — 3 blok */}
        <div className="summary-card" role="region" aria-label="Talep fişi">
          <div className="summary-row" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="summary-k">Talep</div>
            <div className="summary-v">{talepV}</div>
          </div>
          <div className="summary-row" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="summary-k">Planlama</div>
            <div className="summary-v">{planV}</div>
          </div>
          <div className="summary-row" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="summary-k">İletişim</div>
            <div className="summary-v">{iletV}</div>
          </div>
        </div>

        {/* Kamera: fotoğraf ipucu */}
        {flowId === 'kamera' && (
          <div
            style={{
              marginBottom: 16,
              padding: '12px 14px',
              background: 'rgba(52,229,197,.04)',
              border: '1px solid rgba(52,229,197,.18)',
              borderRadius: 10,
              fontSize: 13,
              color: 'var(--t-2)',
              lineHeight: 1.65,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: '.18em',
                color: 'var(--t-3)',
                textTransform: 'uppercase',
                marginBottom: 7,
              }}
            >
              Fotoğraf ile hızlandırın
            </div>
            Göndermeden önce varsa mevcut sistemin fotoğrafını veya
            ekran görüntüsünü WhatsApp'a ekleyebilirsiniz.
            <br />
            <span style={{ fontSize: 11, color: 'var(--t-4)', marginTop: 5, display: 'block' }}>
              İpucu: Referans kodunu kopyaladıktan sonra
              ekran görüntüsü almanız kodu kaybetmenizi önler.
            </span>
          </div>
        )}

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
            onClick={onHome}
            aria-label="Ana sayfaya dön"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              padding: '8px',
              fontSize: 13,
              color: 'var(--t-3)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
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
