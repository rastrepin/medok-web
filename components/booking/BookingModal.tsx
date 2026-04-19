'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomSheet from './BottomSheet';
import { IMaskInput } from 'react-imask';
import { track } from '@/lib/track';
import { getAvailableDays } from '@/lib/doctor-booking-utils';

type ContactMethod = 'phone' | 'telegram' | 'viber';

// Doctors shown in modal (name lookup for display)
const DOCTOR_NAMES: Record<string, { name: string; nameGenitive: string; role: string }> = {
  'kelman-viktoriia':   { name: 'Кельман Вікторія Володимирівна',  nameGenitive: 'до Кельман Вікторії',  role: 'Акушер-гінеколог, член FMF (Fetal Medicine Foundation)' },
  'yanyuk-olha':        { name: 'Янюк Ольга Олександрівна',         nameGenitive: 'до Янюк Ольги',     role: 'Акушер-гінеколог, УЗД' },
  'trofimchuk-tetiana': { name: 'Трофімчук Тетяна Ігорівна',   nameGenitive: 'до Трофімчук Тетяни',    role: 'Акушер-гінеколог' },
  'bondarchuk-zhanna':  { name: 'Бондарчук Жанна Геннадіївна',    nameGenitive: 'до Бондарчук Жанни',     role: 'УЗД-спеціаліст, член FMF (Fetal Medicine Foundation)' },
};

type Props = {
  open: boolean;
  onClose: () => void;
  prefilledDoctorSlug?: string;
  prefilledProgramId?: string;
  source: string;
};

