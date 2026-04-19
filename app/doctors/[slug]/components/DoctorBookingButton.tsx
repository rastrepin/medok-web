'use client';
import { useBookingModal } from '@/components/booking/useBookingModal';

type Props = {
  slug: string;
  label: string;
  source?: string;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  id?: string;
};

export default function DoctorBookingButton({
  slug,
  label,
  source = 'doctor-page-cta',
  variant = 'primary',
  fullWidth = false,
  id,
}: Props) {
  const booking = useBookingModal();

  const isPrimary = variant === 'primary';

  return (
    <button
      id={id}
      onClick={() => booking.open('booking', { prefilledDoctorSlug: slug, source })}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: fullWidth ? '100%' : undefined,
        background: isPrimary ? '#1a7c75' : 'var(--white)',
        color: isPrimary ? '#fff' : 'var(--teal-dark)',
        border: isPrimary ? 'none' : '1.5px solid var(--teal-dark)',
        borderRadius: 9999,
        padding: '16px 28px',
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        minHeight: 48,
        transition: 'background 0.15s',
      }}
    >
      {label}
    </button>
  );
}
