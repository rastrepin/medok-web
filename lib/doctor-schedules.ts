export type ScheduleDay = {
  day: string;   // abbreviated lowercase: пн, вт, ср, чт, пт, сб, нд
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
      { day: 'ср', hours: '13:00–17:00' },
      { day: 'сб', hours: '9:00–17:00' },
    ],
  },
  {
    slug: 'kelman-viktoriia',
    days: [
      { day: 'вт', hours: '9:00–15:00' },
      { day: 'чт', hours: '15:00–20:00' },
    ],
  },
  {
    slug: 'trofimchuk-tetiana',
    days: [
      { day: 'нд', hours: '9:00–15:00' },
    ],
  },
  {
    slug: 'bondarchuk-zhanna',
    days: [
      { day: 'пн', hours: '9:00–17:00' },
      { day: 'вт', hours: '15:00–20:00' },
      { day: 'ср', hours: '9:00–13:00' },
      { day: 'чт', hours: '9:00–15:00' },
      { day: 'пт', hours: '9:00–17:00' },
    ],
  },
];

export function getScheduleBySlug(slug: string): DoctorSchedule | undefined {
  return DOCTOR_SCHEDULES.find((s) => s.slug === slug);
}
