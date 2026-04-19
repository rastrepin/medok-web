import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { LeadPayload } from '@/lib/types';
import { normalizePhone, isSpamPhone, isValidUkrainianPhone } from '@/lib/lead-utils';

// ── email helpers ─────────────────────────────────────────────────────────────

function buildEmailBody(lead: LeadPayload, cabinetUrl: string): string {
  const formLabel =
    lead.form_type === 'transfer'       ? 'Перехід з клініки'
    : lead.form_type === 'callback'     ? 'Зворотній дзвінок'
    : lead.form_type === 'doctor_booking' ? 'Запис до лікаря (сторінка лікаря)'
    : 'Квіз / підбір програми';

  const contactStr = lead.contact_method === 'telegram' ? 'Telegram'
    : lead.contact_method === 'viber'    ? 'Viber'
    : lead.contact_method === 'phone'    ? 'Дзвінок'
    : lead.messenger === 'telegram'      ? 'Telegram'
    : lead.messenger === 'viber'         ? 'Viber'
    : lead.messenger === 'phone'         ? 'Дзвінок'
    : '—';

  const purposeStr = lead.visit_purpose === 'program'      ? 'Програма ведення вагітності'
    : lead.visit_purpose === 'consultation' ? 'Консультація вагітної'
    : lead.visit_purpose === 'gynecology'   ? 'Жіноча консультація'
    : '';

  const rows = [
    `Ім'я:        ${lead.name}`,
    `Телефон:     ${lead.phone}`,
    `Тип форми:   ${formLabel}`,
    `Зв'язок:     ${contactStr}`,
    lead.visit_purpose      ? `Мета:        ${purposeStr}` : '',
    lead.preferred_day      ? `День:        ${lead.preferred_day}` : '',
    lead.doctor_name        ? `Лікар:       ${lead.doctor_name}` : lead.doctor_id ? `Лікар:       ${lead.doctor_id}` : '',
    lead.referrer_url       ? `Сторінка:    ${lead.referrer_url}` : '',
    lead.city               ? `Місто:       ${lead.city}` : '',
    lead.trimester          ? `Триместр:    ${lead.trimester}` : '',
    lead.pregnancy_type     ? `Тип вагітн.: ${lead.pregnancy_type === 'twin' ? 'Двоплідна' : 'Одноплідна'}` : '',
    lead.program_id         ? `Пакет:       ${lead.program_id}` : '',
    lead.transfer_week      ? `Тиждень:     ${lead.transfer_week}` : '',
    lead.has_medical_records ? `Документи:  ${lead.has_medical_records}` : '',
    '',
    `Кабінет:     ${cabinetUrl}`,
  ].filter(Boolean);

  return rows.join('\n');
}

async function sendEmailViaResend(lead: LeadPayload, cabinetUrl: string): Promise<void> {
  const apiKey    = process.env.RESEND_API_KEY;
  const toEmail   = process.env.MEDOK_NOTIFY_EMAIL;
  const ccEmail   = process.env.MEDOK_NOTIFY_CC;

  if (!apiKey || !toEmail) return;

  const formLabel =
    lead.form_type === 'transfer'        ? 'Перехід'
    : lead.form_type === 'callback'      ? 'Дзвінок'
    : lead.form_type === 'doctor_booking' ? 'Запис до лікаря'
    : 'Квіз';

  const subject = `[MED OK] ${formLabel}: ${lead.name} ${lead.phone}`;
  const text    = buildEmailBody(lead, cabinetUrl);

  const payload: Record<string, unknown> = {
    from: 'MED OK <notify@medok.check-up.in.ua>',
    to:   [toEmail],
    subject,
    text,
  };
  if (ccEmail) payload.cc = [ccEmail];

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  }).catch((err) => console.error('[EMAIL ERROR]', err));
}

// ── telegram helpers ──────────────────────────────────────────────────────────

