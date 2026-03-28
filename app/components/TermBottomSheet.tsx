'use client';
import { useEffect, useRef } from 'react';
import { TERMS } from '@/lib/data';

interface Props {
  termKey: string | null;
  onClose: () => void;
}

export default function TermBottomSheet({ termKey, onClose }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const term = termKey ? TERMS[termKey] : null;

  // Close on backdrop click
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  // Close on Escape
  useEffect(() => {
    if (!termKey) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [termKey, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (termKey) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [termKey]);

  if (!term) return null;

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,.45)',
        display: 'flex', alignItems: 'flex-end',
        backdropFilter: 'blur(2px)',
        animation: 'fadeInOverlay .18s ease',
      }}
    >
      <div
        ref={sheetRef}
        style={{
          width: '100%',
          maxWidth: 560,
          margin: '0 auto',
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          padding: '0 0 env(safe-area-inset-bottom,0)',
          animation: 'slideUpSheet .22s cubic-bezier(.32,.72,0,1)',
          boxShadow: '0 -4px 32px rgba(0,0,0,.12)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--g200)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--tp)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--td)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--g900)', fontFamily: 'var(--font-playfair),"Playfair Display",serif' }}>
              {term.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрити"
            style={{
              width: 44, height: 44, borderRadius: 12,
              border: '1.5px solid var(--g200)',
              background: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--g400)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '0 20px 28px', fontSize: 15, color: 'var(--g600)', lineHeight: 1.75 }}>
          {term.body}
        </div>
      </div>

      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUpSheet { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </div>
  );
}
