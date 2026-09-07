'use client';

import { useState } from 'react';
import { analyzeRentVsBuy, type RentVsBuyInput } from '@/lib/calculators/rent-vs-buy';
import { formatUSD } from '@/lib/format';
import { Field, NumberInput } from '@/components/field';
import { MetricRow, ResultsPanel } from '@/components/results-panel';

const defaults: RentVsBuyInput = {
  homePrice: 300000,
  downPaymentPct: 20,
  mortgageRate: 6.5,
  loanTermYears: 30,
  propertyTaxRate: 1.2,
  annualInsurance: 1500,
  annualMaintenancePct: 1,
  monthlyHoa: 100,
  monthlyRent: 1800,
  rentGrowthPct: 3,
  homeAppreciationPct: 3,
  investmentReturnPct: 7,
  timeHorizonYears: 10,
};

export default function RentVsBuyCalculator() {
  const [input, setInput] = useState<RentVsBuyInput>(defaults);
  const result = analyzeRentVsBuy(input);
  const set = (k: keyof RentVsBuyInput) => (v: number) => setInput((p) => ({ ...p, [k]: v }));

  const verdictLabel =
    result.verdict === 'buy' ? 'Buy' : result.verdict === 'rent' ? 'Rent' : 'Break-even';
  const verdictColor =
    result.verdict === 'buy'
      ? 'bg-green-100 text-green-800 border-green-300'
      : result.verdict === 'rent'
        ? 'bg-red-100 text-red-800 border-red-300'
        : 'bg-amber-100 text-amber-800 border-amber-300';

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Buying</h2>
        <Field label="Home Price">
          <NumberInput value={input.homePrice} onChange={set('homePrice')} step={10000} prefix="$" />
        </Field>
        <Field label="Down Payment">
          <NumberInput value={input.downPaymentPct} onChange={set('downPaymentPct')} step={1} suffix="%" />
        </Field>
        <Field label="Mortgage Rate">
          <NumberInput value={input.mortgageRate} onChange={set('mortgageRate')} step={0.1} suffix="%" />
        </Field>
        <Field label="Loan Term">
          <NumberInput value={input.loanTermYears} onChange={set('loanTermYears')} step={1} suffix="years" />
        </Field>
        <Field label="Property Tax Rate">
          <NumberInput value={input.propertyTaxRate} onChange={set('propertyTaxRate')} step={0.1} suffix="%" />
        </Field>
        <Field label="Annual Insurance">
          <NumberInput value={input.annualInsurance} onChange={set('annualInsurance')} step={100} prefix="$" />
        </Field>
        <Field label="Annual Maintenance">
          <NumberInput value={input.annualMaintenancePct} onChange={set('annualMaintenancePct')} step={0.1} suffix="%" />
        </Field>
        <Field label="Monthly HOA">
          <NumberInput value={input.monthlyHoa} onChange={set('monthlyHoa')} step={10} prefix="$" />
        </Field>
        <Field label="Home Appreciation">
          <NumberInput value={input.homeAppreciationPct} onChange={set('homeAppreciationPct')} step={0.5} suffix="%" />
        </Field>

        <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Renting</h2>
        <Field label="Monthly Rent">
          <NumberInput value={input.monthlyRent} onChange={set('monthlyRent')} step={50} prefix="$" />
        </Field>
        <Field label="Rent Growth">
          <NumberInput value={input.rentGrowthPct} onChange={set('rentGrowthPct')} step={0.5} suffix="%" />
        </Field>

        <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Assumptions</h2>
        <Field label="Investment Return (opportunity cost)">
          <NumberInput value={input.investmentReturnPct} onChange={set('investmentReturnPct')} step={0.5} suffix="%" />
        </Field>
        <Field label="Time Horizon">
          <NumberInput value={input.timeHorizonYears} onChange={set('timeHorizonYears')} step={1} suffix="years" />
        </Field>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Verdict</h2>
            <p className="text-sm text-gray-500">Over {input.timeHorizonYears} years</p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${verdictColor}`}>
            {verdictLabel}
          </span>
        </div>

        <ResultsPanel title="Cost Comparison">
          <MetricRow label="Total Cost of Renting" value={formatUSD(result.totalCostRenting)} />
          <MetricRow label="Total Cost of Buying" value={formatUSD(result.totalCostBuying)} />
          <MetricRow
            label="Net Advantage"
            value={formatUSD(result.netAdvantage)}
            highlight
          />
        </ResultsPanel>

        <ResultsPanel title="Break-Even">
          <MetricRow
            label="Break-Even Year"
            value={result.breakEvenYear === null ? 'Never' : `Year ${result.breakEvenYear}`}
            highlight
          />
        </ResultsPanel>
      </div>
    </div>
  );
}
