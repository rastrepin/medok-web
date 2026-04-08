'use client';

import { useState, useRef, useId } from 'react';
import { CLINIC } from '@/lib/data';

type ContactMethod = 'telegram' | 'viber' | 'phone';
type FormState = 'idle' | 'submitting' | 'success' | 'error';

const CONTACT_OPTIONS: { value: ContactMethod; label: string; icon: string }[] = [
  { value: 'telegram', label: 'Telegram', icon: '✈️' },
  { value: 'viber',    label: 'Viber',    icon: '📲' },
  { value: 'phone',    label: 'Дзвінок',  icon: '📞' },
];

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (typeof w.gtag === 'function') w.gtag(...args);
  }
}

function pushDL(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...params });
  }
}

export default function CallbackForm() {
  const formId = useId();
  const startedRef = useRef(false);

  const [name,          setName]          = useState('');
  const [phone,         setPhone]         = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('telegram');
  const [honeypot,      setHoneypot]      = useState(''); // bot trap
  const [formState,     setFormState]     = useState<FormState>('idle');
  const [errorMsg,      setErrorMsg]      = useState('');

  const tgLink  = 'https://t.me/+380674542880';
  const vbrLink = 'viber://chat?number=+380674542880';

  function handleFocus() {
    if (!startedRef.current) {
      startedRef.current = true;
      gtag('event', 'form_start', { form_type: 'callback' });
      pushDL('form_start', { form_type: 'callback' });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Honeypot check — silent drop
    if (honeypot) return;

    if (!name.trim() || !phone.trim()) {
      setErrorMsg("Будь ласка, заповніть ім'я та номер телефону.");
      return;
    }

    setFormState('submitting');
    setErrorMsg('');

    gtag('event', 'form_submit', { form_type: 'callback', contact_method: contactMethod });
    pushDL('form_submit', { form_type: 'callback', contact_method: contactMethod });

    try {
      const res = await fetch('/api/medok/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:       name.trim(),
          phone:      phone.trim(),
          messenger:  contactMethod,
          form_type: 'callback',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data?.error ?? 'Помилка. Спробуйте ще раз або зателефонуйте нам.');
        setFormState('error');
        return;
      }

      setFormState('success');
      gtag('event', 'lead_created', { form_type: 'callback', contact_method: contactMethod });
      pushDL('lead_created', { form_type: 'callback', contact_method: contactMethod });
    } catch {
      setErrorMsg('Помилка мережі. Перевірте з\'єднання і спробуйте ще раз.');
      setFormState('error');
    }
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (formState === 'success') {
    return (
      <section id="callback" style={{
        background: 'var(--g900)',
        padding: '56px 48px',
      }}>
        <div style={{
          maxWidth: 560, margin: '0 auto',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h2 style={{
            fontFamily: 'var(--font)',
            fontSize: 24, fontWeight: 700,
            color: '#fff', marginBottom: 12,
          }}>
            Дякуємо, {name.split(' ')[0]}!
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.65)', marginBottom: 32, lineHeight: 1.6 }}>
            Ми зв'яжемося з вами протягом робочого дня.<br />
            Або напишіть нам прямо зараз:
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={tgLink}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#229ED9', color: '#fff',
                padding: '13px 24px', borderRadius: 9999,
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
              }}
            >
              ✈️ Telegram
            </a>
            <a
              href={vbrLink}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#7360F2', color: '#fff',
                padding: '13px 24px', borderRadius: 9999,
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
              }}
            >
              📲 Viber
            </a>
            <a
              href={`tel:${CLINIC.phone}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,.1)', color: '#fff',
                border: '1px solid rgba(255,255,255,.2)',
                padding: '13px 24px', borderRadius: 9999,
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
              }}
            >
              📞 {CLINIC.phone}
            </a>
          </div>
        </div>

        <style>{`
          @media(max-width:768px){
            section#callback{padding:40px 20px!important}
          }
        `}</style>
      </section>
    );
  }

  // ── Form state ────────────────────────────────────────────────────────────
  const isSubmitting = formState === 'submitting';

  return (
    <section id="callback" style={{
      background: 'var(--g900)',
      padding: '56px 48px',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {/* Heading */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', color: 'var(--tl)',
            marginBottom: 12,
          }}>
            Залишити заявку
          </div>
          <h2 style={{
            fontFamily: 'var(--font)',
            fontSize: 28, fontWeight: 700, lineHeight: 1.2,
            color: '#fff', marginBottom: 10,
          }}>
            Передзвонимо вам
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>
            Заповніть форму — ми зв'яжемося протягом робочого дня
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Honeypot — hidden from real users, bots fill it */}
          <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
            <label htmlFor={`${formId}-website`}>Website</label>
            <input
              id={`${formId}-website`}
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Name */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 6 }}>
              Ваше ім'я
            </label>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Наприклад: Олена"
              autoComplete="given-name"
              required
              disabled={isSubmitting}
              onFocus={handleFocus}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,.07)',
                border: '1px solid rgba(255,255,255,.15)',
                borderRadius: 10, color: '#fff',
                padding: '13px 16px', fontSize: 15,
                fontFamily: 'inherit', outline: 'none',
                transition: 'border-color .15s',
              }}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 6 }}>
              Телефон
            </label>
            <input
              type="tel"
              name="phone"
              value={phone}
              placeholder="0XX XXX XXXX"
              autoComplete="tel"
              required
              disabled={isSubmitting}
              onFocus={handleFocus}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,.07)',
                border: '1px solid rgba(255,255,255,.15)',
                borderRadius: 10, color: '#fff',
                padding: '13px 16px', fontSize: 15,
                fontFamily: 'inherit', outline: 'none',
                transition: 'border-color .15s',
              }}
            />
          </div>

          {/* Contact method */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 10 }}>
              Як зв'язатись
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CONTACT_OPTIONS.map(({ value, label, icon }) => {
                const active = contactMethod === value;
                return (
                  <label
                    key={value}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '9px 16px', borderRadius: 9999, cursor: 'pointer',
                      fontSize: 13, fontWeight: active ? 700 : 500,
                      background: active ? 'var(--td)' : 'rgba(255,255,255,.07)',
                      border: `1px solid ${active ? 'var(--td)' : 'rgba(255,255,255,.15)'}`,
                      color: active ? '#fff' : 'rgba(255,255,255,.6)',
                      transition: 'all .15s',
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="radio"
                      name="contact_method"
                      value={value}
                      checked={active}
                      onChange={() => setContactMethod(value)}
                      disabled={isSubmitting}
                      style={{ display: 'none' }}
                    />
                    {icon} {label}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Error message */}
          {(formState === 'error' || errorMsg) && (
            <p style={{
              fontSize: 13, color: '#fca5a5',
              marginBottom: 14, lineHeight: 1.5,
            }}>
              {errorMsg}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              background: isSubmitting ? 'rgba(255,255,255,.15)' : 'var(--c)',
              color: '#fff', border: 'none',
              padding: '15px 28px', borderRadius: 9999,
              fontSize: 15, fontWeight: 700, cursor: isSubmitting ? 'wait' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background .2s',
            }}
          >
            {isSubmitting ? 'Надсилаємо…' : 'Передзвоніть мені'}
          </button>
        </form>
      </div>

      <style>{`
        @media(max-width:768px){
          section#callback{padding:40px 20px!important}
          section#callback h2{font-size:22px!important}
        }
      `}</style>
    </section>
  );
}
