'use client';
import HeroInlineQuiz from './HeroInlineQuiz';

const TRUST_PILLS = [
  { label: "Зв'язок з лікарем 24/7" },
  { label: 'УЗД експертного класу' },
  { label: 'Скринінг за протоколом FMF' },
  { label: 'Фіксована вартість' },
];

export default function MedokHero() {
  return (
    <section id="hero" style={{
      background: 'var(--mint-tint)',
      padding: '0 0 0',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '72px 48px 64px' }}>
        {/* Two-column layout on desktop */}
        <div className="hero-grid">
          {/* Left col */}
          <div className="hero-left">
            {/* Eyebrow */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 11, fontWeight: 700, letterSpacing: '2.2px',
              textTransform: 'uppercase', color: 'var(--td)', marginBottom: 20,
            }}>
              <span style={{ width: 26, height: 2, background: 'var(--t)', borderRadius: 1, flexShrink: 0, display: 'inline-block' }} />
              ВЕДЕННЯ ВАГІТНОСТІ · ВІННИЦЯ
            </div>

            {/* H1 */}
            <h1 style={{
              fontFamily: 'var(--font)',
              fontSize: 48, fontWeight: 600, color: 'var(--g900)',
              lineHeight: 1.1, marginBottom: 16, letterSpacing: '-.5px',
              maxWidth: 560,
            }}>
              Ведення вагітності у Вінниці — МЦ MED OK
            </h1>

            {/* Accent subtitle */}
            <p className="hero-subtitle" style={{
              fontFamily: 'var(--font-acc)',
              fontSize: 36, fontStyle: 'italic', fontWeight: 300,
              color: 'var(--td)',
              lineHeight: 1.2, marginBottom: 22, maxWidth: 500,
              letterSpacing: '-.2px',
            }}>
              Ваша вагітність — під повним контролем
            </p>

            {/* Description */}
            <p style={{
              fontSize: 16, color: '#1A1A2E', lineHeight: 1.75, fontWeight: 500,
              marginBottom: 32, maxWidth: 520,
            }}>
              Персоналізована програма з I до III триместру. Команда MED OK супроводжує вас між візитами — лікарі перевіряють ваші аналізи та висновки.
            </p>

            {/* Ghost link → #programs */}
            <button
              onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent', border: 'none', padding: '0',
                fontSize: 14, fontWeight: 600, color: 'var(--td)',
                cursor: 'pointer', fontFamily: 'inherit', marginBottom: 36,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              Подивитись всі програми ↓
            </button>

            {/* Trust pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TRUST_PILLS.map((pill) => (
                <div
                  key={pill.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    background: 'rgba(255,255,255,.7)', border: '1.5px solid rgba(82,178,173,.2)',
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
          </div>

          {/* Right col — inline quiz */}
          <div className="hero-right">
            <HeroInlineQuiz />
          </div>
        </div>
      </div>

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 460px;
          gap: 48px;
          align-items: center;
        }
        .hero-right { display: flex; justify-content: center; }
        @media(max-width:1024px){
          .hero-grid { grid-template-columns: 1fr; gap: 36px; }
          .hero-right { justify-content: flex-start; }
          #hero > div { padding: 48px 20px 44px !important; }
          #hero h1 { font-size: 32px !important; max-width: 100% !important; }
          .hero-subtitle { font-size: 26px !important; max-width: 100% !important; }
        }
        @media(max-width:480px){
          #hero h1 { font-size: 26px !important; }
          .hero-subtitle { font-size: 22px !important; }
          .hero-right > div { max-width: 100% !important; width: 100%; }
        }
      `}</style>
    </section>
  );
}
