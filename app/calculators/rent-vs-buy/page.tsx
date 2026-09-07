import type { Metadata } from 'next';
import RentVsBuyCalculator from '@/components/rent-vs-buy-calculator';

export const metadata: Metadata = {
  title: 'Rent vs Buy Calculator | RealEstateDecide',
  description:
    'Know whether to rent or buy. Total cost comparison, break-even year, and a clear verdict.',
};

export default function RentVsBuyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Rent vs Buy Calculator</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Protects a $200k+ decision. Buying too early or renting too long both cost tens of
          thousands. See the real numbers.
        </p>
      </div>
      <RentVsBuyCalculator />
    </div>
  );
}
