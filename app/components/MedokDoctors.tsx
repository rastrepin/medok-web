'use client';
import Image from 'next/image';
import { useState } from 'react';
import { CLINIC } from '@/lib/data';

const TERM_LABELS: Record<string, string> = {
  fmf: 'FMF (Fetal Medicine Foundation)',
  isuog: 'ISUOG',
  voluson: 'Апарат Voluson E8',
};
const TERM_BODIES: Record<string, string> = {
  fmf: 'Fetal Medicine Foundation — міжнародна організація з Лондона, яка розробляє стандарти скринінгу вагітності. Сертифікат FMF означає, що лікар пройшов навчання та щорічну перевірку якості вимірювань.',
  isuog: 'Міжнародне товариство ультразвуку в акушерстві та гінекології. Членство підтверджує дотримання світових стандартів діагностики.',
  voluson: "Апарат УЗД експертного класу від GE Healthcare. Забезпечує високу деталізацію зображення, включаючи 3D/4D — об'ємну візуалізацію дитини в реальному часі.",
};

function InfoBtn({ termKey, onInfo }: { termKey: string; onInfo: (k: string) => void }) {
  return (
    <button
      onClick={() => onInfo(termKey)}
      style={{
        background: 'var(--tp)', border: 'none', cursor: 'pointer',
        fontSize: 10, fontWeight: 800, color: 'var(--td)',
        padding: '1px 6px', borderRadius: 20,
        display: 'inline-flex', alignItems: 'center',
        marginLeft: 3, verticalAlign: 'middle', lineHeight: 1.4,
        fontFamily: 'inherit',
      }}
      title="Що це?"
    >?</button>
  );
}

// Obstetrician cards
const OB_DOCTORS = [
  {
    id: 'yanyuk',
    slug: 'yanyuk-olha',
    name: 'Янюк Ольга Олександрівна',
    role: 'Акушер-гінеколог · УЗД',
    photo: '/images/doctors/ginekolog-yanyuk-olga.jpg',
    initials: 'ЯО',
    avatarColor: 'linear-gradient(135deg,var(--td),var(--t))',
    bioKey: 'yanyuk',
  },
  {
    id: 'kelman',
    slug: 'kelman-viktoriia',
    name: 'Кельман Вікторія Володимирівна',
    role: 'Акушер-гінеколог · Пренатальна діагностика',
    photo: '/images/doctors/ginekolog-kelman-viktoriya.jpg',
    initials: 'КВ',
    avatarColor: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
    bioKey: 'kelman',
  },
  {
    id: 'trofimchuk',
    slug: 'trofimchuk-tetiana',
    name: 'Трофімчук Тетяна Ігорівна',
    role: 'Акушер-гінеколог · УЗД',
    photo: '/images/doctors/ginekolog-trofimchuk-tetyana.jpg',
    initials: 'ТТ',
    avatarColor: 'linear-gradient(135deg,var(--c),#f43f5e)',
    bioKey: 'trofimchuk',
  },
];

const UZD_DOCTOR = {
  id: 'bondarchuk',
  slug: 'bondarchuk-zhanna',
  name: 'Бондарчук Жанна Геннадіївна',
  role: 'УЗД-діагност · Voluson E8',
  photo: '/images/doctors/ginekolog-UZD-bondarchuk-zhanna.jpg',
  initials: 'БЖ',
  avatarColor: 'linear-gradient(135deg,#b45309,#f59e0b)',
};

// Bio renderers (with optional ℹ️ buttons)
function ObBio({ id, onInfo }: { id: string; onInfo: (k: string) => void }) {
  if (id === 'yanyuk') {
    return (
      <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.65, marginBottom: 16, textAlign: 'center' }}>
        Веде вагітність і сама проводить УЗД — ваш лікар бачить повну картину без посередників. Автор медичних публікацій, учасниця міжнародних профільних конференцій.
      </p>
    );
  }
  if (id === 'kelman') {
    return (
      <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.65, marginBottom: 16, textAlign: 'center' }}>
        Фокус на пренатальній діагностиці та доказовій медицині. Навчання за програмою FMF (Fetal Medicine Foundation) — міжнародний стандарт скринінгу. Детально пояснює кожен результат і план дій.
      </p>
    );
  }
  if (id === 'trofimchuk') {
    return (
      <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.65, marginBottom: 16, textAlign: 'center' }}>
        ВНМУ з відзнакою, додаткова спеціалізація з УЗД (Львів, 2022). Поєднує ведення вагітності з власними дослідженнями. Сучасний підхід та увага до комфорту пацієнтки.
      </p>
    );
  }
  return null;
}

