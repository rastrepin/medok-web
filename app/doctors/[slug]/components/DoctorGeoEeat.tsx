/**
 * DoctorGeoEeat — E-E-A-T block only.
 * GEO text is now rendered inside DoctorSchedule (combined container, Task 8).
 * Placement: after DoctorSchedule, before footer CTA.
 */

type DoctorGeoEeatProps = {
  reviewerName: string;
  reviewerTitle: string;
  sources: string[];
};

export default function DoctorGeoEeat({
  reviewerName,
  reviewerTitle,
  sources,
}: DoctorGeoEeatProps) {
  return (
    <section
      style={{
        background: '#fff',
        borderTop: '1px solid var(--g100)',
        padding: '24px 48px',
      }}
    >
      <div style={{
        maxWidth: 1140, margin: '0 auto',
        display: 'flex', flexWrap: 'wrap', gap: '12px 48px',
        alignItems: 'flex-start',
      }}>
        {/* Author */}
        <div style={{ minWidth: 160 }}>
          <div style={{
            fontSize: 9, fontWeight: 800, letterSpacing: '1.8px',
            textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 4,
          }}>
            Автор
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--g700)' }}>
            Ігор Растрепін
          </div>
          <div style={{ fontSize: 11, color: 'var(--g500)', marginTop: 2 }}>
            засновник check-up.in.ua
          </div>
        </div>

        {/* Reviewer */}
        <div style={{ minWidth: 220, flex: 1 }}>
          <div style={{
            fontSize: 9, fontWeight: 800, letterSpacing: '1.8px',
            textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 4,
          }}>
            Рецензент
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--g700)' }}>
            {reviewerName}
          </div>
          <div style={{ fontSize: 11, color: 'var(--g500)', marginTop: 2 }}>
            {reviewerTitle}
          </div>
        </div>

        {/* Updated */}
        <div style={{ minWidth: 120 }}>
          <div style={{
            fontSize: 9, fontWeight: 800, letterSpacing: '1.8px',
            textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 4,
          }}>
            Оновлено
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--g600)' }}>
            Квітень 2026
          </div>
        </div>

        {/* Sources */}
        <div style={{ minWidth: 180 }}>
          <div style={{
            fontSize: 9, fontWeight: 800, letterSpacing: '1.8px',
            textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 4,
          }}>
            Джерела
          </div>
          {sources.map((s) => (
            <div key={s} style={{
              fontSize: 11, color: 'var(--g500)', lineHeight: 1.6,
            }}>
              {s}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          section[data-eeat]{padding:20px!important}
          section[data-eeat] > div{flex-direction:column!important;gap:14px!important}
          section[data-eeat] > div > div{min-width:unset!important;flex:unset!important;width:100%!important}
        }
      `}</style>
    </section>
  );
}
