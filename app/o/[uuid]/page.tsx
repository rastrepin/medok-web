import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Запис прийнято — МЦ MED OK',
  robots: { index: false },
};

export default function OnboardingStub() {
  return (
    <main style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ marginBottom: 24 }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
            stroke="var(--teal)" strokeWidth="2" strokeLinecap="round"
            style={{ margin: '0 auto' }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="h2" style={{ marginBottom: 12 }}>Дякуємо!</h1>
        <p className="body" style={{ color: 'var(--gray-700)', marginBottom: 8 }}>
          Ваш запит прийнято. Адміністратор зв'яжеться з вами протягом дня для підтвердження.
        </p>
        <p className="caption" style={{ color: 'var(--gray-500)', marginBottom: 32 }}>
          Пн–Пт 8:00–20:00 · Сб 9:00–15:00
        </p>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          color: 'var(--teal-dark)', fontSize: 15, fontWeight: 600, textDecoration: 'none',
        }}>
          ← Повернутись на головну
        </Link>
      </div>
    </main>
  );
}
