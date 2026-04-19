'use client';
/**
 * Global booking modal state — Context-based (no zustand, no extra deps)
 * Usage: useBookingModal().open('quiz', { prefilledTrimester: 'first' })
 */
import { createContext, useContext } from 'react';

export type ModalType = 'quiz' | 'booking' | 'callback' | null;

export type ModalOptions = {
  prefilledTrimester?: 'first' | 'second' | 'third' | 'full';
  prefilledPregnancyType?: 'single' | 'twin';
  prefilledDoctorSlug?: string;
  prefilledProgramId?: string;
  source?: string;
};

export type BookingModalState = {
  modal: ModalType;
  options: ModalOptions;
  open: (modal: ModalType, options?: ModalOptions) => void;
  close: () => void;
};

export const BookingModalContext = createContext<BookingModalState>({
  modal: null,
  options: {},
  open: () => {},
  close: () => {},
});

export function useBookingModal() {
  return useContext(BookingModalContext);
}
