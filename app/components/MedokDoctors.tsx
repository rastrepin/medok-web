import { DOCTORS, CLINIC } from '@/lib/data';
import { Doctor } from '@/lib/types';

function DoctorActivity({ doc }: { doc: Doctor }) {
  if (doc.doctor_type !== 'obstetrician') return null;
  if (!doc.last_active_at) return null;

  const daysAgo = Math.floor(
    (Date.now() - new Date(doc.last_active_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysAgo > 7) return null;

  const actLabel = daysAgo === 0 ? 'сьогодні' : daysAgo === 1 ? 'вчора' : `${daysAgo} дні тому`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--g400)', background: 'var(--g50)', borderRadius: 8, padding: '6px 10px', marginBottom: 10 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0, display: 'inline-block' }} />
      <span style={{ fontWeight: 600 }}>Веде прийом</span>
      <span>·</span>
      <span>Активний {actLabel}</span>
      {doc.patients_count && doc.patients_count > 0 ? (
        <>
          <span>·</span>
          <span>{doc.patients_count} пацієнток</span>
        </>
      ) : null}
    </div>
  );
}

export default function MedokDoctors() {
  const obDoctors = DOCTORS.filter((d) => d.doctor_type === 'obstetrician');
  const uzdDoctor = DOCTORS.find((d) => d.doctor_type === 'ultrasound');

  return (
    <section style={{ background: 'var(--g50)', borderTop: '1px solid var(--g100)', borderBottom: '1px solid var(--g100)' }}>
      <div id="doctors" style={{ maxWidth: 1140, margin: '0 auto', padding: '72px 48px' }}>
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 12 }}>Команда</div>
          <h2 style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 36, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>
            Лікарі, які ведуть вагітність
          </h2>
          <p style={{ fontSize: 15, color: 'var(--g500)', marginTop: 10, lineHeight: 1.75 }}>
            Акушер-гінекологи з реальною міжнародною підготовкою
          </p>
        </div>

        {/* Obstetricians */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 28 }}>
          {obDoctors.map((doc) => (
            <div
              key={doc.id}
              style={{ background: '#fff', border: '1.5px solid var(--g200)', borderRadius: 20, padding: '24px 18px', transition: 'all .25s', cursor: 'pointer' }}
            >
              <div style={{ width: 60, height: 60, borderRadius: 14, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 20, fontWeight: 600, color: '#fff', background: doc.avatar_color }}>
                {doc.avatar_initials}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--g900)', textAlign: 'center', marginBottom: 3, lineHeight: 1.35 }}>
                {doc.name}
              </div>
              <div style={{ fontSize: 10, color: 'var(--t)', fontWeight: 700, textAlign: 'center', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                {doc.role}
              </div>

              <DoctorActivity doc={doc} />

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', marginBottom: 12 }}>
                {doc.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: 10, fontWeight: 700, background: tag.includes('FMF') ? 'rgba(214,2,66,.1)' : 'var(--g100)', color: tag.includes('FMF') ? 'var(--cd)' : 'var(--g600)', padding: '3px 8px', borderRadius: 10 }}>
                    {tag}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'var(--g500)', lineHeight: 1.55, marginBottom: 14, textAlign: 'center' }}>
                {doc.bio}
              </p>
              <a
                href={`tel:${CLINIC.phone}`}
                style={{ display: 'block', textAlign: 'center', padding: '9px', background: 'var(--cl)', color: 'var(--c)', borderRadius: 9999, fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'all .2s' }}
              >
                Записатись
              </a>
            </div>
          ))}
        </div>

        {/* UZD specialist */}
        {uzdDoctor && (
          <div style={{ background: 'linear-gradient(150deg,var(--tp) 0%,#fff 60%)', border: '1.5px solid var(--tl)', borderRadius: 20, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 22, fontWeight: 600, color: '#fff', background: uzdDoctor.avatar_color, flexShrink: 0 }}>
              {uzdDoctor.avatar_initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--td)', marginBottom: 4 }}>Діагностика · Voluson E8</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--g900)', marginBottom: 4 }}>{uzdDoctor.name}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {uzdDoctor.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: 10, fontWeight: 700, background: tag.includes('FMF') ? 'rgba(214,2,66,.1)' : 'var(--tp)', color: tag.includes('FMF') ? 'var(--cd)' : 'var(--td)', padding: '3px 8px', borderRadius: 10 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.6, maxWidth: 360 }}>
              {uzdDoctor.bio}
            </p>
            <a href={`tel:${CLINIC.phone}`} style={{ flexShrink: 0, background: 'var(--td)', color: '#fff', padding: '10px 22px', borderRadius: 9999, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              Записатись
            </a>
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:1024px){
          #doctors > div:nth-child(2){grid-template-columns:repeat(2,1fr)!important}
        }
        @media(max-width:768px){
          #doctors{padding:52px 20px!important}
          #doctors > div:nth-child(2){grid-template-columns:1fr 1fr!important;gap:12px!important}
          #doctors > div:nth-child(3){flex-direction:column!important;gap:16px!important}
        }
        @media(max-width:480px){
          #doctors > div:nth-child(2){grid-template-columns:1fr!important}
        }
      `}</style>
    </section>
  );
}
