'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PreconsultationData } from '@/lib/types';

interface Props {
  uuid: string;
  initial: PreconsultationData | null;
}

const CHRONIC_OPTIONS: { id: string; label: string }[] = [
  { id: 'diabetes',     label: 'Цукровий діабет' },
  { id: 'hypertension', label: 'Гіпертонія' },
  { id: 'thyroid',      label: 'Щитоподібна залоза' },
  { id: 'kidney',       label: 'Нирки / сечовидільна' },
  { id: 'heart',        label: 'Серце / судини' },
  { id: 'blood',        label: 'Згортання крові' },
];

const BIRTH_METHODS: { id: 'natural' | 'cesarean' | 'mixed'; label: string }[] = [
  { id: 'natural',  label: 'Природні' },
  { id: 'cesarean', label: 'Кесарів розтин' },
  { id: 'mixed',    label: 'Змішано' },
];

type LocalData = Omit<PreconsultationData, 'completed_at'>;

const REQUIRED_STEPS = 7;

function countFilled(d: LocalData, extraFirstOk: boolean): number {
  let filled = 0;
  if (typeof d.pregnancy_week === 'number' && d.pregnancy_week >= 1) filled++;
  if (typeof d.is_first_pregnancy === 'boolean') filled++;
  // previous-births step is only relevant if NOT first pregnancy
  if (extraFirstOk) filled++;
  if (Array.isArray(d.chronic_conditions) || typeof d.chronic_other === 'string') filled++;
  if (typeof d.current_medications === 'string' && d.current_medications !== undefined) filled++;
  if (typeof d.allergies === 'string' && d.allergies !== undefined) filled++;
  if (typeof d.main_concern === 'string' && d.main_concern.trim().length > 0) filled++;
  return filled;
}

