'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useBookingModal } from '@/components/booking/useBookingModal';
import { CLINIC } from '@/lib/data';

const NAV_LINKS = [
  { label: 'Послуги',                id: 'services' },
  { label: 'Лікарі',                 id: 'doctors' },
  { label: 'Програми',               id: 'programs' },
  { label: 'Перехід з іншої клініки', id: 'transfer' },
];

export default function MedokNav() {
  const [open, setOpen]       = useState(false);
  const [hidden, setHidden]   = useState(false);
  const pathname              = usePathname();
  const booking               = useBookingModal();
  const isHome                = pathname === '/';

  // Extract doctor slug when on /doctors/[slug]
  const doctorSlug = pathname.startsWith('/doctors/')
    ? pathname.split('/doctors/')[1]?.split('/')[0] ?? undefined
    : undefined;

  // Scroll-hide: hide on scroll down, show on scroll up
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLink = (id: string) => {
    setOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const handleBooking = () => {
    setOpen(false);
    booking.open('booking', {
      ...(doctorSlug ? { prefilledDoctorSlug: doctorSlug } : {}),
      source: 'header',
    });
  };

  return (
    <>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 48px',
          height: 64,
          borderBottom: '1px solid var(--gray-200)',
          position: 'sticky',
          top: 0,
          background: 'rgba(255,255,255,.97)',
          backdropFilter: 'blur(12px)',
          zIndex: 200,
          transition: 'transform 0.3s ease',
          transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        }}
      >
        {/* Brand */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="МЦ MED OK — медичний центр Вінниця"
            className="nav-logo"
            style={{ display: 'block' }}
          />
        </a>

        {/* Desktop links (home only) */}
        {isHome && (
          <ul style={{ display: 'flex', gap: 32, listStyle: 'none', margin: 0, padding: 0 }} className="nav-desktop">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => handleLink(l.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--gray-500)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }} className="nav-desktop">
          <a
            href={`tel:${CLINIC.phone}`}
            style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-700)', textDecoration: 'none' }}
          >
            {CLINIC.phoneDisplay}
          </a>
          <button
            onClick={handleBooking}
            style={{
              background: 'var(--teal)', color: '#fff', border: 'none',
              padding: '9px 24px', borderRadius: 9999, fontSize: 13,
              fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              letterSpacing: '0.05em',
            }}
          >
            ЗАПИСАТИСЬ
          </button>
        </div>

        {/* Burger */}
        <button
          onClick={() => setOpen(!open)}
          className="nav-burger"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'none', flexDirection: 'column', gap: 5 }}
          aria-label="Меню"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block', width: 22, height: 2,
                background: 'var(--gray-700)', borderRadius: 2,
                transition: 'all .3s',
                transform:
                  open && i === 0 ? 'rotate(45deg) translate(5px,5px)' :
                  open && i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : 'none',
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>

        <style>{`
          .nav-logo { height: 40px; width: auto; }
          @media (min-width: 768px) { .nav-logo { height: 48px; } }
          @media (max-width: 768px) {
            .nav-desktop { display: none !important; }
            .nav-burger  { display: flex !important; }
            nav          { padding: 0 20px !important; }
          }
        `}</style>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0,
          background: '#fff', zIndex: 190, padding: 24,
          display: 'flex', flexDirection: 'column', gap: 16,
          borderTop: '1px solid var(--gray-200)',
          boxShadow: '0 8px 24px rgba(0,0,0,.1)',
          transform: hidden ? 'translateY(-64px)' : 'none',
          transition: 'transform 0.3s ease',
        }}>
          {[...NAV_LINKS, { label: 'Питання', id: 'faq' }].map((l) => (
            <button
              key={l.id}
              onClick={() => handleLink(l.id)}
              style={{
                background: 'none', border: 'none', borderBottom: '1px solid var(--gray-100)',
                paddingBottom: 12, fontFamily: 'inherit', fontSize: 16,
                fontWeight: 700, color: 'var(--gray-700)', textAlign: 'left', cursor: 'pointer',
              }}
            >
              {l.label}
            </button>
          ))}
          <a
            href={`tel:${CLINIC.phone}`}
            style={{
              display: 'block', background: 'var(--teal)', color: '#fff',
              padding: '14px 20px', borderRadius: 9999, fontWeight: 700,
              fontSize: 15, textAlign: 'center', textDecoration: 'none',
            }}
          >
            {CLINIC.phoneDisplay}
          </a>
        </div>
      )}
    </>
  );
}
