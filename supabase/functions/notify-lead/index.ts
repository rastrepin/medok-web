import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// ── config ────────────────────────────────────────────────────────────────────

const RESEND_API_KEY          = Deno.env.get('RESEND_API_KEY')!;
const SUPABASE_URL            = Deno.env.get('SUPABASE_URL') ?? 'https://apuivrfokciooovrpmgj.supabase.co';
const SUPABASE_SERVICE_ROLE   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SITE_URL                = Deno.env.get('SITE_URL') ?? 'https://medok.check-up.in.ua';
const TO_EMAIL                = 'med.ok.podillia@gmail.com';
const BCC_EMAIL               = 'info@check-up.in.ua';

// ── translation maps ──────────────────────────────────────────────────────────

const TRIMESTER_UA: Record<string, string> = {
  first:  'I триместр',
  second: 'II триместр',
  third:  'III триместр',
  full:   'Вся вагітність',
  i:      'I триместр',
  ii:     'II триместр',
  iii:    'III триместр',
};

const PROGRAM_UA: Record<string, string> = {
  'i-single':    'I триместр · Одноплідна',
  'i-twin':      'I триместр · Двоплідна',
  'ii-single':   'II триместр · Одноплідна',
  'ii-twin':     'II триместр · Двоплідна',
  'iii-single':  'III триместр · Одноплідна',
  'iii-twin':    'III триместр · Двоплідна',
  'full-single': 'Вся вагітність · Одноплідна',
  'full-twin':   'Вся вагітність · Двоплідна',
};

// ── label helpers ─────────────────────────────────────────────────────────────

function formLabel(type: string): string {
  if (type === 'transfer')       return 'Перехід з клініки';
  if (type === 'callback')       return 'Зворотній дзвінок';
  if (type === 'doctor_booking') return 'Запис до лікаря';
  return 'Квіз / підбір програми';
}

function contactLabel(r: Record<string, unknown>): string {
  const m = (r.contact_method ?? r.messenger) as string | undefined;
  if (m === 'telegram') return 'Telegram';
  if (m === 'viber')    return 'Viber';
  if (m === 'phone')    return 'Дзвінок';
  return '—';
}

function purposeLabel(p: string | undefined): string {
  if (!p) return '';
  if (p === 'program')       return 'Програма ведення вагітності';
  if (p === 'consultation')  return 'Консультація вагітної';
  if (p === 'gynecology')    return 'Жіноча консультація';
  if (p === 'uzd_screening') return 'УЗД скринінг';
  if (p === 'uzd_referral')  return 'УЗД за направленням';
  if (p === 'uzd_consult')   return 'Консультація УЗД';
  return p;
}

