/**
 * Normalize a Ukrainian phone number to +380XXXXXXXXX format.
 * Handles: 0XX, 80XX, +380XX, 380XX, spaces, dashes, parens.
 */
export function normalizePhone(raw: string): string {
  // Strip everything except digits and leading +
  const digits = raw.replace(/[^\d]/g, '');

  // Map to +380... format
  if (digits.startsWith('380') && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.startsWith('80') && digits.length === 11) {
    return `+3${digits}`;
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return `+38${digits}`;
  }
  // Already full: +380...
  if (raw.startsWith('+') && digits.startsWith('380') && digits.length === 12) {
    return `+${digits}`;
  }

  // Fallback: return as-is (validation will catch bad format)
  return raw.trim();
}

/**
 * Basic spam phone detection.
 * Returns true if the phone looks like a test/bot submission.
 */
export function isSpamPhone(phone: string): boolean {
  const d = phone.replace(/[^\d]/g, '');

  // All same digits: 0000000000, 1111111111, etc.
  if (/^(\d)\1{9,}$/.test(d)) return true;

  // Known test numbers
  const testPatterns = [
    /^380000000000$/,
    /^380111111111$/,
    /^380123456789$/,
    /^380987654321$/,
  ];
  if (testPatterns.some((p) => p.test(d))) return true;

  // Too short or too long
  if (d.length < 10 || d.length > 13) return true;

  return false;
}

/**
 * Validate phone format after normalization.
 * Must be +380XXXXXXXXX (12 digits after +).
 */
export function isValidUkrainianPhone(phone: string): boolean {
  return /^\+380\d{9}$/.test(phone);
}
