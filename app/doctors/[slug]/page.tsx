import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase';
import DoctorHero from './components/DoctorHero';
import DoctorSpecialization from './components/DoctorSpecialization';
import DoctorBase from './components/DoctorBase';
import DoctorCases from './components/DoctorCases';

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

  // Find specialization matching ?case= param
  const activeSpec = activeCase
    ? specializations.find((s) => s.case_type === activeCase)
    : null;

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

      {/* Footer CTA strip */}
      <section style={{
        background: 'var(--g900)',
        padding: '40px 48px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <p style={{
            fontSize: 18, fontWeight: 700, color: '#fff',
            marginBottom: 20,
            fontFamily: 'var(--font-playfair),"Playfair Display",serif',
          }}>
            Хочете записатись до {doctor.name.split(' ')[0]}?
          </p>
          <a
            href="/#quiz"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--c)', color: '#fff',
              padding: '14px 32px', borderRadius: 9999,
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
            }}
          >
            Підібрати програму
          </a>
        </div>
        <style>{`
          @media(max-width:768px){
            section[style*="var(--g900)"]{padding:32px 20px!important}
          }
        `}</style>
      </section>
    </>
  );
}
