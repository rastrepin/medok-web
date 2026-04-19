'use client';
import { useEffect, useRef, useState } from 'react';
import { useBookingModal } from '@/components/booking/useBookingModal';

type Props = {
  slug: string;
  ctaLabel: string;
};

export default function DoctorStickyCta({ slug, ctaLabel }: Props) {
  const [visible, setVisible] = useState(false);
  const booking = useBookingModal();

  useEffect(() => {
    const target = document.getElementById('hero-cta');
    if (!target) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <>
      <div className="doctor-sticky-cta">
        <button
          onClick={() => booking.open('booking', { prefilledDoctorSlug: slug, source: 'sticky-mobile' })}
          style={{
            width: '100%',
            background: 'var(--teal)',
            color: '#fff',
            border: 'none',
            borderRadius: 9999,
            padding: '14px 24px',
            fontFamily: 'inherit',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          {ctaLabel}
        </button>
      </div>
      <style>{`
        .doctor-sticky-cta {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: #fff;
          padding: 12px 20px;
          border-top: 1px solid var(--gray-200);
          box-shadow: var(--shadow-accent);
          z-index: 50;
        }
        @media (max-width: 767px) {
          .doctor-sticky-cta { display: block; }
        }
      `}</style>
    </>
  );
}
