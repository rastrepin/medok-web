import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchEnrichedCabinet } from '@/lib/cabinet-query';
import { CLINIC } from '@/lib/data';
import PreconsultationAccordion from './PreconsultationAccordion';
import AddToHomeScreenHint from './AddToHomeScreenHint';
import {
  formatKyivAppointment,
  formatPreferredDay,
  formatUAH,
  getCallbackEta,
  pregnancyTypeLabel,
  programPrice,
  telHref,
  trimesterLabel,
} from './helpers';

export const metadata: Metadata = {
  title: 'Ваш запис — МЦ MED OK',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ uuid: string }>;
}

export default async function OnboardingPage({ params }: Props) {
  const { uuid } = await params;
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(uuid)) notFound();

  const result = await fetchEnrichedCabinet({ uuid });
  if (!result) notFound();

  const { cabinet } = result;
  const isConfirmed = cabinet.status === 'confirmed' || cabinet.status === 'active' || cabinet.status === 'completed';

  return (
    <main style={{ minHeight: '100vh', background: 'var(--gray-50, #F9FAFB)' }}>
      {isConfirmed ? <HeroConfirmed cabinet={cabinet} /> : <HeroPending cabinet={cabinet} />}

      <div style={container}>
        {/* PWA banner — hide after confirmation (spec 2.1 end) */}
        {!isConfirmed && (
          <div style={{ margin: '0 0 24px' }}>
            <AddToHomeScreenHint />
          </div>
        )}

        <RequestSummary cabinet={cabinet} isConfirmed={isConfirmed} />

        <SectionTitle eyebrow="ДОДАТКОВО · 2 ХВ" title="Анкета для лікаря">
          <span style={{ color: 'var(--gray-500, #6B7280)', fontSize: 14 }}>Можна заповнити зараз або після дзвінка адміністратора</span>
        </SectionTitle>
        <PreconsultationAccordion uuid={cabinet.uuid} initial={cabinet.preconsultation} />

        <SectionTitle eyebrow="НА ПРИЙОМ" title="Що взяти з собою" />
        <WhatToBring />

        <SectionTitle eyebrow="ДОКУМЕНТИ · СКОРО" title="Аналізи та УЗД">
          <span style={{ color: 'var(--gray-500, #6B7280)', fontSize: 14 }}>Завантаження буде доступне після оформлення програми</span>
        </SectionTitle>
        <DocumentsStub />

        <SectionTitle eyebrow="АДРЕСА · ФІЛІЯ ПОДІЛЛЯ" title="Як дістатися" />
        <DirectionsCard />

        {cabinet.program && (
          <>
            <SectionTitle eyebrow="ВАША ПРОГРАМА" title={cabinet.program.name} />
            <ProgramCard program={cabinet.program} pregnancyType={cabinet.pregnancy_type} />
          </>
        )}

        <SectionTitle eyebrow="КОЛИ ДЗВОНИТИ ОДРАЗУ" title="Тривожні симптоми" isAlert />
        <AlertBlock />
      </div>

      <div style={{ height: 40 }} />
    </main>
  );
}

/* ──────────────────────────────────  HERO  ──────────────────────────────── */

function HeroPending({ cabinet }: { cabinet: NonNullable<Awaited<ReturnType<typeof fetchEnrichedCabinet>>>['cabinet'] }) {
  const name = cabinet.patient_name?.split(' ')[0] ?? 'Дорога пацієнтко';
  const eta = getCallbackEta(cabinet.created_at);
  return (
    <header style={{ ...hero, background: 'var(--mint-tint, #E8F5F1)' }}>
      <div style={{ ...heroInner }}>
        <div className="eyebrow" style={{ color: 'var(--teal-dark, #1a7c75)' }}>ВАША ЗАЯВКА · MED OK</div>
        <h1 className="h1" style={{ margin: '8px 0 0' }}>
          Дякуємо, {name}
          <br />
          <span className="h1-accent">Очікуємо підтвердження</span>
        </h1>

        <div style={{
          marginTop: 20,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '10px 16px',
          background: 'rgba(255, 209, 102, 0.22)',
          border: '1.5px solid rgba(234, 179, 8, 0.35)',
          borderRadius: 999,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97706', display: 'inline-block' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#7C2D12' }}>{eta}</span>
        </div>

        <p className="body" style={{ color: 'var(--gray-700, #374151)', marginTop: 16, maxWidth: 520 }}>
          Після дзвінка ця сторінка оновиться — з’явиться час, лікар та дорожня карта.
        </p>
      </div>
    </header>
  );
}

