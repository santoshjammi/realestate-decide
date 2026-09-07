# RealEstateDecide — Real-Estate Decision Calculator App

## 1. Product Concept

A small web app hosting a suite of "scary expensive decision" calculators for **US real estate investors**. One buyer (real estate investors), one domain (real estate), one codebase. Vertical beats general.

**Core principle:** A budget tracker protects $40. A rental property analyzer protects a $200,000 decision. Same effort to build — charge $99, not $10. **The whole game is picking a buyer whose mistake is expensive.**

## 2. Anchor + Cluster (build these first)

| # | Calculator | Decision protected | Price tier |
|---|-----------|-------------------|-----------|
| **1 (ANCHOR)** | **Rental Property Analyzer** | $150k–$500k property purchase | $99–$200 |
| 2 | House-Flip Profit Calculator | $50k–$300k flip | $49–$99 |
| 3 | Refinance Break-Even Calculator | $200k–$500k mortgage | $49–$99 |
| 4 | Rent vs Buy Calculator | $200k+ | $49–$99 |

**Why this cluster:** One buyer (real estate investors), one domain, one codebase. Build the app once, add calculators incrementally, cross-sell. This is "vertical beats general" — a *real-estate-decision* app, not a generic calculator app.

## 3. Target Buyer (ICP)

- **Who:** First-time and small-scale US real estate investors (1–10 properties)
- **Age:** 28–50
- **Pain:** Terrified of buying a property that bleeds cash. One wrong number = years of negative cash flow.
- **What they search:** "rental property calculator", "cap rate calculator", "cash on cash return", "should I buy or rent", "refinance break even"
- **Channel:** Google SEO (high-intent search), YouTube (offer-first content), real estate Facebook groups

## 4. Monetization

- **Free tier:** 1 basic calculator (Rent vs Buy) — foot in the door, drives traffic
- **Paid tier:** Full suite (all 4) — one-time purchase or subscription
- **Pricing:** Anchor at $99 one-time for the full suite; $29 for a single calculator
- **USD pricing**, US tax/legal/real-estate conventions baked in

## 5. Tech Stack (local-first, buildable from India)

- **Frontend:** Next.js (App Router) + React + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API routes (lightweight) — no heavy infra
- **State:** Client-side for calculators (pure JS math, no server needed for the core value)
- **Payments:** Stripe Checkout (later — Phase 2)
- **Deploy:** Vercel (later — Phase 2)
- **No shipping, no inventory** — pure digital

## 6. Calculator Math (the core value — must be correct)

### 6.1 Rental Property Analyzer (ANCHOR)
Inputs: purchase price, down payment %, interest rate, loan term, monthly rent, property tax rate, insurance, maintenance %, vacancy %, property management %, HOA, other expenses.

Outputs:
- **NOI** (Net Operating Income) = Gross Rent − Vacancy − Operating Expenses
- **Cap Rate** = NOI / Purchase Price
- **Cash-on-Cash Return** = Annual Cash Flow / Total Cash Invested
- **Monthly Cash Flow** = Rent − (P&I + Taxes + Insurance + Maintenance + Vacancy + Mgmt + HOA)
- **1% Rule** check (monthly rent ≥ 1% of purchase price)
- **50% Rule** check (operating expenses ≈ 50% of gross rent)
- **Debt Service Coverage Ratio (DSCR)** = NOI / Annual Debt Service
- **Verdict:** Good deal / Borderline / Bad deal with color-coded output

### 6.2 House-Flip Profit Calculator
Inputs: purchase price, rehab cost, holding period, holding costs (taxes, insurance, utilities, interest), selling price, closing costs (buy + sell), realtor commission, financing cost.

Outputs:
- **Total Investment** = Purchase + Rehab + Holding + Closing + Commission + Financing
- **Net Profit** = Selling Price − Total Investment
- **ROI** = Net Profit / Total Investment
- **Profit per month** = Net Profit / Holding Period
- **70% Rule** check (buy price ≤ 70% of ARV − rehab)
- **Verdict:** Good flip / Break-even / Bad flip

### 6.3 Refinance Break-Even Calculator
Inputs: current rate, current balance, new rate, new loan term, closing costs, monthly payment current vs new.

Outputs:
- **Monthly savings** = Current payment − New payment
- **Break-even months** = Closing costs / Monthly savings
- **5-year savings** = (Monthly savings × 60) − Closing costs
- **Verdict:** Refinance worth it if break-even < 24 months (configurable)

### 6.4 Rent vs Buy Calculator
Inputs: home price, down payment, mortgage rate, property tax, insurance, maintenance, HOA, rent, rent growth %, home appreciation %, investment return %, time horizon.

Outputs:
- **Total cost of renting** over horizon (with rent growth + opportunity cost of down payment)
- **Total cost of buying** over horizon (P&I + taxes + insurance + maintenance + HOA − equity − appreciation)
- **Net advantage** = Buy cost − Rent cost (positive = renting cheaper, negative = buying cheaper)
- **Break-even year** (when buying becomes cheaper)
- **Verdict:** Buy / Rent / Break-even

## 7. App Structure

```
digitalProducts/
├── docs/designs/          # this design doc
├── app/                   # Next.js App Router
│   ├── page.tsx           # landing page (offer-first)
│   ├── layout.tsx
│   ├── globals.css
│   ├── calculators/
│   │   ├── rental-property/     # ANCHOR
│   │   ├── house-flip/
│   │   ├── refinance-breakeven/
│   │   └── rent-vs-buy/
│   └── api/               # (Phase 2: payments)
├── components/            # shadcn/ui components
│   ├── ui/               # shadcn primitives
│   ├── calculator-form.tsx
│   ├── results-panel.tsx
│   └── verdict-badge.tsx
├── lib/
│   ├── calculators/      # pure math functions (unit-testable)
│   │   ├── rental-property.ts
│   │   ├── house-flip.ts
│   │   ├── refinance.ts
│   │   └── rent-vs-buy.ts
│   └── format.ts          # USD/percent formatting
├── tests/                 # unit tests for calculator math
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 8. Landing Page (offer-first, per build-in-public playbook)

- **Hero:** "Stop guessing. Know if a property actually makes money before you buy." + CTA
- **The anchor offer:** "Rental Property Analyzer — the $99 tool that protects a $200,000 decision."
- **Social proof placeholder:** testimonial wall (to be filled after launch)
- **Free tier hook:** "Try Rent vs Buy free. No credit card."
- **Risk reversal:** "If the math doesn't save you from one bad deal, it's paid for itself."
- **URL in comments / CTAs everywhere** — lead capture

## 9. Design Language

- **shadcn/ui + Tailwind** (per user preference)
- Clean, trustworthy, financial-tool aesthetic
- Color-coded verdicts: green (good deal), amber (borderline), red (bad deal)
- Mobile-responsive (most real estate investors browse on phone)
- Dark-mode friendly

## 10. Build Phases

- **Phase 1 (NOW):** Next.js app + all 4 calculators with correct math + unit tests + landing page. Local, runnable, verified.
- **Phase 2 (after validation):** Stripe Checkout, deploy to Vercel, SEO content, YouTube offer-first content.
- **Phase 3:** Sell-first validation in real estate Facebook groups before heavy marketing.

## 11. Verification Checklist

- [ ] `npm run dev` starts and serves the app
- [ ] All 4 calculators render and compute correct results
- [ ] Unit tests pass for all calculator math (known-value assertions)
- [ ] Landing page is offer-first with clear CTA
- [ ] shadcn/ui components used, Tailwind styling applied
- [ ] Mobile-responsive
- [ ] `npm run build` succeeds (production build)