export default function MedokDoctors() {
  const [termKey, setTermKey] = useState<string | null>(null);
  const [ctaOpen, setCtaOpen] = useState(false);
  const [ctaPhone, setCtaPhone] = useState('');
  const [ctaSent, setCtaSent] = useState(false);

  const handleCtaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/medok/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '', phone: ctaPhone, form_type: 'callback' }),
      });
    } catch { /* non-fatal */ }
    setCtaSent(true);
  };

  return (
    <section style={{ background: '#fff', borderTop: '1px solid var(--g100)', borderBottom: '1px solid var(--g100)' }}>
      <div id="doctors" style={{ maxWidth: 1140, margin: '0 auto', padding: '72px 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 12 }}>КОМАНДА</div>
          <h2 style={{ fontFamily: 'var(--font)', fontSize: 36, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>
            Лікарі, які ведуть вагітність
          </h2>
          <p style={{ fontSize: 15, color: 'var(--g500)', marginTop: 10, lineHeight: 1.75 }}>
            Одна вагітність — один лікар від першого візиту до огляду після пологів
          </p>
        </div>

        {/* Obstetricians grid */}
        <div className="doctors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 28 }}>
          {OB_DOCTORS.map((doc) => (
            <div key={doc.id} style={{
              background: '#fff', border: '1.5px solid var(--g200)',
              borderRadius: 20, padding: '28px 18px',
              transition: 'all .25s', display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              {/* Photo */}
              <div style={{ width: 80, height: 80, borderRadius: 18, overflow: 'hidden', marginBottom: 14, flexShrink: 0, border: '2px solid var(--g100)' }}>
                <Image
                  src={doc.photo}
                  alt={doc.name}
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--g900)', textAlign: 'center', marginBottom: 3, lineHeight: 1.35 }}>
                {doc.name}
              </div>
              <div style={{ fontSize: 10, color: 'var(--t)', fontWeight: 700, textAlign: 'center', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                {doc.role}
              </div>

              <ObBio id={doc.id} onInfo={setTermKey} />

              <div style={{ display: 'flex', gap: 7, width: '100%' }}>
                <a href={`tel:${CLINIC.phone}`} style={{
                  flex: 1, display: 'block', textAlign: 'center', padding: '9px 6px',
                  background: 'var(--cl)', color: 'var(--c)',
                  borderRadius: 9999, fontSize: 12, fontWeight: 700,
                  textDecoration: 'none',
                }}>
                  Записатись
                </a>
                <a href={`/doctors/${doc.slug}?case=pregnancy`} style={{
                  flex: 1, display: 'block', textAlign: 'center', padding: '9px 6px',
                  background: 'var(--g50)', color: 'var(--g600)',
                  border: '1.5px solid var(--g200)',
                  borderRadius: 9999, fontSize: 12, fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  Профіль
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* UZD specialist — wide card */}
        <div className="uzd-card" style={{
          background: 'linear-gradient(150deg,var(--tp) 0%,#fff 60%)',
          border: '1.5px solid var(--tl)', borderRadius: 20,
          padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 24,
          marginBottom: 24,
        }}>
          {/* Photo */}
          <div style={{ width: 72, height: 72, borderRadius: 16, overflow: 'hidden', flexShrink: 0, border: '2px solid var(--tl)' }}>
            <Image
              src={UZD_DOCTOR.photo}
              alt={UZD_DOCTOR.name}
              width={72}
              height={72}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--td)', marginBottom: 4 }}>
              ДІАГНОСТИКА
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--g900)', marginBottom: 6 }}>{UZD_DOCTOR.name}</div>
            <div style={{ fontSize: 11, color: 'var(--g400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.3px' }}>
              {UZD_DOCTOR.role}
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.7, maxWidth: 440, flex: 1 }}>
            Лікар, до якого направляють ваші гінекологи на планові скринінги. Сертифікація FMF (Fetal Medicine Foundation, Лондон), член ISUOG (International Society of Ultrasound in Obstetrics and Gynecology). Апарат Voluson E8 з 3D/4D — деталізація, яка дає вашому лікарю повну інформацію для рішень. Жанна не веде вагітність — вона проводить ключові дослідження, на які спирається ваш акушер-гінеколог.
          </p>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <a href={`tel:${CLINIC.phone}`} style={{
              display: 'block', textAlign: 'center',
              background: 'var(--cl)', color: 'var(--c)',
              padding: '10px 22px', borderRadius: 9999,
              textDecoration: 'none', fontSize: 13, fontWeight: 700,
              whiteSpace: 'nowrap',
            }}>
              Записатись
            </a>
            <a href={`/doctors/${UZD_DOCTOR.slug}`} style={{
              display: 'block', textAlign: 'center',
              background: 'var(--g50)', color: 'var(--g600)',
              border: '1.5px solid var(--g200)',
              padding: '9px 22px', borderRadius: 9999,
              textDecoration: 'none', fontSize: 13, fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              Профіль
            </a>
          </div>
        </div>

        {/* "Допоможемо обрати" CTA block */}
        <div style={{
          background: 'var(--g50)', border: '1.5px solid var(--g200)',
          borderRadius: 18, padding: '24px 28px',
          display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--g900)', marginBottom: 6 }}>
              Не знаєте, кого обрати?
            </div>
            <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.65, margin: 0 }}>
              Залиште номер — адміністратор розпитає про вашу ситуацію і підкаже, який лікар вам підійде.
            </p>
          </div>

          {!ctaOpen && !ctaSent && (
            <button
              onClick={() => setCtaOpen(true)}
              style={{
                background: 'var(--td)', color: '#fff', border: 'none',
                padding: '12px 26px', borderRadius: 9999,
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              Передзвоніть мені
            </button>
          )}

          {ctaOpen && !ctaSent && (
            <form onSubmit={handleCtaSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="tel"
                value={ctaPhone}
                onChange={(e) => setCtaPhone(e.target.value)}
                placeholder="+380"
                required
                style={{
                  padding: '11px 16px', border: '1.5px solid var(--g200)',
                  borderRadius: 9999, fontSize: 14, fontFamily: 'inherit',
                  outline: 'none', width: 180,
                }}
              />
              <button type="submit" style={{
                background: 'var(--c)', color: '#fff', border: 'none',
                padding: '11px 22px', borderRadius: 9999,
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Надіслати
              </button>
            </form>
          )}

          {ctaSent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--td)', fontWeight: 700, fontSize: 13 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Передзвонимо вам скоро
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheet for info terms */}
      {termKey && (
        <div onClick={() => setTermKey(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
          zIndex: 400, display: 'flex', alignItems: 'flex-end',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', borderRadius: '20px 20px 0 0',
            padding: '28px 28px 48px', width: '100%',
            maxWidth: 540, margin: '0 auto',
            animation: 'slideUpSheet .25s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--g900)' }}>
                {TERM_LABELS[termKey] ?? termKey}
              </div>
              <button onClick={() => setTermKey(null)} style={{
                background: 'var(--g100)', border: 'none',
                width: 36, height: 36, borderRadius: '50%',
                fontSize: 18, cursor: 'pointer', color: 'var(--g500)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: 'var(--g600)', lineHeight: 1.75 }}>
              {TERM_BODIES[termKey] ?? 'Інформація буде додана.'}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUpSheet { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
        @media(max-width:1024px){ .doctors-grid{grid-template-columns:repeat(2,1fr)!important} }
        @media(max-width:768px){
          #doctors{padding:52px 20px!important}
          .doctors-grid{grid-template-columns:1fr 1fr!important;gap:12px!important}
          .uzd-card{flex-direction:column!important;align-items:flex-start!important;gap:16px!important}
          .uzd-card p{max-width:100%!important}
          .uzd-card a{width:100%!important;text-align:center!important;display:block!important}
        }
        @media(max-width:480px){
          .doctors-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </section>
  );
}
