'use client';
import { useState } from 'react';
import MedokDatePicker, { SelectedDate } from './MedokDatePicker';

type TransferStep = 'initial' | 'result' | 'form' | 'success';
type TermRange = 'early' | 'mid' | 'late';

const TERM_OPTIONS: { key: TermRange; label: string; sub: string }[] = [
  { key: 'early', label: 'До 12 тижнів', sub: 'I триместр' },
  { key: 'mid', label: '12–28 тижнів', sub: 'II триместр' },
  { key: 'late', label: 'Після 28 тижнів', sub: 'III триместр' },
];

const RESULTS: Record<TermRange, { title: string; body: string }> = {
  early: {
    title: 'Чудовий момент для переходу.',
    body: 'Ми приймемо всі ваші аналізи та продовжимо ведення з того місця, де зупинились. Перший прийом — огляд карти та план.',
  },
  mid: {
    title: 'Перехід у II триместрі — стандартна практика.',
    body: 'Лікар перегляне вашу карту на першій консультації та визначить, які дослідження вже проведено. Зайвих повторів не буде.',
  },
  late: {
    title: 'Ми приймаємо і на пізніх термінах.',
    body: 'Уточніть деталі — наш лікар зв\'яжеться з вами особисто, щоб підготуватись до прийому і не гаяти часу.',
  },
};

