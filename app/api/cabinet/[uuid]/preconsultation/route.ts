import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import type { PreconsultationData } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_KEYS: Array<keyof PreconsultationData> = [
  'pregnancy_week',
  'is_first_pregnancy',
  'previous_births_count',
  'previous_births_method',
  'chronic_conditions',
  'chronic_other',
  'current_medications',
  'allergies',
  'main_concern',
];

function isCompleted(p: PreconsultationData): boolean {
  const hasWeek = typeof p.pregnancy_week === 'number' && p.pregnancy_week >= 1 && p.pregnancy_week <= 41;
  const hasFirst = typeof p.is_first_pregnancy === 'boolean';
  const hasMeds = typeof p.current_medications === 'string';
  const hasAllergies = typeof p.allergies === 'string';
  const hasConcern = typeof p.main_concern === 'string' && p.main_concern.trim().length > 0;
  if (!hasFirst) return false;
  if (p.is_first_pregnancy === false) {
    if (typeof p.previous_births_count !== 'number' || p.previous_births_count < 1) return false;
    if (!p.previous_births_method) return false;
  }
  return hasWeek && hasMeds && hasAllergies && hasConcern;
}

function sanitize(input: Record<string, unknown>): Partial<PreconsultationData> {
  const out: Partial<PreconsultationData> = {};
  for (const k of ALLOWED_KEYS) {
    if (!(k in input)) continue;
    const v = input[k];
    switch (k) {
      case 'pregnancy_week': {
        if (v === null) out.pregnancy_week = null;
        else if (typeof v === 'number' && v >= 1 && v <= 41) out.pregnancy_week = Math.floor(v);
        break;
      }
      case 'is_first_pregnancy': {
        if (typeof v === 'boolean' || v === null) out.is_first_pregnancy = v as boolean | null;
        break;
      }
      case 'previous_births_count': {
        if (v === null) out.previous_births_count = null;
        else if (typeof v === 'number' && v >= 0 && v <= 20) out.previous_births_count = Math.floor(v);
        break;
      }
      case 'previous_births_method': {
        if (v === null) out.previous_births_method = null;
        else if (v === 'natural' || v === 'cesarean' || v === 'mixed') out.previous_births_method = v;
        break;
      }
      case 'chronic_conditions': {
        if (Array.isArray(v)) out.chronic_conditions = v.filter((x) => typeof x === 'string').slice(0, 20) as string[];
        else if (v === null) out.chronic_conditions = null;
        break;
      }
      case 'chronic_other':
      case 'current_medications':
      case 'allergies':
      case 'main_concern': {
        if (typeof v === 'string') out[k] = v.slice(0, 2000);
        else if (v === null) out[k] = null;
        break;
      }
    }
  }
  return out;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(uuid)) {
    return NextResponse.json({ error: 'invalid_uuid' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const patch = sanitize(body);
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'no_valid_fields' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: existing, error: selErr } = await supabase
    .from('medok_cabinets')
    .select('uuid, preconsultation')
    .eq('uuid', uuid)
    .maybeSingle();

  if (selErr) return NextResponse.json({ error: 'db_error' }, { status: 500 });
  if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const current = (existing.preconsultation ?? {}) as PreconsultationData;
  const merged: PreconsultationData = { ...current, ...patch };
  if (isCompleted(merged) && !merged.completed_at) {
    merged.completed_at = new Date().toISOString();
  }

  const { error: updErr } = await supabase
    .from('medok_cabinets')
    .update({ preconsultation: merged })
    .eq('uuid', uuid);

  if (updErr) return NextResponse.json({ error: 'update_failed' }, { status: 500 });

  return NextResponse.json({ preconsultation: merged }, { headers: { 'Cache-Control': 'no-store' } });
}