const trimesterLabel = (t: string) => TRIMESTER_UA[t] ?? t;
const programLabel   = (id: string) => PROGRAM_UA[id] ?? id;

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:7px 16px 7px 0;color:#6B7280;font-size:13px;white-space:nowrap;vertical-align:top;font-weight:500;">${label}</td>
    <td style="padding:7px 0;color:#1A1A2E;font-size:14px;">${value}</td>
  </tr>`;
}

// Normalize Ukrainian phone for tel: link (+380...)
function telHref(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (trimmed.startsWith('+')) return trimmed.replace(/[\s()-]/g, '');
  const digits = trimmed.replace(/\D/g, '');
  if (digits.startsWith('380')) return '+' + digits;
  if (digits.startsWith('0') && digits.length === 10) return '+38' + digits;
  return '+' + digits;
}

// ── fetch cabinet/token from medok_cabinets ───────────────────────────────────
interface CabinetBits { uuid: string; confirmation_token: string | null }

async function fetchCabinetForLead(leadId: number | string | undefined): Promise<CabinetBits | null> {
  if (!leadId) return null;
  try {
    const url = `${SUPABASE_URL}/rest/v1/medok_cabinets?select=uuid,confirmation_token&lead_id=eq.${encodeURIComponent(String(leadId))}&order=created_at.desc&limit=1`;
    const res = await fetch(url, {
      headers: {
        'apikey':        SUPABASE_SERVICE_ROLE,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
      },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<CabinetBits>;
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

// ── handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  let record: Record<string, unknown>;
  try {
    const body = await req.json();
    record = (body.record ?? body) as Record<string, unknown>;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const label   = formLabel((record.form_type as string) ?? '');
  const name    = String(record.name ?? '—');
  const phone   = (record.phone as string) ?? '';
  const tel     = telHref(phone);
  const subject = `[MED OK] ${label}: ${name} ${phone}`;

  let doctorDisplay: string | null = (record.doctor_name as string) || null;
  if (!doctorDisplay && record.doctor_id) doctorDisplay = String(record.doctor_id);

  const createdAt = record.created_at
    ? new Date(record.created_at as string).toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })
    : '';

  const cabinet = await fetchCabinetForLead(record.id as number | string | undefined);
  const cabinetUuid  = cabinet?.uuid ?? null;
  const cabinetToken = cabinet?.confirmation_token ?? null;
  const confirmUrl   = cabinetToken ? `${SITE_URL}/admin/confirm?token=${encodeURIComponent(cabinetToken)}` : null;
  const cabinetUrl   = cabinetUuid  ? `${SITE_URL}/o/${cabinetUuid}` : null;

  // details table
  const phoneHtml = tel
    ? `<a href="tel:${tel}" style="color:#1a7c75;text-decoration:none;font-weight:600;">${phone}</a>`
    : phone;

  let rows = '';
  rows += row("Ім'я",       name);
  rows += row('Телефон',    phoneHtml);
  rows += row('Тип форми',  label);
  rows += row("Зв'язок",    contactLabel(record));
  if (record.visit_purpose) rows += row('Мета',      purposeLabel(record.visit_purpose as string));
  if (record.preferred_day) rows += row('День',      String(record.preferred_day));
  if (doctorDisplay)        rows += row('Лікар',     doctorDisplay);
  if (record.referrer_url)  rows += row('Сторінка',  String(record.referrer_url));
  if (record.city)          rows += row('Місто',     String(record.city));
  if (record.trimester)     rows += row('Триместр',  trimesterLabel(record.trimester as string));
  if (record.transfer_week) rows += row('Тиждень вагітності', `${record.transfer_week} тиж.`);
  if (record.program_id)    rows += row('Пакет',     programLabel(record.program_id as string));
  if (cabinetUrl)           rows += row('Кабінет пацієнтки',
    `<a href="${cabinetUrl}" style="color:#1a7c75;text-decoration:underline;">${cabinetUrl.replace(SITE_URL, '')}</a>`);
  rows += row('Час заявки', createdAt);

  // CTA buttons (Gmail-safe: table + bg colors, not flex)
  const confirmButton = confirmUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
         <tr><td style="border-radius:999px;background:#1a7c75;">
           <a href="${confirmUrl}"
              style="display:inline-block;padding:14px 28px;color:#ffffff;font-weight:700;
                     font-size:14px;letter-spacing:0.08em;text-transform:uppercase;
                     text-decoration:none;border-radius:999px;min-width:220px;text-align:center;">
             Підтвердити запис
           </a>
         </td></tr>
       </table>`
    : '';

  const callButton = tel
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
         <tr><td style="border-radius:999px;background:#ffffff;border:1.5px solid #1a7c75;">
           <a href="tel:${tel}"
              style="display:inline-block;padding:13px 26px;color:#1a7c75;font-weight:700;
                     font-size:14px;letter-spacing:0.04em;
                     text-decoration:none;border-radius:999px;min-width:220px;text-align:center;">
             📞 Зателефонувати
           </a>
         </td></tr>
       </table>`
    : '';

  const ctaBlock = (confirmButton || callButton)
    ? `<div style="padding:6px 28px 22px;">
         <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
           ${confirmButton ? `<tr><td align="center" style="padding:8px 0;">${confirmButton}</td></tr>` : ''}
           ${callButton    ? `<tr><td align="center" style="padding:8px 0;">${callButton}</td></tr>`    : ''}
         </table>
         ${confirmUrl
            ? `<p style="margin:14px 0 0;color:#6B7280;font-size:11px;line-height:1.5;text-align:center;">
                 Посилання діє 7 днів. Підтвердження відбувається на сторінці з date+time — автоматичних підтверджень через відкриття email не буде.
               </p>`
            : ''}
       </div>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#F9FAFB;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

    <div style="background:#1a7c75;padding:22px 28px;">
      <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">Нова заявка — MED OK DOVIRA</h1>
      <p style="margin:5px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">${label}</p>
    </div>

    <div style="padding:24px 28px 12px;">
      <table style="width:100%;border-collapse:collapse;">
        ${rows}
      </table>
    </div>

    ${ctaBlock}

    <div style="padding:12px 28px 14px;background:#F3F4F6;border-top:1px solid #E5E7EB;">
      <p style="margin:0;color:#9CA3AF;font-size:11px;">Автоматичне сповіщення · check-up.in.ua · Для відповіді просто натисніть Reply</p>
    </div>

  </div>
</body>
</html>`;

  const payload = {
    from:     'Сайт MED OK DOVIRA <noreply@check-up.in.ua>',
    to:       [TO_EMAIL],
    bcc:      [BCC_EMAIL],
    reply_to: TO_EMAIL,
    subject,
    html,
  };

  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  console.log('[notify-lead]', res.status, JSON.stringify(data));

  // Mark email_sent_at on cabinet (non-blocking)
  if (cabinetUuid && res.ok) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/medok_cabinets?uuid=eq.${encodeURIComponent(cabinetUuid)}`, {
        method: 'PATCH',
        headers: {
          'apikey':        SUPABASE_SERVICE_ROLE,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
          'Content-Type':  'application/json',
          'Prefer':        'return=minimal',
        },
        body: JSON.stringify({ email_sent_at: new Date().toISOString() }),
      });
    } catch { /* non-fatal */ }
  }

  return new Response(JSON.stringify({ ok: res.ok, status: res.status, data }), {
    status:  res.ok ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
});
