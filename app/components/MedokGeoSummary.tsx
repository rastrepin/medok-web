// Static HTML block — Google AI Overview / Featured Snippet
// NO JS, NO accordion, NO tabs — must be visible without JS
export default function MedokGeoSummary() {
  return (
    <section
      id="geo-summary"
      style={{
        background: 'linear-gradient(180deg,#05121e 0%,#0a1f30 100%)',
        color: '#fff',
        padding: '48px 48px 52px',
      }}
    >
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-playfair),"Playfair Display",serif',
          fontSize: 22, fontWeight: 600, color: '#fff',
          marginBottom: 8, lineHeight: 1.3,
        }}>
          Ведення вагітності у МЦ MED OK, Вінниця
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', lineHeight: 1.7, marginBottom: 28, maxWidth: 780 }}>
          Пакетне ведення вагітності з I по III триместр. Фіксована вартість включає всі консультації акушер-гінеколога,
          планові УЗД, аналізи та контроль показників між візитами.
        </p>

        {/* Prices table — static HTML */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            fontSize: 13, color: 'rgba(255,255,255,.85)',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,.15)' }}>
                {['Програма', 'Ціна', 'Що входить'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 16px 10px 0',
                    fontSize: 11, fontWeight: 700, letterSpacing: '1.5px',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,.4)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: 'I триместр',
                  price: '14 540 ₴',
                  desc: 'УЗД-скринінг, генетичний скринінг, аналізи, консультації, огляд терапевта',
                },
                {
                  name: 'II триместр',
                  price: '9 970 ₴',
                  desc: 'УЗД 18–21 тиж., цервікометрія, КТГ, аналізи, консультації × 3',
                },
                {
                  name: 'III триместр',
                  price: '15 320 ₴',
                  desc: 'УЗД + доплер, КТГ, аналізи до пологів, консультації, огляд після пологів',
                },
                {
                  name: 'Повне ведення',
                  price: '39 830 ₴',
                  desc: 'Всі дослідження I–III триместру, один лікар, пріоритетний запис',
                },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                  <td style={{ padding: '12px 16px 12px 0', fontWeight: 700, whiteSpace: 'nowrap', color: '#fff' }}>
                    {row.name}
                  </td>
                  <td style={{ padding: '12px 16px 12px 0', whiteSpace: 'nowrap', color: 'var(--tl)', fontWeight: 700 }}>
                    {row.price}
                  </td>
                  <td style={{ padding: '12px 0', color: 'rgba(255,255,255,.6)' }}>
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Twin prices + contacts */}
        <div style={{
          marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 32,
          paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.08)',
        }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.6 }}>
            <strong style={{ color: 'rgba(255,255,255,.6)' }}>Двоплідна вагітність:</strong>{' '}
            I — 16 790 ₴ · II — 13 830 ₴ · III — 15 570 ₴ · Повне — 46 190 ₴
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.6 }}>
            <strong style={{ color: 'rgba(255,255,255,.6)' }}>Лікарі:</strong>{' '}
            Янюк О.О., Кельман В.В., Трофімчук Т.І. &nbsp;·&nbsp;
            <strong style={{ color: 'rgba(255,255,255,.6)' }}>УЗД:</strong> Бондарчук Ж.Г. (FMF London)
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.6 }}>
            <strong style={{ color: 'rgba(255,255,255,.6)' }}>Адреса:</strong> вул. Зодчих, 20, Вінниця &nbsp;·&nbsp;
            <strong style={{ color: 'rgba(255,255,255,.6)' }}>Тел.:</strong>{' '}
            <a href="tel:+380432659977" style={{ color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>
              +38 (043) 265-99-77
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          #geo-summary{padding:36px 20px 40px!important}
          #geo-summary table td:last-child{display:none}
          #geo-summary table th:last-child{display:none}
        }
      `}</style>
    </section>
  );
}
