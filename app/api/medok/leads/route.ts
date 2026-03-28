import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { LeadPayload } from '@/lib/types';
import { randomUUID } from 'crypto';

// ── helpers ──────────────────────────────────────────────────────────────────

function buildTelegramText(lead: LeadPayload, cabinetUrl: string): string {
  const lines: string[] = [];
  const emoji = lead.form_type === 'transfer' ? '🔄' : '📋';

  lines.push(`${emoji} Новий запит - МЦ MED OK`);
  lines.push('');
  lines.push(`👤 ${lead.name}`);
  lines.push(`📱 ${lead.phone}`);

  if (lead.form_type === 'transfer') {
    lines.push(`📅 Термін: ${lead.transfer_week ?? '—'} тижнів`);
    if (lead.has_medical_records) {
      lines.push(`📁 Документи: ${lead.has_medical_records}`);
    }
    lines.push(`🏷️ Тип: Перехід з іншого лікаря`);
  } else {
    if (lead.trimester) lines.push(`🗓️ Триместр: ${lead.trimester}`);
    if (lead.pregnancy_type) lines.push(`👶 Тип: ${lead.pregnancy_type === 'twin' ? 'Двоплідна' : 'Одноплідна'}`);
    if (lead.program_id) lines.push(`📦 Пакет: ${lead.program_id}`);
    if (lead.doctor_id) lines.push(`👨‍⚕️ Лікар: ${lead.doctor_id}`);
  }

  if (lead.messenger) lines.push(`💬 Месенджер: ${lead.messenger}`);

  if (lead.preferred_dates && lead.preferred_dates.length > 0) {
    lines.push('');
    lines.push('📆 Зручний час:');
    lead.preferred_dates.forEach((pd) => {
      const ranges = pd.ranges.map((r: string) =>
        r === 'morning' ? 'ранок' : r === 'afternoon' ? 'день' : 'вечір'
      ).join(', ');
      lines.push(`  ${pd.date} - ${ranges}`);
    });
  }

  lines.push('');
  lines.push(`🔗 Кабінет: ${cabinetUrl}`);

  return lines.join('\n');
}

async function sendTelegram(text: string): Promise<void> {
  const token = process.env.MEDOK_TG_BOT_TOKEN;
  const chatId = process.env.MEDOK_TG_CHAT_ID;
  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  }).catch(() => {/* non-fatal */});
}

async function sendEmail(lead: LeadPayload, cabinetUrl: string): Promise<void> {
  const email = process.env.MEDOK_EMAIL;
  if (!email) return;

  const subject = lead.form_type === 'transfer'
    ? `Перехід: ${lead.name} (${lead.phone})`
    : `Новий запит: ${lead.name} (${lead.phone})`;

  const body = `
Ім'я: ${lead.name}
Телефон: ${lead.phone}
Тип форми: ${lead.form_type}
${lead.trimester ? `Триместр: ${lead.trimester}` : ''}
${lead.program_id ? `Пакет: ${lead.program_id}` : ''}
${lead.doctor_id ? `Лікар: ${lead.doctor_id}` : ''}
${lead.transfer_week ? `Тиждень: ${lead.transfer_week}` : ''}
${lead.has_medical_records ? `Документи: ${lead.has_medical_records}` : ''}
${lead.messenger ? `Месенджер: ${lead.messenger}` : ''}
Кабінет: ${cabinetUrl}
`.trim();

  // Use nodemailer or Resend if configured
  // For now just log - real email requires SMTP config
  console.log('[EMAIL]', subject, body);
}

// ── handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: LeadPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.name || !body.phone) {
    return NextResponse.json({ error: 'name and phone required' }, { status: 422 });
  }

  const supabase = createServiceClient();
  const cabinetUuid = randomUUID();
  const origin = req.headers.get('origin') || 'https://medok.check-up.in.ua';
  const cabinetUrl = `${origin}/cabinet/${cabinetUuid}`;

  // 1. Insert lead
  const { data: lead, error: leadError } = await supabase
    .from('medok_leads')
    .insert({
      name: body.name,
      phone: body.phone,
      form_type: body.form_type ?? 'quiz',
      trimester: body.trimester ?? null,
      pregnancy_type: body.pregnancy_type ?? null,
      program_id: body.program_id ?? null,
      doctor_id: body.doctor_id ?? null,
      messenger: body.messenger ?? null,
      preferred_dates: body.preferred_dates ?? null,
      transfer_week: body.transfer_week ?? null,
      has_medical_records: body.has_medical_records ?? null,
      status: 'new',
    })
    .select('id')
    .single();

  if (leadError || !lead) {
    console.error('[LEAD ERROR]', leadError);
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  // 2. Create cabinet
  const { error: cabError } = await supabase
    .from('medok_cabinets')
    .insert({
      uuid: cabinetUuid,
      lead_id: lead.id,
      patient_name: body.name,
      patient_phone: body.phone,
      program_id: body.program_id ?? null,
      doctor_id: body.doctor_id ?? null,
      trimester: body.trimester ?? null,
      appointment_status: 'pending',
    });

  if (cabError) {
    console.error('[CABINET ERROR]', cabError);
    // Don't fail the whole request — cabinet is secondary
  }

  // 3. Notifications (non-blocking)
  const tgText = buildTelegramText(body, cabinetUrl);
  await Promise.allSettled([
    sendTelegram(tgText),
    sendEmail(body, cabinetUrl),
  ]);

  return NextResponse.json({ cabinet_url: cabinetUrl });
}
