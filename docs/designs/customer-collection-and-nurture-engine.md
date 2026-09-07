# RealEstateDecide — Customer Collection & "Sell Them More" Nurture Engine

## 1. Purpose

We are about to spend money and effort driving traffic through rented channels
(YouTube, Reddit, Facebook groups, Product Hunt, SEO). **None of those channels
is an asset we own.** The one thing every channel produces that we fully own is
the **list of people who gave us their email**. That list compounds forever and
never costs us again — it is the moat.

This document is the single source of truth for: (a) how we collect every
contact, (b) how we segment them, and (c) the email nurture engine that turns
the list into repeat revenue ("sell them more").

## 2. The One Narrative (drives every email, every UI string)

> **"Stop guessing. Know if a property actually makes money before you buy."**

We are the **trusted advisor who keeps surfacing the next decision that
protects the investor's money** — not a calculator vendor pushing features.

## 3. The Compound Loop (the engine, not just collection)

```
Value → Permission → Trust → Offer → New offer (compounding)
```

- A free user runs a calculator → gets the answer **and** a free cheat sheet → permission granted.
- The reader uses it to avoid one bad deal → we're "the person who saved them money."
- Their next decision (flip / refinance / buy-vs-rent) → we surface the right calculator **as helpful content**, not a pitch.
- Each purchase makes the next one easier. That is the compound loop.

## 4. Capture Points (3 total)

| # | Capture point | Who | What it collects | Tag (Brevo) |
|---|---|---|---|---|
| 1 | **Free Rent vs Buy results gate** | warm visitors (SEO/organic) | email in exchange for full report + 1% Rule cheat sheet | `Free-User` |
| 2 | **Stripe Checkout** | paying customers | name + email + what they bought — **automatic, zero manual work** | `Buyer` |
| 3 | **Homepage lead magnet** | cold visitors | email for the free guide | `Subscriber` |

**Rule:** every contact lands on **one Brevo list**, segmented by tag. Buyers get
different emails than free browsers. Never mix the two without knowing who's who.

### 4.1 Free Rent vs Buy results gate (primary cold-traffic catch)
- **Where:** inside the Rent vs Buy calculator results panel (`components/rent-vs-buy-calculator.tsx`).
- **Behavior:** after the user runs the math, show a collapsed card: *"Get your full report + the free 1% Rule cheat sheet."*
- **Fields:** email (single field, low friction). Optional first name for personalization later.
- **Mechanism:** **Brevo hosted embedded form** (tag `Free-User`). Brevo's servers render and process the form, so it works on a fully static host (Hostinger) with **no server route required**. Paste Brevo's embed HTML into `NEXT_PUBLIC_BREVO_EMBED_HTML` (build-time env) and `components/email-capture.tsx` renders it in place.
- **Anti-friction guardrail:** the calculator results already render on-screen before the gate. The gate gives a *bonus* (full report + cheat sheet), it never *withholds* the verdict. Do not paywall the core answer — that kills the SEO value.

### 4.2 Stripe Checkout (automatic buyer capture) — NOT YET (needs a server)
- Stripe captures email + name at checkout natively and would push buyers to Brevo with tag `Buyer`. **Requires a server for the webhook** — not possible on the static Hostinger export. Deferred until the site migrates to a server-capable host (e.g. Vercel) with Phase 2 checkout.

### 4.3 Homepage lead magnet (cold-traffic catch)
- On the landing page (`app/page.tsx`), a compact email field tied to the hero CTA.
- Magnet: **"The 1% Rule Cheat Sheet"** — one-page, genuinely useful.
- Same **Brevo hosted form** mechanism, tag `Subscriber`.

## 5. Email Service — Brevo Free Tier (decided)

- **Why:** best-in-class free automation + tag-based segmentation at $0 to start.
- **Free limits:** 300 emails/day, unlimited contacts, 2 active automation flows.
- **Static-host architecture (chosen):** capture uses **Brevo hosted embedded forms** (tagged `Subscriber` / `Free-User`) that post directly to Brevo's servers — **no API route / server needed**, so it works on the static Hostinger export today.
- **Migration path:** when validating to Stripe checkout / Vercel (Phase 2), the API-route path and automatic buyer capture slot right in — the lists/tags port cleanly.
- **Credentials needed (vault, never chat/git):** Brevo hosted-form embed HTML → `NEXT_PUBLIC_BREVO_EMBED_HTML` (build-time env). Stripe keys (deferred until server host) → `~/.hermes/vault/stripe.env`.

## 6. Brevo Setup (one-time, when keys land)

1. Create ONE list: **"RealEstateDecide Leads"**.
2. Create 3 tags: `Free-User`, `Buyer`, `Subscriber`.
3. Automation Flow **A — Cold Subscriber** (for `Subscriber` and `Free-User` tags): the 6-step welcome/value sequence below.
4. Automation Flow **B — Buyer** (for `Buyer` tag): shorter, higher-value sequence (thank-you → proof → new-tool cross-sell). Segments: `Buyer` contacts skip Flow A's offer email and go straight to Flow B.
5. A 7th **ongoing weekly** campaign: one helpful tip per week to all non-churned contacts. This is the "sell them more over time" backbone.

## 7. The Email Nurture Sequence — Automation Flow A (cold subscriber / free user)

Timing is *day-of-opt-in*, not business days. Every email is help that points
at the next decision tool. No email is a naked pitch.

