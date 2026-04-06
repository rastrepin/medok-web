/**
 * Per-doctor GEO text and E-E-A-T reviewer data.
 * Source: COWORK-FIXES-MEDOK.md — Task 6.
 */

export type DoctorGeoEeatData = {
  geoText: string;
  reviewerName: string;
  reviewerTitle: string;
  sources: string[];
};

const DOCTOR_GEO_EEAT: Record<string, DoctorGeoEeatData> = {
  'yanyuk-olha': {
    geoText:
      'Приймає пацієнток у Вінниці на двох філіях — Вишенька та Поділля. Графік: середа 13:00–17:00, субота 9:00–17:00. Онлайн-консультація доступна. Вул. Зодчих, 20, Вінниця · +38\u00a0(043)\u00a0265-99-77.',
    reviewerName: 'Янюк Ольга Олександрівна',
    reviewerTitle: 'акушер-гінеколог, лікар УЗД, МЦ MED OK Вінниця',
    sources: ['Наказ МОЗ України №417 від 15.07.2011'],
  },
  'kelman-viktoriia': {
    geoText:
      'Приймає на трьох філіях — Бар, Поділля, Соборна. Графік: вівторок 9:00–15:00, четвер 15:00–20:00. Онлайн-консультація доступна. Вул. Зодчих, 20, Вінниця · +38\u00a0(043)\u00a0265-99-77.',
    reviewerName: 'Кельман Вікторія Володимирівна',
    reviewerTitle:
      'акушер-гінеколог, пренатальна діагностика, член FMF та Асоціації акушер-гінекологів України, МЦ MED OK Вінниця',
    sources: ['Наказ МОЗ України №417 від 15.07.2011'],
  },
  'trofimchuk-tetiana': {
    geoText:
      'Приймає на філіях Соборна та Поділля. Графік: неділя 9:00–15:00. Онлайн-консультація доступна. Вул. Зодчих, 20, Вінниця · +38\u00a0(043)\u00a0265-99-77.',
    reviewerName: 'Трофімчук Тетяна Ігорівна',
    reviewerTitle: 'акушер-гінеколог, УЗД-спеціаліст, МЦ MED OK Вінниця',
    sources: ['Наказ МОЗ України №417 від 15.07.2011'],
  },
  'bondarchuk-zhanna': {
    geoText:
      'Приймає на філії Поділля, пн–пт (графік вище). Скринінги I, II, III триместру на апараті Voluson E8. Приймає пацієнток за направленням від акушерів клініки та зовнішніх лікарів. Вул. Зодчих, 20, Вінниця · +38\u00a0(043)\u00a0265-99-77.',
    reviewerName: 'Бондарчук Жанна Геннадіївна',
    reviewerTitle:
      'лікар УЗД, сертифікований спеціаліст FMF London, член ISUOG, МЦ MED OK Вінниця',
    sources: ['FMF London — протоколи скринінгу', 'ISUOG Practice Guidelines'],
  },
};

export function getDoctorGeoEeat(slug: string): DoctorGeoEeatData | undefined {
  return DOCTOR_GEO_EEAT[slug];
}
