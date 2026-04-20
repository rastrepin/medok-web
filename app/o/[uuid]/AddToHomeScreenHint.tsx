'use client';

import { useState } from 'react';

/**
 * Inline "Додати на головний екран" hint banner + modal with platform-specific
 * steps. Detects iOS vs Android via userAgent on the client.
 */
export default function AddToHomeScreenHint() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <>
      <section aria-label="PWA installation hint" style={bannerWrap}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={iconCircle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div style={{ flex: 1, color: '#fff' }}>
            <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: 0.2 }}>Додайте на головний екран</div>
            <div style={{ fontSize: 12, opacity: 0.88 }}>Швидкий доступ до деталей запису</div>
          </div>
          <button onClick={() => setOpen(true)} type="button" style={howBtn}>ЯК?</button>
          <button onClick={() => setHidden(true)} type="button" style={dismissBtn} aria-label="Закрити">✕</button>
        </div>
      </section>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.5)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 100, padding: 12,
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 18, padding: 24,
              maxWidth: 420, width: '100%',
              boxShadow: '0 -8px 24px rgba(0,0,0,0.15)',
            }}
          >
            <div className="h3" style={{ marginBottom: 16 }}>Додайте MED OK на головний екран</div>
            <ModalSteps />
            <button type="button" onClick={() => setOpen(false)} className="btn-primary" style={{ width: '100%', marginTop: 20 }}>
              Зрозуміло
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ModalSteps() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isIOS = /iPhone|iPad|iPod/.test(ua);

  if (isIOS) {
    return (
      <ol style={ol}>
        <li>Натисніть кнопку <strong>«Поділитися»</strong> у нижньому рядку Safari.</li>
        <li>Оберіть <strong>«Додати на головний екран»</strong>.</li>
        <li>Натисніть <strong>«Додати»</strong> у правому верхньому кутку.</li>
        <li>Іконка MED OK з’явиться на головному екрані — клік відкриває цю сторінку в один тап.</li>
      </ol>
    );
  }
  return (
    <ol style={ol}>
      <li>Відкрийте <strong>меню браузера</strong> (три крапки ⋮ справа зверху).</li>
      <li>Оберіть <strong>«Додати на головний екран»</strong> або <strong>«Встановити застосунок»</strong>.</li>
      <li>Підтвердіть — іконка MED OK з’явиться на головному екрані.</li>
    </ol>
  );
}

const bannerWrap: React.CSSProperties = {
  background: 'linear-gradient(135deg, #1a7c75 0%, #14665f 100%)',
  padding: '14px 16px',
  borderRadius: 14,
  color: '#fff',
};

const iconCircle: React.CSSProperties = {
  width: 36, height: 36, borderRadius: '50%',
  background: 'rgba(255,255,255,0.2)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  color: '#fff', flexShrink: 0,
};

const howBtn: React.CSSProperties = {
  background: 'rgba(255,255,255,0.22)',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.1,
  cursor: 'pointer',
};

const dismissBtn: React.CSSProperties = {
  background: 'transparent',
  color: '#fff',
  border: 'none',
  fontSize: 18,
  cursor: 'pointer',
  padding: '6px 8px',
  opacity: 0.75,
};

const ol: React.CSSProperties = {
  paddingLeft: 20,
  margin: 0,
  color: 'var(--black, #1A1A2E)',
  fontFamily: 'var(--font-text, Fixel)',
  fontSize: 14,
  lineHeight: 1.6,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};
