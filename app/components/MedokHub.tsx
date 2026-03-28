const HUB_ITEMS = [
  {
    title: 'Ведення вагітності',
    desc: 'I, II або III триместр, або повне ведення від постановки на облік до пологів. Фіксована вартість — все включено.',
    facts: ['Один лікар на весь термін', 'Від 9 970 до 39 830 грн', "Зв'язок з лікарем між візитами"],
    link: '#quiz', linkLabel: 'Підібрати програму',
    isPrimary: true,
    iconColor: 'var(--cl)',
  },
  {
    title: 'Планове УЗД',
    desc: 'Ваш гінеколог приймає рішення на основі того, що бачить діагност. У MED OK скринінги проводить спеціаліст із сертифікацією FMF London на апараті Voluson E8 — це поєднання, яке дає лікарю повну картину.',
    facts: ['Скринінги I, II, III триместру', '3D/4D — детальна оцінка розвитку'],
    link: '#doctors', linkLabel: 'Про спеціаліста',
    isPrimary: false,
    iconColor: 'var(--tp)',
  },
];

export default function MedokHub() {
  return (
    <section id="services" style={{ padding: '64px 48px' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 12 }}>
            НАПРЯМИ
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 36, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>
            Як ми допомагаємо
          </h2>
          <p style={{ fontSize: 15, color: 'var(--g500)', marginTop: 10, lineHeight: 1.75 }}>
            Оберіть те, що актуально для вас зараз
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
          {HUB_ITEMS.map((item) => (
            <a
              key={item.title}
              href={item.link}
              style={{
                background: item.isPrimary ? 'linear-gradient(150deg,#fff5f7 0%,#fff 60%)' : '#fff',
                border: `1.5px solid ${item.isPrimary ? 'var(--c)' : 'var(--g200)'}`,
                borderRadius: 22, padding: '36px 32px',
                display: 'flex', flexDirection: 'column',
                textDecoration: 'none', color: 'inherit',
                position: 'relative', overflow: 'hidden',
                transition: 'all .25s',
              }}
            >
              {item.isPrimary && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--c)' }} />
              )}
              {item.isPrimary && (
                <span style={{
                  position: 'absolute', top: 20, right: 20,
                  fontSize: 10, fontWeight: 800, padding: '3px 10px',
                  borderRadius: 20, background: 'var(--c)', color: '#fff',
                  textTransform: 'uppercase', letterSpacing: '.5px',
                }}>
                  Популярне
                </span>
              )}
              <div style={{
                width: 52, height: 52, borderRadius: 14, background: item.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={item.isPrimary ? 'var(--c)' : 'var(--td)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 22, fontWeight: 600, color: 'var(--g900)', marginBottom: 10, lineHeight: 1.25 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--g500)', lineHeight: 1.75, marginBottom: 20, flex: 1 }}>
                {item.desc}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {item.facts.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--g600)', fontWeight: 600 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: item.isPrimary ? 'var(--cd)' : 'var(--td)', marginTop: 'auto' }}>
                {item.linkLabel}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          #services{padding:48px 20px!important}
          #services > div > div:last-child{grid-template-columns:1fr!important;gap:14px!important}
        }
      `}</style>
    </section>
  );
}
