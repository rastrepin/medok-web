'use client';
import { useState } from 'react';
import { formatUAH, trimesterLabel } from './helpers';

interface Props {
  program: {
    name: string;
    includes: string[];
    price_single: number;
    price_twin: number;
    trimester: string;
  };
  pregnancyType: 'single' | 'twin' | null;
}

export default function ProgramIncludedAccordion({ program, pregnancyType }: Props) {
  const [open, setOpen] = useState(false);
  const price = formatUAH(pregnancyType === 'twin' ? program.price_twin : program.price_single);
  const count = (program.includes ?? []).length;

  return (
    <div style={{
      marginTop: 12,
      background: 'var(--white, #FFFFFF)',
      border: '1.5px solid var(--gray-200, #E5E7EB)',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--black, #1A1A2E)' }}>
            Що входить у програму
          </span>
          <span style={{ fontSize: 12, color: 'var(--gray-500, #6B7280)' }}>
            {count} пункт{count === 1 ? '' : count >= 2 && count <= 4 ? 'и' : 'ів'} · {price}
          </span>
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--mint-tint, #E8F5F1)',
            color: 'var(--teal-dark, #1a7c75)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 180ms ease',
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ fontSize: 12, color: 'var(--gray-500, #6B7280)', marginBottom: 10 }}>
            {trimesterLabel(program.trimester)} · {pregnancyType === 'twin' ? 'двоплідна' : 'одноплідна'} вагітність
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(program.includes ?? []).map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.55 }}>
                <span style={{ color: 'var(--teal-dark, #1a7c75)', flexShrink: 0, marginTop: 6 }}>
                  <svg width="8" height="8" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3" fill="currentColor" /></svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
