/**
 * MEDOK Analytics — fire-and-forget event tracking
 * Stores session_id in sessionStorage, POSTs to /api/medok-events
 */

const SESSION_KEY = 'medok_session_id';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function getDevice(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function getUtm(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source:   p.get('utm_source')   ?? undefined,
    utm_medium:   p.get('utm_medium')   ?? undefined,
    utm_campaign: p.get('utm_campaign') ?? undefined,
  };
}

export type TrackEvent = {
  event_type:
    | 'modal_opened'
    | 'quiz_started'
    | 'quiz_step_completed'
    | 'quiz_dropped'
    | 'quiz_to_callback'
    | 'quiz_to_form'
    | 'form_submitted'
    | 'quiz_inline_started'
    | 'quiz_offer_viewed'
    | 'quiz_offer_chose_full_pregnancy'
    | 'quiz_doctor_selection_viewed'
    | 'quiz_doctor_selected'
    | 'quiz_doctor_skip';
  modal_type?: 'quiz' | 'booking' | 'callback';
  step_number?: number;
  step_value?: object;
  source_cta?: string;
};

export async function track(event: TrackEvent): Promise<void> {
  try {
    const payload = {
      ...event,
      session_id:   getSessionId(),
      source_page:  typeof window !== 'undefined' ? window.location.pathname : '',
      device:       getDevice(),
      ...getUtm(),
    };
    // fire-and-forget — не блокує UI
    void fetch('/api/medok-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // silent — аналітика не має валити UI
  }
}
