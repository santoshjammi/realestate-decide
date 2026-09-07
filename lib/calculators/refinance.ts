// Refinance Break-Even Calculator — pure math functions
// Protects a $200k–$500k mortgage decision.

export interface RefinanceInput {
  currentRate: number; // annual %
  currentBalance: number;
  newRate: number; // annual %
  newLoanTermYears: number;
  closingCosts: number;
  currentRemainingYears: number;
}

export interface RefinanceResult {
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
  monthlySavings: number;
  breakEvenMonths: number;
  fiveYearSavings: number;
  worthIt: boolean;
  verdict: 'good' | 'borderline' | 'bad';
}

function monthlyPayment(principal: number, annualRate: number, years: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function analyzeRefinance(input: RefinanceInput): RefinanceResult {
  const {
    currentRate, currentBalance, newRate, newLoanTermYears, closingCosts, currentRemainingYears,
  } = input;

  const currentMonthlyPayment = monthlyPayment(currentBalance, currentRate, currentRemainingYears);
  const newMonthlyPayment = monthlyPayment(currentBalance, newRate, newLoanTermYears);
  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;

  const breakEvenMonths = monthlySavings > 0 ? closingCosts / monthlySavings : Infinity;
  const fiveYearSavings = monthlySavings * 60 - closingCosts;

  // Refinance worth it if break-even < 24 months (configurable threshold)
  const worthIt = monthlySavings > 0 && breakEvenMonths < 24;

  let verdict: RefinanceResult['verdict'];
  if (worthIt && fiveYearSavings > 0) verdict = 'good';
  else if (monthlySavings > 0) verdict = 'borderline';
  else verdict = 'bad';

  return {
    currentMonthlyPayment, newMonthlyPayment, monthlySavings, breakEvenMonths,
    fiveYearSavings, worthIt, verdict,
  };
}
