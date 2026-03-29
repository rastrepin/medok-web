'use client';
import { useState } from 'react';

type PackageItem = {
  id: string;
  name: string;
  price: string;
  priceTwin: string;
  isPrimary?: boolean;
  level1: string[];
  level2: string[];
};

const PACKAGES: PackageItem[] = [
  {
    id: 'i',
    name: 'I триместр',
    price: '14 540 ₴',
    priceTwin: '16 790 ₴',
    level1: [
      'Постановка на облік та перший план спостереження',
      'УЗД-скринінг — оцінка розвитку та ризиків [ℹ]uzd-screening',
      'Генетичний скринінг (Astraia + центр «Геном») [ℹ]genetic-screening',
      'Аналізи крові та сечі',
      'Консультації акушер-гінеколога',
    ],
    level2: [
      'УЗД скринінг I триместру (11–13+6 тижнів)',
      'Біохімічний скринінг РАРР-А, β-ХГЛ, PIGF у програмі Astraia',
      'Загальний аналіз крові (24 показники)',
      'Загальний аналіз сечі',
      'Мікробіологічне дослідження сечі',
      'Група крові + резус-фактор',
      'Сифіліс, ВІЛ, гепатити B та C',
      'Феритин, вітамін D',
      'Глюкоза крові натще, ТТГ',
      'УЗД молочних залоз',
      'УЗД щитоподібної залози',
      'Первинний огляд акушер-гінеколога (кольпоскопія, мазок)',
      'Цитологічне дослідження',
      'Консультація акушер-гінеколога (30 хв)',
      'Огляд терапевта + ЕКГ',
    ],
  },
  {
    id: 'ii',
    name: 'II триместр',
    price: '9 970 ₴',
    priceTwin: '13 830 ₴',
    level1: [
      'УЗД 18–21 тиждень — анатомічний скринінг',
      'Контроль шийки матки (цервікометрія) [ℹ]cervicometry',
      'Аналізи крові, сечі, інфекції',
      'КТГ — запис серцебиття дитини [ℹ]ktg',
      'Консультації акушер-гінеколога × 3',
    ],
    level2: [
      'УЗД вагітності II триместр (18–21 тиждень)',
      'Цервікометрія × 2',
      'Аналіз крові: АФП, вільний β-ХГЛ та естріол',
      'Загальний аналіз крові (24 показники)',
      'Загальний аналіз сечі × N ⚠️ (уточнити)',
      'Тест на антитіла до ВІЛ',
      'Прискорена реакція на сифіліс',
      'Тест толерантності до глюкози',
      'КТГ плоду',
      'Консультації акушер-гінеколога × 3',
    ],
  },
  {
    id: 'iii',
    name: 'III триместр',
    price: '15 320 ₴',
    priceTwin: '15 570 ₴',
    level1: [
      'УЗД з доплерометрією — кровотік між мамою та дитиною [ℹ]dopplerometry',
      'КТГ — регулярний контроль серцебиття [ℹ]ktg',
      'Аналізи готовності до пологів',
      'Огляд після пологів',
      "Зв'язок з лікарем між візитами",
    ],
    level2: [
      'УЗД вагітності III триместр',
      'Цервікометрія',
      'Доплерографія + 3D',
      'КТГ плоду × N ⚠️ (уточнити)',
      'Загальний аналіз крові (24 показники)',
      'Загальний аналіз сечі × N ⚠️ (уточнити)',
      'Бак. дослідження на Streptococcus',
      'Консультації акушер-гінеколога × N ⚠️ (уточнити)',
      'Відкриття листа непрацездатності',
      'Після­пологовий огляд (кольпоскопія, мазок, рекомендації)',
      'Онлайн-консультація (15 хв) × 1',
    ],
  },
  {
    id: 'full',
    name: 'Повне ведення',
    price: '39 830 ₴',
    priceTwin: '46 190 ₴',
    isPrimary: true,
    level1: [
      'Все з I, II та III триместру — від постановки до огляду після пологів',
      'Один лікар на весь термін',
      'Пріоритетний запис',
      'Генетичний скринінг (Astraia + «Геном») [ℹ]genetic-screening',
      'УЗД на Voluson E8 [ℹ]voluson',
    ],
    level2: [
      'Повний обсяг I триместру',
      'Повний обсяг II триместру',
      'Повний обсяг III триместру',
      'Пріоритетний запис на зручний час',
      'Один лікар — від першого прийому до огляду після пологів',
    ],
  },
];

