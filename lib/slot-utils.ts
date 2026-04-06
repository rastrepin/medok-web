// ── Types ─────────────────────────────────────────────────────────────────────

export type Slot = {
  /** ISO date string: "2026-04-08" */
  value: string;
  /** Human-readable label: "Ср, 8 квіт · 13:00–17:00" */
  label: string;
  /** Day name in Ukrainian */
  dayName: string;
  /** Working hours: "13:00–17:00" */
  hours: string;
};

// ── Hardcoded schedules (source: content/medok/doctors/doctors.md) ───────────
// Key: doctor ID from lib/data.ts DOCTORS array

type DaySchedule = { day: string; hours: string };

const DOCTOR_SCHEDULES: Record<string, DaySchedule[]> = {
  yanyuk: [
    { day: 'Середа',  hours: '13:00–17:00' },
    { day: 'Субота',  hours: '9:00–17:00'  },
  ],
  kelman: [
    { day: 'Вівторок', hours: '9:00–15:00'  },
    { day: 'Четвер',   hours: '15:00–20:00' },
  ],
  trofimchuk: [
    { day: 'Неділя', hours: '9:00–15:00' },
  ],
  bondarchuk: [
    { day: 'Понеділок', hours: '9:00–17:00'  },
    { day: 'Вівторок',  hours: '15:00–20:00' },
    { day: 'Середа',    hours: '9:00–13:00'  },
    { day: 'Четвер',    hours: '9:00–15:00'  },
    { day: "П'ятниця",  hours: '9:00–17:00'  },
  ],
};

// ── Day mapping: Ukrainian name → JS getDay() (0=Sun … 6=Sat) ────────────────

const UA_DAY_TO_JS: Record<string, number> = {
  'Неділя':    0,
  'Понеділок': 1,
  'Вівторок':  2,
  'Середа':    3,
  'Четвер':    4,
  "П'ятниця":  5,
  'Субота':    6,
};

// ── Formatting helpers ────────────────────────────────────────────────────────

const SHORT_DAYS   = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const SHORT_MONTHS = [
  'січ', 'лют', 'бер', 'квіт', 'трав', 'черв',
  'лип', 'серп', 'вер', 'жовт', 'лист', 'груд',
];

function slotLabel(date: Date, hours: string): string {
  return `${SHORT_DAYS[date.getDay()]}, ${date.getDate()} ${SHORT_MONTHS[date.getMonth()]} · ${hours}`;
}

function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Returns up to `count` upcoming available slots for the given doctor,
 * starting from tomorrow. Scans up to 60 days ahead.
 *
 * @param doctorId  - DOCTORS[].id from lib/data.ts (e.g. 'yanyuk')
 * @param count     - max slots to return (default 6)
 */
export function getAvailableSlots(doctorId: string, count = 6): Slot[] {
  const schedule = DOCTOR_SCHEDULES[doctorId];
  if (!schedule || schedule.length === 0) return [];

  // Build jsDay → hours map for fast lookup
  const dayMap = new Map<number, string>();
  for (const { day, hours } of schedule) {
    const jsDay = UA_DAY_TO_JS[day];
    if (jsDay !== undefined) dayMap.set(jsDay, hours);
  }

  const slots: Slot[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1); // start from tomorrow

  for (let i = 0; i < 60 && slots.length < count; i++) {
    const jsDay = cursor.getDay();
    const hours = dayMap.get(jsDay);

    if (hours) {
      const dayUa = Object.entries(UA_DAY_TO_JS).find(([, v]) => v === jsDay)?.[0] ?? '';
      slots.push({
        value:   isoDate(new Date(cursor)),
        label:   slotLabel(cursor, hours),
        dayName: dayUa,
        hours,
      });
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return slots;
}
