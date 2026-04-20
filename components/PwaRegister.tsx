'use client';

import { useEffect } from 'react';

/**
 * Registers /sw.js in the browser. No-op on unsupported environments
 * (SSR, older browsers, non-https). Safe to mount once at the app root.
 */
export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    // Wait for load to avoid competing with critical boot path.
    const onLoad = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .catch((err) => {
          // Non-fatal — PWA remains a progressive enhancement.
          console.warn('[pwa] sw registration failed', err);
        });
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  return null;
}
