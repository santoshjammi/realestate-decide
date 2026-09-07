import Link from 'next/link';
import EmailCapture from '@/components/email-capture';

const calculators = [
  {
    href: '/calculators/rental-property',
    title: 'Rental Property Analyzer',
    desc: 'NOI, cap rate, cash-on-cash return, and a clear good/bad verdict.',
    tag: 'Anchor',
    price: '$99',
  },
  {
    href: '/calculators/house-flip',
    title: 'House-Flip Profit Calculator',
    desc: 'Net profit, ROI, profit per month, and the 70% rule.',
    tag: 'Pro',
    price: '$49',
  },
  {
    href: '/calculators/refinance-breakeven',
    title: 'Refinance Break-Even Calculator',
    desc: 'Monthly savings, break-even point, and 5-year savings.',
    tag: 'Pro',
    price: '$49',
  },
  {
    href: '/calculators/rent-vs-buy',
    title: 'Rent vs Buy Calculator',
    desc: 'Total cost comparison and break-even year.',
    tag: 'Free',
    price: 'Free',
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
          Stop guessing. Know if a property actually makes money{' '}
          <span className="text-blue-600 dark:text-blue-400">before you buy.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Real estate investors lose thousands on bad deals they could have caught with simple math.
          Run the numbers in 60 seconds — before you commit a six-figure decision.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/calculators/rental-property"
            className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Analyze a Rental Property →
          </Link>
          <Link
            href="/calculators/rent-vs-buy"
            className="rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Try Rent vs Buy Free
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          No credit card. No signup. Just the math.
        </p>
      </section>

      {/* Lead magnet capture (cold traffic) */}
      <section className="mx-auto mt-10 max-w-2xl">
        <EmailCapture
          source="homepage"
          heading="Free: the 1% Rule Cheat Sheet"
          subtext="One page. The exact rule investors use to spot a bad deal before writing an offer. Yours free — no spam, unsubscribe anytime."
          cta="Send me the cheat sheet"
        />
      </section>

      {/* The anchor offer */}
      <section className="mt-16 rounded-2xl border border-blue-200 bg-blue-50 p-8 dark:border-blue-800 dark:bg-blue-950/40">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              The Rental Property Analyzer
            </h2>
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              The $99 tool that protects a $200,000 decision.
            </p>
          </div>
          <Link
            href="/calculators/rental-property"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Get the Analyzer →
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          If the math doesn&apos;t save you from one bad deal, it&apos;s paid for itself.
        </p>
      </section>

      {/* Calculator grid */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">All Calculators</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {calculators.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-700"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {c.tag}
                </span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{c.price}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">{c.title}</h3>
              <p className="mt-1 flex-1 text-sm text-gray-600 dark:text-gray-300">{c.desc}</p>
              <span className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                Open calculator →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Social proof placeholder */}
      <section className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Investors who ran the numbers
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Testimonials coming soon — after our first real users.
        </p>
      </section>
    </div>
  );
}
