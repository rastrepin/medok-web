'use client';
import { useBookingModal } from '@/components/booking/useBookingModal';
import { track } from '@/lib/track';

type Trimester = 'first' | 'second' | 'third';

const OPTIONS: { val: Trimester; label: string; sub: string }[] = [
  { val: 'first',  label: 'I триместр',   sub: '11–16 тиж' },
  { val: 'second', label: 'II триместр',  sub: '18–28 тиж' },
  { val: 'third',  label: 'III триместр', sub: '30–41 тиж' },
];

export default function HeroInlineQuiz() {
  const booking = useBookingModal();

  const handleSelect = (val: Trimester) => {
    void track({ event_type: 'quiz_inline_started', step_value: { trimester: val }, source_cta: 'hero-inline' });
    booking.open('quiz', { prefilledTrimester: val, source: 'hero-inline' });
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '1.5px solid rgba(82,178,173,.25)',
        borderRadius: 18,
        padding: '22px 20px 18px',
        maxWidth: 420,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--teal-dark)', margin: 0,
        }}>
          КРОК 1 З 3
        </p>
        <p style={{
          fontSize: 11, color: 'var(--gray-500)', margin: 0,
        }}>
          30 сек
        </p>
      </div>

      <p style={{
        fontSize: 17, fontWeight: 700, color: 'var(--gray-900)',
        margin: '0 0 14px', lineHeight: 1.3,
      }}>
        Який у вас термін?
      </p>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPTIONS.map(({ val, label, sub }) => (
          <button
            key={val}
            onClick={() => handleSelect(val)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              background: '#F9FAFB',
              border: '1.5px solid #E5E7EB',
              borderRadius: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
              minHeight: 52,
              textAlign: 'left',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--teal-dark)';
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--mint-tint)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E7EB';
              (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB';
            }}
          >
            <span>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', display: 'block' }}>{label}</span>
              <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>{sub}</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        ))}
      </div>

      {/* Divider + caption */}
      <div style={{ borderTop: '1px solid #F3F4F6', marginTop: 14, paddingTop: 12 }}>
        <p style={{ fontSize: 11, color: 'var(--gray-500)', margin: 0, lineHeight: 1.5, textAlign: 'center' }}>
          Після 3 питань — дізнаєтеся вашу програму та вартість
        </p>
      </div>
    </div>
  );
}