const TERM_LABELS: Record<string, string> = {
  astraia: 'Програма Astraia',
  genom: 'Центр «Геном»',
  voluson: 'Апарат Voluson E8',
  cervicometry: 'Цервікометрія',
  dopplerometry: 'Доплерометрія',
  ktg: 'КТГ (кардіотокографія)',
  'genetic-screening': 'Генетичний скринінг',
  'uzd-screening': 'УЗД-скринінг I триместру',
  'qual-category': 'Кваліфікаційна категорія',
  fmf: 'FMF (Fetal Medicine Foundation)',
  isuog: 'ISUOG',
};

const TERM_BODIES: Record<string, string> = {
  astraia: 'Спеціалізована програма для розрахунку ризиків генетичних відхилень. Використовується в провідних клініках Європи. Дає індивідуальний розрахунок ризику на основі даних УЗД та аналізу крові.',
  genom: 'Ліцензований генетичний центр, партнер MED OK. Забезпечує лабораторну частину генетичного скринінгу I триместру.',
  voluson: "Апарат УЗД експертного класу від GE Healthcare. Забезпечує високу деталізацію зображення, включаючи 3D/4D — об'ємну візуалізацію дитини в реальному часі.",
  cervicometry: 'Вимірювання довжини шийки матки на УЗД. Допомагає оцінити ризик передчасних пологів.',
  dopplerometry: 'УЗД-дослідження кровотоку між мамою, плацентою та дитиною. Показує, чи достатньо живлення отримує дитина.',
  ktg: 'Запис серцебиття дитини та скорочень матки. Безболісна процедура, зазвичай з III триместру.',
  'genetic-screening': 'Аналіз крові мами + дані УЗД, які разом дають оцінку ризику хромосомних аномалій у дитини (наприклад, синдром Дауна).',
  'uzd-screening': 'Дослідження на 11–13 тижні вагітності. Оцінює розвиток дитини та визначає ризики хромосомних аномалій.',
  'qual-category': 'Офіційна атестація МОЗ України. Вища категорія підтверджує багаторічний досвід та рівень підготовки лікаря.',
  fmf: 'Fetal Medicine Foundation — міжнародна організація з Лондона, яка розробляє стандарти скринінгу вагітності. Сертифікат FMF означає, що лікар пройшов навчання та щорічну перевірку якості вимірювань.',
  isuog: 'Міжнародне товариство ультразвуку в акушерстві та гінекології. Членство підтверджує дотримання світових стандартів діагностики.',
};

function InfoBtn({ termKey, onInfo }: { termKey: string; onInfo: (k: string) => void }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); onInfo(termKey); }}
      style={{
        background: 'var(--tp)', border: 'none', cursor: 'pointer',
        fontSize: 10, fontWeight: 800, color: 'var(--td)',
        padding: '1px 6px', borderRadius: 20,
        display: 'inline-flex', alignItems: 'center',
        marginLeft: 4, verticalAlign: 'middle', lineHeight: 1.4,
      }}
      title="Що це?"
    >
      ?
    </button>
  );
}

function renderLevel1(text: string, onInfo: (k: string) => void) {
  // Format: "text [ℹ]termKey"
  const match = text.match(/^(.*?)\s*\[ℹ\](\S+)$/);
  if (!match) return <span>{text}</span>;
  return (
    <span>
      {match[1]}
      <InfoBtn termKey={match[2]} onInfo={onInfo} />
    </span>
  );
}

