'use client';
import { useState } from 'react';
import { CLINIC } from '@/lib/data';

export default function MedokNav() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
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
          borderBottom: '1px solid var(--g200)',
          position: 'sticky',
          top: 0,
          background: 'rgba(255,255,255,.97)',
          backdropFilter: 'blur(12px)',
          zIndex: 200,
        }}
      >
        {/* Brand */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="МЦ MED OK — медичний центр Вінниця"
            height={40}
            style={{ height: 40, width: 'auto', display: 'block' }}
          />
          <span style={{ fontSize: 10, color: 'var(--g400)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            медичний центр · Вінниця
          </span>
        </a>

        {/* Desktop links */}
        <ul style={{ display: 'flex', gap: 32, listStyle: 'none', margin: 0, padding: 0 }} className="nav-desktop">
          {[
            { label: 'Послуги', id: 'services' },
            { label: 'Лікарі', id: 'doctors' },
            { label: 'Програми', id: 'programs' },
            { label: 'Перехід з іншої клініки', id: 'transfer' },
          ].map((l) => (
            <li key={l.id}>
              <button
                onClick={() => scrollTo(l.id)}
                style={{ background: 'none', border: 'none', color: 'var(--g500)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }} className="nav-desktop">
          <a
            href={`tel:${CLINIC.phone}`}
            style={{ fontSize: 14, fontWeight: 700, color: 'var(--g700)', textDecoration: 'none' }}
          >
            {CLINIC.phoneDisplay}
          </a>
          <button
            onClick={() => scrollTo('quiz')}
            style={{
              background: 'var(--t)', color: '#fff', border: 'none',
              padding: '9px 24px', borderRadius: 9999, fontSize: 13,
              fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Записатись
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
                background: 'var(--g700)', borderRadius: 2,
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
          @media(max-width:768px){
            .nav-desktop{display:none!important}
            .nav-burger{display:flex!important}
            nav{padding:0 20px!important}
          }
        `}</style>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0,
          background: '#fff', zIndex: 190, padding: 24,
          display: 'flex', flexDirection: 'column', gap: 16,
          borderTop: '1px solid var(--g200)',
          boxShadow: '0 8px 24px rgba(0,0,0,.1)',
        }}>
          {[
            { label: 'Послуги', id: 'services' },
            { label: 'Лікарі', id: 'doctors' },
            { label: 'Програми', id: 'programs' },
            { label: 'Перехід з іншої клініки', id: 'transfer' },
            { label: 'Питання', id: 'faq' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                background: 'none', border: 'none', borderBottom: '1px solid var(--g100)',
                paddingBottom: 12, fontFamily: 'inherit', fontSize: 16,
                fontWeight: 700, color: 'var(--g700)', textAlign: 'left', cursor: 'pointer',
              }}
            >
              {l.label}
            </button>
          ))}
          <a
            href={`tel:${CLINIC.phone}`}
            style={{
              display: 'block', background: 'var(--t)', color: '#fff',
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
