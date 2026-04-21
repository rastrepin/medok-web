type CaseType = 'pregnancy' | 'ultrasound';

const CASE_INFO: Record<CaseType, { title: string; desc: string; href: string; icon: string }> = {
  pregnancy: {
    title: 'Ведення вагітності',
    desc: 'Пакетне ведення від I до III триместру. Консультації, аналізи, УЗД — фіксована ціна.',
    href: '/#programs',
    icon: '🤱',
  },
  ultrasound: {
    title: 'Планове УЗД',
    desc: 'Скринінгове УЗД I, II, III триместру на апараті Voluson E8. FMF-протокол.',
    href: '/#programs',
    icon: '🔬',
  },
};

type DoctorCasesProps = {
  doctorType: string;
  caseTypes: CaseType[];
};

export default function DoctorCases({ caseTypes }: DoctorCasesProps) {
  if (caseTypes.length === 0) return null;

  return (
    <section style={{ background: 'var(--g50)', padding: '96px 48px' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '2.2px',
          textTransform: 'uppercase', color: 'var(--td)', marginBottom: 14,
        }}>
          НАПРЯМИ РОБОТИ
        </div>
        <h2 className="h2" style={{ marginBottom: 28 }}>
          Як цей лікар може допомогти
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${caseTypes.length}, 1fr)`,
          gap: 16,
        }} className="cases-grid">
          {caseTypes.map((type) => {
            const info = CASE_INFO[type];
            if (!info) return null;
            return (
              <a
                key={type}
                href={info.href}
                style={{
                  display: 'block', textDecoration: 'none',
                  background: '#fff', border: '1.5px solid var(--g200)',
                  borderRadius: 18, padding: '24px 22px',
                  transition: 'border-color .2s, box-shadow .2s',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 14 }}>{info.icon}</div>
                <div style={{
                  fontSize: 15, fontWeight: 700, color: 'var(--g900)',
                  marginBottom: 8,
                }}>
                  {info.title}
                </div>
                <p style={{
                  fontSize: 13, color: 'var(--g500)', lineHeight: 1.7,
                  margin: 0,
                }}>
                  {info.desc}
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  marginTop: 16, fontSize: 13, fontWeight: 700,
                  color: 'var(--td)',
                }}>
                  Переглянути програми
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .cases-grid{grid-template-columns:1fr!important}
          section[style*="var(--g50)"]{padding:64px 20px!important}
        }
      `}</style>
    </section>
  );
}
