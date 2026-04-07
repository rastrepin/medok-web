/**
 * Doctor booking utils — computes next N available days for a doctor.
 * Used client-side so dates are always relative to "today".
 */

import { DOCTOR_SCHEDULES } from './doctor-schedules';

const DAY_OF_WEEK: Record<string, number> = {
  'Неділя':    0,
  'Понеділок': 1,
  'Вівторок':  2,
  'Середа':    3,
  'Четвер':    4,
  'П\'ятниця': 5,
  'Субота':    6,
};

export type AvailableDay = {
  label: string; // "Середа, 9 квітня"
  value: string; // "2026-04-09"
};

/**
 * Returns up to `limit` nearest upcoming working days for a doctor
 * based on their hardcoded schedule. Days searched within 60 calendar days.
 */
export function getAvailableDays(
  doctorSlug: string,
  limit = 6,
): AvailableDay[] {
  const schedule = DOCTOR_SCHEDULES.find((s) => s.slug === doctorSlug);
  if (!schedule || schedule.days.length === 0) return [];

  const workDayNums = schedule.days
    .map((d) => DAY_OF_WEEK[d.day])
    .filter((n): n is number => n !== undefined);

  const days: AvailableDay[] = [];
  const now = new Date();

  for (let i = 1; i <= 60 && days.length < limit; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    if (workDayNums.includes(date.getDay())) {
      const label = date.toLocaleDateString('uk-UA', {
        weekday: 'long',
        day:     'numeric',
        month:   'long',
      });
      days.push({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        value: date.toISOString().split('T')[0],
      });
    }
  }

  return days;
}
