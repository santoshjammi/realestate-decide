'use client';

import { siteConfig } from '@/lib/site-config';

/**
 * Buy button for a value-ladder rung.
 *
 * Reads the payment link from siteConfig. If no payment link is configured
 * (Razorpay not set up yet), it renders a disabled "Coming soon" state so the
 * ladder structure is visible but nothing dead-ends.
 */
export function BuyButton({
  rung,
  label,
  className = '',
}: {
  rung: 'tripwire' | 'core' | 'backEnd';
  label?: string;
  className?: string;
}) {
  const offer = siteConfig.pricing[rung];
  const link = offer.paymentLink;
  const text = label ?? `Get ${offer.name} — $${offer.price}`;

  if (!link) {
    return (
      <button
        disabled
        title="Checkout not connected yet"
        className={`cursor-not-allowed rounded-lg bg-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-400 ${className}`}
      >
        {text} — coming soon
      </button>
    );
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 ${className}`}
    >
      {text} →
    </a>
  );
}
