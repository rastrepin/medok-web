/**
 * Static per-doctor content: tags, stat facts, education items, CPD cards.
 * Source: medok-doctor-page-redesign.md + medok-design-tokens.md
 *
 * Education items are structured arrays — NOT split from a string by dots
 * to avoid the "ВНМУ ім." / "М.І." / "Пирогова" split bug.
 */

export type EducationItem = {
  /** icon variant — maps to SVG in DoctorPage */
  icon: 'degree' | 'hospital' | 'lab' | 'cert';
  text: string;
};

export type CpdCard = {
  eyebrow: string;
  body: string;
  tag: string;
};

export type StatFact = {
  value: string;
  label: string;
};

export type DoctorContent = {
  tags: string[];
  facts: StatFact[];
  bio?: string;
  education: EducationItem[];
  cpd: CpdCard[];
  ctaLabel: string;
  stickyCtaLabel: string;
};

export const DOCTOR_CONTENT: Record<string, DoctorContent> = {
  'kelman-viktoriia': {
    tags: ['Акушер-гінеколог', 'Пренатальна діагностика', 'Член FMF'],
    facts: [
      { value: '2021', label: 'Рік сертифікації' },
      { value: 'FMF',  label: 'Член спільноти' },
      { value: '9',    label: 'Років практики' },
    ],
    bio: 'Акушер-гінеколог з фокусом на пренатальній діагностиці. Аспірантка кафедри акушерства та гінекології №2 ВНМУ ім. М.І. Пирогова — поєднує наукову роботу з щоденною клінічною практикою.\n\nЧлен FMF (Fetal Medicine Foundation) та Асоціації акушер-гінекологів України. Пройшла тренінги з акушерських кровотеч, прееклампсії, дистоції плечиків у симуляційному центрі ВОКЛ.\n\nПрактикує доказову медицину — кожне рішення базується на актуальних міжнародних протоколах.',
    education: [
      { icon: 'degree',   text: 'ВНМУ ім. М.І. Пирогова, 2017 р., з відзнакою' },
      { icon: 'hospital', text: 'Інтернатура 2017–2020, ВОКЛ ім. М.І. Пирогова' },
      { icon: 'lab',      text: 'Спеціалізація УЗД, 2020' },
      { icon: 'cert',     text: 'Сертифікація пренатальної діагностики FMF, 2021' },
    ],
    cpd: [
      { eyebrow: 'Симуляційні тренінги', body: 'Тренінги з акушерських кровотеч, прееклампсії та дистоції плечиків у симуляційному центрі ВОКЛ.', tag: 'ВОКЛ' },
      { eyebrow: 'Членство', body: 'Член FMF (Fetal Medicine Foundation) та Асоціації акушер-гінекологів України.', tag: 'FMF · ААГУ' },
      { eyebrow: 'Наукова діяльність', body: 'Аспірантка кафедри акушерства та гінекології №2 ВНМУ ім. М.І. Пирогова.', tag: 'ВНМУ ім. Пирогова' },
    ],
    ctaLabel: 'ЗАПИСАТИСЬ ДО ВІКТОРІЇ',
    stickyCtaLabel: 'ЗАПИСАТИСЬ ДО КЕЛЬМАН ВІКТОРІЇ',
  },

  'yanyuk-olha': {
    tags: ['Акушер-гінеколог', 'УЗД-діагностика', 'Кольпоскопія'],
    facts: [
      { value: '2019', label: 'Спеціалізація УЗД' },
      { value: '2013', label: 'Рік диплому' },
      { value: '13',   label: 'Років практики' },
    ],
    education: [
      { icon: 'degree',   text: 'ВНМУ ім. М.І. Пирогова' },
      { icon: 'hospital', text: 'Інтернатура, ВОКЛ ім. М.І. Пирогова' },
      { icon: 'lab',      text: 'Спеціалізація з УЗД-діагностики, 2019' },
      { icon: 'cert',     text: 'Кольпоскопія — кваліфікаційний курс' },
    ],
    cpd: [
      { eyebrow: 'Конференції', body: 'Учасниця міжнародних профільних конференцій з акушерства та гінекології.', tag: 'Міжнар. конф.' },
      { eyebrow: 'УЗД-діагностика', body: 'Спеціалізація з ультразвукової діагностики, апарат Voluson.', tag: 'УЗД 2019' },
      { eyebrow: 'Кольпоскопія', body: 'Кваліфікаційний курс кольпоскопії та лікування патологій шийки матки.', tag: 'Кольпоскопія' },
    ],
    ctaLabel: 'ЗАПИСАТИСЬ ДО ОЛЬГИ',
    stickyCtaLabel: 'ЗАПИСАТИСЬ ДО ЯНЮК ОЛЬГИ',
  },

  'trofimchuk-tetiana': {
    tags: ['Акушер-гінеколог', 'УЗД-діагностика', 'ВНМУ з відзнакою'],
    facts: [
      { value: '2019', label: 'Рік диплому' },
      { value: '2022', label: 'УЗД Львів' },
      { value: '7',    label: 'Років практики' },
    ],
    education: [
      { icon: 'degree',   text: 'ВНМУ ім. М.І. Пирогова, з відзнакою, 2019' },
      { icon: 'hospital', text: 'Інтернатура, ВОКЛ ім. М.І. Пирогова' },
      { icon: 'lab',      text: 'Спеціалізація з УЗД-діагностики, Львів, 2022' },
      { icon: 'cert',     text: 'Платформа Progress — безперервна медична освіта' },
    ],
    cpd: [
      { eyebrow: 'УЗД-спеціалізація', body: 'Спеціалізація з ультразвукової діагностики у Львові — сертифікат 2022 р.', tag: 'УЗД Львів 2022' },
      { eyebrow: 'Безперервна освіта', body: 'Активний учасник платформи Progress для лікарів — постійне оновлення знань.', tag: 'Progress' },
      { eyebrow: 'Академічна база', body: 'Диплом ВНМУ ім. М.І. Пирогова з відзнакою — міцна теоретична підготовка.', tag: 'ВНМУ з відзнакою' },
    ],
    ctaLabel: 'ЗАПИСАТИСЬ ДО ТЕТЯНИ',
    stickyCtaLabel: 'ЗАПИСАТИСЬ ДО ТРОФІМЧУК ТЕТЯНИ',
  },

  'bondarchuk-zhanna': {
    tags: ['Лікар УЗД', 'FMF London', 'ISUOG'],
    facts: [
      { value: 'FMF',        label: 'London сертифікація' },
      { value: 'ISUOG',      label: 'Член спільноти' },
      { value: 'Voluson E8', label: 'Апарат 3D/4D' },
    ],
    education: [
      { icon: 'degree',   text: 'Медичний університет, диплом лікаря' },
      { icon: 'hospital', text: 'Спеціалізація з УЗД-діагностики, ВОКЛ' },
      { icon: 'cert',     text: 'Сертифікація FMF (Fetal Medicine Foundation, Лондон)' },
      { icon: 'lab',      text: 'ISUOG — сертифікований член асоціації' },
    ],
    cpd: [
      { eyebrow: 'FMF London', body: 'Сертифікація Fetal Medicine Foundation — найвищий стандарт пренатальної діагностики.', tag: 'FMF London' },
      { eyebrow: 'ISUOG', body: 'Член International Society of Ultrasound in Obstetrics and Gynecology.', tag: 'ISUOG' },
      { eyebrow: 'Обладнання', body: 'Дослідження на апараті GE Voluson E8 — 3D/4D зображення найвищої якості.', tag: 'Voluson E8' },
    ],
    ctaLabel: 'ЗАПИСАТИСЬ НА УЗД',
    stickyCtaLabel: 'ЗАПИСАТИСЬ НА УЗД',
  },
};

export function getDoctorContent(slug: string): DoctorContent | undefined {
  return DOCTOR_CONTENT[slug];
}
