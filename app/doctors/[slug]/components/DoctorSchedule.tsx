import type { ScheduleDay } from '@/lib/doctor-schedules';
import { CLINIC } from '@/lib/data';

type DoctorScheduleProps = {
  days: ScheduleDay[];
  doctorFirstName: string;
  /** When provided, renders GEO text in the same container (Task 8) */
  geoText?: string;
};

export default function DoctorSchedule({ days, doctorFirstName, geoText }: DoctorScheduleProps) {
  if (!days || days.length === 0) return null;

  return (
    <section style={{
      background: '#F3F4F6',
      borderTop: '1px solid var(--g200)',
      padding: '96px 48px',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <div style={{
          display: 'flex', gap: 40, alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}>
          {/* Left: heading */}
          <div style={{ flex: '0 0 240px', minWidth: 180 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '2px',
              textTransform: 'uppercase', color: 'var(--td)',
              marginBottom: 10,
            }}>
              Графік прийому
            </div>
            <h2 style={{
              fontFamily: 'var(--font)',
              fontSize: 20, fontWeight: 700,
              color: 'var(--g900)', marginBottom: 6,
              lineHeight: 1.2,
            }}>
              Коли приймає {doctorFirstName}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.5 }}>
              Запис за телефоном або через форму нижче
            </p>
          </div>

          {/* Right: schedule chips */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 10,
              marginBottom: 20,
            }}>
              {days.map(({ day, hours }) => (
                <div
                  key={day}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--g200)',
                    borderRadius: 12,
                    padding: '10px 18px',
                    display: 'flex', flexDirection: 'column', gap: 3,
                    minWidth: 130,
                  }}
                >
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: 'var(--td)',
                  }}>
                    {day}
                  </span>
                  <span style={{
                    fontSize: 15, fontWeight: 500,
                    color: 'var(--g900)',
                    fontFamily: 'var(--font)',
                  }}>
                    {hours}
                  </span>
                </div>
              ))}
            </div>

            {/* GEO text (if combined mode) */}
            {geoText && (
              <p style={{
                fontSize: 13, color: 'var(--g600)', lineHeight: 1.8,
                marginBottom: 20, maxWidth: 680,
              }}>
                {geoText}
              </p>
            )}

            <a
              href={`tel:${CLINIC.phone}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'var(--td)', color: '#fff',
                padding: '12px 24px', borderRadius: 9999,
                fontSize: 13, fontWeight: 700, textDecoration: 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.48 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
              </svg>
              Записатись за телефоном
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          section[data-schedule]{padding:64px 20px!important}
        }
      `}</style>
    </section>
  );
}