export default function BookingModal({ open, onClose, prefilledDoctorSlug, source }: Props) {
  const router = useRouter();
  const [name,     setName]     = useState('');
  const [phone,    setPhone]    = useState('');
  const [contact,  setContact]  = useState<ContactMethod>('phone');
  const [day,      setDay]      = useState('');
  const [status,   setStatus]   = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [cabinetUuid, setCabinetUuid] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  const doctor   = prefilledDoctorSlug ? DOCTOR_NAMES[prefilledDoctorSlug] : null;
  const availDays = prefilledDoctorSlug
    ? getAvailableDays(prefilledDoctorSlug)
    : getAvailableDays(''); // falls back to clinic defaults handled below

  // Default generic days (найближчі 6 робочих: Пн-Пт) when no doctor prefilled
  const genericDays = (() => {
    const days = [];
    const now = new Date();
    for (let i = 1; i <= 30 && days.length < 6; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dow = d.getDay();
      if (dow >= 1 && dow <= 5) {
        const label = d.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' });
        days.push({ label: label.charAt(0).toUpperCase() + label.slice(1), value: d.toISOString().split('T')[0] });
      }
    }
    return days;
  })();

  const datePills = availDays.length > 0 ? availDays : genericDays;

  useEffect(() => {
    if (open && datePills.length > 0 && !day) setDay(datePills[0].value);
  }, [open]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open) {
      void track({ event_type: 'modal_opened', modal_type: 'booking', source_cta: source });
    }
  }, [open, source]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 12) {
      setErrorMsg('Введіть повний номер телефону');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/medok-leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone,
          form_type: prefilledDoctorSlug ? 'doctor_booking' : 'program_booking',
          contact_method: contact,
          preferred_day: day,
          doctor_slug: prefilledDoctorSlug ?? undefined,
          doctor_name: doctor?.name ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Помилка');
      void track({ event_type: 'form_submitted', modal_type: 'booking', source_cta: source });
      setCabinetUuid(data.cabinet_uuid ?? null);
      setStatus('success');
      setTimeout(() => {
        if (data.cabinet_uuid) router.push(`/o/${data.cabinet_uuid}`);
        else onClose();
      }, 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Щось пішло не так. Спробуйте ще раз.');
      setStatus('idle');
    }
  };


  // ── Success screen ──────────────────────────────────────────
  if (status === 'success') {
    return (
      <BottomSheet open={open} onClose={onClose} title="">
        <div style={{ textAlign: 'center', padding: '40px 8px' }}>
          <div style={{ marginBottom: 20 }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
              stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ margin: '0 auto', display: 'block' }}>
              <circle cx="12" cy="12" r="10"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
            color: 'var(--gray-900)', marginBottom: 12, textTransform: 'uppercase' }}>
            ЗАЯВКУ НАДІСЛАНО
          </p>
          <p style={{ fontSize: 15, color: 'var(--gray-700)', lineHeight: 1.6, marginBottom: 24 }}>
            Адміністратор зателефонує протягом дня для підтвердження запису.
          </p>
          {cabinetUuid && (
            <a href={`/o/${cabinetUuid}`}
              style={{ fontSize: 13, color: 'var(--teal-dark)', fontWeight: 600, textDecoration: 'none' }}>
              Деталі запису →
            </a>
          )}
        </div>
      </BottomSheet>
    );
  }

  const title = doctor ? `Запис ${doctor.nameGenitive}` : 'Запис на консультацію';

  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <p className="h3" style={{ marginBottom: 4 }}>{title}</p>
          {doctor && (
            <p className="caption" style={{ color: 'var(--teal-dark)' }}>{doctor.role}</p>
          )}
          {!doctor && (
            <p className="caption" style={{ color: 'var(--gray-500)' }}>
              Адміністратор уточнить деталі при дзвінку
            </p>
          )}
        </div>

        {/* Honeypot */}
        <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)}
          style={{ display: 'none' }} tabIndex={-1} aria-hidden />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label">Ваше ім'я</label>
            <input className="input" type="text" placeholder="Марія"
              value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Телефон</label>
            <IMaskInput
              mask="+{38} (000) 000-00-00"
              lazy={false}
              placeholderChar="_"
              type="tel"
              inputMode="numeric"
              className="input"
              value={phone}
              onAccept={(val: string) => setPhone(val)}
              required
            />
          </div>

          {/* Contact method */}
          <div>
            <label className="label">Зручний спосіб зв'язку</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['phone', 'telegram', 'viber'] as ContactMethod[]).map(m => (
                <button key={m} type="button"
                  className={`pill-toggle${contact === m ? ' active' : ''}`}
                  onClick={() => setContact(m)}>
                  {m === 'phone' ? 'Дзвінок' : m === 'telegram' ? 'Telegram' : 'Viber'}
                </button>
              ))}
            </div>
          </div>

          {/* Date pills */}
          {datePills.length > 0 && (
            <div>
              <label className="label">Бажаний день</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {datePills.map(d => (
                  <button key={d.value} type="button"
                    className={`date-pill${day === d.value ? ' active' : ''}`}
                    onClick={() => setDay(d.value)}>
                    <div className="day">{new Date(d.value + 'T12:00').toLocaleDateString('uk-UA', { weekday: 'short' })}</div>
                    <div className="date">{new Date(d.value + 'T12:00').getDate()}</div>
                  </button>
                ))}
                <button type="button"
                  className={`date-pill${day === 'other' ? ' active' : ''}`}
                  onClick={() => setDay('other')}>
                  <div className="day">Інший</div>
                  <div className="date">день</div>
                </button>
              </div>
            </div>
          )}

          {/* Consent */}
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
            <input type="checkbox" required style={{ marginTop: 3, accentColor: 'var(--teal)', flexShrink: 0 }} />
            <span className="caption" style={{ color: 'var(--gray-500)' }}>
              Я погоджуюсь з{' '}
              <a href="/privacy" target="_blank" style={{ color: 'var(--teal-dark)' }}>
                політикою конфіденційності
              </a>
            </span>
          </label>

          {errorMsg && (
            <p style={{ fontSize: 13, color: 'var(--danger)', background: '#fff0f4', padding: '10px 14px', borderRadius: 8 }}>
              {errorMsg}
            </p>
          )}

          <button type="submit" className="btn-primary"
            disabled={status === 'submitting'} style={{ width: '100%', marginTop: 4 }}>
            {status === 'submitting' ? 'НАДСИЛАННЯ...' : 'ЗАПИСАТИСЬ'}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}