function buildTelegramText(lead: LeadPayload, cabinetUrl: string): string {
  const lines: string[] = [];
  const emoji = lead.form_type === 'transfer'        ? '🔄'
    : lead.form_type === 'callback'      ? '📞'
    : lead.form_type === 'doctor_booking' ? '🩺'
    : '📋';

  lines.push(`${emoji} Новий запит — МЦ MED OK`);
  lines.push('');
  lines.push(`👤 ${lead.name}`);
  lines.push(`📱 ${lead.phone}`);

  if (lead.form_type === 'transfer') {
    lines.push(`📅 Термін: ${lead.transfer_week ?? '—'} тижнів`);
    if (lead.has_medical_records) lines.push(`📁 Документи: ${lead.has_medical_records}`);
    lines.push(`🏷️ Тип: Перехід з іншого лікаря`);
  } else if (lead.form_type === 'callback') {
    const messenger = lead.messenger === 'telegram' ? 'Telegram'
      : lead.messenger === 'viber' ? 'Viber'
      : 'Дзвінок';
    lines.push(`💬 Зв'язок: ${messenger}`);
    lines.push(`🏷️ Тип: Зворотній дзвінок`);
  } else if (lead.form_type === 'doctor_booking') {
    if (lead.doctor_name)  lines.push(`👩‍⚕️ Лікар: ${lead.doctor_name}`);
    const contactStr = lead.contact_method === 'telegram' ? 'Telegram'
      : lead.contact_method === 'viber'    ? 'Viber'
      : 'Дзвінок';
    lines.push(`💬 Зв'язок: ${contactStr}`);
    const purposeStr = lead.visit_purpose === 'program'      ? 'Програма вагітності'
      : lead.visit_purpose === 'consultation' ? 'Консультація вагітної'
      : 'Жіноча консультація';
    lines.push(`🏷️ Мета: ${purposeStr}`);
    if (lead.preferred_day && lead.preferred_day !== 'other') lines.push(`📅 День: ${lead.preferred_day}`);
    if (lead.referrer_url) lines.push(`🔗 Сторінка: ${lead.referrer_url}`);
  } else {
    if (lead.trimester)      lines.push(`🗓️ Триместр: ${lead.trimester}`);
    if (lead.pregnancy_type) lines.push(`👶 Тип: ${lead.pregnancy_type === 'twin' ? 'Двоплідна' : 'Одноплідна'}`);
    if (lead.program_id)     lines.push(`📦 Пакет: ${lead.program_id}`);
    if (lead.doctor_id)      lines.push(`👨‍⚕️ Лікар: ${lead.doctor_id}`);
    if (lead.messenger)      lines.push(`💬 Месенджер: ${lead.messenger}`);
  }

  if (lead.preferred_dates && lead.preferred_dates.length > 0) {
    lines.push('');
    lines.push('📆 Зручний час:');
    lead.preferred_dates.forEach((pd) => {
      const ranges = pd.ranges.map((r: string) =>
        r === 'morning' ? 'ранок' : r === 'afternoon' ? 'день' : 'вечір'
      ).join(', ');
      lines.push(`  ${pd.date} — ${ranges}`);
    });
  }

  if (lead.preferred_slots && lead.preferred_slots.length > 0) {
    lines.push('');
    lines.push('🕐 Слоти:');
    lead.preferred_slots.forEach((s) => lines.push(`  ${s}`));
  }

  lines.push('');
  lines.push(`🔗 Кабінет: ${cabinetUrl}`);

  return lines.join('\n');
}

async function sendTelegram(text: string): Promise<void> {
  const token  = process.env.MEDOK_TG_BOT_TOKEN;
  const chatId = process.env.MEDOK_TG_CHAT_ID;
  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  }).catch(() => {/* non-fatal */});
}

// ── handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: LeadPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.name?.trim() || !body.phone?.trim()) {
    return NextResponse.json({ error: 'name and phone required' }, { status: 422 });
  }

  // ── Phone normalization + validation ─────────────────────────────────────
  const normalizedPhone = normalizePhone(body.phone);

  if (isSpamPhone(normalizedPhone)) {
    // Silently accept spam (don't reveal detection)
    return NextResponse.json({ cabinet_url: null, spam: true });
  }

  if (!isValidUkrainianPhone(normalizedPhone)) {
    return NextResponse.json(
      { error: 'Некоректний номер телефону. Введіть у форматі 0XX XXX XXXX.' },
      { status: 422 }
    );
  }

  const sanitizedBody: LeadPayload = { ...body, phone: normalizedPhone };

  // ── DB ────────────────────────────────────────────────────────────────────
  const supabase = createServiceClient();
  const origin   = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://medok.check-up.in.ua';

  // INSERT lead — trigger auto_create_cabinet fires and creates cabinet row
  const { data: lead, error: leadError } = await supabase
    .from('medok_leads')
    .insert({
      name:               sanitizedBody.name.trim(),
      phone:              normalizedPhone,
      form_type:          sanitizedBody.form_type ?? 'quiz',
      trimester:          sanitizedBody.trimester          ?? null,
      pregnancy_type:     sanitizedBody.pregnancy_type     ?? null,
      program_id:         sanitizedBody.program_id         ?? null,
      doctor_id:          sanitizedBody.doctor_id          ?? null,
      messenger:          sanitizedBody.messenger          ?? null,
      preferred_dates:    sanitizedBody.preferred_dates    ?? null,
      transfer_week:      sanitizedBody.transfer_week      ?? null,
      has_medical_records: sanitizedBody.has_medical_records ?? null,
      // new fields (booking system)
      quiz_answers:       sanitizedBody.quiz_answers       ?? null,
      is_existing_patient: sanitizedBody.is_existing_patient ?? null,
      // doctor_booking fields
      contact_method:     sanitizedBody.contact_method     ?? null,
      visit_purpose:      sanitizedBody.visit_purpose      ?? null,
      preferred_day:      sanitizedBody.preferred_day      ?? null,
      doctor_slug:        sanitizedBody.doctor_slug        ?? null,
      doctor_name:        sanitizedBody.doctor_name        ?? null,
      referrer_url:       sanitizedBody.referrer_url       ?? null,
      city:               sanitizedBody.city               ?? null,
      status: 'new',
    })
    .select('id')
    .single();

  if (leadError || !lead) {
    console.error('[LEAD ERROR]', leadError);
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  // Fetch UUID created by trigger (auto_create_cabinet)
  const { data: cabinet } = await supabase
    .from('medok_cabinets')
    .select('uuid')
    .eq('lead_id', lead.id)
    .single();

  const cabinetUuid = cabinet?.uuid ?? '';
  const cabinetUrl  = cabinetUuid ? `${origin}/o/${cabinetUuid}` : '';

  // ── Notifications (non-blocking) ─────────────────────────────────────────
  const tgText = buildTelegramText(sanitizedBody, cabinetUrl);
  await Promise.allSettled([
    sendTelegram(tgText),
    sendEmailViaResend(sanitizedBody, cabinetUrl),
  ]);

  return NextResponse.json({ cabinet_url: cabinetUrl, cabinet_uuid: cabinetUuid });
}
