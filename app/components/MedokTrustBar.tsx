const TRUST_ITEMS = [
  'Тільки з позиції доказової медицини',
  'Спираємося на актуальні міжнародні стандарти',
  'Оплата послуг в медичному закладі. Ціни перевірено.',
];

export default function MedokTrustBar() {
  return (
    <div style={{
      background: '#0a1f30',
      borderTop: '1px solid rgba(255,255,255,.07)',
      borderBottom: '1px solid rgba(255,255,255,.07)',
      padding: '16px 48px',
    }}>
      <div style={{
        maxWidth: 1140, margin: '0 auto',
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'center', gap: '10px 36px',
      }}>
        {TRUST_ITEMS.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12, color: 'rgba(255,255,255,.5)',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--t)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {item}
          </div>
        ))}
      </div>

      <style>{`
        @media(max-width:768px){
          div[style*="0a1f30"]{padding:12px 20px!important}
        }
      `}</style>
    </div>
  );
}
