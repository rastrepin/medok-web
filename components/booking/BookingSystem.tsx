'use client';
/**
 * BookingSystem — renders the active modal based on BookingModalContext.
 * Place once in layout or root page so modals are globally accessible.
 */
import { useBookingModal } from './useBookingModal';
import QuizModal     from './QuizModal';
import BookingModal  from './BookingModal';
import CallbackModal from './CallbackModal';

export default function BookingSystem() {
  const { modal, options, close } = useBookingModal();

  return (
    <>
      <QuizModal
        open={modal === 'quiz'}
        onClose={close}
        prefilledTrimester={options.prefilledTrimester}
        prefilledPregnancyType={options.prefilledPregnancyType}
        source={options.source ?? 'unknown'}
      />
      <BookingModal
        open={modal === 'booking'}
        onClose={close}
        prefilledDoctorSlug={options.prefilledDoctorSlug}
        prefilledProgramId={options.prefilledProgramId}
        source={options.source ?? 'unknown'}
      />
      <CallbackModal
        open={modal === 'callback'}
        onClose={close}
        source={options.source ?? 'unknown'}
      />
    </>
  );
}
