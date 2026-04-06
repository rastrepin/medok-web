'use client';

import type { Slot } from '@/lib/slot-utils';

type SlotPickerProps = {
  slots: Slot[];
  selected: string[];
  onChange: (values: string[]) => void;
  max?: number;
};

export default function SlotPicker({
  slots,
  selected,
  onChange,
  max = 3,
}: SlotPickerProps) {
  if (slots.length === 0) return null;

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else if (selected.length < max) {
      onChange([...selected, value]);
    }
  }

  const atMax = selected.length >= max;

  return (
    <div>
      <label style={{
        fontSize: 12, fontWeight: 700,
        color: 'var(--g600)', marginBottom: 6,
        display: 'block',
      }}>
        Зручний час запису{' '}
        <span style={{ fontWeight: 500, color: 'var(--g400)' }}>
          (оберіть до {max})
        </span>
      </label>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        {slots.map((slot) => {
          const isSelected = selected.includes(slot.value);
          const isDisabled = !isSelected && atMax;

          return (
            <button
              key={slot.value}
              type="button"
              disabled={isDisabled}
              onClick={() => toggle(slot.value)}
              title={isDisabled ? `Можна обрати не більше ${max} варіантів` : slot.label}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                border: `1.5px solid ${isSelected ? 'var(--td)' : isDisabled ? 'var(--g100)' : 'var(--g200)'}`,
                background: isSelected ? 'var(--tp)' : isDisabled ? 'var(--g50)' : '#fff',
                color: isSelected ? 'var(--td)' : isDisabled ? 'var(--g300)' : 'var(--g700)',
                fontSize: 13,
                fontWeight: isSelected ? 700 : 500,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all .15s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2,
                textAlign: 'left',
                minWidth: 130,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: isSelected ? 'var(--td)' : isDisabled ? 'var(--g300)' : 'var(--g900)' }}>
                {slot.dayName}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: isSelected ? 'var(--t)' : isDisabled ? 'var(--g200)' : 'var(--g400)' }}>
                {(() => {
                  // Parse "2026-04-08" → "8 квіт"
                  const [, m, d] = slot.value.split('-').map(Number);
                  const months = ['', 'січ', 'лют', 'бер', 'квіт', 'трав', 'черв', 'лип', 'серп', 'вер', 'жовт', 'лист', 'груд'];
                  return `${d} ${months[m]}`;
                })()}
              </span>
              <span style={{ fontSize: 12, color: isSelected ? 'var(--td)' : isDisabled ? 'var(--g200)' : 'var(--g600)' }}>
                {slot.hours}
              </span>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p style={{
          fontSize: 11, color: 'var(--td)',
          marginTop: 8, fontWeight: 600,
        }}>
          Обрано: {selected.length} з {max}
          {atMax && ' — максимум'}
        </p>
      )}
    </div>
  );
}
