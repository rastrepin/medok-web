'use client';
import { useState, useCallback, ReactNode } from 'react';
import { BookingModalContext, ModalType, ModalOptions } from './useBookingModal';

export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal]     = useState<ModalType>(null);
  const [options, setOptions] = useState<ModalOptions>({});

  const open = useCallback((m: ModalType, opts: ModalOptions = {}) => {
    setModal(m);
    setOptions(opts);
  }, []);

  const close = useCallback(() => {
    setModal(null);
    setOptions({});
  }, []);

  return (
    <BookingModalContext.Provider value={{ modal, options, open, close }}>
      {children}
    </BookingModalContext.Provider>
  );
}
