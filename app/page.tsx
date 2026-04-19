'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const DOCTORS = [
  { id: 'yanyuk', slug: 'yanyuk-olha', name: 'Янюк Ольга Олександрівна', role: 'Акушер-гінеколог · УЗД', photo: '/images/doctors/ginekolog-yanyuk-olga.jpg', bio: 'Веде вагітність і сама проводить УЗД — ваш лікар бачить повну картину без посередників. Автор медичних публікацій.', badge: null },
  { id: 'kelman', slug: 'kelman-viktoriia', name: 'Кельман Вікторія Володимирівна', role: 'Акушер-гінеколог · Пренатальна діагностика', photo: '/images/doctors/ginekolog-kelman-viktoriya.jpg', bio: 'Фокус на пренатальній діагностиці. Навчання за програмою FMF — міжнародний стандарт скринінгу. Детально пояснює кожен результат.', badge: null },
  { id: 'trofimchuk', slug: 'trofimchuk-tetiana', name: 'Трофімчук Тетяна Ігорівна', role: 'Акушер-гінеколог · УЗД', photo: '/images/doctors/ginekolog-trofimchuk-tetyana.jpg', bio: 'Досвід у перинатальному центрі та пологовому будинку Інномед. Веде вагітність від постановки на облік до пологів.', badge: null },
  { id: 'bondarchuk', slug: 'bondarchuk-zhanna', name: 'Бондарчук Жанна Геннадіївна', role: 'УЗД · Пренатальна діагностика', photo: '/images/doctors/ginekolog-UZD-bondarchuk-zhanna.jpg', bio: 'Сертифікація FMF London, член ISUOG. Скринінги I–III триместру на Voluson E8 з 3D/4D.', badge: 'ДІАГНОСТИКА' },
];

const PROGRAMS = [
  { id: 'trimester-i', name: 'I триместр', price: 14540, priceTwin: 16790, weeks: '11–16 тиж', highlights: ['УЗД з 3D + генетичний скринінг Astraia', 'Аналізи: ЗАК, феритин, ТТГ, вітамін D', 'УЗД щитоподібної та молочних залоз', 'Огляд терапевта + ЕКГ', 'Консультації гінеколога: очна + онлайн'] },
  { id: 'trimester-ii', name: 'II триместр', price: 9970, priceTwin: 13830, weeks: '18–28 тиж', highlights: ['Анатомічний скринінг з 3D (18–22 тиж)', 'Цервікометрія ×2 + КТГ', 'Глюкозо-толерантний тест', 'Аналізи крові ×4, сечі ×2', 'Консультації: очні ×3, онлайн ×2'] },
  { id: 'trimester-iii', name: 'III триместр', price: 15320, priceTwin: 15570, weeks: '30–41 тиж', highlights: ['УЗД ×2 + доплерометрія плоду', 'КТГ-моніторинг ×5', 'Школа батьківства (3 год)', 'Консультації: очні ×4, онлайн ×1', 'Огляд після пологів + педіатр'] },
  { id: 'trimester-full', name: 'Вся вагітність', price: 39830, priceTwin: 46190, weeks: 'від постановки до пологів', highlights: ['Все з I + II + III триместру', 'Один лікар на весь термін', 'Консультації: очні ×8, онлайн ×4', 'КТГ ×6, УЗД всіх скринінгів', 'Пріоритетний запис + CAREWAY 24/7'], best: true },
];

const STEPS = [
  { num: 1, title: 'Заявка та підбір програми', desc: 'Залишаєте заявку на сайті або телефоном. Адміністратор передзвонює протягом робочого дня, допомагає обрати програму (I, II, III триместр або повне ведення) та записує на перший прийом до вашого лікаря.' },
  { num: 2, title: 'Перший прийом — постановка на облік', desc: 'Акушер-гінеколог проводить огляд, оформлює обмінну карту та складає індивідуальний план спостереження: які дослідження, аналізи та скринінги заплановані на кожен тиждень. Вартість програми фіксована.' },
  { num: 3, title: 'Програма досліджень по тижнях', desc: 'Ви знаєте план наперед: УЗД-скринінги з 3D, біохімічні аналізи, КТГ, цервікометрія — кожне дослідження прив\'язане до конкретного тижня вагітності. Не потрібно нічого шукати самостійно.' },
  { num: 4, title: 'Контроль між візитами', desc: 'Лікар відстежує ваші результати аналізів та досліджень між прийомами через систему CAREWAY. Якщо щось потребує уваги — зв\'яжеться з вами, не чекаючи наступного запису. Огляд після пологів також входить у програму.' },
];

