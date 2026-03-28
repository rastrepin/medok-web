'use client';

const TRUST_PILLS = [
  { icon: '★', label: 'FMF London', termKey: 'fmf' },
  { icon: '⬜', label: 'Voluson E8', termKey: null },
  { icon: '●', label: 'CAREWAY App 24/7', termKey: null },
  { icon: '⬜', label: 'Astraia + «Геном»', termKey: 'astraia' },
];

const HERO_CARDS = [
  { bg: 'var(--tp)', label: 'Ведення вагітності', sub: 'I, II, III триместр або повне', badge: 'Пакет «Довіра»', badgeBg: 'var(--tp)', badgeColor: 'var(--td)' },
  { bg: 'var(--cl)', label: 'Команда 24/7', sub: 'CAREWAY App між візитами', badge: 'Онлайн', badgeBg: '#ffe4e6', badgeColor: '#be123c' },
  { bg: '#fef9c3', label: 'Планове УЗД на Voluson E8', sub: 'FMF London · ISUOG · 3D/4D', badge: 'Скринінг', badgeBg: '#fef9c3', badgeColor: '#b45309' },
  { bg: '#dcfce7', label: 'Біохімічний скринінг', sub: 'Astraia + центр «Геном»', badge: 'I триместр', badgeBg: '#dcfce7', badgeColor: '#166534' },
];

export default function MedokHero() {
  return (
    <section style={{
      maxWidth: 1140, margin: '0 auto',
      padding: '64px 48px 56px',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: 64,
      alignItems: 'center',
    }}>
      {/* Left */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 18 }}>
          <span style={{ width: 26, height: 2, background: 'var(--t)', borderRadius: 1, flexShrink: 0, display: 'inline-block' }} />
          Ведення вагітності · Пакет «Довіра»
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", serif',
            fontSize: 46, fontWeight: 600, color: 'var(--g900)',
            lineHeight: 1.12, marginBottom: 20, letterSpacing: '-.5px',
          }}
        >
          Ваша вагітність —{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--c)' }}>
            під повним контролем
          </em>
        </h1>

        <p style={{ fontSize: 15, color: 'var(--g500)', lineHeight: 1.75, marginBottom: 32, maxWidth: 450 }}>
          Персоналізована програма з I до III триместру. Команда MED OK супроводжує вас цілодобово через CAREWAY App — лікарі перевіряють ваші аналізи та висновки у режимі реального часу.
        </p>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          <button
            onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'var(--c)', color: '#fff', border: 'none',
              padding: '14px 32px', borderRadius: 9999, fontSize: 15,
              fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all .22s',
            }}
          >
            Підібрати програму
          </button>
          <button
            onClick={() => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'transparent', color: 'var(--g600)',
              border: '2px solid var(--g200)', padding: '13px 22px',
              borderRadius: 9999, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Наші лікарі
          </button>
        </div>

        {/* Trust pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TRUST_PILLS.map((pill) => (
            <div
              key={pill.label}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'var(--g50)', border: '1.5px solid var(--g200)',
                borderRadius: 9999, padding: '7px 14px',
                fontSize: 12, fontWeight: 700, color: 'var(--g600)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--td)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {pill.label}
            </div>
          ))}
        </div>
      </div>

      {/* Right — card stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {HERO_CARDS.map((card, i) => (
          <div key={i}>
            {i > 0 && (
              <div style={{ width: 2, height: 10, background: 'var(--g200)', margin: '0 0 10px 27px' }} />
            )}
            <div style={{
              background: '#fff', border: '1.5px solid var(--g200)',
              borderRadius: 16, padding: '15px 18px',
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: 'var(--sh)', transition: 'all .3s',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11,
                background: card.bg, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--td)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--g900)' }}>{card.label}</div>
                <div style={{ fontSize: 11, color: 'var(--g400)', marginTop: 2, fontWeight: 500 }}>{card.sub}</div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 800, padding: '3px 9px',
                borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0,
                background: card.badgeBg, color: card.badgeColor,
              }}>
                {card.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media(max-width:768px){
          section[style*="grid-template-columns"]{
            grid-template-columns:1fr!important;
            padding:40px 20px 36px!important;
            gap:32px!important;
          }
          section[style*="grid-template-columns"] > div:last-child{display:none}
          h1{font-size:34px!important}
        }
        @media(max-width:480px){
          h1{font-size:28px!important}
        }
      `}</style>
    </section>
  );
}
