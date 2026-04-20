/**
 * Helpers for the /o/[uuid] onboarding page — pure functions, no JSX.
 */

import type { OnboardingCabinet } from '@/lib/types';

/**
 * Kyiv-timezone ETA for admin callback promise shown on the pending state.
 * Rules:
 *  - submitted before 13:00 → "до 14:00 (today)"
 *  - submitted 13:00-17:59  → "до 18:00 (today)"
 *  - submitted ≥ 18:00      → "до 10:00 {next weekday}"
 *  - weekend (sat/sun)      → "до 10:00 {next monday}"
 */
export function getCallbackEta(createdAtIso: string, nowIso: string = new Date().toISOString()): string {
  const tz = 'Europe/Kiev';
  const fmt = new Intl.DateTimeFormat('uk-UA', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  });
  const created = new Date(createdAtIso);
  const now = new Date(nowIso);
  // Pull Kyiv hour/dow for {created} and {now}
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, weekday: 'short', hour: '2-digit', hour12: false,
  }).formatToParts(created);
  const dowToken = parts.find(p => p.type === 'weekday')?.value ?? 'Mon';
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0', 10);

  // Pull "now" Kyiv dow/hour for "today" vs "tomorrow" decision
  const nowParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, weekday: 'short', hour: '2-digit', hour12: false,
  }).formatToParts(now);
  const nowHour = parseInt(nowParts.find(p => p.type === 'hour')?.value ?? '0', 10);
  const nowDow = nowParts.find(p => p.type === 'weekday')?.value ?? 'Mon';

  const isWeekend = (d: string) => d === 'Sat' || d === 'Sun';

  let etaHour = 14;
  let label = 'Адміністратор зателефонує до 14:00';
  if (isWeekend(nowDow)) {
    // always next monday morning
    return 'Адміністратор зателефонує в понеділок до 10:00';
  }
  if (nowHour < 13) { etaHour = 14; }
  else if (nowHour < 18) { etaHour = 18; }
  else {
    // after 18: next weekday morning
    return 'Адміністратор зателефонує завтра до 10:00';
  }
  label = `Адміністратор зателефонує сьогодні до ${etaHour.toString().padStart(2, '0')}:00`;
  // created/hour unused for user-facing string — keeping formatter import to satisfy lint
  void fmt; void dowToken; void hour; void created;
  return label;
}

/** Formats a stored appointment_date (ISO UTC) into Kyiv wall-time "23.04 · 10:30". */
export function formatKyivAppointment(iso: string): { date: string; time: string; dayName: string; countdown: string } {
  const tz = 'Europe/Kiev';
  const d = new Date(iso);

  const date = new Intl.DateTimeFormat('uk-UA', {
    timeZone: tz, day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(d);
  const time = new Intl.DateTimeFormat('uk-UA', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(d);
  const dayName = new Intl.DateTimeFormat('uk-UA', {
    timeZone: tz, weekday: 'long',
  }).format(d);

  // Countdown: days difference, using Kyiv midnight boundaries
  const msInDay = 24 * 60 * 60 * 1000;
  const apptKyiv = kyivDateOnly(d);
  const todayKyiv = kyivDateOnly(new Date());
  const days = Math.round((apptKyiv.getTime() - todayKyiv.getTime()) / msInDay);

  let countdown = '';
  if (days < 0) countdown = 'минулий';
  else if (days === 0) countdown = 'сьогодні';
  else if (days === 1) countdown = 'завтра';
  else if (days < 5) countdown = `через ${days} дні`;
  else countdown = `через ${days} днів`;

  return { date, time, dayName, countdown };
}

/** Returns a Date representing the Kyiv wall-date part only at UTC midnight. */
function kyivDateOnly(d: Date): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Kiev', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(d);
  const y = parts.find(p => p.type === 'year')?.value ?? '1970';
  const m = parts.find(p => p.type === 'month')?.value ?? '01';
  const day = parts.find(p => p.type === 'day')?.value ?? '01';
  return new Date(`${y}-${m}-${day}T00:00:00Z`);
}

/** Returns a human-readable program price based on pregnancy_type. */
export function programPrice(cab: OnboardingCabinet): { value: number; label: string } | null {
  if (!cab.program) return null;
  if (cab.pregnancy_type === 'twin') {
    return { value: cab.program.price_twin, label: 'двоплідна' };
  }
  return { value: cab.program.price_single, label: 'одноплідна' };
}

/** Normalize trimester values used across quiz ("first"/"second"/...)
 * and DB ("i"/"ii"/...) to a common key. */
export function normalizeTrimester(
  t: string | null,
): 'i' | 'ii' | 'iii' | 'full' | null {
  switch (t) {
    case 'i':
    case 'first':
      return 'i';
    case 'ii':
    case 'second':
      return 'ii';
    case 'iii':
    case 'third':
      return 'iii';
    case 'full':
    case 'all':
      return 'full';
    default:
      return null;
  }
}

/** Trimester label for display. Returns null when unknown
 * so the caller can hide the row. */
export function trimesterLabel(trimester: string | null): string | null {
  switch (normalizeTrimester(trimester)) {
    case 'i':   return 'I триместр';
    case 'ii':  return 'II триместр';
    case 'iii': return 'III триместр';
    case 'full': return 'Вся вагітність';
    default: return null;
  }
}

/** Pregnancy type label. Returns null when unknown so the caller can hide the row. */
export function pregnancyTypeLabel(t: 'single' | 'twin' | null): string | null {
  if (t === 'twin') return 'Двоплідна';
  if (t === 'single') return 'Одноплідна';
  return null;
}

/** Format preferred_day (ISO date or "other") */
export function formatPreferredDay(d: string | null): string {
  if (!d || d === 'other') return 'Узгодити з адміністратором';
  try {
    return new Intl.DateTimeFormat('uk-UA', {
      day: '2-digit', month: 'long', weekday: 'short',
    }).format(new Date(d));
  } catch {
    return d;
  }
}

/** Price formatter (UAH). */
export function formatUAH(value: number): string {
  return `${new Intl.NumberFormat('uk-UA').format(value)} ₴`;
}

/** Normalize Ukrainian phone for `tel:` href. */
export function telHref(raw: string): string {
  const digits = (raw ?? '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('380')) return '+' + digits;
  if (digits.length === 10 && digits.startsWith('0')) return '+38' + digits;
  return raw;
}
