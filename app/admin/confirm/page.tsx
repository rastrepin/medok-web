import type { Metadata } from 'next';
import AdminConfirmClient from './AdminConfirmClient';

export const metadata: Metadata = {
  title: 'Підтвердження запису — MED OK',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <AdminConfirmClient token={token ?? ''} />;
}
