import { NextRequest, NextResponse } from 'next/server';
import { fetchEnrichedCabinet } from '@/lib/cabinet-query';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cabinet/[uuid]
 * Public endpoint — fetches enriched cabinet (lead + program + doctor)
 * used by the onboarding page /o/{uuid}.
 * Access is gated only by the UUID; RLS is intentionally permissive.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await params;
  if (!uuid) {
    return NextResponse.json({ error: 'uuid required' }, { status: 400 });
  }

  const result = await fetchEnrichedCabinet({ uuid });
  if (!result) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  return NextResponse.json(result.cabinet, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
