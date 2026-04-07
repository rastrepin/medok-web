/**
 * GEO-block — static server component, no JS.
 * Source: content/medok/index.md
 * Placement: after FAQ, before E-E-A-T and Footer.
 * Must remain static HTML — NOT in JS tabs or accordion.
 */
export default function MedokGeoBlock() {
  return (
    <section
      id="geo"
      style={{
        background: '#F3F4F6',
        borderTop: '1px solid var(--g200)',
        padding: '64px 48px 56px',
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font)',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--g900)',
            marginBottom: 16,
            lineHeight: 1.25,
          }}
        >
          Ведення вагітності у Вінниці — МЦ MED OK, від 9&nbsp;970&nbsp;₴
        </h2>
        <p
          style={{
            fontSize: 14,
            color: 'var(--g600)',
            lineHeight: 1.8,
            maxWidth: 820,
          }}
        >
          МЦ MED OK приймає пацієнтів у Вінниці з 2017 року; напрямок пренатальної
          діагностики та ведення вагітності відкрито у 2023 році на філії Поділля
          (вул. Зодчих, 20). Пакети «Довіра» охоплюють I, II та III триместр —
          вартість від 9&nbsp;970&nbsp;₴ за триместр до 39&nbsp;830&nbsp;₴ за повне ведення
          (одноплідна вагітність). УЗД-скринінги проводить Бондарчук Жанна
          Геннадіївна — сертифікований спеціаліст FMF (Fetal Medicine Foundation,
          Лондон), член ISUOG (International Society of Ultrasound in Obstetrics and
          Gynecology), апарат Voluson E8 з 3D/4D. Акушери-гінекологи: Янюк Ольга
          Олександрівна, Кельман Вікторія Володимирівна (аспірантка, член FMF),
          Трофімчук Тетяна Ігорівна. Приймають пацієнток з Вінниці та міст
          Вінницької області. Онлайн-консультація доступна. Вул. Зодчих, 20,
          Вінниця · +38&nbsp;(043)&nbsp;265-99-77.
        </p>
      </div>

      <style>{`
        @media(max-width:768px){
          section#geo{ padding: 44px 20px 36px !important }
          section#geo h2{ font-size: 18px !important }
        }
      `}</style>
    </section>
  );
}