export default function MedokTransfer() {
  const [step, setStep] = useState<TransferStep>('initial');
  const [term, setTerm] = useState<TermRange | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [weeks, setWeeks] = useState('');
  const [hasRecords, setHasRecords] = useState<'yes' | 'no' | 'partial' | ''>('');
  const [dates, setDates] = useState<SelectedDate[]>([]);
  const [contactMethod, setContactMethod] = useState<'viber' | 'telegram' | 'none'>('none');
  const [messengerContact, setMessengerContact] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectTerm = (t: TermRange) => {
    setTerm(t);
    setStep('result');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/medok/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone,
          form_type: 'transfer',
          trimester: term === 'early' ? 'i' : term === 'mid' ? 'ii' : 'iii',
          pregnancy_type: 'single',
          preferred_dates: dates,
          contact_method: contactMethod,
          messenger_contact: messengerContact || undefined,
          transfer_week: weeks ? parseInt(weeks) : undefined,
          has_medical_records: hasRecords || undefined,
        }),
      });
      setStep('success');
    } catch {
      alert('Помилка. Спробуйте ще раз або зателефонуйте нам.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ background: 'var(--g50)', borderTop: '1px solid var(--g100)' }}>
      <div id="transfer" style={{ maxWidth: 1140, margin: '0 auto', padding: '72px 48px' }}>
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 12 }}>Перехід</div>
          <h2 style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 36, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>
            Перехід з іншої клініки
          </h2>
          <p style={{ fontSize: 15, color: 'var(--g500)', marginTop: 10, lineHeight: 1.75 }}>
            Приймаємо на будь-якому терміні. Ми вже знаємо що вам потрібно.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          {/* Left — flow */}
          <div>
            {step === 'initial' && (
              <div>
                <div style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 22, fontWeight: 600, color: 'var(--g900)', marginBottom: 8 }}>
                  На якому терміні ви зараз?
                </div>
                <p style={{ fontSize: 14, color: 'var(--g400)', marginBottom: 24, fontWeight: 500 }}>
                  Один вибір — і отримаєте конкретну відповідь
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {TERM_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => selectTerm(opt.key)}
                      style={{ border: '1.5px solid var(--g200)', borderRadius: 16, padding: '16px 18px', cursor: 'pointer', background: '#fff', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 14, transition: 'all .18s' }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--g900)' }}>{opt.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--g400)', fontWeight: 500, marginTop: 2 }}>{opt.sub}</div>
                      </div>
                      <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--g300)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'result' && term && (
              <div style={{ background: 'var(--tp)', border: '1.5px solid var(--tl)', borderRadius: 18, padding: 28 }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--td)', marginBottom: 10 }}>
                  {TERM_OPTIONS.find((o) => o.key === term)?.label}
                </div>
                <h3 style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 20, fontWeight: 600, color: 'var(--g900)', marginBottom: 10, lineHeight: 1.3 }}>
                  {RESULTS[term].title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--g600)', lineHeight: 1.7, marginBottom: 22 }}>
                  {RESULTS[term].body}
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setStep('form')}
                    style={{ background: 'var(--td)', color: '#fff', border: 'none', padding: '12px 26px', borderRadius: 9999, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Залишити запит
                  </button>
                  <button
                    onClick={() => setStep('initial')}
                    style={{ background: 'none', border: 'none', color: 'var(--g400)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    ← Назад
                  </button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div style={{ textAlign: 'center', padding: '40px 28px', background: '#fff', borderRadius: 18, border: '1.5px solid var(--tl)' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--tp)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--td)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 22, fontWeight: 600, color: 'var(--g900)', marginBottom: 8 }}>
                  Запит надіслано
                </h3>
                <p style={{ fontSize: 14, color: 'var(--g500)', lineHeight: 1.7 }}>
                  Ми зв&apos;яжемось з вами протягом робочого дня.
                </p>
              </div>
            )}
          </div>

          {/* Right — form */}
          {step !== 'success' && (
            <div style={{ background: '#fff', border: '1.5px solid var(--g200)', borderRadius: 20, padding: 28, boxShadow: 'var(--shm)' }}>
              {step === 'form' ? (
                <>
                  <h3 style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 20, fontWeight: 600, color: 'var(--g900)', marginBottom: 4 }}>
                    Залишити запит
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--g400)', marginBottom: 20, fontWeight: 500 }}>
                    Лікар або адміністратор зв&apos;яжеться протягом робочого дня
                  </p>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--g600)', marginBottom: 6, display: 'block' }}>Ваше ім&apos;я</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Олена" required
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--g200)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--g600)', marginBottom: 6, display: 'block' }}>Телефон</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380" required
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--g200)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--g600)', marginBottom: 6, display: 'block' }}>Термін вагітності (тижнів)</label>
                      <input type="number" min={1} max={42} value={weeks} onChange={(e) => setWeeks(e.target.value)} placeholder="Наприклад: 22"
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--g200)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--g600)', marginBottom: 8, display: 'block' }}>Є медична карта з попередньої клініки?</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[{ k: 'yes', l: 'Так' }, { k: 'no', l: 'Ні' }, { k: 'partial', l: 'Частково' }].map((opt) => (
                          <button key={opt.k} type="button"
                            onClick={() => setHasRecords(opt.k as 'yes' | 'no' | 'partial')}
                            style={{ padding: '7px 16px', borderRadius: 9999, border: `1.5px solid ${hasRecords === opt.k ? 'var(--t)' : 'var(--g200)'}`, background: hasRecords === opt.k ? 'var(--tp)' : '#fff', color: hasRecords === opt.k ? 'var(--td)' : 'var(--g600)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                            {opt.l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <MedokDatePicker value={dates} onChange={setDates} />
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--g600)', marginBottom: 10, display: 'block' }}>Месенджер</label>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                        {(['viber', 'telegram', 'none'] as const).map((m) => (
                          <button key={m} type="button" onClick={() => setContactMethod(m)}
                            style={{ padding: '7px 16px', borderRadius: 9999, border: `1.5px solid ${contactMethod === m ? 'var(--t)' : 'var(--g200)'}`, background: contactMethod === m ? 'var(--tp)' : '#fff', color: contactMethod === m ? 'var(--td)' : 'var(--g600)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                            {m === 'viber' ? 'Viber' : m === 'telegram' ? 'Telegram' : 'Не потрібно'}
                          </button>
                        ))}
                      </div>
                      {contactMethod !== 'none' && (
                        <input value={messengerContact} onChange={(e) => setMessengerContact(e.target.value)} placeholder="Номер або @username"
                          style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--g200)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                      )}
                    </div>
                    <button type="submit" disabled={submitting}
                      style={{ padding: 14, background: submitting ? 'var(--g300)' : 'var(--c)', color: '#fff', border: 'none', borderRadius: 9999, fontSize: 15, fontWeight: 700, cursor: submitting ? 'default' : 'pointer', fontFamily: 'inherit' }}>
                      {submitting ? 'Надсилаємо...' : 'Надіслати запит'}
                    </button>
                  </form>
                </>
              ) : (
                <div>
                  <h3 style={{ fontFamily: 'var(--font-playfair),"Playfair Display",serif', fontSize: 20, fontWeight: 600, color: 'var(--g900)', marginBottom: 4 }}>Як це відбувається</h3>
                  <p style={{ fontSize: 13, color: 'var(--g400)', marginBottom: 20 }}>Три кроки для переходу</p>
                  {[
                    { n: 1, title: 'Зберіть наявні документи', desc: 'Обмінна карта, виписки, результати аналізів та УЗД. Якщо частини немає — не критично.' },
                    { n: 2, title: 'Перший прийом — огляд карти', desc: 'Лікар визначає, які дослідження вже виконані, і складає план. Вже проведені аналізи не повторюємо.' },
                    { n: 3, title: 'Оформлення пакету', desc: 'Обираємо відповідний триместровий пакет. Вартість фіксована і прозора.' },
                  ].map((s, i) => (
                    <div key={s.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: i < 2 ? 20 : 0 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--td)', color: '#fff', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
                      <div>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--g900)', marginBottom: 4 }}>{s.title}</h4>
                        <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.6 }}>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          #transfer{padding:52px 20px!important}
          #transfer > div:last-child{grid-template-columns:1fr!important;gap:24px!important}
        }
      `}</style>
    </section>
  );
}
