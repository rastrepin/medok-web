'use client';
import { useState, useEffect } from 'react';
import BottomSheet from './BottomSheet';
import { useBookingModal } from './useBookingModal';
import { track } from '@/lib/track';
import {
  PROGRAMS, TRIMESTER_TO_PROGRAM, QUIZ_DOCTORS, formatPrice,
  type ProgramId,
} from '@/lib/program-data';

type Trimester     = 'first' | 'second' | 'third';
type PregnancyType = 'single' | 'twin';
type Screen        = 'trimester' | 'pregnancy' | 'existing' | 'offer' | 'doctors';

type Props = {
  open: boolean;
  onClose: () => void;
  prefilledTrimester?: 'first' | 'second' | 'third' | 'full';
  prefilledPregnancyType?: PregnancyType;
  source: string;
};

// ── helpers ──────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="var(--teal-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function ChevronRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

// ── component ─────────────────────────────────────────────────
export default function QuizModal({ open, onClose, prefilledTrimester, prefilledPregnancyType, source }: Props) {
  const booking = useBookingModal();

  // valid trimester values for this modal (no 'full' — that's offer-only)
  const validTrimester = (prefilledTrimester === 'full' ? undefined : prefilledTrimester) as Trimester | undefined;

  // determine starting screen
  const startScreen = (): Screen => {
    if (validTrimester && prefilledPregnancyType) return 'existing';
    if (validTrimester) return 'pregnancy';
    return 'trimester';
  };

  const [screen,        setScreen]        = useState<Screen>(startScreen);
  const [trimester,     setTrimester]     = useState<Trimester | null>(validTrimester ?? null);
  const [pregnancyType, setPregnancyType] = useState<PregnancyType | null>(prefilledPregnancyType ?? null);
  const [isExisting,    setIsExisting]    = useState<boolean | null>(null);
  const [transferWeek,  setTransferWeek]  = useState('');
  // offer screen — selected program (for I trimester toggle)
  const [selectedOffer, setSelectedOffer] = useState<ProgramId | null>(null);

  useEffect(() => {
    if (open) {
      const sc = startScreen();
      setScreen(sc);
      setTrimester(validTrimester ?? null);
      setPregnancyType(prefilledPregnancyType ?? null);
      setIsExisting(null);
      setTransferWeek('');
      setSelectedOffer(null);
      void track({ event_type: 'modal_opened', modal_type: 'quiz', source_cta: source });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    if (screen !== 'offer') {
      void track({ event_type: 'quiz_dropped', modal_type: 'quiz', source_cta: source });
    }
    onClose();
  };

  // progress: trimester(1/3) → pregnancy(2/3) → existing(3/3) → offer(done)
  const SCREEN_PROGRESS: Record<Screen, number> = {
    trimester: 33,
    pregnancy: 55,
    existing:  78,
    offer:     100,
    doctors:   100,
  };

  // ── go to offer ──
  const goToOffer = (existing: boolean) => {
    void track({
      event_type: 'quiz_step_completed', modal_type: 'quiz',
      step_number: 3,
      step_value: { trimester, pregnancy_type: pregnancyType, is_existing: existing },
      source_cta: source,
    });
    // default selected offer for I trimester
    if (trimester === 'first') {
      setSelectedOffer('i'); // default to trimester card, user can switch
    } else if (trimester) {
      setSelectedOffer(TRIMESTER_TO_PROGRAM[trimester]);
    }
    void track({ event_type: 'quiz_offer_viewed', modal_type: 'quiz', source_cta: source });
    setScreen('offer');
  };

  // ── book CTA → open BookingModal with prefilled ──
  const handleBookCta = (doctorSlug?: string) => {
    const programId = selectedOffer
      ? (pregnancyType === 'twin' ? `${selectedOffer}-twin` : `${selectedOffer}-single`)
      : undefined;

    booking.open('booking', {
      ...(doctorSlug ? { prefilledDoctorSlug: doctorSlug } : {}),
      ...(programId  ? { prefilledProgramId: programId }   : {}),
      source: 'quiz-offer',
    });

    if (doctorSlug) {
      void track({ event_type: 'quiz_doctor_selected', modal_type: 'quiz', step_value: { doctor_slug: doctorSlug }, source_cta: source });
    }
  };

  // ── current offer program ──
  const offerProgram = selectedOffer ? PROGRAMS[selectedOffer] : null;
  const offerPrice   = offerProgram
    ? (pregnancyType === 'twin' ? offerProgram.priceTwin : offerProgram.priceSingle)
    : 0;

  const progress = SCREEN_PROGRESS[screen];

  return (
    <BottomSheet open={open} onClose={handleClose} title="Підбір програми">
      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--gray-200)', borderRadius: 2, marginBottom: 24 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--teal-dark)', borderRadius: 2, transition: 'width 0.35s ease' }} />
      </div>

      {/* ══ SCREEN: trimester (shown only when opened without prefill) ══ */}
      {screen === 'trimester' && (
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>КРОК 1 З 3</p>
          <p className="h3" style={{ marginBottom: 20 }}>Який у вас термін?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {([
              { val: 'first'  as Trimester, label: 'I триместр',   sub: '11–16 тиж' },
              { val: 'second' as Trimester, label: 'II триместр',  sub: '18–28 тиж' },
              { val: 'third'  as Trimester, label: 'III триместр', sub: '30–41 тиж' },
            ]).map(({ val, label, sub }) => (
              <button key={val} type="button"
                onClick={() => {
                  setTrimester(val);
                  void track({ event_type: 'quiz_started', modal_type: 'quiz', step_number: 1, step_value: { trimester: val }, source_cta: source });
                  setScreen('pregnancy');
                }}
                style={{
                  padding: '14px 18px', textAlign: 'left',
                  border: '1.5px solid var(--gray-200)',
                  background: '#fff', borderRadius: 'var(--r-md)', cursor: 'pointer',
                  fontSize: 15, color: 'var(--black)', fontFamily: 'var(--font-text)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.15s', minHeight: 56,
                }}>
                <span>
                  <span style={{ display: 'block', fontWeight: 700 }}>{label}</span>
                  <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{sub}</span>
                </span>
                <ChevronRight />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══ SCREEN: pregnancy type ══ */}
      {screen === 'pregnancy' && (
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>КРОК 2 З 3</p>
          <p className="h3" style={{ marginBottom: 8 }}>Одноплідна чи двоплідна вагітність?</p>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>
            Від цього залежить вартість програми
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[
              { val: 'single' as PregnancyType, label: 'Одноплідна',          sub: 'один плід' },
              { val: 'twin'   as PregnancyType, label: 'Двоплідна вагітність', sub: 'двійня' },
            ].map(({ val, label, sub }) => (
              <button key={val} type="button"
                onClick={() => {
                  setPregnancyType(val);
                  void track({ event_type: 'quiz_step_completed', modal_type: 'quiz', step_number: 2, step_value: { pregnancy_type: val }, source_cta: source });
                  setScreen('existing');
                }}
                style={{
                  padding: '20px 14px', textAlign: 'center',
                  border: '1.5px solid var(--gray-200)',
                  background: '#fff', borderRadius: 'var(--r-lg)', cursor: 'pointer',
                  fontSize: 15, fontWeight: 700, color: 'var(--black)', fontFamily: 'var(--font-text)',
                  transition: 'all 0.15s', minHeight: 80,
                }}>
                <span style={{ display: 'block', marginBottom: 4 }}>{label}</span>
                <span style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 400 }}>{sub}</span>
              </button>
            ))}
          </div>
          <button type="button" className="btn-ghost"
            onClick={() => setScreen('trimester')}>
            ← Назад
          </button>
        </div>
      )}

      {/* ══ SCREEN: existing patient ══ */}
      {screen === 'existing' && (
        <div>
          <p className="eyebrow" style={{ marginBottom: 8 }}>КРОК 3 З 3</p>
          <p className="h3" style={{ marginBottom: 20 }}>Чи стоїте на обліку в іншій клініці?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button type="button"
              onClick={() => { setIsExisting(false); goToOffer(false); }}
              style={{
                padding: '16px 18px', textAlign: 'left',
                border: '1.5px solid var(--gray-200)', background: '#fff',
                borderRadius: 'var(--r-md)', cursor: 'pointer',
                fontSize: 15, color: 'var(--black)', fontFamily: 'var(--font-text)',
                transition: 'all 0.15s', minHeight: 56,
              }}>
              Ні, перша постановка на облік
            </button>
            <button type="button"
              onClick={() => setIsExisting(true)}
              style={{
                padding: '16px 18px', textAlign: 'left',
                border: `1.5px solid ${isExisting === true ? 'var(--teal-dark)' : 'var(--gray-200)'}`,
                background: isExisting === true ? 'var(--mint-tint)' : '#fff',
                borderRadius: 'var(--r-md)', cursor: 'pointer',
                fontSize: 15, color: 'var(--black)', fontFamily: 'var(--font-text)',
                transition: 'all 0.15s', minHeight: 56,
              }}>
              Так, переходжу з іншої клініки
            </button>
            {isExisting === true && (
              <div style={{ marginTop: 4 }}>
                <label className="label">На якому ви тижні?</label>
                <input className="input" type="number" min="4" max="40"
                  placeholder="Наприклад: 12"
                  value={transferWeek} onChange={e => setTransferWeek(e.target.value)} />
                <button type="button" className="btn-primary" style={{ width: '100%', marginTop: 12 }}
                  onClick={() => goToOffer(true)}>
                  Далі →
                </button>
              </div>
            )}
          </div>
          <button type="button" className="btn-ghost" style={{ marginTop: 16 }}
            onClick={() => setScreen('pregnancy')}>
            ← Назад
          </button>
        </div>
      )}

      {/* ══ SCREEN: offer ══ */}
      {screen === 'offer' && trimester && pregnancyType && (
        <div>
          <p className="eyebrow" style={{ marginBottom: 4 }}>ВАША ПРОГРАМА</p>
          <p className="h3" style={{ marginBottom: 20 }}>
            Пакет «Довіра»
            {trimester === 'first' ? ' · I триместр' :
             trimester === 'second' ? ' · II триместр' : ' · III триместр'}
          </p>

          {/* For I trimester: two selectable cards */}
          {trimester === 'first' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {/* Card I trimester */}
              {(['i', 'full'] as ProgramId[]).map((pid) => {
                const prog  = PROGRAMS[pid];
                const price = pregnancyType === 'twin' ? prog.priceTwin : prog.priceSingle;
                const isSelected = selectedOffer === pid;
                const isFull = pid === 'full';
                return (
                  <button key={pid} type="button"
                    onClick={() => {
                      setSelectedOffer(pid);
                      if (isFull) void track({ event_type: 'quiz_offer_chose_full_pregnancy', modal_type: 'quiz', source_cta: source });
                    }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      background: isSelected ? 'var(--mint-tint)' : '#F9FAFB',
                      border: `2px solid ${isSelected ? 'var(--teal-dark)' : '#E5E7EB'}`,
                      borderRadius: 14, padding: '16px 18px', cursor: 'pointer',
                      fontFamily: 'inherit', position: 'relative', transition: 'all 0.15s',
                    }}>
                    {/* Best price badge */}
                    {isFull && (
                      <span style={{
                        position: 'absolute', top: -10, right: 14,
                        background: 'var(--teal-dark)', color: '#fff',
                        fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
                        padding: '3px 8px', borderRadius: 4,
                      }}>
                        НАЙКРАЩА ЦІНА
                      </span>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal-dark)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {prog.name}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--gray-500)', margin: 0 }}>
                          {isFull ? '11–41 тиж · від постановки до пологів' : `${prog.weeks} тиж`}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)', margin: 0, fontFamily: 'var(--font-display)' }}>
                          {formatPrice(price)}
                        </p>
                        {pregnancyType === 'single' && (
                          <p style={{ fontSize: 10, color: 'var(--gray-500)', margin: '2px 0 0' }}>двоплідна: {formatPrice(isFull ? 46190 : 16790)}</p>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                          width: 18, height: 18, borderRadius: '50%',
                          background: 'var(--teal-dark)', display: 'inline-flex',
                          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--teal-dark)', fontWeight: 600 }}>Обрано</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Single card for II / III trimester */
            <div style={{ marginBottom: 20 }}>
              {(() => {
                const pid   = TRIMESTER_TO_PROGRAM[trimester];
                const prog  = PROGRAMS[pid];
                const price = pregnancyType === 'twin' ? prog.priceTwin : prog.priceSingle;
                return (
                  <div style={{
                    background: 'var(--mint-tint)',
                    border: '2px solid var(--teal-dark)',
                    borderRadius: 14, padding: '18px 20px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal-dark)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {prog.name}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--gray-500)', margin: 0 }}>{prog.weeks} тиж</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)', margin: 0, fontFamily: 'var(--font-display)' }}>
                          {formatPrice(price)}
                        </p>
                        <p style={{ fontSize: 10, color: 'var(--gray-500)', margin: '2px 0 0' }}>
                          {pregnancyType === 'single' ? 'одноплідна' : 'двоплідна вагітність'}
                        </p>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--gray-600)', margin: 0, lineHeight: 1.5 }}>
                      Фіксована вартість за весь триместр. Без несподіваних доплат.
                    </p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* What's included */}
          {offerProgram && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--teal-dark)', marginBottom: 10 }}>
                ЩО ВХОДИТЬ
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {offerProgram.includes.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ flexShrink: 0, marginTop: 1 }}><CheckIcon /></span>
                    <span style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location + doctor row */}
          <div style={{
            background: '#F9FAFB', border: '1px solid #E5E7EB',
            borderRadius: 12, padding: '14px 16px', marginBottom: 20,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--teal-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>
                <strong>MED OK Поділля</strong> · вул. Зодчих 20, Вінниця
              </span>
            </div>
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--teal-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>
                Лікар — за вашим вибором · <span style={{ color: 'var(--teal-dark)', fontWeight: 600 }}>4 акушери · адміністратор узгодить</span>
              </span>
            </div>
          </div>

          {/* CTA primary */}
          <button type="button" className="btn-primary-long"
            style={{ width: '100%', marginBottom: 12 }}
            onClick={() => handleBookCta()}>
            Записатись на програму
          </button>

          {/* Ghost row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" className="btn-ghost"
              onClick={() => { setScreen('existing'); setSelectedOffer(null); }}>
              ← Інший пакет
            </button>
            <button type="button" className="btn-ghost"
              onClick={() => {
                void track({ event_type: 'quiz_doctor_selection_viewed', modal_type: 'quiz', source_cta: source });
                setScreen('doctors');
              }}>
              Обрати лікаря →
            </button>
          </div>
        </div>
      )}

      {/* ══ SCREEN: doctor selection ══ */}
      {screen === 'doctors' && (
        <div>
          <button type="button" className="btn-ghost" style={{ marginBottom: 16 }}
            onClick={() => setScreen('offer')}>
            ← Назад до програми
          </button>

          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--teal-dark)', marginBottom: 6 }}>
            КОМАНДА MED OK
          </p>
          <p className="h3" style={{ marginBottom: 20 }}>Оберіть вашого лікаря</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {QUIZ_DOCTORS.map((doc) => (
              <button key={doc.slug} type="button"
                onClick={() => handleBookCta(doc.slug)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, width: '100%',
                  padding: '14px 16px', background: '#fff',
                  border: '1.5px solid var(--gray-200)', borderRadius: 14,
                  cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  transition: 'all 0.15s', minHeight: 76,
                }}>
                {/* Avatar */}
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: doc.color, flexShrink: 0, overflow: 'hidden',
                  border: '1.5px solid rgba(82,178,173,.2)',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={doc.photo} alt={doc.name} width={52} height={52}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.name}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--gray-500)', margin: '0 0 6px' }}>{doc.role}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {doc.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px',
                        background: 'var(--mint-tint)', color: 'var(--teal-dark)',
                        borderRadius: 4,
                      }}>{tag}</span>
                    ))}
                    <span style={{ fontSize: 10, color: 'var(--gray-500)', padding: '2px 0', alignSelf: 'center' }}>
                      {doc.schedule}
                    </span>
                  </div>
                </div>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>

          {/* Skip doctor selection */}
          <button type="button"
            style={{
              width: '100%', padding: '13px 20px', background: '#fff',
              border: '1.5px solid var(--gray-200)', borderRadius: 9999,
              fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
              color: 'var(--gray-600)', cursor: 'pointer', transition: 'all 0.15s',
            }}
            onClick={() => {
              void track({ event_type: 'quiz_doctor_skip', modal_type: 'quiz', source_cta: source });
              setScreen('offer');
            }}>
            Довіряю адміністратору — оберіть лікаря
          </button>
        </div>
      )}
    </BottomSheet>
  );
}
