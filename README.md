# RealEstateDecide

Real estate decision calculators that protect six-figure decisions. Built for US real estate investors — one buyer, one domain, one codebase.

## The Product

A small web app hosting a suite of "scary expensive decision" calculators. The core principle: a budget tracker protects $40, a rental property analyzer protects a $200,000 decision. Same effort to build — charge $99, not $10.

## Calculators

| Calculator | Decision protected | Price tier |
|-----------|-------------------|-----------|
| **Rental Property Analyzer** (anchor) | $150k–$500k property purchase | $99 |
| House-Flip Profit Calculator | $50k–$300k flip | $49 |
| Refinance Break-Even Calculator | $200k–$500k mortgage | $49 |
| Rent vs Buy Calculator | $200k+ | Free |

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Pure client-side math (no backend needed for the core value)
- Unit-tested calculator logic

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # run calculator unit tests
npm run build      # production build
```

## Project Structure

```
app/calculators/          # route pages (one per calculator)
components/               # calculator UI + shared components
lib/calculators/          # pure math functions (unit-testable)
tests/calculators.test.ts # known-value unit tests
docs/designs/             # design doc (source of truth)
```

## Roadmap

- **Phase 1 (done):** All 4 calculators + landing page + tests
- **Phase 2:** Stripe Checkout, deploy to Vercel, SEO content, YouTube offer-first content
- **Phase 3:** Sell-first validation in real estate Facebook groups before heavy marketing