const ADVANTAGES = [
  { title: 'Контроль між візитами', desc: "Лікар відстежує ваші показники між прийомами. Якщо щось потребує уваги — зв'яжеться, не чекаючи наступного запису." },
  { title: 'УЗД експертного рівня', desc: 'Скринінги проводить спеціаліст FMF London на апараті Voluson E8 з 3D/4D.' },
  { title: 'Один лікар — від початку до кінця', desc: 'Ваш акушер-гінеколог веде вас від постановки на облік до огляду після пологів.' },
];

function fmt(n: number) { return n.toLocaleString('uk-UA'); }
import { useBookingModal } from '@/components/booking/useBookingModal';
import MedokTransfer from './components/MedokTransfer';
import MedokFaq from './components/MedokFaq';
import MedokGeoBlock from './components/MedokGeoBlock';
import MedokEeat from './components/MedokEeat';
import MedokQuiz from './components/MedokQuiz';

export default function HomePage() {
  const booking = useBookingModal();
  const [ctaText, setCtaText] = useState('Підібрати програму');
  const doctorsRef = useRef<HTMLElement>(null);
  const programsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = [
      { ref: doctorsRef, text: 'Записатись до лікаря' },
      { ref: programsRef, text: 'Обрати програму' },
    ];
    const observers: IntersectionObserver[] = [];
    const visible = new Set<string>();
    sections.forEach(({ ref, text }) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { visible.add(text); setCtaText(text); }
          else { visible.delete(text); if (visible.size === 0) setCtaText('Підібрати програму'); else setCtaText([...visible][visible.size - 1]); }
        },
        { threshold: 0.2 },
      );
      if (ref.current) observer.observe(ref.current);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      {/* 1. HERO */}
      <section id="hero" style={{ maxWidth: 1140, margin: '0 auto', padding: '96px 48px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 18 }}>
          <span style={{ width: 26, height: 2, background: 'var(--t)', borderRadius: 1, flexShrink: 0, display: 'inline-block' }} />
          ВЕДЕННЯ ВАГІТНОСТІ · ВІННИЦЯ
        </div>
        <h1 style={{ fontFamily: 'var(--font)', fontSize: 48, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.1, marginBottom: 14, letterSpacing: '-.5px', maxWidth: 720 }}>
          Ведення вагітності у Вінниці — МЦ MED OK
        </h1>
        <p style={{ fontSize: 16, fontWeight: 500, color: '#1A1A2E', lineHeight: 1.5, marginBottom: 28, maxWidth: 580 }}>
          Лікар завжди на зв'язку — ваші аналізи та УЗД під рукою між візитами
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <button onClick={() => booking.open('quiz', { source: 'hero' })} style={{ background: 'var(--c)', color: '#fff', border: 'none', padding: '15px 36px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Підібрати програму
          </button>
          <button onClick={() => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'transparent', border: 'none', padding: '4px 0', fontSize: 14, fontWeight: 600, color: 'var(--td)', cursor: 'pointer', fontFamily: 'inherit' }}>
            Наші лікарі ↓
          </button>
        </div>
      </section>

      {/* 2. DOCTORS */}
      <section ref={doctorsRef} id="doctors" style={{ background: '#fff', borderTop: '1px solid var(--g100)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '96px 48px' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 10 }}>КОМАНДА</div>
            <h2 style={{ fontFamily: 'var(--font)', fontSize: 32, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>Лікарі, які ведуть вагітність</h2>
          </div>
          <div className="doctors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
            {DOCTORS.map((doc) => (
              <div key={doc.id} style={{ background: '#fff', border: '1.5px solid var(--g200)', borderRadius: 16, padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', marginBottom: 12, flexShrink: 0, border: '2px solid var(--g100)' }}>
                  <Image src={doc.photo} alt={doc.name} width={80} height={80} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                </div>
                {doc.badge && <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 4 }}>{doc.badge}</div>}
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--g900)', marginBottom: 3, lineHeight: 1.35 }}>{doc.name}</div>
                <div style={{ fontSize: 10, color: 'var(--t)', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>{doc.role}</div>
                <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.65, marginBottom: 16, flex: 1 }}>{doc.bio}</p>
                <button onClick={() => booking.open('booking', { prefilledDoctorSlug: doc.slug, source: 'doctor-card' })} style={{ display: 'block', textAlign: 'center', padding: '10px 6px', background: '#005485', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', border: 'none', width: '100%', minHeight: 44 }}>Записатись</button>
                <a href={`/doctors/${doc.slug}?case=pregnancy`} style={{ display: 'block', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--td)', textDecoration: 'none', marginTop: 8, padding: '4px 0' }}>Профіль →</a>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: 'var(--g500)', lineHeight: 1.6, maxWidth: 520 }}>
            Не знаєте, кого обрати?{' '}
            <a
              href="#quiz"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                const quizEl = document.getElementById('quiz');
                if (quizEl) quizEl.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ color: 'var(--td)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }}
            >
              Оберіть програму — ми підберемо лікаря
            </a>
          </p>
        </div>
      </section>
      {/* 3. PROGRAMS */}
      <section ref={programsRef} id="programs" style={{ background: 'var(--g50)', borderTop: '1px solid var(--g100)', borderBottom: '1px solid var(--g100)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '96px 48px' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 10 }}>ПРОГРАМИ</div>
            <h2 style={{ fontFamily: 'var(--font)', fontSize: 32, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>Програми ведення вагітності</h2>
          </div>
          <div className="programs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {PROGRAMS.map((prog) => (
              <div key={prog.id} style={{ background: '#fff', border: prog.best ? '2px solid var(--t)' : '1.5px solid var(--g200)', borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {prog.best && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--td)', color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: '1px', padding: '4px 14px', borderRadius: 9999, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Найкраща ціна</div>}
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--g900)', marginBottom: 2 }}>{prog.name}</div>
                <div style={{ fontSize: 11, color: 'var(--g400)', marginBottom: 10, fontWeight: 500 }}>{prog.weeks}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--g900)', marginBottom: 4, lineHeight: 1.1 }}>{fmt(prog.price)} ₴</div>
                <div style={{ fontSize: 12, color: 'var(--g500)', marginBottom: 14 }}>двоплідна: {fmt(prog.priceTwin)} ₴</div>
                <div style={{ marginBottom: 20, flex: 1 }}>
                  {prog.highlights.map((h: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: 'var(--g600)', lineHeight: 1.45, marginBottom: 5 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--t)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12" /></svg>
                      {h}
                    </div>
                  ))}
                </div>
                <button onClick={() => {
                  const tMap: Record<string, 'first'|'second'|'third'|'full'> = { 'trimester-i': 'first', 'trimester-ii': 'second', 'trimester-iii': 'third', 'trimester-full': 'full' };
                  booking.open('quiz', { prefilledTrimester: tMap[prog.id], prefilledPregnancyType: 'single', source: 'program-card' });
                }} style={{ background: '#005485', color: '#fff', border: 'none', padding: '11px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', width: '100%', minHeight: 44 }}>Обрати програму</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <button onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'transparent', border: 'none', padding: '4px 0', fontSize: 13, fontWeight: 600, color: 'var(--td)', cursor: 'pointer', fontFamily: 'inherit' }}>Подивитись повний склад програми ↓</button>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="onboarding" style={{ background: '#fff' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '96px 48px' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 10 }}>МАРШРУТ</div>
            <h2 style={{ fontFamily: 'var(--font)', fontSize: 32, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>Як це працює</h2>
          </div>
          <div className="v2-steps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {STEPS.map((step) => (
              <div key={step.num} style={{ background: 'var(--g50)', borderRadius: 16, padding: '28px 24px', border: '1px solid var(--g100)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, minWidth: 40, borderRadius: '50%', background: 'var(--td)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800 }}>{step.num}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--g900)', marginBottom: 8 }}>{step.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ADVANTAGES */}
      <section id="why" style={{ background: 'var(--g50)', borderTop: '1px solid var(--g100)', borderBottom: '1px solid var(--g100)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '96px 48px' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--td)', marginBottom: 10 }}>ЧОМУ MED OK</div>
            <h2 style={{ fontFamily: 'var(--font)', fontSize: 32, fontWeight: 600, color: 'var(--g900)', lineHeight: 1.2 }}>Переваги</h2>
          </div>
          <div className="advantages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {ADVANTAGES.map((adv, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '24px 20px', border: '1.5px solid var(--g200)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--tp)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--td)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--g900)', marginBottom: 6 }}>{adv.title}</div>
                <p style={{ fontSize: 13, color: 'var(--g500)', lineHeight: 1.6, margin: 0 }}>{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6-11. Reused sections */}
      <div id="transfer" style={{ borderTop: '1px solid var(--g100)' }}><MedokTransfer /></div>
      <div style={{ background: 'var(--g50)', borderTop: '1px solid var(--g100)' }}><MedokFaq /></div>
      <div id="quiz"><MedokQuiz /></div>
      <MedokGeoBlock />
      <MedokEeat />
      {/* Callback CTA — replaces inline form */}
      <section style={{ background: 'var(--mint-tint)', borderTop: '1px solid var(--gray-200)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '64px 48px', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'var(--teal-dark)', marginBottom: 12 }}>ЗВ'ЯЗОК</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: 'var(--gray-900)', marginBottom: 8, textTransform: 'uppercase' }}>Передзвонимо вам</h2>
          <p style={{ fontSize: 15, color: 'var(--gray-700)', marginBottom: 24, lineHeight: 1.6 }}>Залишіть номер — адміністратор зателефонує протягом робочого дня</p>
          <button onClick={() => booking.open('callback', { source: 'footer-cta' })} className="btn-primary" style={{ minWidth: 200 }}>
            ПЕРЕДЗВОНИТИ
          </button>
        </div>
      </section>

      {/* STICKY CTA — mobile only */}
      <div className="v2-sticky-cta" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, padding: '8px 16px', paddingBottom: 'max(8px, env(safe-area-inset-bottom))', background: '#fff', boxShadow: '0 -2px 8px rgba(0,0,0,0.08)' }}>
        <button onClick={() => booking.open('quiz', { source: 'sticky-mobile' })} style={{ width: '100%', height: 52, background: '#d60242', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Підібрати програму</button>
      </div>

      <style>{`
        .v2-sticky-cta{display:none}
        @media(max-width:767px){.v2-sticky-cta{display:block}body{padding-bottom:68px!important}}
        @media(max-width:768px){#hero{padding:64px 20px 36px!important}#hero h1{font-size:28px!important;max-width:100%!important}}
        @media(max-width:1280px){.doctors-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:768px){#doctors>div{padding:64px 20px!important}.doctors-grid{grid-template-columns:1fr!important;gap:12px!important}}
        @media(max-width:1024px){.programs-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:600px){#programs>div{padding:64px 20px!important}.programs-grid{grid-template-columns:1fr!important;gap:12px!important}}
        @media(max-width:768px){#onboarding>div{padding:64px 20px!important}.v2-steps-grid{grid-template-columns:1fr!important;gap:12px!important}}
        @media(max-width:768px){#advantages>div{padding:64px 20px!important}.advantages-grid{grid-template-columns:1fr!important;gap:12px!important}}
      `}</style>
    </>
  );
}
