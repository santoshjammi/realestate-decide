import type { Metadata } from 'next';
import RentalPropertyCalculator from '@/components/rental-property-calculator';

export const metadata: Metadata = {
  title: 'Rental Property Analyzer | RealEstateDecide',
  description:
    'Know if a rental property actually makes money before you buy. NOI, cap rate, cash-on-cash return, and a clear good/bad verdict.',
};

export default function RentalPropertyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Rental Property Analyzer
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Protects a $150k–$500k decision. One wrong number = years of negative cash flow. Run the
          numbers before you commit.
        </p>
      </div>
      <RentalPropertyCalculator />
    </div>
  );
}
