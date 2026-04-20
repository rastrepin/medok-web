/**
 * Daily cron: find leads that are 48h+ old and still not confirmed,
 * email the admin a digest, and mark each lead's stale_notified_at.
 *
 * Triggered by Vercel Cron (see vercel.json).
 *
 * Auth: Vercel signs cron requests with the project's CRON_SECRET as a bearer
 * token in `Authorization`. We also accept a manual `?secret=...` query param
 * for debugging.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TO_EMAIL = 'med.ok.podillia@gmail.com';
const CC_EMAIL = 'okay@check-up.in.ua';
const FROM_EMAIL = 'Сайт MED OK DOVIRA <noreply@check-up.in.ua>';
const STALE_HOURS = 48;
const RENOTIFY_DAYS = 7;

type StaleLead = {
  id: number;
  name: string | null;
  phone: string | null;
  created_at: string;
  form_type: string | null;
  trimester: string | null;
  pregnancy_type: string | null;
  doctor_name: string | null;
  contact_method: string | null;
  preferred_day: string | null;
  stale_notified_at: string | null;
  medok_cabinets: { uuid: string } | { uuid: string }[] | null;
};

const TRIMESTER_UA: Record<string, string> = {
  first: 'I', i: 'I', second: 'II', ii: 'II', third: 'III', iii: 'III', full: 'вся', all: 'вся',
};

const FORM_UA: Record<string, string> = {
  quiz: 'Квіз',
  callback: 'Дзвінок',
  transfer: 'Перехід з клініки',
  doctor_booking: 'До лікаря',
};

function formatKyiv(isoDate: string): string {
  return new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kiev',
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  }).format(new Date(isoDate));
}

function renderHtml(rows: StaleLead[]): string {
  const tr = rows
    .map((r) => {
      const cab = Array.isArray(r.medok_cabinets) ? r.medok_cabinets[0] : r.medok_cabinets;
      const uuid = cab?.uuid;
      const cabUrl = uuid ? `https://medok.check-up.in.ua/o/${uuid}` : '';
      const trim = r.trimester ? TRIMESTER_UA[r.trimester] ?? r.trimester : '—';
      const form = r.form_type ? FORM_UA[r.form_type] ?? r.form_type : '—';
      const hoursOld = Math.round(
        (Date.now() - new Date(r.created_at).getTime()) / 3_600_000,
      );

      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;font:14px/1.4 system-ui">
            <strong style="color:#1A1A2E">${escapeHtml(r.name ?? '—')}</strong><br>
            <span style="color:#6B7280">#${r.id} · ${escapeHtml(form)} · ${hoursOld}г. тому</span>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;font:14px/1.4 system-ui;color:#1A1A2E">
            ${escapeHtml(r.phone ?? '—')}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;font:14px/1.4 system-ui;color:#374151">
            ${trim}${r.pregnancy_type === 'twin' ? ' · двійня' : ''}${r.doctor_name ? '<br>' + escapeHtml(r.doctor_name) : ''}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;font:14px/1.4 system-ui;text-align:right">
            ${uuid ? `<a href="${cabUrl}" style="color:#1a7c75;text-decoration:none;font-weight:600">Кабінет ↗</a>` : ''}
          </td>
        </tr>
      `;
    })
    .join('');

  const now = formatKyiv(new Date().toISOString());

  return `<!doctype html><html><body style="margin:0;background:#F9FAFB;padding:24px">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.04)">
      <div style="background:#1a7c75;color:#fff;padding:20px 24px">
        <div style="font:600 13px/1 system-ui;letter-spacing:.08em;text-transform:uppercase;opacity:.8">MED OK · stale leads</div>
        <div style="font:700 22px/1.2 Comfortaa,cursive;margin-top:6px">Непідтверджені заявки · ${rows.length}</div>
        <div style="font:14px/1.4 system-ui;opacity:.85;margin-top:4px">Звіт ${now} (Київ)</div>
      </div>
      <div style="padding:20px 24px;font:14px/1.5 system-ui;color:#374151">
        Ці заявки чекають на підтвердження ≥ ${STALE_HOURS} годин. Будь ласка, зателефонуйте пацієнтам або позначте їх у адмінці як оброблені.
      </div>
      <table style="width:100%;border-collapse:collapse">
        ${tr}
      </table>
      <div style="padding:16px 24px;background:#F9FAFB;font:12px/1.4 system-ui;color:#6B7280">
        Автоматичне повідомлення · daily 09:00 Kyiv · medok.check-up.in.ua
      </div>
    </div>
  </body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get('authorization');
  if (auth === `Bearer ${secret}`) return true;
  const q = req.nextUrl.searchParams.get('secret');
  return q === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: 'resend_not_configured' }, { status: 500 });
  }

  const supabase = createServiceClient();

  const staleBefore = new Date(Date.now() - STALE_HOURS * 3_600_000).toISOString();
  const renotifyBefore = new Date(Date.now() - RENOTIFY_DAYS * 86_400_000).toISOString();

  // Stale = older than 48h, not confirmed, not previously notified (or notified >7d ago).
  // We filter in JS for the cabinet.confirmed_at join because PostgREST
  // doesn't let us express "joined.confirmed_at IS NULL" cleanly in one call.
  const { data: leads, error } = await supabase
    .from('medok_leads')
    .select(
      'id, name, phone, created_at, form_type, trimester, pregnancy_type, doctor_name, contact_method, preferred_day, stale_notified_at, medok_cabinets(uuid, confirmed_at, appointment_status)',
    )
    .lt('created_at', staleBefore)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[cron/stale-leads] query failed', error);
    return NextResponse.json({ error: 'query_failed', detail: error.message }, { status: 500 });
  }

  const stale = (leads ?? []).filter((l) => {
    const cabList = Array.isArray(l.medok_cabinets) ? l.medok_cabinets : l.medok_cabinets ? [l.medok_cabinets] : [];
    const cab = cabList[0] as { confirmed_at?: string | null; appointment_status?: string | null } | undefined;
    const isConfirmed = !!cab?.confirmed_at || cab?.appointment_status === 'confirmed';
    if (isConfirmed) return false;
    if (!l.stale_notified_at) return true;
    return l.stale_notified_at < renotifyBefore;
  }) as StaleLead[];

  if (stale.length === 0) {
    return NextResponse.json({ ok: true, stale: 0, notified: 0 });
  }

  const html = renderHtml(stale);
  const subject = `MED OK · ${stale.length} непідтверджен${stale.length === 1 ? 'а заявка' : stale.length < 5 ? 'і заявки' : 'их заявок'} ≥ 48г`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      cc: [CC_EMAIL],
      reply_to: TO_EMAIL,
      subject,
      html,
    }),
  });

  const resendResult = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('[cron/stale-leads] resend failed', res.status, resendResult);
    return NextResponse.json(
      { error: 'resend_failed', status: res.status, detail: resendResult },
      { status: 500 },
    );
  }

  const now = new Date().toISOString();
  const ids = stale.map((l) => l.id);
  const { error: updateError } = await supabase
    .from('medok_leads')
    .update({ stale_notified_at: now })
    .in('id', ids);

  if (updateError) {
    console.error('[cron/stale-leads] mark failed (email was sent)', updateError);
  }

  return NextResponse.json({
    ok: true,
    stale: stale.length,
    notified: ids.length,
    ids,
  });
}
