import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;
  const token = req.nextUrl.searchParams.get('token');

  if (token !== process.env.MEDOK_CONFIRM_TOKEN) {
    return new NextResponse(html('❌ Невірний токен', 'Посилання недійсне або застаріле.'), {
      status: 403,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const supabase = createServiceClient();

  const { data: cabinet, error } = await supabase
    .from('medok_cabinets')
    .select('uuid, patient_name, appointment_status')
    .eq('uuid', uuid)
    .single();

  if (error || !cabinet) {
    return new NextResponse(html('❌ Не знайдено', 'Кабінет з таким ID не існує.'), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  if (cabinet.appointment_status === 'confirmed') {
    return new NextResponse(
      html('✅ Вже підтверджено', `Запис ${cabinet.patient_name} вже підтверджено раніше.`),
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const { error: updateError } = await supabase
    .from('medok_cabinets')
    .update({ appointment_status: 'confirmed' })
    .eq('uuid', uuid);

  if (updateError) {
    return new NextResponse(html('❌ Помилка', 'Не вдалося оновити статус. Спробуйте ще раз.'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Also update lead status
  await supabase
    .from('medok_leads')
    .update({ status: 'confirmed' })
    .eq('id', supabase.from('medok_cabinets').select('lead_id').eq('uuid', uuid));

  return new NextResponse(
    html('✅ Підтверджено', `Запис пацієнтки ${cabinet.patient_name} успішно підтверджено.`),
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

function html(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — MED OK</title>
  <style>
    body { font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f4f6f8; }
    .card { background: #fff; border-radius: 16px; padding: 40px 48px; text-align: center; box-shadow: 0 2px 20px rgba(0,0,0,.08); max-width: 400px; }
    h1 { font-size: 22px; margin: 0 0 12px; color: #111; }
    p { color: #555; font-size: 15px; line-height: 1.6; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
