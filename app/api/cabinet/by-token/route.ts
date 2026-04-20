import { NextRequest, NextResponse } from 'next/server';
import { fetchEnrichedCabinet } from '@/lib/cabinet-query';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cabinet/by-token?token=xxx
 * Admin-facing — used by /admin/confirm page to load the enriched cabinet
 * without exposing the UUID. Returns the same payload as /api/cabinet/[uuid]
 * plus token_state.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'token required' }, { status: 400 });
  }

  const result = await fetchEnrichedCabinet({ token });
  if (!result) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 404 });
  }

  if (!result.token_valid) {
    return NextResponse.json(
      { error: 'token_expired', status: result.raw_status },
      { status: 410 },
    );
  }

  return NextResponse.json(
    {
      cabinet: result.cabinet,
      already_confirmed: result.raw_status !== 'pending',
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
