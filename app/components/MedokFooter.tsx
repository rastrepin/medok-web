import { CLINIC } from '@/lib/data';

const NAV_LINKS = [
  { label: 'Програми', href: '#programs' },
  { label: 'Лікарі', href: '#doctors' },
  { label: 'Як це працює', href: '#onboarding' },
  { label: 'Переваги', href: '#why' },
  { label: 'Запис', href: '#quiz' },
  { label: 'FAQ', href: '#faq' },
];

export default function MedokFooter() {
  return (
    <footer style={{ background: 'var(--g900)', color: '#fff', marginTop: 0 }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '56px 48px 32px' }}>
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
              МЦ MED OK
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginBottom: 16, letterSpacing: '.3px' }}>
              медичний центр · Вінниця
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.7 }}>
              Ведення вагітності за міжнародними стандартами.<br />
              Один лікар. Один пакет. Повний супровід.
            </p>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <a
                href={`tel:${CLINIC.phone}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: 'var(--c)', color: '#fff', padding: '9px 16px',
                  borderRadius: 9999, fontSize: 13, fontWeight: 700, textDecoration: 'none',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 5.5 5.5l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                </svg>
                {CLINIC.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: 18 }}>
              Навігація
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', textDecoration: 'none', transition: 'color .15s' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: 18 }}>
              Контакти
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>
                  {CLINIC.address}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 5.5 5.5l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                </svg>
                <a href={`tel:${CLINIC.phone}`} style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>
                  {CLINIC.phoneDisplay}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>
                  {CLINIC.workHours}
                </span>
              </div>

              {/* CAREWAY badge */}
              <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: '10px 14px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--tl)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--tl)' }}>CAREWAY App</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 1 }}>кабінет пацієнтки · 24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,.09)', marginBottom: 24 }} />

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>
            © {new Date().getFullYear()} МЦ MED OK. Всі права захищено.
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>
            Powered by{' '}
            <a href="https://check-up.in.ua" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>
              CAREWAY
            </a>
          </div>
        </div>
      </div>

      <style>{`
        footer a:hover { color: rgba(255,255,255,0.9) !important; }
        @media(max-width:768px){
          footer > div { padding: 40px 20px 24px !important; }
          footer > div > div:first-child { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </footer>
  );
}
