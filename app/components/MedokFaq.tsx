'use client';
import { useState } from 'react';
import { CLINIC } from '@/lib/data';

const FAQ_ITEMS = [
  {
    q: 'Що входить у пакет «Довіра»?',
    a: 'Пакет включає всі планові консультації акушер-гінеколога, УЗД відповідно до триместру, контроль аналізів через CAREWAY App між прийомами та зв\'язок з лікарем без черг. Точний перелік послуг — в описі кожного триместрового пакету.',
  },
  {
    q: 'Чи можна приєднатися не з першого тижня вагітності?',
    a: 'Так. Ми приймаємо пацієнток на будь-якому терміні — і на 5 тижні, і на 20. Якщо частина триместру вже минула, лікар складає індивідуальний план з урахуванням вашої поточної ситуації та наявних обстежень.',
  },
  {
    q: 'Як працює CAREWAY App між прийомами?',
    a: 'Після першого прийому ви отримуєте доступ до особистого кабінету. Туди надходять результати аналізів, ви бачите дорожню карту запланованих візитів і можете надіслати питання лікарю. Лікар перевіряє показники і повідомляє, якщо потрібна увага — без черги та очікування.',
  },
  {
    q: 'Що означає «лікар вищої кваліфікаційної категорії» і чи варто доплачувати?',
    a: 'Це офіційна атестаційна категорія МОЗ України — підтверджений досвід та рівень підготовки. Доплата +650 грн за триместр, якщо ви обираєте конкретного спеціаліста з цією категорією. Якщо для вас важливіша послідовність ведення одним лікарем — це вже включено в базовий пакет.',
  },
  {
    q: 'Чи є можливість двоплідної вагітності?',
    a: 'Так, всі пакети мають окрему ціну для двоплідної вагітності. Ведення двійні потребує частіших контролів та додаткових параметрів при УЗД — це враховано в обсязі пакету.',
  },
  {
    q: 'Як записатися та що відбувається після запису?',
    a: 'Заповніть коротку форму або зателефонуйте — адміністратор передзвонить і узгодить зручний час. На першому прийомі лікар проводить огляд і формує дорожню карту вагітності. Після цього ви отримуєте доступ до кабінету CAREWAY з усіма запланованими візитами.',
  },
];

export default function MedokFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ maxWidth: 1140, margin: '0 auto', padding: '72px 48px' }}>
      <div style={{ marginBottom: 44 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 12 }}>FAQ</div>
        <h2 style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 36, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>
          Часті запитання
        </h2>
        <p style={{ fontSize: 15, color: 'var(--g500)', marginTop: 10 }}>Якщо не знайшли відповідь — телефонуйте: <a href={`tel:${CLINIC.phone}`} style={{ color: 'var(--c)', fontWeight: 700, textDecoration: 'none' }}>{CLINIC.phoneDisplay}</a></p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              style={{
                border: `1.5px solid ${isOpen ? 'var(--t)' : 'var(--g200)'}`,
                borderRadius: 14,
                background: isOpen ? 'var(--tp)' : '#fff',
                overflow: 'hidden',
                transition: 'all .22s',
              }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '17px 20px', background: 'none', border: 'none', cursor: 'pointer', gap: 12,
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: isOpen ? 'var(--td)' : 'var(--g900)', lineHeight: 1.4 }}>
                  {item.q}
                </span>
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke={isOpen ? 'var(--td)' : 'var(--g400)'}
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .22s' }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {isOpen && (
                <div style={{ padding: '0 20px 18px', fontSize: 14, color: 'var(--g600)', lineHeight: 1.7 }}>
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @media(max-width:768px){
          #faq{padding:52px 20px!important}
        }
      `}</style>
    </section>
  );
}
