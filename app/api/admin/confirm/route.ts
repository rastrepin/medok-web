import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const KYIV_TZ = 'Europe/Kiev';
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

interface Body {
  token?: string;
  date?: string;       // YYYY-MM-DD
  time?: string;       // HH:MM
  admin_note?: string;
  admin_name?: string; // optional display name → confirmed_by
}

/** Build a Europe/Kiev wall-time → UTC ISO string (handles DST). */
function kyivLocalToUtcIso(dateStr: string, timeStr: string): string | null {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [hh, mm]   = timeStr.split(':').map(Number);
  if (!y || !mo || !d || hh === undefined || mm === undefined) return null;

  const utcGuess = Date.UTC(y, mo - 1, d, hh, mm);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: KYIV_TZ, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).formatToParts(new Date(utcGuess));
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const kyivIso = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'));
  const offsetMs = kyivIso - utcGuess;
  return new Date(utcGuess - offsetMs).toISOString();
}

export async function POST(req: NextRequest) {
  let body: Body;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  const token = body.token?.trim();
  const date  = body.date?.trim();
  const time  = body.time?.trim();
  const note  = body.admin_note?.trim() || null;
  const admin = body.admin_name?.trim() || 'admin';

  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 });
  if (!date || !DATE_RE.test(date)) {
    return NextResponse.json({ error: 'date must be YYYY-MM-DD' }, { status: 422 });
  }
  if (!time || !TIME_RE.test(time)) {
    return NextResponse.json({ error: 'time must be HH:MM' }, { status: 422 });
  }

  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: KYIV_TZ }).format(new Date());
  if (date < today) {
    return NextResponse.json({ error: 'date_in_past' }, { status: 422 });
  }

  const appointmentIso = kyivLocalToUtcIso(date, time);
  if (!appointmentIso) {
    return NextResponse.json({ error: 'invalid datetime' }, { status: 422 });
  }

  const supabase = createServiceClient();

  const { data: cab, error: fetchError } = await supabase
    .from('medok_cabinets')
    .select('uuid, appointment_status, token_expires_at, lead_id')
    .eq('confirmation_token', token)
    .maybeSingle();

  if (fetchError) {
    console.error('[admin/confirm fetch error]', fetchError);
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }
  if (!cab) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 404 });
  }
  if (cab.token_expires_at && new Date(cab.token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'token_expired' }, { status: 410 });
  }
  if (cab.appointment_status && cab.appointment_status !== 'pending') {
    return NextResponse.json(
      { error: 'not_pending', current_status: cab.appointment_status },
      { status: 409 },
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from('medok_cabinets')
    .update({
      appointment_status: 'confirmed',
      appointment_date:   appointmentIso,
      confirmed_at:       new Date().toISOString(),
      confirmed_by:       admin,
      notes:              note,
      updated_at:         new Date().toISOString(),
    })
    .eq('uuid', cab.uuid)
    .select('uuid, appointment_status, appointment_date, confirmed_at, confirmed_by')
    .single();

  if (updateError || !updated) {
    console.error('[admin/confirm update error]', updateError);
    return NextResponse.json({ error: 'update_failed' }, { status: 500 });
  }

  if (cab.lead_id) {
    await supabase
      .from('medok_leads')
      .update({ status: 'confirmed' })
      .eq('id', cab.lead_id)
      .then(() => undefined, () => undefined);
  }

  return NextResponse.json({ ok: true, cabinet: updated });
}
