const SUPPORT_CARDS = [
  {
    title: 'УЗД-діагностика експертного рівня',
    text: 'Скринінги проводить Бондарчук Жанна — сертифікація FMF (Fetal Medicine Foundation, Лондон), член ISUOG (International Society of Ultrasound in Obstetrics and Gynecology). Апарат Voluson E8 з 3D/4D. Ваш гінеколог отримує максимально точну інформацію для рішень.',
    iconBg: 'var(--tp)',
  },
  {
    title: 'Генетичний скринінг I триместру',
    text: 'Оцінка ризиків хромосомних аномалій. Результати обробляються у системі Astraia — міжнародний стандарт, у партнерстві з генетичним центром «Геном».',
    iconBg: '#dcfce7',
  },
  {
    title: 'Один лікар — від початку до кінця',
    text: 'Ваш акушер-гінеколог знає вашу історію від першого прийому до огляду після пологів. Не ротується з черговими. Знає ваші особливості, реагує в контексті.',
    iconBg: '#fef9c3',
  },
  {
    title: 'Фіксована вартість',
    text: 'Ви знаєте суму за весь триместр наперед. Всі консультації, УЗД, аналізи — включені. Без несподіваних доплат під час вагітності.',
    iconBg: 'var(--g100)',
  },
];

export default function MedokWhy() {
  return (
    <section style={{ maxWidth: 1140, margin: '0 auto', padding: '72px 48px' }}>
      <div style={{ marginBottom: 44 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 12 }}>
          ПЕРЕВАГИ
        </div>
        <h2 style={{ fontFamily: 'var(--font)', fontSize: 36, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>
          Чому MED OK
        </h2>
        <p style={{ fontSize: 15, color: 'var(--g500)', marginTop: 10, maxWidth: 620, lineHeight: 1.75 }}>
          Кожне рішення вашого лікаря базується на повній картині — а ви знаєте, що відбувається, і не маєте приводу для тривог
        </p>
      </div>

      {/* Main accent card — full width */}
      <div style={{
        background: 'linear-gradient(135deg,#05121e 0%,#0d2235 100%)',
        borderRadius: 24, padding: '40px 44px', marginBottom: 18,
        color: '#fff',
      }}>
        <div style={{ maxWidth: 760 }}>
          <h3 style={{ fontFamily: 'var(--font)', fontSize: 24, fontWeight: 600, color: '#fff', marginBottom: 16, lineHeight: 1.3 }}>
            Лікар бачить повну картину — ви не маєте приводу для тривог
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', lineHeight: 1.8, marginBottom: 20 }}>
            У звичайній клініці лікар бачить ваші показники тільки на прийомі. У MED OK ваш лікар має під рукою всі ключові дані між візитами — через медичну систему CAREWAY. Якщо результат аналізу потребує уваги, лікар побачить це і зв&apos;яжеться з вами, не чекаючи наступного запису.
          </p>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 20 }}>
            {[
              { label: 'Ваш кабінет', sub: 'дорожня карта, візити, результати' },
              { label: 'Застосунок лікаря', sub: 'контроль показників між прийомами' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--tl)', marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{item.sub}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, fontStyle: 'italic' }}>
            Це не просто &quot;зв&apos;язок 24/7&quot;. Це система, яка мінімізує ризик того, що щось важливе залишиться непоміченим — і прибирає привід для тривог між прийомами.
          </p>
        </div>
      </div>

      {/* Supporting 4 cards — 2x2 grid */}
      <div className="why-grid">
        {SUPPORT_CARDS.map((card) => (
          <div
            key={card.title}
            style={{
              background: '#fff',
              border: '1.5px solid var(--g200)',
              borderRadius: 18, padding: '24px 22px',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: card.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--td)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--g900)', marginBottom: 8 }}>{card.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.7 }}>{card.text}</p>
          </div>
        ))}
      </div>

      <style>{`
        .why-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media(max-width:768px){
          section[id=""] { padding: 52px 20px !important; }
          .why-grid { grid-template-columns: 1fr !important; }
          [style*="40px 44px"] { padding: 28px 24px !important; }
        }
      `}</style>
    </section>
  );
}
