'use client';
import { useEffect, useState } from 'react';
import { useBookingModal } from '@/components/booking/useBookingModal';

type Props = {
  slug: string;
  ctaLabel: string;
  stickyCtaLabel: string;
};

export default function DoctorStickyCta({ slug, ctaLabel: _ctaLabel, stickyCtaLabel }: Props) {
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
          className="sticky-cta-btn"
        >
          {stickyCtaLabel}
        </button>
      </div>
      <style>{`
        .doctor-sticky-cta {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: #fff;
          padding: 12px 20px;
          box-shadow: 0 -2px 12px rgba(0,0,0,0.08);
          z-index: 150;
          border-top: 1px solid #E5E7EB;
        }
        .sticky-cta-btn {
          width: 100%;
          background: #1a7c75;
          color: #fff;
          border: none;
          border-radius: 9999px;
          padding: 16px 24px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          min-height: 48px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 375px) {
          .sticky-cta-btn { font-size: 13px; letter-spacing: 0.05em; }
        }
        @media (max-width: 768px) {
          .doctor-sticky-cta { display: block; }
        }
      `}</style>
    </>
  );
}
