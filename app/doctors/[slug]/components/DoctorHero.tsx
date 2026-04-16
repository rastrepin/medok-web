'use client';

type DoctorHeroProps = {
  name: string;
  role: string;
  photoFilename: string | null;
  avatarInitials: string;
  avatarColor: string;
  doctorType: string;
  branches: string[];
  lastActiveAt: string | null;
  patientsCount: number;
};

export default function DoctorHero({
  name,
  role,
  photoFilename,
  avatarInitials,
  avatarColor,
  doctorType,
  branches,
  lastActiveAt: _lastActiveAt,
  patientsCount: _patientsCount,
}: DoctorHeroProps) {
  return (
    <section style={{
      background: '#fff',
      borderBottom: '1px solid var(--g200)',
      padding: '96px 48px',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        {/* Back breadcrumb */}
        <a
          href="/#doctors"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'var(--g500)', textDecoration: 'none',
            marginBottom: 32, letterSpacing: '.3px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Команда лікарів
        </a>

        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Photo / Avatar */}
          <div style={{ flexShrink: 0 }}>
            {photoFilename ? (
              <div style={{
                width: 140, height: 140, borderRadius: 20,
                overflow: 'hidden',
                border: '2px solid var(--tp)',
                boxShadow: '0 4px 16px rgba(82,178,173,.15)',
              }}>
                {(() => {
                  const base = photoFilename.replace(/\.[^.]+$/, '');
                  return (
                    <picture>
                      <source
                        type="image/webp"
                        srcSet={`/images/doctors/${base}-400w.webp 400w, /images/doctors/${base}-200w.webp 200w, /images/doctors/${base}-100w.webp 100w`}
                        sizes="140px"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/images/doctors/${photoFilename}`}
                        alt={name}
                        width={140}
                        height={140}
                        loading="eager"
                        decoding="async"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    </picture>
                  );
                })()}
              </div>
            ) : (
              <div style={{
                width: 140, height: 140, borderRadius: 20,
                background: avatarColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40, fontWeight: 800, color: '#fff',
                border: '2px solid var(--tp)',
              }}>
                {avatarInitials}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 240 }}>
            {/* Role eyebrow */}
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '2px',
              textTransform: 'uppercase', color: 'var(--t)',
              marginBottom: 8,
            }}>
              {role}
            </div>

            {/* Name */}
            <h1 style={{
              fontFamily: 'var(--font)',
              fontSize: 36, fontWeight: 600, lineHeight: 1.15,
              color: 'var(--g900)', marginBottom: 14, letterSpacing: '-.3px',
            }}>
              {name}
            </h1>

            {/* Activity line — static schedule status */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 12, color: 'var(--g500)', marginBottom: 12,
            }}>
              <span style={{ color: '#22c55e', fontSize: 8 }}>●</span>
              Актуальний графік на квітень 2026
            </div>

            {/* Branches */}
            {branches.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                {branches.map((b) => (
                  <span key={b} style={{
                    background: '#fff',
                    border: '1px solid var(--g200)',
                    borderRadius: 9999, padding: '4px 12px',
                    fontSize: 12, color: 'var(--g700)', fontWeight: 500,
                  }}>
                    {b}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href="#booking"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'var(--c)', color: '#fff',
                  padding: '13px 28px', borderRadius: 10,
                  fontSize: 14, fontWeight: 700, textDecoration: 'none',
                }}
              >
                Записатись
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          section[style*="96px 48px"]{padding:64px 20px!important}
          h1{font-size:26px!important}
        }
      `}</style>
    </section>
  );
}
