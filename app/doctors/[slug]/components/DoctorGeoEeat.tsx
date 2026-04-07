/**
 * DoctorGeoEeat — static server component (no JS).
 * Renders per-doctor GEO text + E-E-A-T block.
 * Placement: after DoctorSchedule, before footer CTA.
 */

type DoctorGeoEeatProps = {
  geoText: string;
  reviewerName: string;
  reviewerTitle: string;
  sources: string[];
  doctorName: string;
};

export default function DoctorGeoEeat({
  geoText,
  reviewerName,
  reviewerTitle,
  sources,
  doctorName,
}: DoctorGeoEeatProps) {
  return (
    <>
      {/* GEO block */}
      <section
        style={{
          background: '#F3F4F6',
          borderTop: '1px solid var(--g200)',
          padding: '48px 48px 40px',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{
            fontSize: 14,
            color: 'var(--g600)',
            lineHeight: 1.8,
          }}>
            {geoText}
          </p>
        </div>

        <style>{`
          @media(max-width:768px){
            section[data-doctor-geo]{ padding: 36px 20px 32px !important }
          }
        `}</style>
      </section>

      {/* E-E-A-T block */}
      <section
        style={{
          background: '#fff',
          borderTop: '1px solid var(--g100)',
          padding: '28px 48px',
        }}
      >
        <div style={{
          maxWidth: 860, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', gap: '16px 48px',
          alignItems: 'flex-start',
        }}>
          {/* Author */}
          <div style={{ minWidth: 160 }}>
            <div style={{
              fontSize: 9, fontWeight: 800, letterSpacing: '1.8px',
              textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 5,
            }}>
              Автор
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--g700)' }}>
              Ігор Растрепін
            </div>
            <div style={{ fontSize: 11, color: 'var(--g500)', marginTop: 2 }}>
              медичний редактор check-up.in.ua
            </div>
          </div>

          {/* Reviewer */}
          <div style={{ minWidth: 220, flex: 1 }}>
            <div style={{
              fontSize: 9, fontWeight: 800, letterSpacing: '1.8px',
              textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 5,
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
              textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 5,
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
              textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 5,
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
            section[data-doctor-eeat]{ padding: 24px 20px !important }
            section[data-doctor-eeat] > div{
              flex-direction: column !important;
              gap: 16px !important;
            }
            section[data-doctor-eeat] > div > div{
              min-width: unset !important;
              width: 100% !important;
              flex: unset !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}
