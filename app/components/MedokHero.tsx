'use client';
import HeroInlineQuiz from './HeroInlineQuiz';

export default function MedokHero() {
  return (
    <section id="hero" style={{ background: 'var(--mint-tint)' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '72px 48px 64px' }}>
        <div className="hero-grid">

          {/* Left col */}
          <div className="hero-left">
            {/* Eyebrow */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 11, fontWeight: 700, letterSpacing: '2.2px',
              textTransform: 'uppercase', color: 'var(--teal-dark)', marginBottom: 24,
            }}>
              <span style={{ width: 26, height: 2, background: 'var(--teal)', borderRadius: 1, flexShrink: 0, display: 'inline-block' }} />
              ВЕДЕННЯ ВАГІТНОСТІ · ВІННИЦЯ
            </div>

            {/* H1 — Comfortaa, UPPERCASE */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 44, fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              color: '#202640',
              lineHeight: 1.15,
              marginBottom: 20,
              maxWidth: 560,
            }}>
              Ведення вагітності у Вінниці — МЦ MED OK
            </h1>

            {/* Subtitle — Fixel, regular, not italic */}
            <p style={{
              fontFamily: 'var(--font-text)',
              fontSize: 17, fontWeight: 400,
              fontStyle: 'normal',
              color: '#374151',
              lineHeight: 1.7,
              marginBottom: 32,
              maxWidth: 500,
            }}>
              Персоналізована програма з I до III триместру. Команда MED OK супроводжує вас між візитами — лікарі перевіряють ваші аналізи та висновки.
            </p>

            {/* Ghost link → #programs */}
            <button
              onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent', border: 'none', padding: 0,
                fontSize: 14, fontWeight: 600, color: 'var(--teal-dark)',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              Подивитись всі програми ↓
            </button>
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
          grid-template-columns: 1fr 440px;
          gap: 56px;
          align-items: center;
        }
        .hero-right { display: flex; justify-content: center; }
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr; gap: 36px; }
          .hero-right { justify-content: flex-start; }
          #hero > div { padding: 48px 20px 44px !important; }
          #hero h1 { font-size: 32px !important; }
        }
        @media (max-width: 480px) {
          #hero h1 { font-size: 26px !important; }
          #hero p { font-size: 15px !important; }
          .hero-right > div { width: 100% !important; max-width: 100% !important; }
        }
      `}</style>
    </section>
  );
}
