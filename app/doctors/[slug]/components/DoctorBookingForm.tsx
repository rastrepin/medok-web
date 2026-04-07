'use client';

import { useState, useRef, useEffect } from 'react';
import { getAvailableDays } from '@/lib/doctor-booking-utils';

type ContactMethod = 'phone' | 'telegram' | 'viber';
type VisitPurpose  = 'program' | 'consultation' | 'gynecology';

type DoctorBookingFormProps = {
  doctorSlug: string;
  doctorName: string;
  doctorNameGenitive: string; // "Ольги Янюк"
  photoFilename: string | null;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function ga4(event: string, params?: Record<string, string>) {
  try { window.gtag?.('event', event, params); } catch { /* non-fatal */ }
}

export default function DoctorBookingForm({
  doctorSlug,
  doctorName,
  doctorNameGenitive,
  photoFilename,
}: DoctorBookingFormProps) {
  const [name,          setName]          = useState('');
  const [phone,         setPhone]         = useState('');
  const [contact,       setContact]       = useState<ContactMethod>('phone');
  const [purpose,       setPurpose]       = useState<VisitPurpose>('program');
  const [day,           setDay]           = useState('');
  const [honeypot,      setHoneypot]      = useState('');
  const [status,        setStatus]        = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [errorMsg,      setErrorMsg]      = useState('');
  const [started,       setStarted]       = useState(false);

  const availableDays = getAvailableDays(doctorSlug);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Initialize preferred_day to first available day
  useEffect(() => {
    if (availableDays.length > 0 && !day) {
      setDay(availableDays[0].value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFocus = () => {
    if (!started) {
      setStarted(true);
      ga4('form_start', { form_type: 'doctor_booking', doctor: doctorSlug });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // spam bot

    ga4('form_submit', { form_type: 'doctor_booking', doctor: doctorSlug });

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/medok/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:           name.trim(),
          phone:          phone.trim(),
          contact_method: contact,
          visit_purpose:  purpose,
          preferred_day:  day || 'other',
          doctor_slug:    doctorSlug,
          doctor_name:    doctorName,
          form_type:      'doctor_booking',
          referrer_url:   window.location.href,
          city:           'Вінниця',
          // map to messenger for existing email/tg handlers
          messenger:      contact,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error || 'Помилка сервера');
      }

      setStatus('success');
      ga4('lead_created', {
        form_type:     'doctor_booking',
        doctor:        doctorSlug,
        visit_purpose: purpose,
        city:          'Вінниця',
      });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Помилка. Спробуйте ще раз.');
    }
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div style={{
        background: 'var(--tp)', border: '1.5px solid var(--tl)',
        borderRadius: 16, padding: '28px 24px', maxWidth: 560,
      }}>
        <div style={{ fontSize: 22, marginBottom: 10 }}>✅</div>
        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--td)', marginBottom: 8, fontFamily: 'var(--font)' }}>
          Дякуємо! Адміністратор зв'яжеться з вами найближчим часом.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
          <a
            href="https://t.me/+380674542880"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: 'var(--td)', fontWeight: 600,
              textDecoration: 'none', border: '1.5px solid var(--tl)',
              padding: '8px 14px', borderRadius: 9999, background: '#fff',
            }}
          >
            ✈️ Telegram
          </a>
          <a
            href="viber://chat?number=+380674542880"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: 'var(--td)', fontWeight: 600,
              textDecoration: 'none', border: '1.5px solid var(--tl)',
              padding: '8px 14px', borderRadius: 9999, background: '#fff',
            }}
          >
            💬 Viber
          </a>
        </div>
        {purpose === 'program' && (
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--g500)' }}>
            Хочете підібрати програму заздалегідь?{' '}
            <a href="/#quiz" style={{ color: 'var(--td)', fontWeight: 600, textDecoration: 'none' }}>
              Калькулятор програм →
            </a>
          </p>
        )}
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 520 }} noValidate>
      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      />

      {/* Doctor header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
        {photoFilename && (
          <div style={{
            width: 52, height: 52, borderRadius: '50%', overflow: 'hidden',
            flexShrink: 0, border: '2px solid var(--tl)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/images/doctors/${photoFilename}`}
              alt={doctorName}
              width={52} height={52}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
        )}
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--td)', fontFamily: 'var(--font)', marginBottom: 2 }}>
            Записатись до {doctorNameGenitive}
          </p>
          <p style={{ fontSize: 12, color: 'var(--g400)' }}>
            Адміністратор передзвонить і підтвердить час
          </p>
        </div>
      </div>

      {/* Name */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Ваше ім'я</label>
        <input
          ref={firstFieldRef}
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={handleFocus}
          placeholder="Ваше ім'я"
          style={inputStyle}
        />
      </div>

      {/* Phone */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Телефон</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onFocus={handleFocus}
          placeholder="+380XXXXXXXXX"
          style={inputStyle}
        />
      </div>

      {/* Contact method */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Спосіб зв'язку</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {([
            { value: 'phone',    label: '📞 Дзвінок' },
            { value: 'telegram', label: '✈️ Telegram' },
            { value: 'viber',    label: '💬 Viber' },
          ] as { value: ContactMethod; label: string }[]).map((opt) => (
            <label key={opt.value} style={radioLabelStyle(contact === opt.value)}>
              <input
                type="radio"
                name="contact_method"
                value={opt.value}
                checked={contact === opt.value}
                onChange={() => setContact(opt.value)}
                style={{ display: 'none' }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Visit purpose */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Мета візиту</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {([
            { value: 'program',      label: 'Запис на програму ведення вагітності' },
            { value: 'consultation', label: 'Консультація вагітної (без програми)' },
            { value: 'gynecology',   label: 'Звичайна жіноча консультація' },
          ] as { value: VisitPurpose; label: string }[]).map((opt) => (
            <label key={opt.value} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer', fontSize: 14, color: 'var(--g700)',
            }}>
              <input
                type="radio"
                name="visit_purpose"
                value={opt.value}
                checked={purpose === opt.value}
                onChange={() => setPurpose(opt.value)}
                style={{ accentColor: 'var(--t)', width: 16, height: 16 }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Preferred day */}
      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle}>Бажаний день</label>
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
        >
          {availableDays.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
          <option value="other">Інший день — уточню по телефону</option>
        </select>
      </div>

      {/* Error */}
      {status === 'error' && (
        <p style={{ fontSize: 13, color: '#dc2626', marginBottom: 12 }}>
          {errorMsg || 'Помилка. Спробуйте ще раз або зателефонуйте нам.'}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{
          width: '100%',
          background: status === 'submitting' ? 'var(--g300)' : 'var(--t)',
          color: '#fff', border: 'none',
          padding: '14px 24px', borderRadius: 9999,
          fontSize: 15, fontWeight: 700,
          cursor: status === 'submitting' ? 'default' : 'pointer',
          fontFamily: 'inherit', transition: 'background .2s',
        }}
      >
        {status === 'submitting' ? 'Відправляємо...' : 'Записатись'}
      </button>

      <p style={{ fontSize: 11, color: 'var(--g400)', marginTop: 10 }}>
        Відповідаємо впродовж робочого дня · Без спаму
      </p>
    </form>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12, fontWeight: 700, letterSpacing: '.5px',
  textTransform: 'uppercase', color: 'var(--g500)',
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  padding: '11px 14px',
  border: '1.5px solid var(--g200)',
  borderRadius: 10, fontSize: 16, fontFamily: 'inherit',
  color: 'var(--g800)', background: '#fff',
  outline: 'none',
};

function radioLabelStyle(active: boolean): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center',
    padding: '7px 14px', borderRadius: 9999,
    fontSize: 13, fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    border: `1.5px solid ${active ? 'var(--t)' : 'var(--g200)'}`,
    background: active ? 'var(--tp)' : '#fff',
    color: active ? 'var(--td)' : 'var(--g500)',
    transition: 'all .15s',
    userSelect: 'none',
  };
}
