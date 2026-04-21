'use client';
import { useState } from 'react';
import { CLINIC } from '@/lib/data';

const FAQ_ITEMS = [
  {
    q: 'Що входить у програму ведення вагітності?',
    a: 'Всі планові консультації акушер-гінеколога, УЗД відповідно до триместру, аналізи крові та сечі, скринінги. Лікар контролює ваші показники між прийомами та зв\'яжеться з вами, якщо щось потребує уваги. Точний перелік — в описі кожного триместрового пакету.',
  },
  {
    q: 'Чи можна приєднатися не з першого тижня вагітності?',
    a: 'Так. Приймаємо на будь-якому терміні — і на 5 тижні, і на 30. Якщо частина триместру вже минула, лікар складає план з урахуванням вашої ситуації та наявних обстежень.',
  },
  {
    q: 'Як лікар контролює мої показники між візитами?',
    a: 'Ваш акушер-гінеколог має доступ до ваших ключових даних через медичну систему клініки. Коли ви здаєте аналізи або проходите дослідження, лікар бачить результати і реагує, якщо щось потребує уваги — не чекаючи наступного запланованого прийому.',
  },
  {
    q: 'Чи є програми для двоплідної вагітності?',
    a: 'Так, всі пакети мають окрему ціну для двійні. Ведення двоплідної вагітності передбачає частіші контролі та додаткові параметри при УЗД — це враховано в обсязі.',
  },
  {
    q: 'Чи можна обрати конкретного лікаря?',
    a: 'Так. При записі ви обираєте свого акушер-гінеколога — і саме цей лікар веде вас від першого до останнього прийому. Якщо не знаєте кого обрати — пройдіть коротке опитування, і ми порекомендуємо.',
  },
  {
    q: 'Що якщо потрібні дослідження поза програмою?',
    a: 'Якщо під час ведення вагітності з\'являються додаткові показання, лікар порекомендує необхідні дослідження. Їх вартість не входить у пакет і оплачується окремо. Лікар завжди пояснить, навіщо це потрібно.',
  },
  {
    q: 'Як записатися та що відбувається після запису?',
    a: 'Заповніть коротку форму або зателефонуйте — адміністратор передзвонить і узгодить зручний час. На першому прийомі лікар проводить огляд і складає дорожню карту вагітності з усіма запланованими візитами.',
  },
];

export default function MedokFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ maxWidth: 1140, margin: '0 auto', padding: '72px 48px' }}>
      <div style={{ marginBottom: 44 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 12 }}>FAQ</div>
        <h2 className="h2">
          Часті запитання
        </h2>
        <p style={{ fontSize: 15, color: 'var(--g500)', marginTop: 10 }}>
          Якщо не знайшли відповідь — телефонуйте:{' '}
          <a href={`tel:${CLINIC.phone}`} style={{ color: 'var(--c)', fontWeight: 700, textDecoration: 'none' }}>
            {CLINIC.phoneDisplay}
          </a>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{
              border: `1.5px solid ${isOpen ? 'var(--t)' : 'var(--g200)'}`,
              borderRadius: 14,
              background: isOpen ? 'var(--tp)' : '#fff',
              overflow: 'hidden',
              transition: 'all .22s',
            }}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '17px 20px', background: 'none', border: 'none',
                  cursor: 'pointer', gap: 12, textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: isOpen ? 'var(--td)' : 'var(--g900)', lineHeight: 1.4 }}>
                  {item.q}
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke={isOpen ? 'var(--td)' : 'var(--g400)'}
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .22s' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {isOpen && (
                <div style={{ padding: '0 20px 18px', fontSize: 14, color: 'var(--g600)', lineHeight: 1.75 }}>
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
