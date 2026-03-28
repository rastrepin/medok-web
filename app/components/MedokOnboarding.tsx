const STEPS = [
  {
    n: 1,
    color: 'var(--td)',
    title: 'Запис',
    desc: 'Залишаєте заявку або телефонуєте. Адміністратор передзвонить і узгодить зручний час для першого прийому.',
  },
  {
    n: 2,
    color: 'var(--t)',
    title: 'Перший прийом',
    desc: 'Лікар проводить огляд, оформлює карту, призначає базові дослідження. Ви разом обираєте формат — окремий триместр або повне ведення. Вартість фіксована і відома одразу.',
  },
  {
    n: 3,
    color: 'var(--c)',
    title: 'Дорожня карта вагітності',
    desc: 'Після першого прийому ви знаєте план: які дослідження, на яких тижнях, скільки візитів. Все заплановано наперед — не потрібно щоразу з\'ясовувати що далі.',
  },
  {
    n: 4,
    color: '#7c3aed',
    title: 'Контроль між візитами',
    desc: 'Ваш лікар контролює ваші показники між прийомами через медичну систему клініки. Отримали аналізи — передаєте через кабінет. Лікар перевірить і зв\'яжеться, якщо потрібна увага.',
  },
];

const ROADMAP = [
  { week: '11–13 тиж', name: 'Скринінг I триместру + УЗД', status: 'done' },
  { week: '16 тиж', name: 'Консультація акушер-гінеколога', status: 'done' },
  { week: 'I тим.', name: 'Огляд терапевта + ЕКГ, УЗД залоз', status: 'done' },
  { week: '18–21 тиж', name: 'УЗД II триместру + цервікометрія', status: 'next' },
  { week: '24 тиж', name: 'Аналізи + консультація', status: 'plan' },
  { week: '28 тиж', name: 'КТГ + ЗАК + ЗАС', status: 'plan' },
  { week: 'III тим.', name: 'УЗД + доплер, КТГ, консультації', status: 'plan' },
];

export default function MedokOnboarding() {
  return (
    <section id="onboarding" style={{ maxWidth: 1140, margin: '0 auto', padding: '72px 48px' }}>
      <div style={{ marginBottom: 44 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 12 }}>ЯК ЦЕ ПРАЦЮЄ</div>
        <h2 style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 36, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>
          Що відбувається після запису
        </h2>
        <p style={{ fontSize: 15, color: 'var(--g500)', marginTop: 10, lineHeight: 1.75 }}>
          Від першого дзвінка до кабінету з дорожньою картою — чотири кроки
        </p>
        <p style={{ fontSize: 12, color: 'var(--g400)', marginTop: 6, fontStyle: 'italic' }}>
          Приклад дорожньої карти → Ваша карта складається індивідуально на першому прийомі
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
        {/* Steps */}
        <div>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', gap: 18, paddingBottom: i < STEPS.length - 1 ? 28 : 0, position: 'relative' }}>
              {i < STEPS.length - 1 && (
                <div style={{ position: 'absolute', left: 19, top: 44, bottom: 0, width: 2, background: 'var(--g200)' }} />
              )}
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: s.color, color: '#fff', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                {s.n}
              </div>
              <div style={{ paddingTop: 8 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--g900)', marginBottom: 5 }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cabinet preview */}
        <div style={{ background: 'var(--g50)', border: '1.5px solid var(--g200)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ background: 'var(--td)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--tl)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Кабінет пацієнтки · CAREWAY</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', marginTop: 1 }}>Дорожня карта вагітності</div>
            </div>
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 10 }}>
              Мої візити
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {ROADMAP.map((item) => {
                const styles = {
                  done: { border: '1.5px solid var(--tl)', bg: 'var(--tp)', weekColor: 'var(--td)', badgeBg: 'var(--tp)', badgeColor: 'var(--td)', badgeLabel: 'Виконано' },
                  next: { border: '1.5px solid var(--c)', bg: 'var(--cl)', weekColor: 'var(--cd)', badgeBg: 'var(--c)', badgeColor: '#fff', badgeLabel: 'Наступний' },
                  plan: { border: '1.5px solid var(--g200)', bg: '#fff', weekColor: 'var(--g400)', badgeBg: 'var(--g100)', badgeColor: 'var(--g500)', badgeLabel: 'Заплановано' },
                } as const;
                const st = styles[item.status as keyof typeof styles];
                return (
                  <div key={item.week} style={{ display: 'flex', alignItems: 'center', gap: 10, background: st.bg, border: st.border, borderRadius: 10, padding: '10px 12px' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: st.weekColor, width: 48, flexShrink: 0 }}>{item.week}</span>
                    <span style={{ fontSize: 12, fontWeight: item.status === 'next' ? 700 : 600, color: 'var(--g700)', flex: 1 }}>{item.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 10, background: st.badgeBg, color: st.badgeColor, whiteSpace: 'nowrap' }}>{st.badgeLabel}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ background: '#fff', border: '1.5px solid var(--c)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--c)', marginBottom: 4 }}>Найближчий візит</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--g900)' }}>УЗД II триместру — 18–21 тиждень</div>
              <div style={{ fontSize: 11, color: 'var(--g400)', marginTop: 2 }}>Бондарчук Жанна · Voluson E8 · вул. Зодчих 20</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          #onboarding{padding:52px 20px!important}
          #onboarding > div:last-child{grid-template-columns:1fr!important;gap:32px!important}
        }
      `}</style>
    </section>
  );
}
