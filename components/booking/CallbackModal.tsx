'use client';
import { useState, useEffect } from 'react';
import BottomSheet from './BottomSheet';
import { IMaskInput } from 'react-imask';
import { track } from '@/lib/track';
import { saveCabinetUuid } from '@/lib/cabinet-storage';

const PURPOSES = [
  { value: 'program',     label: 'Дізнатись про програму' },
  { value: 'transfer',    label: 'Перейти з іншої клініки' },
  { value: 'booking',     label: 'Просто записатись' },
  { value: 'other',       label: 'Інше' },
];

type Props = {
  open: boolean;
  onClose: () => void;
  source: string;
};

type ContactMethod = 'phone' | 'telegram' | 'viber';

export default function CallbackModal({ open, onClose, source }: Props) {
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [contact, setContact] = useState<ContactMethod>('phone');
  const [purpose, setPurpose] = useState('');
  const [status,  setStatus]  = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const handleOpen = () => {
    void track({ event_type: 'modal_opened', modal_type: 'callback', source_cta: source });
  };

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
    void track({ event_type: 'form_submitted', modal_type: 'callback', source_cta: source });

    try {
      const res = await fetch('/api/medok-leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone,
          form_type: 'callback',
          contact_method: contact,
          visit_purpose: purpose || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Помилка');
      saveCabinetUuid(data.cabinet_uuid);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Щось пішло не так. Спробуйте ще раз.');
      setStatus('error');
    }
  };

  if (!open) return null;

  return (
    <BottomSheet open={open} onClose={onClose} title="Передзвонимо вам">
      <div onMouseEnter={handleOpen}>
        {status === 'success' ? (
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
              color: 'var(--gray-900)', marginBottom: 12, letterSpacing: '0.01em' }}>
              Заявку надіслано
            </p>
            <p style={{ fontSize: 15, color: 'var(--gray-700)', lineHeight: 1.6, marginBottom: 28 }}>
              Адміністратор зателефонує протягом робочого дня.
            </p>
            <button onClick={onClose} className="btn-secondary" style={{ padding: '12px 32px' }}>
              Закрити
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 4 }}>
              <p className="h3" style={{ marginBottom: 4 }}>Передзвонимо вам</p>
              <p className="caption" style={{ color: 'var(--gray-500)' }}>
                Адміністратор зателефонує протягом робочого дня
              </p>
            </div>

            {/* Honeypot */}
            <input
              type="text" name="website" value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              style={{ display: 'none' }} tabIndex={-1} aria-hidden
            />

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">Ваше ім'я</label>
                <input
                  className="input" type="text" placeholder="Марія"
                  value={name} onChange={e => setName(e.target.value)} required
                />
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
                    <button
                      key={m} type="button"
                      className={`pill-toggle${contact === m ? ' active' : ''}`}
                      onClick={() => setContact(m)}
                    >
                      {m === 'phone' ? 'Дзвінок' : m === 'telegram' ? 'Telegram' : 'Viber'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose (optional) */}
              <div>
                <label className="label">Що вас цікавить? (необов'язково)</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {PURPOSES.map(p => (
                    <button
                      key={p.value} type="button"
                      className={`pill-toggle${purpose === p.value ? ' active' : ''}`}
                      style={{ fontSize: 13 }}
                      onClick={() => setPurpose(prev => prev === p.value ? '' : p.value)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

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

              <button
                type="submit"
                className="btn-primary"
                disabled={status === 'submitting'}
                style={{ width: '100%', marginTop: 4 }}
              >
                {status === 'submitting' ? 'НАДСИЛАННЯ...' : 'ПЕРЕДЗВОНИТИ'}
              </button>
            </div>
          </form>
        )}
      </div>
    </BottomSheet>
  );
}
