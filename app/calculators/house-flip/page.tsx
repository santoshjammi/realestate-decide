import type { Metadata } from 'next';
import HouseFlipCalculator from '@/components/house-flip-calculator';

export const metadata: Metadata = {
  title: 'House-Flip Profit Calculator | RealEstateDecide',
  description:
    'Know if a flip is worth it before you buy. Net profit, ROI, profit per month, and the 70% rule.',
};

export default function HouseFlipPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          House-Flip Profit Calculator
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Protects a $50k–$300k flip. Underestimating rehab costs kills the whole deal. See your real
          profit before you commit.
        </p>
      </div>
      <HouseFlipCalculator />
    </div>
  );
}
