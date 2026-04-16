/**
 * DoctorGeoEeat — E-E-A-T block (unified style with MedokEeat).
 * GEO text is rendered inside DoctorSchedule (combined container, Task 8).
 * Placement: after DoctorSchedule, before footer CTA.
 */

type DoctorGeoEeatProps = {
  reviewerName: string;
  reviewerTitle: string;
  sources: string[];
};

function IconPerson() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export default function DoctorGeoEeat({
  reviewerName,
  reviewerTitle,
  sources,
}: DoctorGeoEeatProps) {
  return (
    <section
      id="doctor-eeat"
      style={{
        background: '#fff',
        borderTop: '1px solid var(--g100)',
        padding: '64px 48px',
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Top row: author + reviewer + date */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            marginBottom: 20,
            paddingBottom: 20,
            borderBottom: '1px solid var(--g100)',
          }}
        >
          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ color: 'var(--g400)', marginTop: 2 }}>
              <IconPerson />
            </span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 3 }}>
                Автор
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--g900)' }}>
                Ігор Растрепін
              </div>
              <div style={{ fontSize: 12, color: 'var(--g500)' }}>
                засновник check-up.in.ua
              </div>
            </div>
          </div>

          {/* Reviewer */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ color: 'var(--td)', marginTop: 2 }}>
              <IconShield />
            </span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 3 }}>
                Рецензент
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--g900)' }}>
                {reviewerName}
              </div>
              <div style={{ fontSize: 12, color: 'var(--g500)', maxWidth: 300, lineHeight: 1.5 }}>
                {reviewerTitle}
              </div>
            </div>
          </div>

          {/* Last updated */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginLeft: 'auto' }}>
            <span style={{ color: 'var(--g400)', marginTop: 2 }}>
              <IconCalendar />
            </span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 3 }}>
                Оновлено
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--g900)' }}>
                Квітень 2026
              </div>
            </div>
          </div>
        </div>

        {/* Sources */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ color: 'var(--g400)', marginTop: 2, flexShrink: 0 }}>
            <IconBook />
          </span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 8 }}>
              Джерела
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sources.map((s) => (
                <li key={s} style={{ fontSize: 12, color: 'var(--g500)', lineHeight: 1.55 }}>
                  <span style={{ fontWeight: 600, color: 'var(--g700)' }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          section#doctor-eeat{ padding: 48px 20px !important }
          section#doctor-eeat > div > div:first-child{ flex-direction: column; gap: 16px }
          section#doctor-eeat > div > div:first-child > div:last-child{ margin-left: 0 }
        }
      `}</style>
    </section>
  );
}
