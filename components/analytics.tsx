'use client';

import { useEffect } from 'react';
import { siteConfig } from '@/lib/site-config';

/**
 * Privacy-friendly analytics via Plausible.
 *
 * Works on a fully static host (Hostinger) — just a script tag, no cookie
 * banner, no server. Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN to enable.
 *
 * Also tracks a custom "purchase_click" event when a buy button is clicked,
 * so we can measure intent even before checkout is live.
 */
export function Analytics() {
  const domain = siteConfig.analytics.plausibleDomain;

  useEffect(() => {
    if (!domain) return;
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = domain;
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }, [domain]);

  return null;
}

/** Fire a custom event (e.g. "purchase_click") to Plausible. */
export function trackEvent(name: string, props?: Record<string, string | number>) {
  const w = window as unknown as { plausible?: (e: string, o?: unknown) => void };
  if (typeof w.plausible === 'function') {
    w.plausible(name, props ? { props } : undefined);
  }
}
