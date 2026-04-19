import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      session_id, event_type, modal_type, step_number,
      step_value, source_page, source_cta, device,
      utm_source, utm_medium, utm_campaign,
    } = body;

    if (!session_id || !event_type) {
      return new NextResponse(null, { status: 204 });
    }

    const supabase = createServiceClient();
    await supabase.from('medok_quiz_events').insert({
      session_id, event_type, modal_type, step_number,
      step_value, source_page, source_cta, device,
      utm_source, utm_medium, utm_campaign,
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    // fire-and-forget — завжди 204
    return new NextResponse(null, { status: 204 });
  }
}
