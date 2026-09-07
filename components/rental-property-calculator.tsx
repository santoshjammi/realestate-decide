'use client';

import { useState } from 'react';
import { analyzeRentalProperty, type RentalPropertyInput } from '@/lib/calculators/rental-property';
import { formatUSD, formatPct } from '@/lib/format';
import { Field, NumberInput } from '@/components/field';
import { MetricRow, ResultsPanel } from '@/components/results-panel';
import { VerdictBadge } from '@/components/verdict-badge';

const defaults: RentalPropertyInput = {
  purchasePrice: 200000,
  downPaymentPct: 20,
  interestRate: 6.5,
  loanTermYears: 30,
  monthlyRent: 1800,
  propertyTaxRate: 1.2,
  annualInsurance: 1200,
  maintenancePct: 10,
  vacancyPct: 5,
  managementPct: 8,
  monthlyHoa: 0,
  otherMonthlyExpenses: 0,
};

export default function RentalPropertyCalculator() {
  const [input, setInput] = useState<RentalPropertyInput>(defaults);
  const result = analyzeRentalProperty(input);

  const set = (k: keyof RentalPropertyInput) => (v: number) => setInput((p) => ({ ...p, [k]: v }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Property Details</h2>
        <Field label="Purchase Price">
          <NumberInput value={input.purchasePrice} onChange={set('purchasePrice')} step={5000} prefix="$" />
        </Field>
        <Field label="Down Payment">
          <NumberInput value={input.downPaymentPct} onChange={set('downPaymentPct')} step={1} suffix="%" />
        </Field>
        <Field label="Interest Rate">
          <NumberInput value={input.interestRate} onChange={set('interestRate')} step={0.1} suffix="%" />
        </Field>
        <Field label="Loan Term">
          <NumberInput value={input.loanTermYears} onChange={set('loanTermYears')} step={1} suffix="years" />
        </Field>
        <Field label="Monthly Rent">
          <NumberInput value={input.monthlyRent} onChange={set('monthlyRent')} step={50} prefix="$" />
        </Field>
        <Field label="Property Tax Rate">
          <NumberInput value={input.propertyTaxRate} onChange={set('propertyTaxRate')} step={0.1} suffix="%" />
        </Field>
        <Field label="Annual Insurance">
          <NumberInput value={input.annualInsurance} onChange={set('annualInsurance')} step={100} prefix="$" />
        </Field>
        <Field label="Maintenance">
          <NumberInput value={input.maintenancePct} onChange={set('maintenancePct')} step={1} suffix="%" />
        </Field>
        <Field label="Vacancy">
          <NumberInput value={input.vacancyPct} onChange={set('vacancyPct')} step={1} suffix="%" />
        </Field>
        <Field label="Property Management">
          <NumberInput value={input.managementPct} onChange={set('managementPct')} step={1} suffix="%" />
        </Field>
        <Field label="Monthly HOA">
          <NumberInput value={input.monthlyHoa} onChange={set('monthlyHoa')} step={10} prefix="$" />
        </Field>
        <Field label="Other Monthly Expenses">
          <NumberInput value={input.otherMonthlyExpenses} onChange={set('otherMonthlyExpenses')} step={10} prefix="$" />
        </Field>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Verdict</h2>
            <p className="text-sm text-gray-500">Is this a good deal?</p>
          </div>
          <VerdictBadge verdict={result.verdict} />
        </div>

        <ResultsPanel title="Cash Flow">
          <MetricRow label="Gross Monthly Rent" value={formatUSD(result.grossMonthlyRent)} />
          <MetricRow label="Net Operating Income (NOI)" value={formatUSD(result.netOperatingIncomeMonthly)} highlight />
          <MetricRow label="Total Monthly Expenses" value={formatUSD(result.totalMonthlyExpenses)} />
          <MetricRow label="Monthly Cash Flow" value={formatUSD(result.monthlyCashFlow)} highlight />
          <MetricRow label="Annual Cash Flow" value={formatUSD(result.annualCashFlow)} />
        </ResultsPanel>

        <ResultsPanel title="Returns">
          <MetricRow label="Cap Rate" value={formatPct(result.capRate)} highlight />
          <MetricRow label="Cash-on-Cash Return" value={formatPct(result.cashOnCashReturn)} highlight />
          <MetricRow label="DSCR" value={result.dscr.toFixed(2)} />
          <MetricRow label="1% Rule" value={result.onePercentRule ? 'Passes' : 'Fails'} />
          <MetricRow label="50% Rule" value={result.fiftyPercentRule ? 'Passes' : 'Fails'} />
        </ResultsPanel>

        <ResultsPanel title="Financing">
          <MetricRow label="Down Payment" value={formatUSD(result.downPayment)} />
          <MetricRow label="Loan Amount" value={formatUSD(result.loanAmount)} />
          <MetricRow label="Monthly P&I" value={formatUSD(result.monthlyPandI)} />
          <MetricRow label="Monthly PMI" value={formatUSD(result.monthlyPmi)} />
          <MetricRow label="Total Cash Invested" value={formatUSD(result.totalCashInvested)} />
        </ResultsPanel>
      </div>
    </div>
  );
}