function HeroConfirmed({ cabinet }: { cabinet: NonNullable<Awaited<ReturnType<typeof fetchEnrichedCabinet>>>['cabinet'] }) {
  const apt = cabinet.appointment_date ? formatKyivAppointment(cabinet.appointment_date) : null;
  const doctor = cabinet.doctor;

  return (
    <header style={{ ...hero, background: 'var(--mint-tint, #E8F5F1)' }}>
      <div style={{ ...heroInner }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--teal-dark, #1a7c75)' }}>ПЕРШИЙ ПРИЙОМ · ПІДТВЕРДЖЕНО</div>
            <h1 className="h1" style={{ margin: '8px 0 0' }}>
              {apt ? apt.date : 'Найближчим часом'}
              <br />
              <span className="h1-accent">{apt ? apt.time : ''}</span>
            </h1>
          </div>
          {apt && (
            <span style={{
              padding: '6px 12px',
              background: 'rgba(82,178,173,0.18)',
              border: '1.5px solid rgba(26,124,117,0.35)',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--teal-dark, #1a7c75)',
              textTransform: 'uppercase',
              letterSpacing: 0.05,
              whiteSpace: 'nowrap',
            }}>{apt.countdown}</span>
          )}
        </div>

        <div style={{ marginTop: 16, color: 'var(--gray-700, #374151)', fontSize: 15 }}>
          {apt?.dayName && <span style={{ textTransform: 'capitalize' }}>{apt.dayName} · </span>}
          вул. Зодчих, 20 · філія Поділля
        </div>

        {doctor && (
          <div style={{
            marginTop: 20,
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '10px 14px 10px 10px',
            background: '#fff',
            border: '1.5px solid var(--gray-200, #E5E7EB)',
            borderRadius: 999,
          }}>
            <DoctorAvatar doctor={doctor} size={36} />
            <div>
              <div style={{ fontSize: 13, color: 'var(--gray-500, #6B7280)' }}>Приймає</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--black, #1A1A2E)' }}>{doctor.name}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* ──────────────────────────  REQUEST SUMMARY  ──────────────────────────── */

function RequestSummary({ cabinet, isConfirmed }: {
  cabinet: NonNullable<Awaited<ReturnType<typeof fetchEnrichedCabinet>>>['cabinet'];
  isConfirmed: boolean;
}) {
  const price = programPrice(cabinet);

  return (
    <>
      <SectionTitle eyebrow="ВАШ ЗАПИТ" title={isConfirmed ? 'Деталі запису' : 'Що ви обрали'} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {cabinet.program && (
          <div style={cardAccent}>
            <div className="eyebrow" style={{ color: 'var(--teal-dark, #1a7c75)' }}>ПРОГРАМА</div>
            <div className="h3" style={{ margin: '6px 0 6px' }}>{cabinet.program.name}</div>
            {price && (
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--teal-dark, #1a7c75)' }}>
                {formatUAH(price.value)} · {price.label}
              </div>
            )}
          </div>
        )}

        {cabinet.doctor && (
          <div style={cardDefault}>
            <div className="eyebrow" style={{ color: 'var(--gray-500, #6B7280)' }}>ЛІКАР</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 10 }}>
              <DoctorAvatar doctor={cabinet.doctor} size={48} />
              <div style={{ flex: 1 }}>
                <div className="h3" style={{ margin: 0 }}>{cabinet.doctor.name}</div>
                {cabinet.doctor.role && (
                  <div style={{ fontSize: 13, color: 'var(--gray-500, #6B7280)' }}>{cabinet.doctor.role}</div>
                )}
              </div>
              {cabinet.doctor.slug && (
                <Link href={`/doctors/${cabinet.doctor.slug}`} style={{
                  color: 'var(--teal-dark, #1a7c75)', fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', whiteSpace: 'nowrap',
                }}>
                  Профіль →
                </Link>
              )}
            </div>
          </div>
        )}

        <div style={cardDefault}>
          <div className="eyebrow" style={{ color: 'var(--gray-500, #6B7280)' }}>ДЕТАЛІ</div>
          <dl style={dlList}>
            <DlRow label="Триместр" value={trimesterLabel(cabinet.trimester)} />
            <DlRow label="Тип вагітності" value={pregnancyTypeLabel(cabinet.pregnancy_type)} />
            {cabinet.transfer_week != null && (
              <DlRow label="Перехід з клініки" value={`${cabinet.transfer_week} тиждень`} />
            )}
            {!isConfirmed && cabinet.preferred_day && (
              <DlRow label="Побажаний день" value={formatPreferredDay(cabinet.preferred_day)} />
            )}
            {cabinet.contact_method && (
              <DlRow label="Спосіб зв’язку" value={contactMethodLabel(cabinet.contact_method)} />
            )}
          </dl>
        </div>
      </div>
    </>
  );
}

function contactMethodLabel(m: string): string {
  switch (m) {
    case 'phone':    return 'Дзвінок';
    case 'telegram': return 'Telegram';
    case 'viber':    return 'Viber';
    default: return '—';
  }
}

/* ──────────────────────────  OTHER BLOCKS  ─────────────────────────────── */

function WhatToBring() {
  const items = [
    'Паспорт або ID-картка',
    'Попередні УЗД та виписки (якщо є)',
    'Список препаратів, які приймаєте',
    'Питання до лікаря (необов’язково)',
  ];
  return (
    <div style={cardDefault}>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((x) => (
          <li key={x} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={checkBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span style={{ fontSize: 15, lineHeight: 1.5 }}>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DocumentsStub() {
  return (
    <div style={{ ...cardDefault, opacity: 0.72, background: 'var(--gray-100, #F3F4F6)' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'var(--white, #FFFFFF)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--gray-500, #6B7280)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Завантаження УЗД та аналізів</div>
          <div style={{ fontSize: 13, color: 'var(--gray-500, #6B7280)' }}>Доступно після оформлення програми</div>
        </div>
      </div>
    </div>
  );
}

function DirectionsCard() {
  return (
    <div style={cardDefault}>
      <div style={{
        height: 180,
        borderRadius: 10,
        background: 'linear-gradient(135deg, var(--mint-tint, #E8F5F1) 0%, var(--mint-light, #97d5c9) 100%)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 14,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50% 50% 50% 0',
            background: '#d60242',
            transform: 'rotate(-45deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff', transform: 'rotate(45deg)' }} />
          </div>
        </div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--black, #1A1A2E)' }}>{CLINIC.address}</div>
      <div style={{ fontSize: 13, color: 'var(--gray-500, #6B7280)', marginTop: 4 }}>пн–пт 09.00–20.00 · сб 09.00–17.00 · нд 09.00–15.00</div>
      <a
        href={CLINIC.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary"
        style={{ display: 'inline-flex', marginTop: 14, textDecoration: 'none' }}
      >
        Відкрити в Google Maps ↗
      </a>
    </div>
  );
}

function ProgramCard({ program, pregnancyType }: {
  program: NonNullable<NonNullable<Awaited<ReturnType<typeof fetchEnrichedCabinet>>>['cabinet']['program']>;
  pregnancyType: 'single' | 'twin' | null;
}) {
  return (
    <div style={cardDefault}>
      <div style={{ marginBottom: 12, color: 'var(--gray-500, #6B7280)', fontSize: 13 }}>
        Що входить у програму · {trimesterLabel(program.trimester)}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(program.includes ?? []).map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--teal-dark, #1a7c75)', flexShrink: 0, marginTop: 6 }}>
              <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3" fill="currentColor" /></svg>
            </span>
            <span style={{ fontSize: 14, lineHeight: 1.55 }}>{item}</span>
          </li>
        ))}
      </ul>
      <div style={{
        marginTop: 16, paddingTop: 14,
        borderTop: '1px solid var(--gray-200, #E5E7EB)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <span style={{ fontSize: 13, color: 'var(--gray-500, #6B7280)' }}>
          {pregnancyType === 'twin' ? 'Двоплідна вагітність' : 'Одноплідна вагітність'}
        </span>
        <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--teal-dark, #1a7c75)', fontFamily: 'var(--font-display-loaded)' }}>
          {formatUAH(pregnancyType === 'twin' ? program.price_twin : program.price_single)}
        </span>
      </div>
    </div>
  );
}

function AlertBlock() {
  return (
    <div style={{
      background: '#FEF2F2',
      border: '1.5px solid #FCA5A5',
      borderRadius: 12,
      padding: 20,
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--crimson, #d60242)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <div style={{ flex: 1 }}>
          <div className="h3" style={{ marginBottom: 8 }}>Коли дзвонити не чекаючи візиту</div>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--gray-700, #374151)', lineHeight: 1.6 }}>
            Кров’янисті виділення, сильний біль внизу живота, температура, відсутність ворушінь після 24 тижня вагітності — дзвоніть одразу, не чекаючи запланованого прийому.
          </p>
          <a
            href={`tel:${telHref(CLINIC.phone)}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginTop: 14,
              padding: '12px 18px',
              background: 'var(--crimson, #d60242)',
              color: '#fff',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 0.05,
              textDecoration: 'none',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {CLINIC.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────  UTIL COMPONENTS  ─────────────────────────── */

function DoctorAvatar({ doctor, size }: {
  doctor: NonNullable<NonNullable<Awaited<ReturnType<typeof fetchEnrichedCabinet>>>['cabinet']['doctor']>;
  size: number;
}) {
  if (doctor.photo_url) {
    // next/image not imported to keep this server component lean — img is fine
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={doctor.photo_url}
        alt={doctor.name}
        width={size}
        height={size}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }
  const initials = doctor.name.split(' ').map(x => x[0]).slice(0, 2).join('');
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--mint-light, #97d5c9)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--teal-dark, #1a7c75)', fontWeight: 700,
      fontSize: Math.round(size / 2.5),
      flexShrink: 0,
    }}>{initials}</span>
  );
}

function SectionTitle({ eyebrow, title, children, isAlert }: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  isAlert?: boolean;
}) {
  return (
    <div style={{ margin: '0 0 16px' }}>
      <div className="eyebrow" style={{ color: isAlert ? 'var(--crimson, #d60242)' : 'var(--teal-dark, #1a7c75)', marginBottom: 6 }}>
        {eyebrow}
      </div>
      <h2 className="h2" style={{ margin: 0, fontSize: 22, lineHeight: 1.3 }}>{title}</h2>
      {children && <div style={{ marginTop: 8, fontSize: 14 }}>{children}</div>}
    </div>
  );
}

function DlRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--gray-100, #F3F4F6)' }}>
      <dt style={{ color: 'var(--gray-500, #6B7280)', fontSize: 13 }}>{label}</dt>
      <dd style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--black, #1A1A2E)', textAlign: 'right' }}>{value}</dd>
    </div>
  );
}

/* ─────────────────────────────  STYLES  ───────────────────────────────── */

const hero: React.CSSProperties = {
  padding: '48px 20px 56px',
};

const heroInner: React.CSSProperties = {
  maxWidth: 680,
  margin: '0 auto',
};

const container: React.CSSProperties = {
  maxWidth: 680,
  margin: '0 auto',
  padding: '40px 20px 0',
  display: 'grid',
  gap: 40,
};

const cardDefault: React.CSSProperties = {
  background: 'var(--white, #FFFFFF)',
  border: '1.5px solid var(--gray-200, #E5E7EB)',
  borderRadius: 12,
  padding: 18,
};

const cardAccent: React.CSSProperties = {
  background: 'var(--mint-tint, #E8F5F1)',
  border: 'none',
  borderRadius: 14,
  padding: 20,
};

const dlList: React.CSSProperties = {
  margin: '8px 0 0',
  padding: 0,
};

const checkBox: React.CSSProperties = {
  width: 22, height: 22, borderRadius: 6,
  background: 'var(--mint-tint, #E8F5F1)',
  color: 'var(--teal-dark, #1a7c75)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0, marginTop: 2,
};
