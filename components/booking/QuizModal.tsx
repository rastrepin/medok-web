'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomSheet from './BottomSheet';
import { IMaskInput } from 'react-imask';
import { track } from '@/lib/track';
import { getAvailableDays } from '@/lib/doctor-booking-utils';

type Trimester   = 'first' | 'second' | 'third' | 'full';
type PregnancyType = 'single' | 'twin';
type ContactMethod = 'phone' | 'telegram' | 'viber';

type Props = {
  open: boolean;
  onClose: () => void;
  prefilledTrimester?: Trimester;
  prefilledPregnancyType?: PregnancyType;
  source: string;
};

const TRIMESTER_LABELS: Record<Trimester, string> = {
  first:  'I триместр (11–16 тижнів)',
  second: 'II триместр (18–28 тижнів)',
  third:  'III триместр (30–41 тижнів)',
  full:   'Вся вагітність (від постановки на облік)',
};

// Program IDs map to trimester (match medok_programs.id)
const PROGRAM_IDS: Record<string, Record<PregnancyType, string>> = {
  first:  { single: 'i-single',   twin: 'i-twin'   },
  second: { single: 'ii-single',  twin: 'ii-twin'  },
  third:  { single: 'iii-single', twin: 'iii-twin' },
  full:   { single: 'full-single',twin: 'full-twin'},
};

