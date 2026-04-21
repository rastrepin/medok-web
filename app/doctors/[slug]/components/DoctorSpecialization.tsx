type Stat = { value: string; label: string };

type SpecializationProps = {
  headline: string;
  focusText: string;
  stats: Stat[];
  ctaLabel: string;
  ctaCaseSlug: string;
};

export default function DoctorSpecialization({
  headline,
  focusText,
  stats,
  ctaLabel,
  ctaCaseSlug,
}: SpecializationProps) {
  return (
    <section style={{
      background: 'var(--tp)',
      borderBottom: '1px solid var(--tl)',
      padding: '96px 48px',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        {/* Eyebrow */}
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '2.2px',
          textTransform: 'uppercase', color: 'var(--td)',
          marginBottom: 14,
        }}>
          СПЕЦІАЛІЗАЦІЯ
        </div>

        {/* Headline */}
        <h2 className="h2" style={{ marginBottom: 16, maxWidth: 680 }}>
          {headline}
        </h2>

        {/* Focus text */}
        <p style={{
          fontSize: 15, color: 'var(--g600)', lineHeight: 1.8,
          marginBottom: 32, maxWidth: 620,
        }}>
          {focusText}
        </p>

        {/* Stats row */}
        {stats.length > 0 && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '12px 32px',
            marginBottom: 36,
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{
                  fontSize: 22, fontWeight: 800, color: 'var(--td)',
                  fontFamily: 'var(--font)',
                }}>
                  {s.value}
                </span>
                <span style={{ fontSize: 11, color: 'var(--g500)', letterSpacing: '.2px' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA — links to quiz on main page */}
        <a
          href="/#quiz"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--td)', color: '#fff',
            padding: '13px 28px', borderRadius: 9999,
            fontSize: 16, fontWeight: 600, textDecoration: 'none',
          }}
        >
          {ctaLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
      </div>

      <style>{`
        @media(max-width:768px){
          section[style*="96px 48px"]{padding:64px 20px!important}
          h2{font-size:24px!important}
        }
      `}</style>
    </section>
  );
}
