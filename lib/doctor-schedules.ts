export type ScheduleDay = {
  day: string;
  hours: string;
};

export type DoctorSchedule = {
  slug: string;
  days: ScheduleDay[];
};

/** Hardcoded schedules from content/medok/doctors/doctors.md */
export const DOCTOR_SCHEDULES: DoctorSchedule[] = [
  {
    slug: 'yanyuk-olha',
    days: [
      { day: 'Середа', hours: '13:00–17:00' },
      { day: 'Субота', hours: '9:00–17:00' },
    ],
  },
  {
    slug: 'kelman-viktoriia',
    days: [
      { day: 'Вівторок', hours: '9:00–15:00' },
      { day: 'Четвер', hours: '15:00–20:00' },
    ],
  },
  {
    slug: 'trofimchuk-tetiana',
    days: [
      { day: 'Неділя', hours: '9:00–15:00' },
    ],
  },
  {
    slug: 'bondarchuk-zhanna',
    days: [
      { day: 'Понеділок', hours: '9:00–17:00' },
      { day: 'Вівторок', hours: '15:00–20:00' },
      { day: 'Середа', hours: '9:00–13:00' },
      { day: 'Четвер', hours: '9:00–15:00' },
      { day: 'П\'ятниця', hours: '9:00–17:00' },
    ],
  },
];

export function getScheduleBySlug(slug: string): DoctorSchedule | undefined {
  return DOCTOR_SCHEDULES.find((s) => s.slug === slug);
}
