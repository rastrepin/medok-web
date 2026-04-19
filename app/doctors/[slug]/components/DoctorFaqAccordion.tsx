'use client';
import { useState } from 'react';
import type { FaqItem } from '@/lib/doctor-faq';

export default function DoctorFaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number>(0);

  if (!items.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            style={{ borderBottom: '1px solid var(--gray-200)' }}
          >
            <button
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                padding: '18px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
              }}
            >
              <span style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--black)',
                lineHeight: 1.4,
                flex: 1,
              }}>
                {item.question}
              </span>
              <span style={{
                flexShrink: 0,
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gray-300)',
                fontSize: 20,
                fontWeight: 300,
                lineHeight: 1,
              }}>
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <div style={{
                paddingBottom: 18,
                fontSize: 13,
                color: 'var(--gray-700)',
                lineHeight: 1.6,
              }}>
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