### Email 1 — Day 0 · Deliver the value ("Here's your cheat sheet")
- **Subject:** Your 1% Rule cheat sheet is here
- **Body outline:**
  - Immediate gift: deliver the cheat sheet / full report. No ask, no pitch.
  - One line of trust: *"You ran the numbers — that already puts you ahead of most first-time buyers."*
  - Soft setup: *"Over the next couple of emails I'll send you the exact rules I wish someone showed me before my first deal."*
- **Goal:** honor permission instantly, set the sequence expectation.
- **Links:** none to product (pure value).

### Email 2 — Day 3 · Teach the rules ("The 50% rule I wish someone showed me")
- **Subject:** The 50% rule that catches bad deals early
- **Body outline:**
  - Teach the 50% rule (operating expenses ≈ half of gross rent) — genuinely useful.
  - Give a quick worked example.
  - **Tie-in (as help, not pitch):** "Want to see *your* property against the 50% rule? Run the Rental Property Analyzer — it checks it for you." Link to the calculator.
- **Goal:** earn trust, first gentle product exposure framed as the tool that does the teaching.

### Email 3 — Day 7 · Objection handling ("3 deals that LOOK great but bleed cash")
- **Subject:** 3 "great deals" that bleed cash
- **Body outline:**
  - Three real-world patterns where the surface numbers look good but the deal is bad (low cap rate trap, underestimated maintenance, vacancy blind spot).
  - Each one maps to a metric the tool already produces (cap rate, cash-on-cash, DSCR).
  - **Tie-in:** "Run the analyzer and it flags all three before you write an offer." Link to the anchor calculator.
- **Goal:** preempt the "I can do this in a spreadsheet" objection by showing the blind spots.

### Email 4 — Day 14 · Surface the next decision ("Is a flip or refi your next move?")
- **Subject:** Your next decision: flip, refinance, or keep renting?
- **Body outline:**
  - Reframe: the calculator they used first was step one of many decisions.
  - Introduce the **cluster naturally** — flip, refinance break-even, buy-vs-rent — as *different decisions*, not features.
  - Cross-sell as decision-framing, one line each.
- **Goal:** move a free user toward a second decision → first purchase.

### Email 5 — Day 21 · Proof ("He ran the analyzer before a $300K purchase")
- **Subject:** Before a $300K purchase, he ran the numbers
- **Body outline:**
  - A proof narrative (real testimonial once we have one; until then, use the *before/after* of a bad-deal-avoided scenario clearly labeled as illustrative).
  - Social proof anchor from the landing page.
  - **Tie-in:** the risk-reversal — *"If the math doesn't save you from one bad deal, it's paid for itself."*
- **Goal:** convert trust into the purchase decision.

### Email 6 — Day 30 · Soft offer ("Unlock the full suite")
- **Subject:** The full suite is yours — and how it pays for itself
- **Body outline:**
  - The offer: full suite of calculators (one-time, ~$99) or single ($49).
  - Price framed against the decision it protects ("protects a $200K decision").
  - Risk-reversal, guarantee.
  - **Then the switch:** after this email, contact moves to the ongoing weekly tip cadence (no more hard offers).
- **Goal:** the one real conversion email, placed 30 days into earned trust.

## 8. Buyer Sequence — Automation Flow B (paying customer)

Shorter and higher-value. Buyer already paid; we maximize LTV and referrals.

- **Email B1 (Day 0):** Thank you + get the most out of the tool + instant value add (tips for using their purchased calculator well).
- **Email B2 (Day 7):** Pro move — show them a second calculator that pairs with what they bought (cross-sell framed as next decision).
- **Email B3 (Day 21):** Referral + review ask — "Know another investor about to make a decision?" + invitation to leave a testimonial (feeds landing-page social proof).
- **Ongoing:** Buyer stays on the weekly tip cadence; optionally a subscription upsell (full suite) if they bought a single.

## 9. Ongoing Weekly Campaign ("sell them more, forever")

- One short, genuinely useful tip per week to all active contacts (rental metrics, market-commonsense, a decision story).
- Always ends by pointing at the *next* decision tool — never a hard sell.
- **This is the compounding engine.** Frequency low enough to avoid churn, value high enough to stay opened.

## 10. KPI Tracker

| Metric | Target / notes |
|---|---|
| Capture rate (visitor → email) | ≥ 15% on free gate |
| Free → Buyer conversion | tracked per cohort |
| Email open rate | > 40% |
| Click rate | > 5% |
| Churn (unsubscribe) | < 2% per campaign |
| **List growth** | weekly +monitor, feeds all future campaigns |

## 11. Verification Checklist

- [ ] Capture UI renders on free calculator + homepage (Brevo hosted-form embed, tag-configured)
- [ ] `NEXT_PUBLIC_BREVO_EMBED_HTML` set with Brevo hosted forms for `Free-User` and `Subscriber`
- [ ] Submitting a hosted form actually lands the contact in Brevo with the right tag
- [ ] Stripe checkout (buyer capture) — deferred until server-capable host + Phase 2

## 12. Open Decisions

- Lead-magnet format: HTML view vs downloadable PDF (PDF needs a generator step; start with styled HTML view).
- Whether to gate the cheat sheet behind *both* email + name (recommend: email only, low friction).
- GDPR/CCPA region handling if traffic expands to EU.
