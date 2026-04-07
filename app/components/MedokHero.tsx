'use client';

const TRUST_PILLS = [
  { label: "Зв'язок з лікарем 24/7" },
  { label: 'УЗД експертного класу' },
  { label: 'Скринінг за протоколом FMF' },
  { label: 'Фіксована вартість' },
];

export default function MedokHero() {
  return (
    <section id="hero" style={{
      maxWidth: 1140, margin: '0 auto',
      padding: '72px 48px 64px',
    }}>
      {/* Eyebrow */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 11, fontWeight: 700, letterSpacing: '2.2px',
        textTransform: 'uppercase', color: 'var(--td)', marginBottom: 20,
      }}>
        <span style={{ width: 26, height: 2, background: 'var(--t)', borderRadius: 1, flexShrink: 0, display: 'inline-block' }} />
        ВЕДЕННЯ ВАГІТНОСТІ · ВІННИЦЯ
      </div>

      {/* H1 — SEO-first */}
      <h1 style={{
        fontFamily: 'var(--font)',
        fontSize: 48, fontWeight: 600, color: 'var(--g900)',
        lineHeight: 1.1, marginBottom: 14, letterSpacing: '-.5px',
        maxWidth: 720,
      }}>
        Ведення вагітності у Вінниці — МЦ MED OK
      </h1>

      {/* Accent subtitle — Cormorant Garamond italic */}
      <p style={{
        fontFamily: 'var(--font-acc)',
        fontSize: 56, fontStyle: 'italic', fontWeight: 300,
        color: 'var(--td)',
        lineHeight: 1.15, marginBottom: 22, maxWidth: 640,
        letterSpacing: '-.3px',
      }}>
        Ваша вагітність — під повним контролем
      </p>

      {/* Description */}
      <p style={{
        fontSize: 16, color: 'var(--g500)', lineHeight: 1.75,
        marginBottom: 36, maxWidth: 580,
      }}>
        Персоналізована програма з I до III триместру. Команда MED OK супроводжує вас між візитами — лікарі перевіряють ваші аналізи та висновки і повідомляють, якщо потрібна увага.
      </p>

      {/* CTA buttons */}
      <div className="hero-btns" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
        <button
          onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            background: 'var(--c)', color: '#fff', border: 'none',
            padding: '15px 36px', borderRadius: 9999, fontSize: 15,
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
            border: '2px solid var(--g200)', padding: '14px 24px',
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
              borderRadius: 9999, padding: '8px 16px',
              fontSize: 12, fontWeight: 700, color: 'var(--g600)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--td)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {pill.label}
          </div>
        ))}
      </div>

      <style>{`
        @media(max-width:768px){
          #hero{padding:48px 20px 44px!important}
          #hero h1{font-size:32px!important;max-width:100%!important}
          #hero h1 + p{font-size:18px!important}
          #hero .hero-btns{flex-direction:column!important;align-items:flex-start!important}
          #hero .hero-btns button{width:100%!important;justify-content:center!important}
        }
        @media(max-width:480px){
          #hero h1{font-size:28px!important}
        }
      `}</style>
    </section>
  );
}