export default function QuizModal({ open, onClose, prefilledTrimester, prefilledPregnancyType, source }: Props) {
  const router = useRouter();

  // Determine starting step based on prefill
  const startStep = prefilledTrimester && prefilledPregnancyType ? 3
    : prefilledTrimester ? 2 : 1;

  const [step,           setStep]           = useState(startStep);
  const [trimester,      setTrimester]      = useState<Trimester | ''>(prefilledTrimester ?? '');
  const [pregnancyType,  setPregnancyType]  = useState<PregnancyType | ''>(prefilledPregnancyType ?? '');
  const [isExisting,     setIsExisting]     = useState<boolean | null>(null);
  const [transferWeek,   setTransferWeek]   = useState('');
  const [showResult,     setShowResult]     = useState(false);
  // Form fields
  const [name,     setName]     = useState('');
  const [phone,    setPhone]    = useState('');
  const [contact,  setContact]  = useState<ContactMethod>('phone');
  const [day,      setDay]      = useState('');
  const [status,   setStatus]   = useState<'idle' | 'submitting' | 'success'>('idle');
  const [cabinetUuid, setCabinetUuid] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const availDays = getAvailableDays('kelman-viktoriia'); // default clinic days
  const genericDays = (() => {
    const days = [];
    const now = new Date();
    for (let i = 1; i <= 30 && days.length < 6; i++) {
      const d = new Date(now); d.setDate(now.getDate() + i);
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
    if (open) {
      void track({ event_type: 'modal_opened', modal_type: 'quiz', source_cta: source });
      // Compute start step fresh each open (avoids stale closure bug)
      const st = prefilledTrimester && prefilledPregnancyType ? 3
        : prefilledTrimester ? 2 : 1;
      setStep(st);
      setTrimester(prefilledTrimester ?? '');
      setPregnancyType(prefilledPregnancyType ?? '');
      setIsExisting(null);
      setTransferWeek('');
      setShowResult(false);
    }
  }, [open, prefilledTrimester, prefilledPregnancyType]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (datePills.length > 0 && !day) setDay(datePills[0].value);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    if (!showResult && step < 4) {
      void track({ event_type: 'quiz_dropped', modal_type: 'quiz', step_number: step, source_cta: source });
    }
    onClose();
  };

  const nextStep = (newStep: number) => {
    void track({
      event_type: 'quiz_step_completed', modal_type: 'quiz',
      step_number: step,
      step_value: { trimester, pregnancy_type: pregnancyType, is_existing: isExisting },
      source_cta: source,
    });
    if (newStep === 'result' as unknown as number) {
      setShowResult(true);
      void track({ event_type: 'quiz_to_form', modal_type: 'quiz', source_cta: source });
    } else {
      setStep(newStep);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot || !trimester || !pregnancyType) return;
    // Phone validation: must have 12 digits (38 + 10)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 12) {
      setErrorMsg('Введіть повний номер телефону');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');

    const programId = PROGRAM_IDS[trimester]?.[pregnancyType] ?? undefined;

    try {
      const res = await fetch('/api/medok-leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, form_type: 'quiz',
          contact_method: contact,
          preferred_day: day,
          trimester, pregnancy_type: pregnancyType,
          program_id: programId,
          is_existing_patient: isExisting ?? false,
          transfer_week: isExisting && transferWeek ? parseInt(transferWeek) : undefined,
          quiz_answers: { trimester, pregnancy_type: pregnancyType, is_existing: isExisting, transfer_week: transferWeek || undefined },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Помилка');
      void track({ event_type: 'form_submitted', modal_type: 'quiz', source_cta: source });
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
            Заявку отримали!
          </p>
          <p style={{ fontSize: 15, color: 'var(--gray-700)', lineHeight: 1.6, marginBottom: 24 }}>
            Адміністратор зв&apos;яжеться з вами для підтвердження та узгодження дати.
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

  // Progress bar
  const totalSteps = 4;
  const progress = showResult ? 100 : ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <BottomSheet open={open} onClose={handleClose} title="Підбір програми">
      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--gray-200)', borderRadius: 2, marginBottom: 24 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--teal)', borderRadius: 2, transition: 'width 0.3s' }} />
      </div>

      {/* ── Step 1: Trimester ── */}
      {!showResult && step === 1 && (
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Крок 1 з 4</p>
          <p className="h3" style={{ marginBottom: 20 }}>Який триместр?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(Object.entries(TRIMESTER_LABELS) as [Trimester, string][]).map(([val, label]) => (
              <button key={val} type="button"
                onClick={() => {
                  setTrimester(val);
                  void track({ event_type: 'quiz_started', modal_type: 'quiz', step_number: 1, step_value: { trimester: val }, source_cta: source });
                  nextStep(2);
                }}
                style={{
                  padding: '14px 18px', textAlign: 'left',
                  border: `1.5px solid ${trimester === val ? 'var(--teal-dark)' : 'var(--gray-200)'}`,
                  background: trimester === val ? 'var(--mint-tint)' : '#fff',
                  borderRadius: 'var(--r-md)', cursor: 'pointer',
                  fontSize: 15, color: 'var(--black)', fontFamily: 'var(--font-text)',
                  transition: 'all 0.15s',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Pregnancy type ── */}
      {!showResult && step === 2 && (
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Крок 2 з 4</p>
          <p className="h3" style={{ marginBottom: 20 }}>Тип вагітності?</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { val: 'single' as PregnancyType, label: 'Одноплідна' },
              { val: 'twin'   as PregnancyType, label: 'Двоплідна (двійня)' },
            ].map(({ val, label }) => (
              <button key={val} type="button"
                onClick={() => { setPregnancyType(val); nextStep(3); }}
                style={{
                  padding: '20px 14px', textAlign: 'center',
                  border: `1.5px solid ${pregnancyType === val ? 'var(--teal-dark)' : 'var(--gray-200)'}`,
                  background: pregnancyType === val ? 'var(--mint-tint)' : '#fff',
                  borderRadius: 'var(--r-lg)', cursor: 'pointer',
                  fontSize: 15, fontWeight: 600, color: 'var(--black)', fontFamily: 'var(--font-text)',
                }}>
                {label}
              </button>
            ))}
          </div>
          <button type="button" className="btn-ghost" style={{ marginTop: 16 }} onClick={() => setStep(1)}>
            ← Назад
          </button>
        </div>
      )}

      {/* ── Step 3: Existing patient ── */}
      {!showResult && step === 3 && (
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Крок 3 з 4</p>
          <p className="h3" style={{ marginBottom: 20 }}>Чи стоїте на обліку?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button type="button"
              onClick={() => { setIsExisting(false); nextStep('result' as unknown as number); }}
              style={{
                padding: '14px 18px', textAlign: 'left',
                border: `1.5px solid ${isExisting === false ? 'var(--teal-dark)' : 'var(--gray-200)'}`,
                background: isExisting === false ? 'var(--mint-tint)' : '#fff',
                borderRadius: 'var(--r-md)', cursor: 'pointer',
                fontSize: 15, color: 'var(--black)', fontFamily: 'var(--font-text)',
              }}>
              Ні, перша постановка на облік
            </button>
            <button type="button"
              onClick={() => setIsExisting(true)}
              style={{
                padding: '14px 18px', textAlign: 'left',
                border: `1.5px solid ${isExisting === true ? 'var(--teal-dark)' : 'var(--gray-200)'}`,
                background: isExisting === true ? 'var(--mint-tint)' : '#fff',
                borderRadius: 'var(--r-md)', cursor: 'pointer',
                fontSize: 15, color: 'var(--black)', fontFamily: 'var(--font-text)',
              }}>
              Так, в іншій клініці
            </button>
            {isExisting === true && (
              <div style={{ marginTop: 8 }}>
                <label className="label">На якому ви тижні?</label>
                <input className="input" type="number" min="4" max="40" placeholder="Наприклад: 12"
                  value={transferWeek} onChange={e => setTransferWeek(e.target.value)} />
                <button type="button" className="btn-primary" style={{ width: '100%', marginTop: 12 }}
                  onClick={() => nextStep('result' as unknown as number)}>
                  Далі →
                </button>
              </div>
            )}
          </div>
          <button type="button" className="btn-ghost" style={{ marginTop: 16 }}
            onClick={() => setStep(prefilledPregnancyType ? 1 : 2)}>
            ← Назад
          </button>
        </div>
      )}

      {/* ── Result screen + Form ── */}
      {showResult && (
        <form onSubmit={handleSubmit}>
          {/* Summary card */}
          <div className="card-accent" style={{ marginBottom: 20 }}>
            <p className="eyebrow" style={{ marginBottom: 6 }}>Програма підібрана</p>
            <p className="h3" style={{ marginBottom: 4 }}>
              Довіра · {trimester === 'first' ? 'I' : trimester === 'second' ? 'II' : trimester === 'third' ? 'III' : 'Вся вагітність'}
              {pregnancyType === 'twin' && ' · Двійня'}
            </p>
            <p className="caption" style={{ color: 'var(--teal-dark)' }}>
              МЦ MED OK Поділля, вул. Зодчих 20
            </p>
            {isExisting && transferWeek && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: '#fff', borderRadius: 8, fontSize: 13, color: 'var(--gray-700)' }}>
                Принесіть обмінну карту та виписки з попередньої клініки
              </div>
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
              {status === 'submitting' ? 'НАДСИЛАННЯ...' : 'ЗАПИСАТИСЬ НА ПРОГРАМУ'}
            </button>

            <button type="button" className="btn-ghost" style={{ textAlign: 'center', width: '100%' }}
              onClick={() => {
                void track({ event_type: 'quiz_to_callback', modal_type: 'quiz', source_cta: source });
                onClose();
                // scroll to #doctors
                setTimeout(() => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}>
              Спочатку познайомитись з лікарями →
            </button>
          </div>
        </form>
      )}
    </BottomSheet>
  );
}
