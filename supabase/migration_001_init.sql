-- ============================================================
-- MED OK / CAREWAY — Initial Schema Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Programs (довідник пакетів)
CREATE TABLE IF NOT EXISTS medok_programs (
  id            TEXT PRIMARY KEY,
  trimester     TEXT NOT NULL,          -- 'i' | 'ii' | 'iii' | 'full'
  name          TEXT NOT NULL,
  description   TEXT,
  price_single  INTEGER NOT NULL,
  price_twin    INTEGER NOT NULL,
  includes      JSONB DEFAULT '[]',
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Doctors (довідник лікарів)
CREATE TABLE IF NOT EXISTS medok_doctors (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  role            TEXT,
  doctor_type     TEXT NOT NULL,        -- 'obstetrician' | 'ultrasound'
  tags            TEXT[] DEFAULT '{}',
  bio             TEXT,
  avatar_initials TEXT,
  avatar_color    TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  last_active_at  TIMESTAMPTZ,
  patients_count  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Leads (заявки)
CREATE TABLE IF NOT EXISTS medok_leads (
  id                  BIGSERIAL PRIMARY KEY,
  name                TEXT NOT NULL,
  phone               TEXT NOT NULL,
  form_type           TEXT DEFAULT 'quiz',  -- 'quiz' | 'transfer'
  trimester           TEXT,
  pregnancy_type      TEXT,                  -- 'single' | 'twin'
  program_id          TEXT REFERENCES medok_programs(id) ON DELETE SET NULL,
  doctor_id           TEXT REFERENCES medok_doctors(id) ON DELETE SET NULL,
  messenger           TEXT,                  -- 'viber' | 'telegram' | 'phone'
  preferred_dates     JSONB,                 -- [{date, ranges}]
  transfer_week       INTEGER,
  has_medical_records TEXT,                  -- 'yes' | 'no' | 'partial'
  status              TEXT DEFAULT 'new',    -- 'new' | 'contacted' | 'confirmed' | 'lost'
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Cabinets (кабінет пацієнтки)
CREATE TABLE IF NOT EXISTS medok_cabinets (
  uuid                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  lead_id             BIGINT REFERENCES medok_leads(id) ON DELETE CASCADE,
  patient_name        TEXT NOT NULL,
  patient_phone       TEXT NOT NULL,
  program_id          TEXT REFERENCES medok_programs(id) ON DELETE SET NULL,
  doctor_id           TEXT REFERENCES medok_doctors(id) ON DELETE SET NULL,
  trimester           TEXT,
  appointment_status  TEXT DEFAULT 'pending',  -- 'pending' | 'confirmed' | 'active' | 'completed'
  appointment_date    TIMESTAMPTZ,
  case_steps          JSONB DEFAULT '[]',
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON medok_cabinets;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON medok_cabinets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED DATA — Programs
-- ============================================================
INSERT INTO medok_programs (id, trimester, name, description, price_single, price_twin, includes) VALUES
(
  'trimester-i', 'i', 'I триместр',
  'Від постановки на облік до 16 тижня. Скринінг I триместру, біохімічний скринінг (Astraia + «Геном»), аналізи та консультації.',
  14540, 16790,
  '["УЗД скринінг I триместру","Біохімічний скринінг Astraia","Партнерство з центром «Геном»","Аналізи крові та сечі","Консультації акушер-гінеколога","Постановка на облік"]'::jsonb
),
(
  'trimester-ii', 'ii', 'II триместр',
  'Від 18 до 28 тижня. Анатомічний скринінг, цервікометрія, КТГ та повний набір аналізів.',
  9970, 13830,
  '["УЗД 18–21 тижень","Цервікометрія × 2","АФП / β-ХГЛ / естріол","ЗАК (24 показники), ЗАС × 3","ВІЛ, сифіліс, ТТГ","КТГ-моніторинг","Консультації × 3"]'::jsonb
),
(
  'trimester-iii', 'iii', 'III триместр',
  'Від 30 тижня до пологів та огляд після. Доплерометрія, КТГ та підготовка до пологів.',
  15320, 15570,
  '["УЗД + доплерометрія","КТГ-моніторинг","Аналізи готовності до пологів","Консультації акушер-гінеколога","Огляд після пологів","CAREWAY App 24/7"]'::jsonb
),
(
  'trimester-full', 'full', 'Повне ведення',
  'I + II + III триместр від постановки на облік до огляду після пологів. Один лікар, фіксована ціна.',
  39830, 46190,
  '["Усі дослідження I–III триместру","Один лікар від початку до кінця","Пріоритетний запис","CAREWAY App 24/7","Біохімічний скринінг Astraia + «Геном»","УЗД на Voluson E8"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA — Doctors
-- ============================================================
INSERT INTO medok_doctors (id, name, role, doctor_type, tags, bio, avatar_initials, avatar_color) VALUES
(
  'yanyuk', 'Янюк Ольга Олександрівна', 'Акушер-гінеколог · УЗД-діагностика', 'obstetrician',
  ARRAY['УЗД 2019','Кольпоскопія','Міжнар. конф.'],
  'Автор медичних публікацій, учасниця міжнародних профільних конференцій. Спеціалізація — ведення вагітності, УЗД-діагностика та кольпоскопія.',
  'ЯО', 'linear-gradient(135deg,#d60242,#f04070)'
),
(
  'kelman', 'Кельман Вікторія Володимирівна', 'Акушер-гінеколог · Пренатальна діагностика', 'obstetrician',
  ARRAY['FMF 2021','Аспірант ВНМУ','Доказова медицина'],
  'Аспірант ВНМУ ім. М.І. Пирогова, навчання за програмою FMF у 2021 році. Пренатальна діагностика та доказові підходи у веденні вагітності.',
  'КВ', 'linear-gradient(135deg,#1a7c75,#52b2ad)'
),
(
  'trofimchuk', 'Трофімчук Тетяна Ігорівна', 'Акушер-гінеколог · УЗД-спеціаліст', 'obstetrician',
  ARRAY['ВНМУ з відзнакою','УЗД Львів 2022','Progress'],
  'ВНМУ ім. М.І. Пирогова з відзнакою (2019), спеціалізація з УЗД у Львові (2022). Активний учасник платформи Progress.',
  'ТТ', 'linear-gradient(135deg,#7c3aed,#a855f7)'
),
(
  'bondarchuk', 'Бондарчук Жанна Геннадіївна', 'УЗД · Пренатальна діагностика', 'ultrasound',
  ARRAY['FMF London','ISUOG','Voluson E8'],
  'Сертифікований спеціаліст FMF London, член ISUOG. Апарат Voluson E8 — 3D/4D пренатальна діагностика.',
  'БЖ', 'linear-gradient(135deg,#b45309,#f59e0b)'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
ALTER TABLE medok_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medok_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE medok_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE medok_cabinets ENABLE ROW LEVEL SECURITY;

-- Public: read programs and doctors (for frontend display)
CREATE POLICY "public_read_programs" ON medok_programs FOR SELECT USING (true);
CREATE POLICY "public_read_doctors" ON medok_doctors FOR SELECT USING (true);

-- Leads: insert only (no read from client)
CREATE POLICY "insert_leads" ON medok_leads FOR INSERT WITH CHECK (true);

-- Cabinets: read by UUID (no auth needed — UUID is the secret)
CREATE POLICY "read_cabinet_by_uuid" ON medok_cabinets FOR SELECT USING (true);

-- Service role bypasses RLS anyway, so above is for anon client
