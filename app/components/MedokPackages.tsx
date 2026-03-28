import { PROGRAMS, formatPrice } from '@/lib/data';

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  i:    { bg: 'var(--tp)', color: 'var(--td)' },
  ii:   { bg: '#fef9c3', color: '#b45309' },
  iii:  { bg: '#f3e8ff', color: '#6b21a8' },
  full: { bg: 'var(--c)', color: '#fff' },
};

export default function MedokPackages() {
  return (
    <section id="programs" style={{ maxWidth: 1140, margin: '0 auto', padding: '72px 48px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 12 }}>Програми</div>
        <h2 style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 36, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>
          Пакет «Довіра» — ціни 2025
        </h2>
        <p style={{ fontSize: 15, color: 'var(--g500)', marginTop: 10, lineHeight: 1.75 }}>
          Фіксована вартість за весь триместр. Всі консультації та дослідження включені.
        </p>
      </div>

      <div style={{ background: 'var(--tp)', borderLeft: '4px solid var(--t)', borderRadius: '0 14px 14px 0', padding: '12px 18px', fontSize: 14, color: 'var(--td)', marginBottom: 28, fontWeight: 600 }}>
        * Лікар вищої кваліфікаційної категорії — +650 грн/триместр
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {PROGRAMS.map((prog) => {
          const badge = BADGE_STYLES[prog.trimester];
          const isFull = prog.trimester === 'full';
          return (
            <div
              key={prog.id}
              style={{
                background: isFull ? 'linear-gradient(150deg,#fff5f7 0%,#fff 55%)' : '#fff',
                border: `1.5px solid ${isFull ? 'var(--c)' : 'var(--g200)'}`,
                borderRadius: 20, padding: 26,
                display: 'flex', flexDirection: 'column',
                transition: 'all .25s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.8px', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, background: badge.bg, color: badge.color }}>
                  {prog.name}
                </span>
                <div style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 22, fontWeight: 700, color: 'var(--c)' }}>
                  {formatPrice(prog.price_single)}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 17, fontWeight: 600, color: 'var(--g900)', marginBottom: 3, lineHeight: 1.3 }}>
                {prog.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--g400)', marginBottom: 14, fontWeight: 600 }}>
                двоплідна: {formatPrice(prog.price_twin)}
              </div>
              <div style={{ borderTop: '1px solid var(--g100)', paddingTop: 13, flex: 1 }}>
                {prog.includes.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 13, color: 'var(--g500)', marginBottom: 7, fontWeight: 500 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
              <a
                href="#quiz"
                style={{
                  display: 'block', textAlign: 'center', padding: 10,
                  marginTop: 16,
                  background: isFull ? 'var(--c)' : 'var(--cl)',
                  color: isFull ? '#fff' : 'var(--c)',
                  borderRadius: 9999, fontSize: 13, fontWeight: 700,
                  textDecoration: 'none', transition: 'all .2s',
                }}
              >
                Записатись
              </a>
            </div>
          );
        })}
      </div>

      <style>{`
        @media(max-width:768px){
          #programs{padding:52px 20px!important}
          #programs > div:last-child{grid-template-columns:1fr!important}
        }
      `}</style>
    </section>
  );
}
