'use client';
import { usePathname } from 'next/navigation';
import { CLINIC } from '@/lib/data';

const NAV_LINKS = [
  { label: 'Програми',          anchor: 'programs' },
  { label: 'Лікарі',            anchor: 'doctors' },
  { label: 'Як це працює',      anchor: 'onboarding' },
  { label: 'Переваги',          anchor: 'why' },
  { label: 'Запис',             anchor: 'quiz' },
  { label: 'FAQ',               anchor: 'faq' },
];

const TEAL       = '#1a7c75';
const TEXT       = '#374151';
const GRAY_LIGHT = '#6B7280';

export default function MedokFooter() {
  const pathname    = usePathname();
  const isDoctorPage = pathname?.startsWith('/doctors/') ?? false;

  const navHref = (anchor: string) =>
    isDoctorPage ? `/#${anchor}` : `#${anchor}`;

  return (
    <footer style={{
      background: '#F9FAFB',
      borderTop: '1px solid #E5E7EB',
      marginTop: 0,
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '56px 48px 32px' }}>

        {/* ── Top grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
          gap: 48,
          marginBottom: 48,
        }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'var(--font)', fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>
              МЦ MED OK
            </div>
            <div style={{ fontSize: 12, color: GRAY_LIGHT, marginBottom: 16, letterSpacing: '.3px' }}>
              медичний центр · Вінниця
            </div>
            <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.7, marginBottom: 20 }}>
              Ведення вагітності за міжнародними стандартами.<br />
              Один лікар. Один пакет. Повний супровід.
            </p>
            <a
              href={`tel:${CLINIC.phone}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: TEAL, color: '#fff', padding: '9px 16px',
                borderRadius: 9999, fontSize: 13, fontWeight: 700, textDecoration: 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 5.5 5.5l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
              </svg>
              {CLINIC.phoneDisplay}
            </a>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.8px', textTransform: 'uppercase', color: TEAL, marginBottom: 18 }}>
              Навігація
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.anchor}
                  href={navHref(link.anchor)}
                  className="footer-link"
                  style={{ fontSize: 14, color: TEXT, textDecoration: 'none' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.8px', textTransform: 'uppercase', color: TEAL, marginBottom: 18 }}>
              Контакти
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span style={{ fontSize: 13, color: TEXT, lineHeight: 1.5 }}>{CLINIC.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 5.5 5.5l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                </svg>
                <a href={`tel:${CLINIC.phone}`} style={{ fontSize: 13, color: TEAL, textDecoration: 'underline' }}>
                  {CLINIC.phoneDisplay}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span style={{ fontSize: 13, color: TEXT }}>{CLINIC.workHours}</span>
              </div>
            </div>
          </div>

          {/* Branches */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.8px', textTransform: 'uppercase', color: TEAL, marginBottom: 18 }}>
              Філії
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E', marginBottom: 14, lineHeight: 1.4 }}>
              Філії MED OK у Вінниці та Барі
            </p>

            {/* Highlighted: OB only */}
            <div style={{ borderLeft: '3px solid #52b2ad', paddingLeft: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E', marginBottom: 3 }}>
                Ведення вагітності
              </div>
              <div style={{ fontSize: 12, color: TEXT, lineHeight: 1.5 }}>
                Тільки Поділля<br />вул. Зодчих 20
              </div>
            </div>

            {/* Other branches */}
            <div style={{ fontSize: 12, color: GRAY_LIGHT, marginBottom: 8 }}>
              Інші напрями в інших філіях:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
              {[
                'Соборна, вул. Соборна 18',
                'Вишенька, вул. М. Ващука 20б',
                'Бар, площа Пам’яті 5',
              ].map((branch) => (
                <div key={branch} style={{ fontSize: 12, color: TEXT }}>— {branch}</div>
              ))}
            </div>
            <a
              href="https://medok.vn.ua/kontakti"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: TEAL, textDecoration: 'underline' }}
            >
              medok.vn.ua/kontakti →
            </a>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: '#E5E7EB', marginBottom: 24 }} />

        {/* ── Bottom ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>
            © {new Date().getFullYear()} МЦ MED OK. Всі права захищено.
          </div>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>
            Powered by{' '}
            <a href="https://check-up.in.ua" target="_blank" rel="noopener noreferrer" style={{ color: TEAL, textDecoration: 'none' }}>
              check-up.in.ua
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: #1a7c75 !important; text-decoration: underline !important; }
        @media (max-width: 900px) {
          footer > div { padding: 40px 20px 24px !important; }
          footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 560px) {
          footer > div > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
