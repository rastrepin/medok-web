import { createServiceClient } from '@/lib/supabase';
import type { OnboardingCabinet, CabinetStatus, PreconsultationData } from '@/lib/types';

/**
 * Enriched cabinet fetch — joins lead, program, doctor.
 * Used by /api/cabinet/[uuid] (public onboarding page) and
 * /api/cabinet/by-token (admin confirm page).
 */
export async function fetchEnrichedCabinet(
  opts: { uuid?: string; token?: string },
): Promise<
  | { cabinet: OnboardingCabinet; token_valid: boolean; appointment_date: string | null; raw_status: CabinetStatus }
  | null
> {
  const supabase = createServiceClient();
  let query = supabase
    .from('medok_cabinets')
    .select(
      `uuid,
       lead_id,
       patient_name,
       patient_phone,
       program_id,
       doctor_id,
       trimester,
       appointment_status,
       appointment_date,
       confirmation_token,
       token_expires_at,
       confirmed_at,
       preconsultation,
       created_at`,
    );

  if (opts.uuid)  query = query.eq('uuid', opts.uuid);
  if (opts.token) query = query.eq('confirmation_token', opts.token);

  const { data: cab, error } = await query.maybeSingle();
  if (error || !cab) return null;

  // fetch joined rows separately (avoids PostgREST embed quirks with text FKs)
  const [leadRes, programRes, doctorRes] = await Promise.all([
    cab.lead_id
      ? supabase
          .from('medok_leads')
          .select(
            'quiz_answers, is_existing_patient, transfer_week, contact_method, preferred_day, pregnancy_type',
          )
          .eq('id', cab.lead_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    cab.program_id
      ? supabase
          .from('medok_programs')
          .select('id, name, price_single, price_twin, includes, trimester')
          .eq('id', cab.program_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    cab.doctor_id
      ? supabase
          .from('medok_doctors')
          .select('id, slug, name, photo_filename, tags, role')
          .eq('id', cab.doctor_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const lead = leadRes.data as {
    quiz_answers: Record<string, unknown> | null;
    is_existing_patient: boolean | null;
    transfer_week: number | null;
    contact_method: 'phone' | 'telegram' | 'viber' | null;
    preferred_day: string | null;
    pregnancy_type: 'single' | 'twin' | null;
  } | null;

  const programRow = programRes.data as {
    id: string;
    name: string;
    price_single: number;
    price_twin: number;
    includes: string[] | null;
    trimester: string;
  } | null;

  const doctorRow = doctorRes.data as {
    id: string;
    slug: string | null;
    name: string;
    photo_filename: string | null;
    tags: string[] | null;
    role: string | null;
  } | null;

  const preconsultationJson = (cab.preconsultation ?? null) as PreconsultationData | null;

  const onboarding: OnboardingCabinet = {
    uuid: cab.uuid,
    status: (cab.appointment_status ?? 'pending') as CabinetStatus,
    patient_name:  cab.patient_name,
    patient_phone: cab.patient_phone,
    appointment_date: cab.appointment_date,
    confirmed_at:     cab.confirmed_at,
    created_at:       cab.created_at,
    trimester:        cab.trimester ?? null,
    pregnancy_type:       lead?.pregnancy_type ?? null,
    is_existing_patient:  lead?.is_existing_patient ?? null,
    transfer_week:        lead?.transfer_week ?? null,
    contact_method:       lead?.contact_method ?? null,
    preferred_day:        lead?.preferred_day ?? null,
    quiz_answers:         lead?.quiz_answers ?? null,
    preconsultation:      preconsultationJson && Object.keys(preconsultationJson).length > 0
      ? preconsultationJson
      : null,
    program: programRow
      ? {
          id:           programRow.id,
          name:         programRow.name,
          price_single: programRow.price_single,
          price_twin:   programRow.price_twin,
          includes:     Array.isArray(programRow.includes) ? programRow.includes : [],
          trimester:    programRow.trimester,
        }
      : null,
    doctor: doctorRow
      ? {
          id:       doctorRow.id,
          slug:     doctorRow.slug ?? undefined,
          name:     doctorRow.name,
          photo_url: doctorRow.photo_filename
            ? `/doctors/${doctorRow.photo_filename}`
            : undefined,
          tags: doctorRow.tags ?? [],
          role: doctorRow.role ?? undefined,
        }
      : null,
  };

  const tokenValid =
    !!cab.confirmation_token &&
    (!cab.token_expires_at || new Date(cab.token_expires_at) > new Date());

  return {
    cabinet: onboarding,
    token_valid: tokenValid,
    appointment_date: cab.appointment_date,
    raw_status: (cab.appointment_status ?? 'pending') as CabinetStatus,
  };
}
