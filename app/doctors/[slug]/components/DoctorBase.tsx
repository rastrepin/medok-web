type DoctorBaseProps = {
  bio: string;
  education: string | null;
  achievements: string | null;
  branches: string[];
};

export default function DoctorBase({ bio, education, achievements, branches }: DoctorBaseProps) {
  return (
    <section style={{ background: '#fff', padding: '56px 48px' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
        }} className="doctor-base-grid">

          {/* Left column */}
          <div>
            <SectionLabel>Про лікаря</SectionLabel>
            <p style={{
              fontSize: 15, color: 'var(--g600)', lineHeight: 1.85,
              marginBottom: education ? 32 : 0,
            }}>
              {bio}
            </p>

            {education && (
              <>
                <SectionLabel>Освіта</SectionLabel>
                <p style={{ fontSize: 14, color: 'var(--g600)', lineHeight: 1.8 }}>
                  {education}
                </p>
              </>
            )}
          </div>

          {/* Right column */}
          <div>
            {achievements && (
              <>
                <SectionLabel>Підвищення кваліфікації</SectionLabel>
                <p style={{ fontSize: 14, color: 'var(--g600)', lineHeight: 1.85, marginBottom: 32 }}>
                  {achievements}
                </p>
              </>
            )}

            {branches.length > 0 && (
              <>
                <SectionLabel>Філії прийому</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {branches.map((b) => (
                    <div key={b} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px',
                      background: 'var(--g50)', borderRadius: 10,
                      border: '1px solid var(--g200)',
                      fontSize: 13, color: 'var(--g700)',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--td)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      МЦ MED OK · {b}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .doctor-base-grid{grid-template-columns:1fr!important;gap:28px!important}
          section[style*="background: rgb(255, 255, 255)"]{padding:40px 20px!important}
        }
      `}</style>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, letterSpacing: '2px',
      textTransform: 'uppercase', color: 'var(--td)',
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}
