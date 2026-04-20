export type Trimester = 'i' | 'ii' | 'iii' | 'full';
export type PregnancyType = 'single' | 'twin';
export type Messenger = 'viber' | 'telegram' | 'phone';

export interface Program {
  id: string;
  trimester: Trimester;
  name: string;
  description: string;
  includes: string[];
  price_single: number;
  price_twin: number;
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  tags: string[];
  bio: string;
  avatar_initials: string;
  avatar_color: string;
  photo_url?: string;
  profile_url?: string;
  doctor_type: 'obstetrician' | 'ultrasound';
  last_active_at?: string;
  patients_count?: number;
  is_active: boolean;
}

export interface LeadPayload {
  name: string;
  phone: string;
  trimester?: Trimester;
  pregnancy_type?: PregnancyType;
  program_id?: string;
  doctor_id?: string;
  preferred_dates?: { date: string; ranges: string[] }[];
  preferred_slots?: string[];
  messenger?: Messenger;
  form_type?: 'quiz' | 'transfer' | 'callback' | 'doctor_booking';
  // transfer-specific
  transfer_week?: number;
  has_medical_records?: 'yes' | 'no' | 'partial';
  // doctor_booking-specific
  contact_method?: 'phone' | 'telegram' | 'viber';
  visit_purpose?: 'program' | 'consultation' | 'gynecology';
  preferred_day?: string; // ISO date "2026-04-09" or "other"
  doctor_slug?: string;
  doctor_name?: string;
  referrer_url?: string;
  city?: string;
  // booking system
  quiz_answers?: object;
  is_existing_patient?: boolean;
}

export type CabinetStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled';

export interface Cabinet {
  uuid: string;
  lead_id: string;
  patient_name: string;
  patient_phone: string;
  program_id?: string;
  doctor_id?: string;
  trimester?: Trimester;
  appointment_status: CabinetStatus;
  appointment_date?: string;
  case_steps?: CaseStep[];
  notes?: string;
  // session 3 — admin confirmation flow
  confirmation_token?: string;
  token_expires_at?: string;
  confirmed_at?: string;
  confirmed_by?: string;
  preconsultation?: PreconsultationData | null;
  email_sent_at?: string;
  branch?: string;
  created_at: string;
  updated_at?: string;
}

export interface CaseStep {
  id: number;
  label: string;
  status: 'done' | 'active' | 'pending';
}

// ─── Preconsultation (onboarding quiz) ────────────────────────────────────
export interface PreconsultationData {
  pregnancy_week?: number | null;
  is_first_pregnancy?: boolean | null;
  previous_births_count?: number | null;
  previous_births_method?: 'natural' | 'cesarean' | 'mixed' | null;
  chronic_conditions?: string[] | null;
  chronic_other?: string | null;
  current_medications?: string | null;
  allergies?: string | null;
  main_concern?: string | null;
  completed_at?: string | null;
}

// ─── Onboarding cabinet API shape (enriched with joined lead/doctor/program) ─
export interface OnboardingCabinet {
  uuid: string;
  status: CabinetStatus;
  patient_name: string;
  patient_phone: string;
  appointment_date: string | null;
  confirmed_at: string | null;
  created_at: string;
  trimester: string | null;
  pregnancy_type: 'single' | 'twin' | null;
  is_existing_patient: boolean | null;
  transfer_week: number | null;
  contact_method: 'phone' | 'telegram' | 'viber' | null;
  preferred_day: string | null;
  quiz_answers: Record<string, unknown> | null;
  preconsultation: PreconsultationData | null;
  program: {
    id: string;
    name: string;
    price_single: number;
    price_twin: number;
    includes: string[];
    trimester: string;
  } | null;
  doctor: {
    id: string;
    slug?: string;
    name: string;
    photo_url?: string;
    tags?: string[];
    role?: string;
  } | null;
}
