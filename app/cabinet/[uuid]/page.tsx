import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase';
import { DOCTORS, CLINIC, formatPrice } from '@/lib/data';
import { Cabinet } from '@/lib/types';

interface Props {
  params: Promise<{ uuid: string }>;
}

export const dynamic = 'force-dynamic';

async function getCabinet(uuid: string): Promise<Cabinet | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('medok_cabinets')
    .select('*')
    .eq('uuid', uuid)
    .single();
  if (error || !data) return null;
  return data as Cabinet;
}

const STATUS_CONFIG = {
  pending: { label: 'Очікує підтвердження', color: '#b45309', bg: '#fef9c3', dot: '#f59e0b' },
  confirmed: { label: 'Підтверджено', color: '#1a7c75', bg: '#e4f5f3', dot: '#52b2ad' },
  active: { label: 'Активне ведення', color: '#1a7c75', bg: '#e4f5f3', dot: '#22c55e' },
  completed: { label: 'Завершено', color: '#6b7280', bg: '#f3f4f6', dot: '#9ca3af' },
};

const TRIMESTER_STEPS: Record<string, { week: string; name: string }[]> = {
  i: [
    { week: '1–13 тиж', name: 'УЗД + постановка на облік' },
    { week: '11–13 тиж', name: 'Скринінг I триместру + Astraia' },
    { week: '16 тиж', name: 'Консультація акушер-гінеколога' },
  ],
  ii: [
    { week: '18–21 тиж', name: 'УЗД II триместру + цервікометрія' },
    { week: '24 тиж', name: 'Аналізи + консультація' },
    { week: '28 тиж', name: 'КТГ + ЗАК + ЗАС' },
  ],
  iii: [
    { week: '30–34 тиж', name: 'УЗД + доплерометрія' },
    { week: '36 тиж', name: 'КТГ + аналізи' },
    { week: '38–40 тиж', name: 'Підготовка до пологів' },
  ],
  full: [
    { week: '11–13 тиж', name: 'Скринінг I триместру + Astraia' },
    { week: '18–21 тиж', name: 'УЗД II триместру + цервікометрія' },
    { week: '28 тиж', name: 'КТГ + ЗАК + ЗАС' },
    { week: '32 тиж', name: 'УЗД III триместру + доплерометрія' },
    { week: '38–40 тиж', name: 'Підготовка до пологів' },
  ],
};

const WHAT_TO_BRING = [
  'Паспорт або ID-картка',
  'Обмінна карта (якщо є)',
  'Результати попередніх аналізів',
  'Направлення від лікаря (якщо є)',
  'Страховий поліс (якщо є)',
];

export default async function CabinetPage({ params }: Props) {
  const { uuid } = await params;
  const cabinet = await getCabinet(uuid);
  if (!cabinet) notFound();

  const status = STATUS_CONFIG[cabinet.appointment_status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
  const doctor = cabinet.doctor_id ? DOCTORS.find((d) => d.id === cabinet.doctor_id) : null;
  const steps = cabinet.trimester ? TRIMESTER_STEPS[cabinet.trimester] ?? [] : [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--g50)', fontFamily: 'var(--font)' }}>
      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid var(--g200)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font)', fontSize: 17, fontWeight: 700, color: 'var(--g900)' }}>
            МЦ MED OK
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: 'var(--td)', background: 'var(--tp)', borderRadius: 20, padding: '4px 12px' }}>
            <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
            CAREWAY
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 48px' }}>
        {/* Header card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px 24px 20px', border: '1.5px solid var(--g200)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.8px', textTransform: 'uppercase', color: 'var(--td)' }}>
              Кабінет пацієнтки
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: status.bg, color: status.color,
              fontSize: 11, fontWeight: 800, padding: '5px 12px', borderRadius: 20,
            }}>
              <span style={{ width: 6, height: 6, background: status.dot, borderRadius: '50%', display: 'inline-block' }} />
              {status.label}
            </div>
          </div>

          <h1 style={{ fontFamily: 'var(--font)', fontSize: 24, fontWeight: 700, color: 'var(--g900)', marginBottom: 4, lineHeight: 1.25 }}>
            {cabinet.patient_name}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--g400)', marginBottom: 0 }}>
            {cabinet.patient_phone}
            {cabinet.trimester && (
              <> · <span style={{ color: 'var(--td)', fontWeight: 700 }}>
                {cabinet.trimester === 'i' ? 'I триместр' :
                 cabinet.trimester === 'ii' ? 'II триместр' :
                 cabinet.trimester === 'iii' ? 'III триместр' : 'Повне ведення'}
              </span></>
            )}
          </p>
        </div>

        {/* Appointment status */}
        {cabinet.appointment_status === 'pending' && (
          <div style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', borderRadius: 14, padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e', marginBottom: 3 }}>Очікуємо підтвердження</div>
              <div style={{ fontSize: 12, color: '#b45309', lineHeight: 1.5 }}>
                Адміністратор зателефонує вам протягом 2 годин у робочий час та узгодить зручний час прийому.
              </div>
            </div>
          </div>
        )}

        {/* Roadmap */}
        {steps.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', border: '1.5px solid var(--g200)', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 14 }}>
              Дорожня карта
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: i === 0 ? 'var(--cl)' : 'var(--g50)',
                    border: `1.5px solid ${i === 0 ? 'var(--c)' : 'var(--g200)'}`,
                    borderRadius: 10, padding: '10px 14px',
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 800, color: i === 0 ? 'var(--cd)' : 'var(--g400)', width: 52, flexShrink: 0 }}>
                    {step.week}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: i === 0 ? 700 : 600, color: 'var(--g700)', flex: 1 }}>
                    {step.name}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 10,
                    background: i === 0 ? 'var(--c)' : 'var(--g200)',
                    color: i === 0 ? '#fff' : 'var(--g500)',
                    whiteSpace: 'nowrap',
                  }}>
                    {i === 0 ? 'Наступний' : 'Заплановано'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctor card */}
        {doctor && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', border: '1.5px solid var(--g200)', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 14 }}>
              Ваш лікар
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                background: doctor.avatar_color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, color: '#fff',
                fontFamily: 'var(--font)',
              }}>
                {doctor.avatar_initials}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--g900)', marginBottom: 3 }}>{doctor.name}</div>
                <div style={{ fontSize: 12, color: 'var(--t)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px' }}>
                  {doctor.role}
                </div>
                <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                  {doctor.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                      background: tag.includes('FMF') ? 'rgba(214,2,66,.1)' : 'var(--g100)',
                      color: tag.includes('FMF') ? 'var(--cd)' : 'var(--g600)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* What to bring */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', border: '1.5px solid var(--g200)', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 14 }}>
            Що взяти на перший прийом
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {WHAT_TO_BRING.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--g600)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ background: 'linear-gradient(150deg,var(--g900) 0%,#1f2937 100%)', borderRadius: 20, padding: '20px 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 12 }}>
            Клініка
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{CLINIC.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 16, lineHeight: 1.5 }}>
            {CLINIC.address}<br />
            {CLINIC.workHours}
          </div>
          <a
            href={`tel:${CLINIC.phone}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--c)', color: '#fff', padding: '11px 20px',
              borderRadius: 9999, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 5.5 5.5l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
            </svg>
            {CLINIC.phoneDisplay}
          </a>
        </div>
      </main>
    </div>
  );
}
