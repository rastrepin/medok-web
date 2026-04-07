import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase';
import { getScheduleBySlug } from '@/lib/doctor-schedules';
import DoctorHero from './components/DoctorHero';
import DoctorSpecialization from './components/DoctorSpecialization';
import DoctorBase from './components/DoctorBase';
import DoctorCases from './components/DoctorCases';
import DoctorSchedule from './components/DoctorSchedule';
import DoctorGeoEeat from './components/DoctorGeoEeat';
import { getDoctorGeoEeat } from '@/lib/doctor-geo-eeat';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
type Specialization = {
  id: string;
  case_type: string;
  headline: string;
  focus_text: string;
  stats: { value: string; label: string }[];
  cta_label: string;
  cta_case_slug: string;
};

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
  education: string | null;
  achievements: string | null;
  branches: string[];
  last_active_at: string | null;
  patients_count: number;
  is_active: boolean;
  medok_doctor_specializations: Specialization[];
};

// ----------------------------------------------------------------
// Static params (build-time)
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
// SEO Metadata
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
    alternates: {
      canonical: `https://medok.check-up.in.ua/doctors/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://medok.check-up.in.ua/doctors/${slug}`,
      locale: 'uk_UA',
      type: 'profile',
    },
  };
}

// ----------------------------------------------------------------
// Page
// ----------------------------------------------------------------
export default async function DoctorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ case?: string }>;
}) {
  const { slug } = await params;
  const { case: activeCase } = await searchParams;

  const supabase = createServiceClient();
  const { data: doctor, error } = await supabase
    .from('medok_doctors')
    .select('*, medok_doctor_specializations(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single<DoctorRow>();

  if (error || !doctor) notFound();

  const specializations: Specialization[] = doctor.medok_doctor_specializations ?? [];

  // Find specialization: match ?case= param, or default to first spec
  // when the doctor has exactly one specialization (e.g. UZD-only doctors)
  const activeSpec = activeCase
    ? specializations.find((s) => s.case_type === activeCase)
    : specializations.length === 1
    ? specializations[0]
    : null;

  // Schedule data (hardcoded from content/medok/doctors/doctors.md)
  const schedule = getScheduleBySlug(slug);
  const doctorGeoEeat = getDoctorGeoEeat(slug);
  const doctorFirstName = doctor.name.split(' ')[1] ?? doctor.name.split(' ')[0];

  // Per-doctor genitive name for CTA ("Хочете записатись до...")
  const DOCTOR_NAME_GENITIVE: Record<string, string> = {
    'yanyuk-olha': 'Ольги Янюк',
    'kelman-viktoriia': 'Вікторії Кельман',
    'trofimchuk-tetiana': 'Тетяни Трофімчук',
    'bondarchuk-zhanna': 'Жанни Бондарчук',
  };
  const doctorNameGenitive = DOCTOR_NAME_GENITIVE[slug] ?? doctorFirstName;

  // All case types this doctor has
  const caseTypes = specializations.map((s) => s.case_type) as ('pregnancy' | 'ultrasound')[];

  // Schema.org JSON-LD
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.name,
    jobTitle: doctor.role,
    medicalSpecialty: 'Obstetric',
    worksFor: {
      '@type': 'MedicalBusiness',
      name: 'МЦ MED OK',
      url: 'https://medok.check-up.in.ua',
    },
    url: `https://medok.check-up.in.ua/doctors/${slug}`,
    ...(doctor.photo_filename && {
      image: `https://medok.check-up.in.ua/images/doctors/${doctor.photo_filename}`,
    }),
  };

  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      {/* Hero */}
      <DoctorHero
        name={doctor.name}
        role={doctor.role}
        photoFilename={doctor.photo_filename}
        avatarInitials={doctor.avatar_initials}
        avatarColor={doctor.avatar_color}
        doctorType={doctor.doctor_type}
        branches={doctor.branches ?? []}
        lastActiveAt={doctor.last_active_at}
        patientsCount={doctor.patients_count ?? 0}
      />

      {/* Specialization block (if ?case= matches) */}
      {activeSpec ? (
        <DoctorSpecialization
          headline={activeSpec.headline}
          focusText={activeSpec.focus_text}
          stats={activeSpec.stats}
          ctaLabel={activeSpec.cta_label}
          ctaCaseSlug={activeSpec.cta_case_slug}
        />
      ) : (
        /* Show all cases if no active specialization */
        <DoctorCases
          doctorType={doctor.doctor_type}
          caseTypes={caseTypes}
        />
      )}

      {/* Base info — education, achievements, branches */}
      <DoctorBase
        bio={doctor.bio}
        education={doctor.education}
        achievements={doctor.achievements}
        branches={doctor.branches ?? []}
      />

      {/* Schedule block */}
      {schedule && (
        <DoctorSchedule
          days={schedule.days}
          doctorFirstName={doctorFirstName}
        />
      )}

      {/* GEO + E-E-A-T block */}
      {doctorGeoEeat && (
        <DoctorGeoEeat
          geoText={doctorGeoEeat.geoText}
          reviewerName={doctorGeoEeat.reviewerName}
          reviewerTitle={doctorGeoEeat.reviewerTitle}
          sources={doctorGeoEeat.sources}
          doctorName={doctor.name}
        />
      )}

      {/* Footer CTA strip */}
      <section style={{
        background: 'var(--tp)',
        borderTop: '1px solid var(--t)',
        padding: '40px 48px',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="doctor-cta-row" style={{
            display: 'flex', alignItems: 'center',
            gap: 20, flexWrap: 'wrap',
          }}>
            {/* Photo */}
            {doctor.photo_filename && (
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                overflow: 'hidden', flexShrink: 0,
                border: '2px solid var(--tl)',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/doctors/${doctor.photo_filename}`}
                  alt={doctor.name}
                  width={64}
                  height={64}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
            )}

            {/* Text + buttons */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <p style={{
                fontSize: 17, fontWeight: 700, color: 'var(--td)',
                marginBottom: 14, fontFamily: 'var(--font)',
              }}>
                Хочете записатись до {doctorNameGenitive}?
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <a
                  href="/#quiz"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'var(--t)', color: '#fff',
                    padding: '12px 28px', borderRadius: 9999,
                    fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  }}
                >
                  Підібрати програму
                </a>
                <a
                  href="/#doctors"
                  style={{
                    fontSize: 13, color: 'var(--td)', fontWeight: 600,
                    textDecoration: 'none', whiteSpace: 'nowrap',
                  }}
                >
                  Або перегляньте всю команду гінекологів →
                </a>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media(max-width:768px){
            section[style*="var(--tp)"]{padding:32px 20px!important}
            .doctor-cta-row{flex-direction:column!important;align-items:flex-start!important}
          }
        `}</style>
      </section>
    </>
  );
}
