'use client';

import { useState } from 'react';
import { analyzeHouseFlip, type HouseFlipInput } from '@/lib/calculators/house-flip';
import { formatUSD, formatPct } from '@/lib/format';
import { Field, NumberInput } from '@/components/field';
import { MetricRow, ResultsPanel } from '@/components/results-panel';
import { VerdictBadge } from '@/components/verdict-badge';

const defaults: HouseFlipInput = {
  purchasePrice: 200000,
  rehabCost: 40000,
  holdingPeriodMonths: 6,
  monthlyHoldingCosts: 1500,
  sellingPrice: 320000,
  buyerClosingCostsPct: 3,
  realtorCommissionPct: 6,
  financingCost: 12000,
};

export default function HouseFlipCalculator() {
  const [input, setInput] = useState<HouseFlipInput>(defaults);
  const result = analyzeHouseFlip(input);
  const set = (k: keyof HouseFlipInput) => (v: number) => setInput((p) => ({ ...p, [k]: v }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Flip Details</h2>
        <Field label="Purchase Price">
          <NumberInput value={input.purchasePrice} onChange={set('purchasePrice')} step={5000} prefix="$" />
        </Field>
        <Field label="Rehab Cost">
          <NumberInput value={input.rehabCost} onChange={set('rehabCost')} step={5000} prefix="$" />
        </Field>
        <Field label="Holding Period">
          <NumberInput value={input.holdingPeriodMonths} onChange={set('holdingPeriodMonths')} step={1} suffix="months" />
        </Field>
        <Field label="Monthly Holding Costs">
          <NumberInput value={input.monthlyHoldingCosts} onChange={set('monthlyHoldingCosts')} step={100} prefix="$" />
        </Field>
        <Field label="After-Repair Value (ARV)">
          <NumberInput value={input.sellingPrice} onChange={set('sellingPrice')} step={5000} prefix="$" />
        </Field>
        <Field label="Buyer Closing Costs">
          <NumberInput value={input.buyerClosingCostsPct} onChange={set('buyerClosingCostsPct')} step={0.5} suffix="%" />
        </Field>
        <Field label="Realtor Commission">
          <NumberInput value={input.realtorCommissionPct} onChange={set('realtorCommissionPct')} step={0.5} suffix="%" />
        </Field>
        <Field label="Financing Cost">
          <NumberInput value={input.financingCost} onChange={set('financingCost')} step={1000} prefix="$" />
        </Field>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Verdict</h2>
            <p className="text-sm text-gray-500">Is this flip worth it?</p>
          </div>
          <VerdictBadge verdict={result.verdict} />
        </div>

        <ResultsPanel title="Profit">
          <MetricRow label="Total Investment" value={formatUSD(result.totalInvestment)} />
          <MetricRow label="Net Profit" value={formatUSD(result.netProfit)} highlight />
          <MetricRow label="ROI" value={formatPct(result.roi)} highlight />
          <MetricRow label="Profit per Month" value={formatUSD(result.profitPerMonth)} />
        </ResultsPanel>

        <ResultsPanel title="Rules of Thumb">
          <MetricRow label="70% Rule" value={result.seventyPercentRule ? 'Passes' : 'Fails'} />
        </ResultsPanel>
      </div>
    </div>
  );
}
