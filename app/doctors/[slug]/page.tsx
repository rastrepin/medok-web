import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase';
import { getScheduleBySlug } from '@/lib/doctor-schedules';
import { getDoctorContent, type EducationItem } from '@/lib/doctor-content';
import { getDoctorGeoEeat } from '@/lib/doctor-geo-eeat';
import { DOCTOR_FAQ } from '@/lib/doctor-faq';
import DoctorFaqAccordion from './components/DoctorFaqAccordion';
import DoctorStickyCta from './components/DoctorStickyCta';
import DoctorBookingButton from './components/DoctorBookingButton';
import DoctorGeoEeat from './components/DoctorGeoEeat';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
type DoctorRow = {
  id: string;
  slug: string;
  name: string;
  role: string;
  doctor_type: string;
  photo_filename: string | null;
  avatar_initials: string;
  avatar_color: string;
  bio: string;
  branches: string[];
  is_active: boolean;
};

// ----------------------------------------------------------------
// Static params
// ----------------------------------------------------------------
export async function generateStaticParams() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('medok_doctors')
    .select('slug')
    .eq('is_active', true)
    .not('slug', 'is', null);
  return (data ?? []).map((d) => ({ slug: d.slug as string }));
}

// ----------------------------------------------------------------
// Metadata
// ----------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServiceClient();
  const { data: doc } = await supabase
    .from('medok_doctors')
    .select('name, role, doctor_type')
    .eq('slug', slug)
    .single();

  if (!doc) return { title: 'Лікар — МЦ MED OK' };

  const isUzd = doc.doctor_type === 'ultrasound';
  const title = isUzd
    ? `УЗД вагітних Вінниця — ${doc.name} · FMF London · МЦ MED OK`
    : `${doc.name} — акушер-гінеколог МЦ MED OK Вінниця`;
  const description = isUzd
    ? `${doc.name} — сертифікована спеціалістка FMF London, член ISUOG. УЗД-скринінг вагітності на апараті Voluson E8. МЦ MED OK, Вінниця.`
    : `${doc.name} — ${doc.role} в МЦ MED OK, Вінниця. Ведення вагітності за міжнародними протоколами. Запис онлайн.`;

  return {
    title,
    description,
    alternates: { canonical: `https://medok.check-up.in.ua/doctors/${slug}` },
    openGraph: { title, description, url: `https://medok.check-up.in.ua/doctors/${slug}`, locale: 'uk_UA', type: 'profile' },
  };
}

// ----------------------------------------------------------------
// SVG icons for education items
// ----------------------------------------------------------------
function IconDegree() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}
function IconHospital() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
    </svg>
  );
}
function IconLab() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
    </svg>
  );
}
function IconCert() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  );
}

function EduIcon({ icon }: { icon: EducationItem['icon'] }) {
  const style = { color: 'var(--teal-dark)', flexShrink: 0, marginTop: 2 };
  if (icon === 'degree')   return <span style={style}><IconDegree /></span>;
  if (icon === 'hospital') return <span style={style}><IconHospital /></span>;
  if (icon === 'lab')      return <span style={style}><IconLab /></span>;
  return <span style={style}><IconCert /></span>;
}

function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