function PackageCard({ pkg, onInfo }: { pkg: PackageItem; onInfo: (k: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: pkg.isPrimary ? 'linear-gradient(160deg,#fff5f7 0%,#fff 60%)' : '#fff',
      border: `1.5px solid ${pkg.isPrimary ? 'var(--c)' : 'var(--g200)'}`,
      borderRadius: 22, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      {pkg.isPrimary && <div style={{ height: 3, background: 'var(--c)', width: '100%' }} />}

      <div style={{ padding: '24px 24px 0' }}>
        {pkg.isPrimary && (
          <span style={{
            display: 'inline-block', marginBottom: 10,
            fontSize: 10, fontWeight: 800, padding: '3px 10px',
            borderRadius: 20, background: 'var(--c)', color: '#fff',
            textTransform: 'uppercase', letterSpacing: '.5px',
          }}>
            Найкраща ціна
          </span>
        )}
        <h3 style={{ fontFamily: 'var(--font)', fontSize: 19, fontWeight: 600, color: 'var(--g900)', marginBottom: 4 }}>
          {pkg.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: pkg.isPrimary ? 'var(--c)' : 'var(--g900)' }}>{pkg.price}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--g400)', marginBottom: 16 }}>двоплідна: {pkg.priceTwin}</div>
      </div>

      {/* Level 1 */}
      <div style={{ padding: '0 24px', flex: 1 }}>
        {pkg.level1.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--g600)', lineHeight: 1.5, marginBottom: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {renderLevel1(item, onInfo)}
          </div>
        ))}
      </div>

      {/* Expandable level 2 */}
      <div style={{ padding: '10px 24px 0' }}>
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 700, color: 'var(--td)',
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 0', fontFamily: 'inherit',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
          {expanded ? 'Сховати склад' : 'Детальний склад'}
        </button>
        {expanded && (
          <div style={{ paddingTop: 8, paddingBottom: 4, borderTop: '1px solid var(--g100)', marginTop: 4 }}>
            {pkg.level2.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 11.5, color: 'var(--g500)', lineHeight: 1.5, marginBottom: 6 }}>
                <span style={{ color: 'var(--g300)', flexShrink: 0 }}>–</span>
                <span style={{ color: item.includes('⚠️') ? '#b45309' : undefined }}>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ padding: '14px 24px 22px', marginTop: 'auto' }}>
        <a href="#quiz" style={{
          display: 'block', textAlign: 'center',
          background: pkg.isPrimary ? 'var(--c)' : 'transparent',
          color: pkg.isPrimary ? '#fff' : 'var(--td)',
          border: `2px solid ${pkg.isPrimary ? 'var(--c)' : 'var(--g200)'}`,
          borderRadius: 9999, padding: '11px 16px',
          fontSize: 13, fontWeight: 700, textDecoration: 'none',
          transition: 'all .2s',
        }}>
          Обрати програму
        </a>
      </div>
    </div>
  );
}

export default function MedokPackages() {
  const [termKey, setTermKey] = useState<string | null>(null);

  return (
    <section id="programs" style={{ padding: '72px 48px' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 12 }}>
            ПРОГРАМИ
          </div>
          <h2 style={{ fontFamily: 'var(--font)', fontSize: 36, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>
            Вартість ведення вагітності
          </h2>
          <p style={{ fontSize: 15, color: 'var(--g500)', marginTop: 10, lineHeight: 1.75, maxWidth: 620 }}>
            Фіксована ціна за весь триместр. Всі консультації та дослідження включені — без несподіваних доплат.
          </p>
        </div>

        <div className="programs-grid">
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onInfo={setTermKey} />
          ))}
        </div>
      </div>

      {/* Bottom Sheet */}
      {termKey && (
        <div onClick={() => setTermKey(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
          zIndex: 400, display: 'flex', alignItems: 'flex-end',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: '20px 20px 0 0',
            padding: '28px 28px 48px', width: '100%',
            maxWidth: 540, margin: '0 auto',
            animation: 'slideUp .25s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--g900)' }}>
                {TERM_LABELS[termKey] ?? termKey}
              </div>
              <button onClick={() => setTermKey(null)} style={{
                background: 'var(--g100)', border: 'none', fontSize: 18,
                cursor: 'pointer', color: 'var(--g500)',
                width: 36, height: 36, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: 'var(--g600)', lineHeight: 1.75 }}>
              {TERM_BODIES[termKey] ?? 'Інформація буде додана.'}
            </p>
          </div>
        </div>
      )}

      <style>{`
        .programs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @keyframes slideUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
        @media(max-width:1024px){ .programs-grid{grid-template-columns:repeat(2,1fr)!important} }
        @media(max-width:600px){ .programs-grid{grid-template-columns:1fr!important} }
        @media(max-width:768px){ #programs{padding:52px 20px!important} }
      `}</style>
    </section>
  );
}
