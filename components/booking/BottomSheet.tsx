'use client';
/**
 * BottomSheet — shared wrapper
 * Desktop: centered modal max-w-540px
 * Mobile (<768px): bottom sheet with drag handle, 90vh
 */
import { useEffect, useRef, ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

export default function BottomSheet({ open, onClose, children, title }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // ESC closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(26, 26, 46, 0.5)',
        zIndex: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          background: '#fff',
          width: '100%',
          maxWidth: 540,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          position: 'relative',
          borderRadius: 18,
        }}
        className="booking-sheet"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Закрити"
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none',
            cursor: 'pointer', padding: 4,
            color: 'var(--gray-500)',
            lineHeight: 1,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        {children}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .booking-sheet {
            position: fixed !important;
            bottom: 0 !important; left: 0 !important; right: 0 !important;
            border-radius: 18px 18px 0 0 !important;
            max-height: 90vh !important;
            padding: 24px 20px 32px !important;
          }
          /* Modal overlay alignment on mobile */
          div[role="dialog"] { max-width: none !important; }
        }
      `}</style>
    </div>
  );
}
