'use client';
import { useState } from 'react';

export interface SelectedDate {
  date: string; // ISO 'YYYY-MM-DD'
  ranges: ('morning' | 'afternoon' | 'evening')[];
}

const RANGES = [
  { key: 'morning' as const, label: 'Ранок', sub: '8:00–11:00' },
  { key: 'afternoon' as const, label: 'День', sub: '11:00–16:00' },
  { key: 'evening' as const, label: 'Вечір', sub: '16:00–19:00' },
];

function getDates(n = 30): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // Skip Sundays
    if (d.getDay() === 0) continue;
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('uk-UA', { weekday: 'short', day: 'numeric', month: 'short' });
}

interface Props {
  value: SelectedDate[];
  onChange: (v: SelectedDate[]) => void;
}

export default function MedokDatePicker({ value, onChange }: Props) {
  const [page, setPage] = useState(0);
  const allDates = getDates(30);
  const perPage = 7;
  const visibleDates = allDates.slice(page * perPage, (page + 1) * perPage);

  const toggleDate = (date: string) => {
    const exists = value.find((v) => v.date === date);
    if (exists) {
      onChange(value.filter((v) => v.date !== date));
    } else {
      onChange([...value, { date, ranges: [] }]);
    }
  };

  const toggleRange = (date: string, range: 'morning' | 'afternoon' | 'evening') => {
    const existing = value.find((v) => v.date === date);
    if (!existing) {
      onChange([...value, { date, ranges: [range] }]);
      return;
    }
    const hasRange = existing.ranges.includes(range);
    onChange(
      value.map((v) =>
        v.date === date
          ? { ...v, ranges: hasRange ? v.ranges.filter((r) => r !== range) : [...v.ranges, range] }
          : v
      )
    );
  };

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--g600)', marginBottom: 10 }}>
        Зручні дати та час
        <span style={{ color: 'var(--g400)', fontWeight: 400, marginLeft: 6 }}>
          (можна обрати кілька)
        </span>
      </div>

      {/* Date chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {visibleDates.map((date) => {
          const sel = value.find((v) => v.date === date);
          return (
            <button
              key={date}
              type="button"
              onClick={() => toggleDate(date)}
              style={{
                padding: '6px 12px', borderRadius: 9999,
                border: `1.5px solid ${sel ? 'var(--t)' : 'var(--g200)'}`,
                background: sel ? 'var(--tp)' : '#fff',
                color: sel ? 'var(--td)' : 'var(--g700)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {formatDate(date)}
            </button>
          );
        })}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {page > 0 && (
          <button
            type="button"
            onClick={() => setPage(page - 1)}
            style={{ background: 'none', border: 'none', color: 'var(--td)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ← Попередній тиждень
          </button>
        )}
        {(page + 1) * perPage < allDates.length && (
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            style={{ background: 'none', border: 'none', color: 'var(--td)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginLeft: 'auto' }}
          >
            Наступний тиждень →
          </button>
        )}
      </div>

      {/* Range selection for selected dates */}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {value.map((sel) => (
            <div key={sel.date} style={{ background: 'var(--g50)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--g700)', marginBottom: 8 }}>
                {formatDate(sel.date)} — оберіть час:
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {RANGES.map((r) => {
                  const active = sel.ranges.includes(r.key);
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => toggleRange(sel.date, r.key)}
                      style={{
                        padding: '6px 14px', borderRadius: 9999,
                        border: `1.5px solid ${active ? 'var(--c)' : 'var(--g200)'}`,
                        background: active ? 'var(--cl)' : '#fff',
                        color: active ? 'var(--cd)' : 'var(--g600)',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {r.label}
                      <span style={{ marginLeft: 4, fontSize: 10, opacity: .7 }}>{r.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
