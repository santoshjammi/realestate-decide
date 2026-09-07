'use client';

import { useEffect, useRef } from 'react';

/**
 * Static-friendly email capture via Brevo's hosted embedded form.
 *
 * The Brevo embed is a `<div>` + script snippet that Brevo's servers render and
 * process — so it works on a fully static host (Hostinger) with NO API route.
 * Paste your Brevo "Hosted form" embed HTML into NEXT_PUBLIC_BREVO_EMBED_HTML
 * (a build-time env var) and this renders it exactly in place.
 *
 * Until that env var is set, it renders a clean placeholder card so the UI is
 * never blank, and the copy still sets up the "sell them more" promise.
 *
 * Each capture point maps to its own Brevo form/tag upstream:
 *   source="homepage"         -> form tagged "Subscriber"
 *   source="free-calculator"  -> form tagged "Free-User"
 */
type EmailCaptureProps = {
  source: 'homepage' | 'free-calculator';
  heading?: string;
  subtext?: string;
};

export default function EmailCapture({
  source,
  heading = 'Get your full report + the free 1% Rule cheat sheet',
  subtext = 'No spam. Unsubscribe anytime.',
}: EmailCaptureProps) {
  const embedHtml = process.env.NEXT_PUBLIC_BREVO_EMBED_HTML;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!embedHtml || !containerRef.current) return;
    // Render Brevo's embed; force fresh script tags so its loader runs.
    containerRef.current.innerHTML = '';
    const host = document.createElement('div');
    host.innerHTML = embedHtml;
    host.querySelectorAll('script').forEach((old) => {
      const fresh = document.createElement('script');
      Array.from(old.attributes).forEach((a) => fresh.setAttribute(a.name, a.value));
      fresh.textContent = old.textContent;
      host.replaceChild(fresh, old);
    });
    containerRef.current.appendChild(host);
  }, [embedHtml]);

  if (embedHtml) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{heading}</h3>
        {subtext && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtext}</p>
        )}
        <div ref={containerRef} className="mt-4" />
      </div>
    );
  }

  // Placeholder until the Brevo embed is wired. Visually matches the real card.
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{heading}</h3>
      {subtext && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtext}</p>}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="h-10 flex-1 rounded-lg border border-dashed border-gray-300 dark:border-gray-600" />
        <div className="h-10 w-40 rounded-lg bg-blue-600/20" />
      </div>
      <p className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400">
        {source === 'homepage'
          ? 'Lead capture: connect your Brevo hosted form (tag "Subscriber").'
          : 'Free-report capture: connect your Brevo hosted form (tag "Free-User").'}
      </p>
    </div>
  );
}
