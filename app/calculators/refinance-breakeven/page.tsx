import type { Metadata } from 'next';
import RefinanceCalculator from '@/components/refinance-calculator';

export const metadata: Metadata = {
  title: 'Refinance Break-Even Calculator | RealEstateDecide',
  description:
    'Know if refinancing is worth it. Monthly savings, break-even point, and 5-year savings.',
};

export default function RefinancePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Refinance Break-Even Calculator
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Protects a $200k–$500k mortgage. Closing costs can wipe out years of savings. Know your
          break-even before you refi.
        </p>
      </div>
      <RefinanceCalculator />
    </div>
  );
}
