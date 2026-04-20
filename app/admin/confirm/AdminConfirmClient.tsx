'use client';

import { useEffect, useMemo, useState } from 'react';
import type { OnboardingCabinet } from '@/lib/types';

type LoadState =
  | { kind: 'loading' }
  | { kind: 'invalid'; detail?: string }
  | { kind: 'already'; cabinet: OnboardingCabinet }
  | { kind: 'ready';   cabinet: OnboardingCabinet };

type SubmitState = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'error'; msg: string } | { kind: 'success'; iso: string };

const TRIMESTER_LABELS: Record<string, string> = {
  first: 'I триместр', second: 'II триместр', third: 'III триместр',
  i: 'I триместр', ii: 'II триместр', iii: 'III триместр', full: 'Вся вагітність',
};

const CONTACT_LABELS: Record<string, string> = {
  phone: 'Дзвінок', telegram: 'Telegram', viber: 'Viber',
};

const TIME_SLOTS = ((): string[] => {
  const slots: string[] = [];
  for (let h = 8; h <= 20; h++) {
    for (const m of [0, 30]) {
      if (h === 20 && m > 0) break;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
})();

function fmtAppointment(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kiev',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(d);
}

function todayKyiv(): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Kiev' }).format(new Date());
}

function maxDateKyiv(days = 60): string {
  const now = Date.now() + days * 24 * 60 * 60 * 1000;
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Kiev' }).format(new Date(now));
}

export default function AdminConfirmClient({ token }: { token: string }) {
  const [load, setLoad] = useState<LoadState>({ kind: 'loading' });
  const [submit, setSubmit] = useState<SubmitState>({ kind: 'idle' });

  // form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const minDate = useMemo(todayKyiv, []);
  const maxDate = useMemo(() => maxDateKyiv(60), []);

  useEffect(() => {
    if (!token) {
      setLoad({ kind: 'invalid', detail: 'Посилання не містить токена.' });
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const r = await fetch(`/api/cabinet/by-token?token=${encodeURIComponent(token)}`, {
          cache: 'no-store',
        });
        if (cancelled) return;

        if (r.status === 404 || r.status === 410) {
          setLoad({
            kind: 'invalid',
            detail:
              r.status === 410
                ? 'Посилання прострочене (понад 7 днів). Створіть нову заявку.'
                : 'Посилання не знайдено в системі.',
          });
          return;
        }
        if (!r.ok) {
          setLoad({ kind: 'invalid', detail: `Помилка завантаження (${r.status})` });
          return;
        }
        const data = (await r.json()) as { cabinet: OnboardingCabinet; already_confirmed: boolean };
        if (data.already_confirmed) {
          setLoad({ kind: 'already', cabinet: data.cabinet });
        } else {
          setLoad({ kind: 'ready', cabinet: data.cabinet });
        }
      } catch (e) {
        if (!cancelled) setLoad({ kind: 'invalid', detail: String(e) });
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time) {
      setSubmit({ kind: 'error', msg: 'Виберіть дату і час.' });
      return;
    }
    setSubmit({ kind: 'submitting' });
    try {
      const r = await fetch('/api/admin/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, date, time, admin_note: adminNote.trim() || undefined }),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) {
        const msg =
          body.error === 'token_expired' ? 'Токен прострочений.'
          : body.error === 'not_pending' ? `Запис у статусі "${body.current_status}". Повторне підтвердження неможливе.`
          : body.error === 'date_in_past' ? 'Дата в минулому.'
          : typeof body.error === 'string' ? body.error
          : `Помилка ${r.status}`;
        setSubmit({ kind: 'error', msg });
        return;
      }
      const iso = body?.cabinet?.appointment_date ?? '';
      setSubmit({ kind: 'success', iso });
    } catch (e) {
      setSubmit({ kind: 'error', msg: String(e) });
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--gray-50)', paddingBottom: 48 }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: '#ffffff', borderBottom: '1px solid var(--gray-200)',
        padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.02em', color: 'var(--teal-dark)' }}>
            MED OK
          </strong>
          <span style={{
            fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--teal-dark)', background: 'var(--mint-tint)',
            padding: '4px 8px', borderRadius: 999, fontWeight: 700,
          }}>
            АДМІНІСТРАТОР
          </span>
        </div>
        <span className="caption" style={{ color: 'var(--gray-500)' }}>Підтвердження запису</span>
      </header>

      <section style={{ maxWidth: 520, margin: '0 auto', padding: '20px' }}>
        {load.kind === 'loading' && (
          <div style={{
            background: '#fff', border: '1.5px solid var(--gray-200)', borderRadius: 12,
            padding: 24, textAlign: 'center', color: 'var(--gray-500)',
          }}>
            Завантажуємо дані заявки…
          </div>
        )}

        {load.kind === 'invalid' && (
          <div style={{
            background: '#fff', border: '1.5px solid var(--gray-200)', borderRadius: 12, padding: 24,
          }}>
            <h1 className="h3" style={{ marginBottom: 8 }}>Посилання недійсне</h1>
            <p className="body" style={{ color: 'var(--gray-700)' }}>
              {load.detail ?? 'Спробуйте відкрити посилання з останнього email.'}
            </p>
          </div>
        )}

        {(load.kind === 'ready' || load.kind === 'already') && (
          <CabinetCard cabinet={load.cabinet} />
        )}

        {load.kind === 'already' && (
          <div style={{
            background: 'var(--mint-tint)', border: '1.5px solid var(--teal)',
            borderRadius: 12, padding: 16, marginTop: 16,
          }}>
            <p className="body" style={{ color: 'var(--teal-dark)', fontWeight: 600 }}>
              ✓ Вже підтверджено
              {load.cabinet.appointment_date ? ` на ${fmtAppointment(load.cabinet.appointment_date)}` : ''}.
            </p>
            <p className="caption" style={{ color: 'var(--gray-700)', marginTop: 4 }}>
              Пацієнтка побачить статус на сторінці кабінету.
            </p>
          </div>
        )}

        {load.kind === 'ready' && submit.kind !== 'success' && (
          <form onSubmit={onSubmit} style={{
            marginTop: 16, background: '#fff',
            border: '1.5px solid var(--gray-200)', borderRadius: 12, padding: 18,
          }}>
            <h2 className="h3" style={{ marginBottom: 14 }}>Дата і час прийому</h2>

            <label className="label" htmlFor="date">Дата прийому</label>
            <input
              id="date" className="input" type="date"
              min={minDate} max={maxDate}
              value={date} onChange={(e) => setDate(e.target.value)}
              required
              style={{ marginBottom: 12 }}
            />

            <label className="label" htmlFor="time">Час прийому</label>
            <select
              id="time" className="input"
              value={time} onChange={(e) => setTime(e.target.value)}
              required style={{ marginBottom: 12 }}
            >
              <option value="">Оберіть слот…</option>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <label className="label" htmlFor="note">Нотатка адміністратора (необов&apos;язково)</label>
            <textarea
              id="note" className="input" rows={3}
              placeholder="Напр.: пацієнтка уточнить термін вагітності на візиті"
              value={adminNote} onChange={(e) => setAdminNote(e.target.value)}
              style={{ marginBottom: 16, minHeight: 84, resize: 'vertical' }}
            />

            {submit.kind === 'error' && (
              <p style={{
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
                padding: '8px 12px', color: '#991b1b', fontSize: 13, marginBottom: 12,
              }}>
                {submit.msg}
              </p>
            )}

            <button
              type="submit" className="btn-primary"
              disabled={submit.kind === 'submitting'}
              style={{ width: '100%' }}
            >
              {submit.kind === 'submitting' ? 'Підтверджуємо…' : 'Підтвердити запис'}
            </button>

            <p className="caption" style={{
              textAlign: 'center', marginTop: 12, color: 'var(--gray-500)',
            }}>
              Після підтвердження посилання стане недоступним.
            </p>
          </form>
        )}

        {submit.kind === 'success' && (
          <div style={{
            marginTop: 16, background: '#fff',
            border: '1.5px solid var(--teal)', borderRadius: 12, padding: 20, textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 999,
              background: 'var(--mint-tint)', color: 'var(--teal-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px', fontSize: 28,
            }}>✓</div>
            <h2 className="h3" style={{ marginBottom: 6 }}>Запис підтверджено</h2>
            <p className="body" style={{ color: 'var(--gray-700)' }}>
              {submit.iso
                ? <>На <strong>{fmtAppointment(submit.iso)}</strong>.</>
                : 'Дані збережено.'}
            </p>
            <p className="caption" style={{ color: 'var(--gray-500)', marginTop: 8 }}>
              Пацієнтка побачить оновлений статус при наступному відкритті сторінки кабінету.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function CabinetCard({ cabinet }: { cabinet: OnboardingCabinet }) {
  const phone = cabinet.patient_phone;
  const trimester = cabinet.trimester ? TRIMESTER_LABELS[cabinet.trimester] ?? cabinet.trimester : null;
  const pregnancy = cabinet.pregnancy_type === 'twin' ? 'Двоплідна'
    : cabinet.pregnancy_type === 'single' ? 'Одноплідна' : null;
  const contact = cabinet.contact_method ? CONTACT_LABELS[cabinet.contact_method] : null;
  const createdAt = new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kiev', day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(cabinet.created_at));

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--gray-200)', borderRadius: 12, padding: 18,
    }}>
      <span style={{
        display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--teal-dark)', marginBottom: 10,
      }}>
        Заявка
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Row label="Ім'я" value={cabinet.patient_name} />
        <Row
          label="Телефон"
          value={<a href={`tel:${phone}`} style={{ color: 'var(--teal-dark)', fontWeight: 600 }}>{phone}</a>}
        />
        {cabinet.program && (
          <Row label="Програма" value={`${cabinet.program.name} · ${cabinet.program.price_single.toLocaleString('uk-UA')} ₴`} />
        )}
        {cabinet.doctor && (
          <Row label="Лікар" value={cabinet.doctor.name} />
        )}
        {trimester && <Row label="Триместр" value={trimester} />}
        {pregnancy && <Row label="Вагітність" value={pregnancy} />}
        {cabinet.is_existing_patient === false && cabinet.transfer_week !== null && cabinet.transfer_week !== undefined && (
          <Row label="Перехід" value={`${cabinet.transfer_week} тиж.`} />
        )}
        {cabinet.is_existing_patient === true && (
          <Row label="Існуюча пацієнтка" value="Так" />
        )}
        {contact && <Row label="Зв'язок" value={contact} />}
        {cabinet.preferred_day && <Row label="Бажаний день" value={cabinet.preferred_day} />}
        <Row label="Подано" value={createdAt} />
      </div>

      <a
        href={`tel:${phone}`}
        className="btn-secondary"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginTop: 16, textDecoration: 'none',
        }}
      >
        📞 Зателефонувати
      </a>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <span style={{
        flexShrink: 0, minWidth: 104, fontSize: 12, fontWeight: 600,
        color: 'var(--gray-500)', textTransform: 'none',
      }}>
        {label}
      </span>
      <span style={{ fontSize: 14, color: 'var(--black)', lineHeight: 1.4 }}>
        {value}
      </span>
    </div>
  );
}
