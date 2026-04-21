/**
 * PWA deep-link helper: persist cabinet UUID у localStorage
 * для автоматичного redirect з головної на /o/{uuid} після submit.
 *
 * Логіка TTL:
 *   - daysSince < 30  → "active" (redirect з головної)
 *   - daysSince 30-180 → сховано, але запис ще є (майбутні банери)
 *   - daysSince >= 180 → auto-clear
 */

const KEY_UUID = 'medok_cabinet_uuid';
const KEY_CREATED = 'medok_cabinet_created_at';

const DAY_MS = 24 * 60 * 60 * 1000;

export const CABINET_ACTIVE_DAYS = 30;
export const CABINET_MAX_AGE_DAYS = 180;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function saveCabinetUuid(uuid: string | null | undefined): void {
  if (!isBrowser() || !uuid) return;
  try {
    window.localStorage.setItem(KEY_UUID, uuid);
    window.localStorage.setItem(KEY_CREATED, new Date().toISOString());
  } catch {
    // localStorage може бути заблокованим (safari private, quota) — мовчки пропускаємо
  }
}

export function clearCabinet(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(KEY_UUID);
    window.localStorage.removeItem(KEY_CREATED);
  } catch {}
}

export interface CabinetRecord {
  uuid: string;
  createdAt: Date;
  daysSince: number;
}

/**
 * Читає запис з localStorage; якщо старше MAX_AGE_DAYS — auto-clear і повертає null.
 */
export function readCabinet(): CabinetRecord | null {
  if (!isBrowser()) return null;
  try {
    const uuid = window.localStorage.getItem(KEY_UUID);
    const createdRaw = window.localStorage.getItem(KEY_CREATED);
    if (!uuid || !createdRaw) return null;
    const createdAt = new Date(createdRaw);
    if (Number.isNaN(createdAt.getTime())) {
      clearCabinet();
      return null;
    }
    const daysSince = (Date.now() - createdAt.getTime()) / DAY_MS;
    if (daysSince >= CABINET_MAX_AGE_DAYS) {
      clearCabinet();
      return null;
    }
    return { uuid, createdAt, daysSince };
  } catch {
    return null;
  }
}

/** Повертає UUID якщо запис < 30 днів (active), інакше null. */
export function getActiveCabinetUuid(): string | null {
  const rec = readCabinet();
  if (!rec) return null;
  return rec.daysSince < CABINET_ACTIVE_DAYS ? rec.uuid : null;
}