export default function PreconsultationAccordion({ uuid, initial }: Props) {
  const wasCompleted = !!initial?.completed_at;
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<LocalData>(() => ({
    pregnancy_week:          initial?.pregnancy_week ?? null,
    is_first_pregnancy:      initial?.is_first_pregnancy ?? null,
    previous_births_count:   initial?.previous_births_count ?? null,
    previous_births_method:  initial?.previous_births_method ?? null,
    chronic_conditions:      initial?.chronic_conditions ?? null,
    chronic_other:           initial?.chronic_other ?? null,
    current_medications:     initial?.current_medications ?? null,
    allergies:               initial?.allergies ?? null,
    main_concern:            initial?.main_concern ?? null,
  }));

  // Track "previous-births" step completeness: either first-preg=true or count+method set
  const extraFirstOk = useMemo(() => {
    if (data.is_first_pregnancy === true) return true;
    if (data.is_first_pregnancy === false) {
      return typeof data.previous_births_count === 'number' && data.previous_births_count >= 1 && !!data.previous_births_method;
    }
    return false;
  }, [data.is_first_pregnancy, data.previous_births_count, data.previous_births_method]);

  const filled = countFilled(data, extraFirstOk);
  const progressPct = Math.round((filled / REQUIRED_STEPS) * 100);
  const finishedLocally = filled >= REQUIRED_STEPS;

  // Save state
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [serverCompletedAt, setServerCompletedAt] = useState<string | null>(initial?.completed_at ?? null);
  const abortRef = useRef<AbortController | null>(null);
  const savedTimerRef = useRef<number | null>(null);

  const save = useCallback(async (patch: Partial<PreconsultationData>, key: string) => {
    if (abortRef.current) abortRef.current.abort();
    const ctl = new AbortController();
    abortRef.current = ctl;
    setSavingKey(key);
    setSaveError(null);
    try {
      const res = await fetch(`/api/cabinet/${uuid}/preconsultation`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
        signal: ctl.signal,
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const json = (await res.json()) as { preconsultation: PreconsultationData };
      if (json.preconsultation?.completed_at) setServerCompletedAt(json.preconsultation.completed_at);
      // Flash "✓ Збережено" for 1.5s
      if (savedTimerRef.current) window.clearTimeout(savedTimerRef.current);
      setSavedKey(key);
      savedTimerRef.current = window.setTimeout(() => setSavedKey(null), 1500);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') setSaveError('Не вдалось зберегти. Перевірте з’єднання.');
    } finally {
      setSavingKey(null);
    }
  }, [uuid]);

  // Auto-open accordion if partly filled but not completed
  useEffect(() => {
    if (!wasCompleted && filled > 0 && !open) setOpen(true);
     
  }, [wasCompleted]);

  const isDone = !!serverCompletedAt && finishedLocally;

  if (isDone) {
    return (
      <section style={cardWrap}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--mint-light, #97d5c9)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--teal-dark, #1a7c75)', fontWeight: 700,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <div style={{ flex: 1 }}>
            <div className="h3" style={{ marginBottom: 2 }}>Анкету для лікаря заповнено</div>
            <div className="caption" style={{ color: 'var(--gray-500, #6B7280)' }}>Лікар ознайомиться з відповідями перед прийомом</div>
          </div>
          <button onClick={() => setOpen(true)} type="button" style={ghostBtn}>
            Редагувати
          </button>
        </div>
      </section>
    );
  }

  return (
    <section style={cardWrap}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={headerBtn}
        aria-expanded={open}
      >
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div className="eyebrow" style={{ color: 'var(--teal-dark, #1a7c75)', marginBottom: 4 }}>АНКЕТА · 2 ХВ</div>
          <div className="h3" style={{ marginBottom: 4 }}>Розкажіть про вашу вагітність</div>
          <div className="caption" style={{ color: 'var(--gray-500, #6B7280)' }}>
            Відповіді допоможуть лікарю краще підготуватись · <strong style={{ color: 'var(--teal-dark, #1a7c75)' }}>{filled} з {REQUIRED_STEPS}</strong>
          </div>
        </div>
        <span style={{
          width: 28, height: 28, borderRadius: '50%', border: '1.5px solid var(--gray-200, #E5E7EB)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--teal-dark, #1a7c75)', fontWeight: 700, fontSize: 18, lineHeight: 1,
        }}>
          {open ? '–' : '+'}
        </span>
      </button>

      {/* Progress bar */}
      <div style={{ marginTop: 14, height: 6, background: 'var(--gray-100, #F3F4F6)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          width: `${progressPct}%`,
          height: '100%',
          background: 'var(--teal, #52b2ad)',
          transition: 'width 0.25s',
        }} />
      </div>

      {open && (
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* 1. Pregnancy week */}
          <Field label="Тиждень вагітності" hint="1–41" saving={savingKey === 'pregnancy_week'} saved={savedKey === 'pregnancy_week'}>
            <input
              type="number"
              min={1}
              max={41}
              inputMode="numeric"
              className="input"
              value={data.pregnancy_week ?? ''}
              onChange={(e) => {
                const raw = e.target.value;
                const n = raw === '' ? null : Math.max(1, Math.min(41, parseInt(raw, 10) || 0));
                setData(prev => ({ ...prev, pregnancy_week: n }));
              }}
              onBlur={() => save({ pregnancy_week: data.pregnancy_week }, 'pregnancy_week')}
              placeholder="Напр. 12"
            />
          </Field>

          {/* 2. First pregnancy? */}
          <Field label="Перша вагітність?" saving={savingKey === 'is_first_pregnancy'} saved={savedKey === 'is_first_pregnancy'}>
            <div style={pillsRow}>
              <Pill
                active={data.is_first_pregnancy === true}
                onClick={() => {
                  const next = { ...data, is_first_pregnancy: true, previous_births_count: null, previous_births_method: null };
                  setData(next);
                  save({ is_first_pregnancy: true, previous_births_count: null, previous_births_method: null }, 'is_first_pregnancy');
                }}
              >Так, перша</Pill>
              <Pill
                active={data.is_first_pregnancy === false}
                onClick={() => {
                  setData(prev => ({ ...prev, is_first_pregnancy: false }));
                  save({ is_first_pregnancy: false }, 'is_first_pregnancy');
                }}
              >Ні, не перша</Pill>
            </div>
          </Field>

          {/* 3. If not first — births count + method */}
          {data.is_first_pregnancy === false && (
            <Field
              label="Скільки пологів + спосіб"
              saving={savingKey === 'previous_births_count' || savingKey === 'previous_births_method'}
              saved={savedKey === 'previous_births_count' || savedKey === 'previous_births_method'}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  type="number"
                  min={1}
                  max={12}
                  inputMode="numeric"
                  className="input"
                  value={data.previous_births_count ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const n = raw === '' ? null : Math.max(1, Math.min(12, parseInt(raw, 10) || 0));
                    setData(prev => ({ ...prev, previous_births_count: n }));
                  }}
                  onBlur={() => save({ previous_births_count: data.previous_births_count }, 'previous_births_count')}
                  placeholder="Кількість попередніх пологів"
                />
                <div style={pillsRow}>
                  {BIRTH_METHODS.map(m => (
                    <Pill
                      key={m.id}
                      active={data.previous_births_method === m.id}
                      onClick={() => {
                        setData(prev => ({ ...prev, previous_births_method: m.id }));
                        save({ previous_births_method: m.id }, 'previous_births_method');
                      }}
                    >{m.label}</Pill>
                  ))}
                </div>
              </div>
            </Field>
          )}

          {/* 4. Chronic conditions */}
          <Field label="Хронічні захворювання" hint="можна обрати декілька" saving={savingKey === 'chronic_conditions'} saved={savedKey === 'chronic_conditions'}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CHRONIC_OPTIONS.map(opt => {
                const arr = data.chronic_conditions ?? [];
                const isActive = arr.includes(opt.id);
                return (
                  <Pill
                    key={opt.id}
                    active={isActive}
                    onClick={() => {
                      const next = isActive ? arr.filter(x => x !== opt.id) : [...arr, opt.id];
                      setData(prev => ({ ...prev, chronic_conditions: next }));
                      save({ chronic_conditions: next }, 'chronic_conditions');
                    }}
                  >{opt.label}</Pill>
                );
              })}
            </div>
            <div style={{ marginTop: 10 }}>
              <input
                type="text"
                className="input"
                value={data.chronic_other ?? ''}
                onChange={(e) => setData(prev => ({ ...prev, chronic_other: e.target.value }))}
                onBlur={() => save({ chronic_other: data.chronic_other ?? '' }, 'chronic_other')}
                placeholder="Інше (якщо не в списку) — не обов'язково"
              />
            </div>
          </Field>

          {/* 5. Medications */}
          <Field label="Препарати зараз" hint="фолієва, вітаміни, інсулін тощо" saving={savingKey === 'current_medications'} saved={savedKey === 'current_medications'}>
            <textarea
              className="input"
              rows={2}
              value={data.current_medications ?? ''}
              onChange={(e) => setData(prev => ({ ...prev, current_medications: e.target.value }))}
              onBlur={() => save({ current_medications: data.current_medications ?? '' }, 'current_medications')}
              placeholder="Що приймаєте зараз (можна перелічити через кому). Якщо нічого — залишіть пустим."
              style={{ resize: 'vertical', minHeight: 72 }}
            />
          </Field>

          {/* 6. Allergies */}
          <Field label="Алергії" saving={savingKey === 'allergies'} saved={savedKey === 'allergies'}>
            <textarea
              className="input"
              rows={2}
              value={data.allergies ?? ''}
              onChange={(e) => setData(prev => ({ ...prev, allergies: e.target.value }))}
              onBlur={() => save({ allergies: data.allergies ?? '' }, 'allergies')}
              placeholder="Препарати, продукти, інше. Якщо немає — залишіть пустим."
              style={{ resize: 'vertical', minHeight: 72 }}
            />
          </Field>

          {/* 7. Main concern */}
          <Field label="Що турбує найбільше?" hint="обов'язково — лікар підготується саме до цього" saving={savingKey === 'main_concern'} saved={savedKey === 'main_concern'}>
            <textarea
              className="input"
              rows={3}
              value={data.main_concern ?? ''}
              onChange={(e) => setData(prev => ({ ...prev, main_concern: e.target.value }))}
              onBlur={() => save({ main_concern: data.main_concern ?? '' }, 'main_concern')}
              placeholder="Напр. «хочу переконатись що все гаразд» або «болить низ живота»"
              style={{ resize: 'vertical', minHeight: 84 }}
            />
          </Field>

          {saveError && (
            <div style={{
              padding: '10px 14px', background: '#FEF2F2', border: '1.5px solid #FCA5A5',
              color: '#991B1B', borderRadius: 10, fontSize: 13,
            }}>
              {saveError}
            </div>
          )}

          <div className="caption" style={{ color: 'var(--gray-500, #6B7280)', textAlign: 'center' }}>
            Кожна відповідь зберігається одразу. Можна закрити сторінку — прогрес не зникне.
          </div>
        </div>
      )}
    </section>
  );
}

/* ────────────────────────────── Small subcomponents ───────────────────────── */

function Field({ label, hint, saving, saved, children }: {
  label: string;
  hint?: string;
  saving?: boolean;
  saved?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <label className="label" style={{ margin: 0 }}>{label}</label>
        {saving ? (
          <span style={{ fontSize: 11, color: 'var(--gray-500, #6B7280)' }}>зберігаю…</span>
        ) : saved ? (
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--teal-dark, #1a7c75)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Збережено
          </span>
        ) : hint ? (
          <span style={{ fontSize: 11, color: 'var(--gray-500, #6B7280)' }}>{hint}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Pill({ active, onClick, children }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pill-toggle ${active ? 'active' : ''}`}
    >
      {children}
    </button>
  );
}

/* Inline style objects */
const cardWrap: React.CSSProperties = {
  background: 'var(--white, #FFFFFF)',
  border: '1.5px solid var(--gray-200, #E5E7EB)',
  borderRadius: 12,
  padding: 20,
};

const headerBtn: React.CSSProperties = {
  all: 'unset',
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  width: '100%',
  cursor: 'pointer',
};

const ghostBtn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--teal-dark, #1a7c75)',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  padding: '4px 0',
};

const pillsRow: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 8 };
