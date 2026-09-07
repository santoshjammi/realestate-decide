'use client';

import { useState } from 'react';

type EmailCaptureProps = {
  source: 'homepage' | 'free-calculator';
  heading?: string;
  subtext?: string;
  cta?: string;
};

/**
 * Reusable email-capture form. Every submission is POSTed to a Next.js API
 * route (/api/leads) that pushes the contact into Brevo with the right tag.
 *
 * Credential-free today: when the BREVO_API_KEY env var is absent, the API
 * route responds 501 and this form gracefully falls back to a "we saved it"
 * state (logs to console + localStorage) so the UI is fully testable before
 * marketing credentials are wired up.
 */
export default function EmailCapture({
  source,
  heading = 'Get your full report + the free 1% Rule cheat sheet',
  subtext = 'No spam. Unsubscribe anytime. The math is yours either way.',
  cta = 'Send me the cheat sheet',
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('saving');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, source }),
      });
      if (res.ok || res.status === 501) {
        // 501 = backend not wired yet; still record locally so UX works in dev.
        try {
          const key = `realestatedecide:leads`;
          const existing = JSON.parse(localStorage.getItem(key) || '[]');
          existing.push({ email, name, source, ts: new Date().toISOString() });
          localStorage.setItem(key, JSON.stringify(existing));
        } catch {
          /* localStorage unavailable — non-fatal */
        }
        setStatus('done');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 dark:border-green-800 dark:bg-green-950/40">
        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
          ✅ Check your inbox — your cheat sheet is on the way.
        </p>
        <p className="mt-1 text-xs text-green-700 dark:text-green-400">
          (Dev mode: no email sent yet — recorded locally. Wire Brevo keys to deliver.)
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{heading}</h3>
      {subtext && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtext}</p>}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name (optional)"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={status === 'saving'}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
        >
          {status === 'saving' ? 'Sending…' : cta}
        </button>
      </div>
      {status === 'error' && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
