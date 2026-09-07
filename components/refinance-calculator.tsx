'use client';

import { useState } from 'react';
import { analyzeRefinance, type RefinanceInput } from '@/lib/calculators/refinance';
import { formatUSD, formatMonths } from '@/lib/format';
import { Field, NumberInput } from '@/components/field';
import { MetricRow, ResultsPanel } from '@/components/results-panel';
import { VerdictBadge } from '@/components/verdict-badge';

const defaults: RefinanceInput = {
  currentRate: 7.0,
  currentBalance: 300000,
  newRate: 5.5,
  newLoanTermYears: 30,
  closingCosts: 6000,
  currentRemainingYears: 28,
};

export default function RefinanceCalculator() {
  const [input, setInput] = useState<RefinanceInput>(defaults);
  const result = analyzeRefinance(input);
  const set = (k: keyof RefinanceInput) => (v: number) => setInput((p) => ({ ...p, [k]: v }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Loan Details</h2>
        <Field label="Current Interest Rate">
          <NumberInput value={input.currentRate} onChange={set('currentRate')} step={0.1} suffix="%" />
        </Field>
        <Field label="Current Balance">
          <NumberInput value={input.currentBalance} onChange={set('currentBalance')} step={5000} prefix="$" />
        </Field>
        <Field label="Current Years Remaining">
          <NumberInput value={input.currentRemainingYears} onChange={set('currentRemainingYears')} step={1} suffix="years" />
        </Field>
        <Field label="New Interest Rate">
          <NumberInput value={input.newRate} onChange={set('newRate')} step={0.1} suffix="%" />
        </Field>
        <Field label="New Loan Term">
          <NumberInput value={input.newLoanTermYears} onChange={set('newLoanTermYears')} step={1} suffix="years" />
        </Field>
        <Field label="Closing Costs">
          <NumberInput value={input.closingCosts} onChange={set('closingCosts')} step={500} prefix="$" />
        </Field>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Verdict</h2>
            <p className="text-sm text-gray-500">Is refinancing worth it?</p>
          </div>
          <VerdictBadge verdict={result.verdict} />
        </div>

        <ResultsPanel title="Payments">
          <MetricRow label="Current Monthly Payment" value={formatUSD(result.currentMonthlyPayment)} />
          <MetricRow label="New Monthly Payment" value={formatUSD(result.newMonthlyPayment)} />
          <MetricRow label="Monthly Savings" value={formatUSD(result.monthlySavings)} highlight />
        </ResultsPanel>

        <ResultsPanel title="Break-Even">
          <MetricRow label="Break-Even Point" value={formatMonths(result.breakEvenMonths)} highlight />
          <MetricRow label="5-Year Savings" value={formatUSD(result.fiveYearSavings)} highlight />
        </ResultsPanel>
      </div>
    </div>
  );
}