// ----------------------------------------------------------------
// Page
// ----------------------------------------------------------------
export default async function DoctorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createServiceClient();
  const { data: doctor, error } = await supabase
    .from('medok_doctors')
    .select('id,slug,name,role,doctor_type,photo_filename,avatar_initials,avatar_color,bio,branches,is_active')
    .eq('slug', slug)
    .eq('is_active', true)
    .single<DoctorRow>();

  if (error || !doctor) notFound();

  const content = getDoctorContent(slug);
  const schedule = getScheduleBySlug(slug);
  const geoEeat = getDoctorGeoEeat(slug);
  const faqItems = DOCTOR_FAQ[slug] ?? [];

  // Name parts: "Кельман Вікторія Володимирівна" → surname="КЕЛЬМАН", firstName="ВІКТОРІЯ", patronymic="Володимирівна"
  const nameParts = doctor.name.trim().split(/\s+/);
  const surname    = (nameParts[0] ?? '').toUpperCase();
  const firstName  = (nameParts[1] ?? '').toUpperCase();
  const patronymic = nameParts.slice(2).join(' ');

  const isUzd       = doctor.doctor_type === 'ultrasound';
  const isFmf       = slug === 'kelman-viktoriia' || slug === 'bondarchuk-zhanna';
  const bio         = content?.bio ?? doctor.bio;
  const tags        = content?.tags ?? [];
  const facts       = content?.facts ?? [];
  const education   = content?.education ?? [];
  const cpd         = content?.cpd ?? [];
  const ctaLabel       = content?.ctaLabel ?? 'ЗАПИСАТИСЬ';
  const stickyCtaLabel = content?.stickyCtaLabel ?? ctaLabel;

  // Photo src helper
  const photoBase = doctor.photo_filename?.replace(/\.[^.]+$/, '');

  // JSON-LD: Physician + FAQPage
  const schemaPhysician = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.name,
    jobTitle: doctor.role,
    medicalSpecialty: isUzd ? 'Diagnostic Radiology' : 'Obstetric',
    worksFor: { '@type': 'MedicalBusiness', name: 'МЦ MED OK', url: 'https://medok.check-up.in.ua' },
    url: `https://medok.check-up.in.ua/doctors/${slug}`,
    ...(doctor.photo_filename && { image: `https://medok.check-up.in.ua/images/doctors/${doctor.photo_filename}` }),
  };

  const schemaFaq = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  return (
    <>
      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPhysician) }} />
      {schemaFaq && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />
      )}

      {/* ── 1. HERO (Mint Tint) ─────────────────────────────── */}
      <section style={{ background: 'var(--mint-tint)', padding: '56px 0 48px' }}>
        <div className="container">
          {/* Eyebrow breadcrumb */}
          <a
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--teal-dark)',
              textDecoration: 'none', marginBottom: 32,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Команда MED OK · Поділля
          </a>

          {/* Avatar + name row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 88, height: 88, borderRadius: 9999,
                overflow: 'hidden', background: doctor.avatar_color,
                border: '2px solid rgba(82,178,173,.25)',
              }}>
                {doctor.photo_filename && photoBase ? (
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`/images/doctors/${photoBase}-200w.webp 200w, /images/doctors/${photoBase}-100w.webp 100w`}
                      sizes="88px"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/doctors/${doctor.photo_filename}`}
                      alt={doctor.name}
                      width={88} height={88}
                      loading="eager"
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </picture>
                ) : (
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '100%', height: '100%',
                    fontSize: 22, fontWeight: 700, color: '#fff',
                  }}>
                    {doctor.avatar_initials}
                  </span>
                )}
              </div>
              {/* FMF badge */}
              {isFmf && (
                <span style={{
                  position: 'absolute', bottom: 0, right: -4,
                  background: 'var(--teal-dark)', color: '#fff',
                  fontSize: 9, fontWeight: 800, letterSpacing: '0.05em',
                  padding: '2px 5px', borderRadius: 4,
                  border: '1.5px solid var(--mint-tint)',
                }}>
                  FMF
                </span>
              )}
            </div>

            {/* Name */}
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontWeight: 400,
                fontSize: 28, lineHeight: 1.1, letterSpacing: '0.01em',
                color: 'var(--gray-900)',
                margin: 0,
              }}>
                {surname} {firstName}
              </h1>
              {patronymic && (
                <p className="h3" style={{ color: 'var(--gray-700)', margin: '6px 0 0' }}>
                  {patronymic}
                </p>
              )}
            </div>
          </div>

          {/* Tag pills */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {tags.map((tag) => (
                <span key={tag} style={{
                  background: 'var(--mint-light)', color: 'var(--teal-dark)',
                  fontSize: 11, fontWeight: 600, padding: '5px 12px',
                  borderRadius: 'var(--r-sm)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Schedule mini-card */}
          {schedule && (
            <div style={{
              background: '#fff', borderRadius: 'var(--r-lg)',
              padding: '14px 18px', marginBottom: 28,
              display: 'inline-flex', flexDirection: 'column', gap: 8,
              minWidth: 260,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gray-700)', fontSize: 13 }}>
                <span style={{ color: 'var(--teal-dark)' }}><IconClock /></span>
                <span>
                  Графік:{' '}
                  {schedule.days.map((d, i) => (
                    <span key={i}>
                      {i > 0 ? ' · ' : ''}
                      {d.day} {d.hours}
                    </span>
                  ))}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gray-700)', fontSize: 13 }}>
                <span style={{ color: 'var(--teal-dark)' }}><IconPin /></span>
                <span>MED OK Поділля, вул. Зодчих 20</span>
              </div>
            </div>
          )}

          {/* Hero CTA */}
          <div id="hero-cta">
            <DoctorBookingButton slug={slug} label={ctaLabel} source="hero-cta" fullWidth={false} />
          </div>
        </div>

        <style>{`
          @media (max-width: 767px) {
            #hero-cta button { width: 100%; }
          }
        `}</style>
      </section>

      {/* ── 2. STAT FACTS ───────────────────────────────────── */}
      {facts.length > 0 && (
        <section style={{ background: 'var(--mint-tint)', paddingBottom: 48 }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {facts.map((f) => (
                <div key={f.label} style={{
                  background: 'var(--mint-light)', borderRadius: 'var(--r-lg)',
                  padding: '16px 12px', textAlign: 'center',
                }}>
                  <span style={{
                    display: 'block',
                    fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
                    color: 'var(--teal-dark)', lineHeight: 1, marginBottom: 6,
                    wordBreak: 'break-word',
                  }}>
                    {f.value}
                  </span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: 'var(--teal-dark)',
                    textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.3,
                  }}>
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. ПРО ЛІКАРЯ ───────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '64px 0' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 className="h2" style={{ fontSize: 24, marginTop: 0, marginBottom: 20 }}>
            Про лікаря
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {bio.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: 15, color: 'var(--black)', lineHeight: 1.65, margin: 0 }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. ОСВІТА ───────────────────────────────────────── */}
      {education.length > 0 && (
        <section style={{ background: 'var(--gray-50)', padding: '64px 0' }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <h2 className="h2" style={{ fontSize: 24, marginTop: 0, marginBottom: 20 }}>
              Освіта
            </h2>
            <div style={{
              background: '#fff', borderRadius: 'var(--r-lg)',
              border: '1.5px solid var(--gray-200)', padding: '4px 0',
            }}>
              {education.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '14px 20px',
                  borderBottom: i < education.length - 1 ? '1px solid var(--gray-100)' : 'none',
                }}>
                  <EduIcon icon={item.icon} />
                  <span style={{ fontSize: 14, color: 'var(--black)', lineHeight: 1.5 }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. ПІДВИЩЕННЯ КВАЛІФІКАЦІЇ ──────────────────────── */}
      {cpd.length > 0 && (
        <section style={{ background: '#fff', padding: '64px 0' }}>
          <div className="container">
            <h2 className="h2" style={{ fontSize: 24, marginTop: 0, marginBottom: 20 }}>
              Підвищення кваліфікації
            </h2>
            <div className="cpd-grid">
              {cpd.map((card) => (
                <div key={card.eyebrow} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal-dark)', margin: 0 }}>
                    {card.eyebrow}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6, margin: 0, flex: 1 }}>
                    {card.body}
                  </p>
                  <span style={{
                    display: 'inline-block', background: 'var(--mint-tint)',
                    color: 'var(--teal-dark)', fontSize: 11, fontWeight: 600,
                    padding: '4px 10px', borderRadius: 'var(--r-sm)', alignSelf: 'flex-start',
                  }}>
                    {card.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <style>{`
            .cpd-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
            }
            @media (max-width: 767px) {
              .cpd-grid {
                display: flex;
                overflow-x: auto;
                gap: 12px;
                scroll-snap-type: x mandatory;
                -webkit-overflow-scrolling: touch;
                padding-bottom: 8px;
              }
              .cpd-grid > * {
                flex: 0 0 80vw;
                scroll-snap-align: start;
              }
            }
          `}</style>
        </section>
      )}

      {/* ── 6. ГРАФІК ПРИЙОМУ ───────────────────────────────── */}
      {schedule && (
        <section style={{ background: 'var(--gray-50)', padding: '64px 0' }}>
          <div className="container" style={{ maxWidth: 560 }}>
            <h2 className="h2" style={{ fontSize: 24, marginTop: 0, marginBottom: 20 }}>
              {`Графік прийому · ${firstName}`}
            </h2>
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {schedule.days.map((d) => (
                  <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--black)', minWidth: 80 }}>
                      {d.day}
                    </span>
                    <span style={{ color: 'var(--gray-500)' }}>·</span>
                    <span style={{ fontSize: 15, color: 'var(--gray-700)' }}>{d.hours}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 16, marginBottom: 0 }}>
                Запис за телефоном або через форму нижче
              </p>
            </div>
            <DoctorBookingButton slug={slug} label={ctaLabel} source="schedule-cta" variant="secondary" />
          </div>
        </section>
      )}

      {/* ── 7. FAQ ──────────────────────────────────────────── */}
      {faqItems.length > 0 && (
        <section style={{ background: '#fff', padding: '64px 0' }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <h2 className="h2" style={{ fontSize: 24, marginTop: 0, marginBottom: 20 }}>
              Часті запитання
            </h2>
            <DoctorFaqAccordion items={faqItems} />
          </div>
        </section>
      )}

      {/* ── 8. GEO ──────────────────────────────────────────── */}
      {geoEeat?.geoText && (
        <section
          id="geo"
          style={{
            background: '#F3F4F6',
            borderTop: '1px solid var(--gray-200)',
            padding: '48px 48px 40px',
          }}
        >
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 14,
                color: 'var(--gray-600)',
                lineHeight: 1.8,
                maxWidth: 820,
                margin: 0,
              }}
            >
              {geoEeat.geoText}
            </p>
          </div>
          <style>{`
            @media(max-width:768px){
              section#geo{ padding: 32px 20px 28px !important }
            }
          `}</style>
        </section>
      )}

      {/* ── 9. E-E-A-T ──────────────────────────────────────── */}
      {geoEeat && (
        <DoctorGeoEeat
          reviewerName={geoEeat.reviewerName}
          reviewerTitle={geoEeat.reviewerTitle}
          sources={geoEeat.sources}
        />
      )}

      {/* ── Mobile sticky CTA ───────────────────────────────── */}
      <DoctorStickyCta slug={slug} ctaLabel={ctaLabel} stickyCtaLabel={stickyCtaLabel} />
    </>
  );
}
