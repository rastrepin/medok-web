import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { normalizePhone, isSpamPhone, isValidUkrainianPhone } from '@/lib/lead-utils';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const name  = (body.name  as string | undefined)?.trim() ?? '';
  const phone = (body.phone as string | undefined)?.trim() ?? '';

  if (!name || !phone) {
    return NextResponse.json({ error: "name і phone обов'язкові" }, { status: 422 });
  }

  const normalizedPhone = normalizePhone(phone);

  if (isSpamPhone(normalizedPhone)) {
    return NextResponse.json({ ok: true, lead_id: null, cabinet_uuid: null, spam: true });
  }

  if (!isValidUkrainianPhone(normalizedPhone)) {
    return NextResponse.json(
      { error: 'Некоректний номер. Введіть у форматі 0XX XXX XXXX.' },
      { status: 422 },
    );
  }

  const supabase = createServiceClient();

  // INSERT — тригер auto_create_cabinet автоматично створює cabinet рядок
  const { data: lead, error: leadError } = await supabase
    .from('medok_leads')
    .insert({
      name,
      phone:               normalizedPhone,
      form_type:           body.form_type           ?? 'quiz',
      trimester:           body.trimester           ?? null,
      pregnancy_type:      body.pregnancy_type      ?? null,
      program_id:          body.program_id          ?? null,
      doctor_id:           body.doctor_id           ?? null,
      contact_method:      body.contact_method      ?? null,
      messenger:           body.messenger           ?? null,
      preferred_day:       body.preferred_day       ?? null,
      doctor_slug:         body.doctor_slug         ?? null,
      doctor_name:         body.doctor_name         ?? null,
      visit_purpose:       body.visit_purpose       ?? null,
      transfer_week:       body.transfer_week       ?? null,
      quiz_answers:        body.quiz_answers        ?? null,
      is_existing_patient: body.is_existing_patient ?? null,
      referrer_url:        (req.headers.get('referer') ?? null),
      status:              'new',
    })
    .select('id')
    .single();

  if (leadError || !lead) {
    console.error('[CREATE LEAD ERROR]', leadError);
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  // Fetch UUID, створеного тригером
  const { data: cabinet } = await supabase
    .from('medok_cabinets')
    .select('uuid')
    .eq('lead_id', lead.id)
    .single();

  const cabinetUuid = cabinet?.uuid ?? null;

  return NextResponse.json({ ok: true, lead_id: lead.id, cabinet_uuid: cabinetUuid });
}
