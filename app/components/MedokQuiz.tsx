'use client';
import { useState, useEffect } from 'react';
import { PROGRAMS, DOCTORS, formatPrice } from '@/lib/data';
import { Trimester, PregnancyType, Program } from '@/lib/types';
import MedokDatePicker, { SelectedDate } from './MedokDatePicker';
import SlotPicker from './SlotPicker';
import { getAvailableSlots, Slot } from '@/lib/slot-utils';

type Step = 1 | 2 | 'result' | 'form' | 'success';

const TRIMESTER_OPTIONS: { key: Trimester; label: string; sub: string }[] = [
  { key: 'i', label: 'I триместр', sub: '11–16 тиждень' },
  { key: 'ii', label: 'II триместр', sub: '18–28 тиждень' },
  { key: 'iii', label: 'III триместр', sub: '30–41 тиждень' },
  { key: 'full', label: 'Повне ведення', sub: 'від постановки на облік' },
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ProgressBar({ step }: { step: Step }) {
  const steps = [1, 2, 'result'] as const;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 48, gap: 0 }}>
      {steps.map((s, i) => {
        const isDone = step === 'result' || step === 'form' || step === 'success'
          ? true
          : typeof step === 'number' && typeof s === 'number' && step > s;
        const isActive = s === step || (step === 'form' && s === 'result') || (step === 'success' && s === 'result');
        const labels = ['Триместр', 'Тип вагітності', 'Програма'];
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                border: `2px solid ${isDone ? 'var(--t)' : isActive ? 'var(--c)' : 'var(--g300)'}`,
                background: isDone ? 'var(--t)' : isActive ? 'var(--c)' : '#fff',
                color: isDone || isActive ? '#fff' : 'var(--g400)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, transition: 'all .3s',
              }}>
                {isDone ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: isActive ? 'var(--c)' : isDone ? 'var(--td)' : 'var(--g400)', textAlign: 'center', maxWidth: 68, lineHeight: 1.3 }}>
                {labels[i]}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 68, height: 2, background: isDone ? 'var(--t)' : 'var(--g200)', margin: '16px 4px 0', transition: 'background .3s', flexShrink: 0 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function MedokQuiz() {
  const [step, setStep] = useState<Step>(1);
  const [trimester, setTrimester] = useState<Trimester | null>(null);
  const [pregType, setPregType] = useState<PregnancyType | null>(null);
  const [program, setProgram] = useState<Program | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dates, setDates] = useState<SelectedDate[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [contactMethod, setContactMethod] = useState<'viber' | 'telegram' | 'none'>('none');
  const [messengerContact, setMessengerContact] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cabinetUrl, setCabinetUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const obDoctors = DOCTORS.filter((d) => d.doctor_type === 'obstetrician' && d.is_active);

  // Reload slots when doctor changes
  useEffect(() => {
    if (doctorId) {
      setAvailableSlots(getAvailableSlots(doctorId, 6));
      setSelectedSlots([]);
      setDates([]);
    } else {
      setAvailableSlots([]);
      setSelectedSlots([]);
    }
  }, [doctorId]);

  const selectTrimester = (t: Trimester) => {
    setTrimester(t);
    setStep(2);
  };

  const selectType = (type: PregnancyType) => {
    setPregType(type);
    const prog = PROGRAMS.find((p) => p.trimester === trimester);
    setProgram(prog || null);
    setStep('result');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimester || !pregType || !program) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/medok/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          trimester,
          pregnancy_type: pregType,
          program_id: program.id,
          doctor_id: doctorId || undefined,
          preferred_dates: doctorId ? undefined : dates,
          preferred_slots: selectedSlots.length > 0 ? selectedSlots : undefined,
          messenger: contactMethod !== 'none' ? contactMethod : undefined,
          messenger_contact: messengerContact || undefined,
          form_type: 'quiz',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          (data as { error?: string }).error ||
          'Помилка сервера. Спробуйте ще раз.'
        );
      }
      // Spam silently passes through
      if ((data as { spam?: boolean }).spam) {
        setStep('success');
        return;
      }
      if ((data as { cabinet_url?: string }).cabinet_url) {
        setCabinetUrl((data as { cabinet_url: string }).cabinet_url);
        setStep('success');
      } else {
        throw new Error('Щось пішло не так. Спробуйте ще раз.');
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Помилка. Зателефонуйте нам: +38 (043) 265-99-77'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const price = program && pregType
    ? (pregType === 'single' ? program.price_single : program.price_twin)
    : null;

  return (
    <section id="quiz" style={{ padding: '72px 48px', background: 'var(--g50)', borderTop: '1px solid var(--g100)' }}>
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 12 }}>
            Калькулятор
          </div>
          <h2 style={{ fontFamily: 'var(--font)', fontSize: 36, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>
            Дізнайтесь вартість
          </h2>
          <p style={{ fontSize: 15, color: 'var(--g500)', marginTop: 10, lineHeight: 1.75 }}>
            Два питання — і ви знаєте ціну та склад вашої програми
          </p>
        </div>

        {step !== 'success' && <ProgressBar step={step} />}

        {/* Step 1 */}
        {step === 1 && (
          <div style={{ animation: 'fadeUp .28s ease' }}>
            <div style={{ fontFamily: 'var(--font)', fontSize: 28, fontWeight: 600, color: 'var(--g900)', textAlign: 'center', marginBottom: 8 }}>
              Який триместр вас цікавить?
            </div>
            <div style={{ textAlign: 'center', color: 'var(--g400)', fontSize: 14, marginBottom: 34, fontWeight: 500 }}>
              Або оберіть повне ведення від I до III
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {TRIMESTER_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => selectTrimester(opt.key)}
                  style={{
                    border: '1.5px solid var(--g200)', borderRadius: 16,
                    padding: 18, cursor: 'pointer', background: '#fff',
                    textAlign: 'left', fontFamily: 'inherit',
                    transition: 'all .18s',
                    gridColumn: opt.key === 'full' ? '1 / -1' : undefined,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--g900)', marginBottom: 3 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--g400)', fontWeight: 500 }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ animation: 'fadeUp .28s ease' }}>
            <div style={{ fontFamily: 'var(--font)', fontSize: 28, fontWeight: 600, color: 'var(--g900)', textAlign: 'center', marginBottom: 8 }}>
              Одноплідна чи двоплідна?
            </div>
            <div style={{ textAlign: 'center', color: 'var(--g400)', fontSize: 14, marginBottom: 34, fontWeight: 500 }}>
              Від цього залежить склад і вартість програми
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { key: 'single' as const, label: 'Одноплідна', sub: 'один плід' },
                { key: 'twin' as const, label: 'Двоплідна', sub: 'двійня / два плоди' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => selectType(opt.key)}
                  style={{
                    border: '1.5px solid var(--g200)', borderRadius: 16,
                    padding: 18, cursor: 'pointer', background: '#fff',
                    textAlign: 'left', fontFamily: 'inherit',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--g900)', marginBottom: 3 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--g400)', fontWeight: 500 }}>{opt.sub}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--g400)', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'block', margin: '20px auto 0', fontFamily: 'inherit' }}>
              ← Назад
            </button>
          </div>
        )}

        {/* Result */}
        {step === 'result' && program && price !== null && (
          <div style={{ animation: 'fadeUp .35s ease' }}>
            <div style={{ background: '#fff', borderRadius: 22, border: '1.5px solid var(--g200)', padding: 30, boxShadow: 'var(--shm)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--td)', marginBottom: 8 }}>
                Пакет «Довіра» · {program.name}
              </div>
              <h3 style={{ fontFamily: 'var(--font)', fontSize: 24, fontWeight: 600, color: 'var(--g900)', marginBottom: 6 }}>
                Ведення вагітності — {program.name}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--g500)', lineHeight: 1.7, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--g100)' }}>
                {program.description}
              </p>

              {/* Price */}
              <div style={{ background: 'linear-gradient(135deg,var(--tp) 0%,#fff 70%)', border: '1.5px solid var(--tl)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--g900)' }}>Пакет «Довіра» · {program.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--g400)', marginTop: 2, fontWeight: 500 }}>
                    {pregType === 'single' ? 'одноплідна' : 'двоплідна'} вагітність
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', fontFamily: 'var(--font)', fontSize: 26, fontWeight: 700, color: 'var(--td)', whiteSpace: 'nowrap' }}>
                  {formatPrice(price)}
                </div>
              </div>

              {/* Includes */}
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--g400)', marginBottom: 12 }}>
                Що входить:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 24 }}>
                {program.includes.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--g600)', fontWeight: 500, lineHeight: 1.4 }}>
                    <CheckIcon />
                    {item}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setStep('form')}
                  style={{ background: 'var(--c)', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 9999, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Записатись
                </button>
                <button
                  onClick={() => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ background: 'transparent', color: 'var(--td)', border: '2px solid var(--t)', padding: '12px 22px', borderRadius: 9999, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Обрати лікаря
                </button>
              </div>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--g400)', fontSize: 13, cursor: 'pointer', marginTop: 14, fontFamily: 'inherit', textDecoration: 'underline', display: 'block' }}>
                ← Вибрати інший пакет
              </button>
            </div>
          </div>
        )}

        {/* Booking form */}
        {step === 'form' && program && (
          <div style={{ animation: 'fadeUp .3s ease' }}>
            <div style={{ background: '#fff', border: '1.5px solid var(--g200)', borderRadius: 18, padding: 28 }}>
              <h3 style={{ fontFamily: 'var(--font)', fontSize: 20, fontWeight: 600, color: 'var(--g900)', marginBottom: 4 }}>
                Запис на програму
              </h3>
              <p style={{ fontSize: 13, color: 'var(--g400)', marginBottom: 22, fontWeight: 500 }}>
                {program.name} · {pregType === 'single' ? 'одноплідна' : 'двоплідна'} · {price ? formatPrice(price) : ''}
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Name */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--g600)', marginBottom: 6, display: 'block' }}>Ваше ім&apos;я</label>
                  <input
                    value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Олена" required
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--g200)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--g600)', marginBottom: 6, display: 'block' }}>Телефон</label>
                  <input
                    type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+380" required
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--g200)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                  />
                </div>

                {/* Doctor */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--g600)', marginBottom: 6, display: 'block' }}>Лікар (необов&apos;язково)</label>
                  <select
                    value={doctorId} onChange={(e) => setDoctorId(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--g200)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff' }}
                  >
                    <option value="">Буду вдячна за рекомендацію</option>
                    {obDoctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Slot picker when doctor chosen, date picker otherwise */}
                {doctorId && availableSlots.length > 0 ? (
                  <SlotPicker
                    slots={availableSlots}
                    selected={selectedSlots}
                    onChange={setSelectedSlots}
                    max={3}
                  />
                ) : (
                  <MedokDatePicker value={dates} onChange={setDates} />
                )}

                {/* Messenger */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--g600)', marginBottom: 10, display: 'block' }}>
                    Месенджер для підтвердження
                  </label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    {(['viber', 'telegram', 'none'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setContactMethod(m)}
                        style={{
                          padding: '7px 16px', borderRadius: 9999,
                          border: `1.5px solid ${contactMethod === m ? 'var(--t)' : 'var(--g200)'}`,
                          background: contactMethod === m ? 'var(--tp)' : '#fff',
                          color: contactMethod === m ? 'var(--td)' : 'var(--g600)',
                          fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        }}
                      >
                        {m === 'viber' ? 'Viber' : m === 'telegram' ? 'Telegram' : 'Не потрібно'}
                      </button>
                    ))}
                  </div>
                  {contactMethod !== 'none' && (
                    <input
                      value={messengerContact} onChange={(e) => setMessengerContact(e.target.value)}
                      placeholder="Номер або @username"
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--g200)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                    />
                  )}
                  {contactMethod !== 'none' && (
                    <p style={{ fontSize: 11, color: 'var(--g400)', marginTop: 6 }}>Ми напишемо вам першими після підтвердження запису</p>
                  )}
                </div>

                {errorMsg && (
                  <div style={{
                    background: '#fef2f2', border: '1px solid #fca5a5',
                    borderRadius: 10, padding: '12px 14px',
                    fontSize: 13, color: '#dc2626', lineHeight: 1.5,
                  }}>
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '14px', background: submitting ? 'var(--g300)' : 'var(--c)', color: '#fff',
                    border: 'none', borderRadius: 9999, fontSize: 15,
                    fontWeight: 700, cursor: submitting ? 'default' : 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {submitting ? 'Надсилаємо...' : 'Надіслати запит'}
                </button>
                <button onClick={() => setStep('result')} type="button" style={{ background: 'none', border: 'none', color: 'var(--g400)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ← Назад до програми
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '48px 28px', background: '#fff', borderRadius: 22, border: '1.5px solid var(--g200)', animation: 'fadeUp .5s ease' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--tp)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--td)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font)', fontSize: 26, fontWeight: 600, color: 'var(--g900)', marginBottom: 10 }}>
              Запит надіслано
            </h3>
            <p style={{ fontSize: 15, color: 'var(--g500)', lineHeight: 1.72, maxWidth: 400, margin: '0 auto 26px' }}>
              Ми зв&apos;яжемось з вами протягом робочого дня для підтвердження.
            </p>
            {cabinetUrl && (
              <a
                href={cabinetUrl}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: 'var(--t)', color: '#fff', textDecoration: 'none',
                  padding: '13px 30px', borderRadius: 9999, fontSize: 15, fontWeight: 700,
                  marginBottom: 20,
                }}
              >
                Відкрити мій кабінет
              </a>
            )}

            {/* Clinic messenger links — завжди видимі */}
            <p style={{ fontSize: 13, color: 'var(--g400)', marginBottom: 12 }}>
              Або напишіть нам у месенджер:
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://t.me/+380674542880"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 20px', borderRadius: 9999,
                  border: '1.5px solid var(--tl)', background: 'var(--tp)',
                  fontSize: 14, fontWeight: 600, color: 'var(--td)',
                  textDecoration: 'none',
                }}
              >
                ✈️ Telegram
              </a>
              <a
                href="viber://chat?number=+380674542880"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 20px', borderRadius: 9999,
                  border: '1.5px solid var(--tl)', background: 'var(--tp)',
                  fontSize: 14, fontWeight: 600, color: 'var(--td)',
                  textDecoration: 'none',
                }}
              >
                💬 Viber
              </a>
            </div>
          </div>
        )}

        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
          @media(max-width:768px){
            #quiz{padding:52px 20px!important}
            section[id="quiz"] .quiz-grid{grid-template-columns:1fr!important}
          }
        `}</style>
      </div>
    </section>
  );
}
