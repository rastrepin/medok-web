/**
 * Static program data — single source of truth for QuizModal offer screen
 * and MedokPackages component.
 */

export type ProgramId = 'i' | 'ii' | 'iii' | 'full';

export type ProgramData = {
  id: ProgramId;
  name: string;
  weeks: string;
  priceSingle: number;
  priceTwin: number;
  shortDesc: string;
  includes: string[]; // short list for offer screen
};

export const PROGRAMS: Record<ProgramId, ProgramData> = {
  i: {
    id: 'i',
    name: 'I триместр',
    weeks: '11–16',
    priceSingle: 14540,
    priceTwin: 16790,
    shortDesc: 'Постановка на облік, УЗД-скринінг, генетичний скринінг, повний набір аналізів.',
    includes: [
      'Постановка на облік та перший план спостереження',
      'УЗД-скринінг I триместру (11–13+6 тижнів)',
      'Генетичний скринінг Astraia + центр «Геном»',
      'Загальний аналіз крові (24 показники)',
      'Загальний аналіз сечі',
      'Консультації акушер-гінеколога',
    ],
  },
  ii: {
    id: 'ii',
    name: 'II триместр',
    weeks: '18–28',
    priceSingle: 9970,
    priceTwin: 13830,
    shortDesc: 'Анатомічний скринінг, цервікометрія, КТГ, аналізи, консультації × 3.',
    includes: [
      'УЗД 18–21 тиждень — анатомічний скринінг',
      'Контроль шийки матки (цервікометрія) × 2',
      'Аналізи крові, сечі, інфекції',
      'КТГ — запис серцебиття дитини',
      'Консультації акушер-гінеколога × 3',
    ],
  },
  iii: {
    id: 'iii',
    name: 'III триместр',
    weeks: '30–41',
    priceSingle: 15320,
    priceTwin: 15570,
    shortDesc: 'УЗД з доплерометрією, КТГ × 5, аналізи готовності до пологів, огляд після пологів.',
    includes: [
      'УЗД з доплерометрією — кровотік між мамою та дитиною',
      'КТГ — регулярний контроль серцебиття × 5',
      'Аналізи готовності до пологів',
      'Огляд після пологів',
      "Зв'язок з лікарем між візитами",
    ],
  },
  full: {
    id: 'full',
    name: 'Вся вагітність',
    weeks: '11–41',
    priceSingle: 39830,
    priceTwin: 46190,
    shortDesc: 'Повний супровід від постановки до огляду після пологів. Один лікар на весь термін.',
    includes: [
      'Повний обсяг I, II та III триместру',
      'Один лікар — від першого прийому до огляду після пологів',
      'Пріоритетний запис на зручний час',
      'Генетичний скринінг (Astraia + «Геном»)',
      'УЗД на апараті Voluson E8 з 3D/4D',
    ],
  },
};

export const TRIMESTER_TO_PROGRAM: Record<'first' | 'second' | 'third', ProgramId> = {
  first:  'i',
  second: 'ii',
  third:  'iii',
};

export function formatPrice(n: number): string {
  return n.toLocaleString('uk-UA').replace(/\s/g, '\u00a0') + '\u00a0₴';
}

/** doctor slugs for offer/doctor-select screen */
export const QUIZ_DOCTORS = [
  {
    slug: 'kelman-viktoriia',
    name: 'Кельман Вікторія Володимирівна',
    role: 'Акушер-гінеколог · пренатальна діагностика',
    tags: ['Член FMF', 'УЗД'],
    schedule: 'вт 9–15 · чт 15–20',
    photo: '/images/doctors/ginekolog-kelman-viktoriya-200w.webp',
    initials: 'КВ',
    color: '#E0F2F1',
  },
  {
    slug: 'yanyuk-olha',
    name: 'Янюк Ольга Олександрівна',
    role: 'Акушер-гінеколог · УЗД-діагностика',
    tags: ['УЗД', 'Кольпоскопія'],
    schedule: 'ср 13–17 · сб 9–17',
    photo: '/images/doctors/ginekolog-yanyuk-olga-200w.webp',
    initials: 'ЯО',
    color: '#FCE4EC',
  },
  {
    slug: 'trofimchuk-tetiana',
    name: 'Трофімчук Тетяна Ігорівна',
    role: 'Акушер-гінеколог',
    tags: ['УЗД', 'ВНМУ з відзнакою'],
    schedule: 'нд 9–15',
    photo: '/images/doctors/ginekolog-trofimchuk-tetyana-200w.webp',
    initials: 'ТТ',
    color: '#E8EAF6',
  },
];
