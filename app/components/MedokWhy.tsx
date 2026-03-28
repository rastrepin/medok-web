const WHY_ITEMS = [
  {
    title: 'CAREWAY App — 24/7',
    text: 'Лікарі MED OK використовують спеціалізований застосунок для перевірки ваших аналізів між прийомами. Зв\'язок без черг.',
    highlight: true,
    badge: 'CAREWAY App',
  },
  {
    title: 'FMF London та ISUOG',
    text: 'Бондарчук Жанна — сертифікований спеціаліст FMF London та член ISUOG. Скринінги за міжнародними протоколами.',
    highlight: false,
  },
  {
    title: 'Апарат Voluson E8',
    text: 'УЗД-обладнання експертного класу GE Healthcare з 3D/4D-технологіями. Детальна пренатальна діагностика вад розвитку.',
    highlight: false,
  },
  {
    title: 'Astraia + центр «Геном»',
    text: 'Біохімічний скринінг I триместру обробляється у ліцензованій програмі Astraia у партнерстві з центром генетики «Геном».',
    highlight: false,
  },
  {
    title: 'Фіксована ціна пакету',
    text: 'Пакет «Довіра» включає всі передбачені консультації та дослідження за один платіж. Вартість відома заздалегідь.',
    highlight: false,
  },
  {
    title: 'Один лікар на весь термін',
    text: 'Ваш лікар знає вашу карту від першого до останнього прийому. Не ротується між черговими спеціалістами.',
    highlight: false,
  },
];

function Icon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--td)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function MedokWhy() {
  return (
    <section style={{ maxWidth: 1140, margin: '0 auto', padding: '72px 48px' }}>
      <div style={{ marginBottom: 44 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 12 }}>Переваги</div>
        <h2 style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 36, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>
          Чому MED OK
        </h2>
        <p style={{ fontSize: 15, color: 'var(--g500)', marginTop: 10 }}>Конкретні факти, а не загальні слова</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
        {WHY_ITEMS.map((item) => (
          <div
            key={item.title}
            style={{
              background: item.highlight ? 'linear-gradient(150deg,var(--tp) 0%,#fff 60%)' : '#fff',
              border: `1.5px solid ${item.highlight ? 'var(--t)' : 'var(--g200)'}`,
              borderRadius: 18, padding: '24px 20px',
              transition: 'all .22s',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: item.highlight ? 'rgba(82,178,173,.2)' : 'var(--g100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--g900)', marginBottom: 7 }}>{item.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.65 }}>{item.text}</p>
            {item.badge && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--td)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 11px', borderRadius: 20, marginTop: 10 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                {item.badge}
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @media(max-width:1024px){section > div:last-child[style*="repeat(3"]{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:768px){section > div:last-child[style*="repeat(3"]{grid-template-columns:1fr 1fr!important;gap:12px!important}}
        @media(max-width:480px){section > div:last-child[style*="repeat(3"]{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}
