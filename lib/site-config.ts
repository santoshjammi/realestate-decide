// Site-wide configuration for RealEstateDecide.
//
// This is the single place to flip the site from "collecting leads" to
// "selling" — the moment a Razorpay Payment Link exists, set the URL here
// and the buy buttons go live. No code changes needed.
//
// Payment links are intentionally NOT hardcoded in components. Set them here
// (or via NEXT_PUBLIC_* env vars) and every CTA picks them up.

export const siteConfig = {
  // The one narrative — every UI string reinforces this.
  narrative: "Stop guessing. Know if a property actually makes money before you buy.",

  // --- Value ladder pricing (USD) ---
  pricing: {
    tripwire: {
      name: "House-Flip Profit Calculator",
      price: 29, // $19–$29 tripwire
      // Razorpay Payment Link for the single calculator. Empty = not buyable yet.
      paymentLink: process.env.NEXT_PUBLIC_TRIPWIRE_PAYMENT_LINK || "",
    },
    core: {
      name: "Full Suite — All 4 Calculators",
      price: 99, // $99 core
      paymentLink: process.env.NEXT_PUBLIC_CORE_PAYMENT_LINK || "",
    },
    backEnd: {
      name: "Done-With-You Analysis",
      price: 497, // high-ticket back-end (later)
      paymentLink: "",
    },
  },

  // --- Analytics ---
  // Plausible is privacy-friendly and works on a fully static host (no cookie
  // banner needed). Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN to enable.
  analytics: {
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
