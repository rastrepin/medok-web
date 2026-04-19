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

export interface Cabinet {
  uuid: string;
  lead_id: string;
  patient_name: string;
  patient_phone: string;
  program_id?: string;
  doctor_id?: string;
  trimester?: Trimester;
  appointment_status: 'pending' | 'confirmed' | 'active' | 'completed';
  appointment_date?: string;
  case_steps?: CaseStep[];
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface CaseStep {
  id: number;
  label: string;
  status: 'done' | 'active' | 'pending';
}
