// Unit tests for all calculator math — known-value assertions.
// Run with: npx tsx tests/calculators.test.ts

import { analyzeRentalProperty } from '../lib/calculators/rental-property';
import { analyzeHouseFlip } from '../lib/calculators/house-flip';
import { analyzeRefinance } from '../lib/calculators/refinance';
import { analyzeRentVsBuy } from '../lib/calculators/rent-vs-buy';

let passed = 0;
let failed = 0;

function assert(cond: boolean, name: string, detail?: string) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function close(a: number, b: number, tol = 0.5) {
  return Math.abs(a - b) <= tol;
}

console.log('\n=== Rental Property Analyzer ===');
{
  // $200k property, 20% down, 6.5% 30yr, $1,800 rent, 1.2% tax, $1,200 ins
  const r = analyzeRentalProperty({
    purchasePrice: 200000, downPaymentPct: 20, interestRate: 6.5, loanTermYears: 30,
    monthlyRent: 1800, propertyTaxRate: 1.2, annualInsurance: 1200,
    maintenancePct: 10, vacancyPct: 5, managementPct: 8, monthlyHoa: 0, otherMonthlyExpenses: 0,
  });
  assert(close(r.downPayment, 40000), 'down payment = $40,000', `got ${r.downPayment}`);
  assert(close(r.loanAmount, 160000), 'loan amount = $160,000', `got ${r.loanAmount}`);
  assert(close(r.monthlyPandI, 1011.3, 1), 'monthly P&I ≈ $1,011', `got ${r.monthlyPandI}`);
  assert(close(r.monthlyTaxes, 200), 'monthly taxes = $200', `got ${r.monthlyTaxes}`);
  assert(close(r.monthlyInsurance, 100), 'monthly insurance = $100', `got ${r.monthlyInsurance}`);
  assert(close(r.monthlyMaintenance, 180), 'maintenance = $180', `got ${r.monthlyMaintenance}`);
  assert(close(r.monthlyVacancy, 90), 'vacancy = $90', `got ${r.monthlyVacancy}`);
  assert(close(r.monthlyManagement, 144), 'management = $144', `got ${r.monthlyManagement}`);
  assert(close(r.netOperatingIncomeMonthly, 1386), 'NOI monthly = $1,386', `got ${r.netOperatingIncomeMonthly}`);
  assert(close(r.monthlyCashFlow, 374.7, 2), 'monthly cash flow ≈ $375', `got ${r.monthlyCashFlow}`);
  assert(close(r.capRate, 8.32, 0.1), 'cap rate ≈ 8.3%', `got ${r.capRate}`);
  assert(close(r.cashOnCashReturn, 11.24, 0.1), 'CoC return ≈ 11.2%', `got ${r.cashOnCashReturn}`);
  assert(r.onePercentRule === false, '1% rule fails (1800 < 2000)', `got ${r.onePercentRule}`);
  assert(r.verdict === 'good' || r.verdict === 'borderline', 'verdict is good/borderline', `got ${r.verdict}`);
}

console.log('\n=== House-Flip ===');
{
  const f = analyzeHouseFlip({
    purchasePrice: 200000, rehabCost: 40000, holdingPeriodMonths: 6, monthlyHoldingCosts: 1500,
    sellingPrice: 320000, buyerClosingCostsPct: 3, realtorCommissionPct: 6, financingCost: 12000,
  });
  const holding = 1500 * 6;
  const closing = 320000 * 0.03;
  const commission = 320000 * 0.06;
  const totalInv = 200000 + 40000 + holding + closing + commission + 12000;
  assert(close(f.totalInvestment, totalInv), 'total investment matches manual calc', `got ${f.totalInvestment}`);
  assert(close(f.netProfit, 320000 - totalInv), 'net profit matches', `got ${f.netProfit}`);
  assert(close(f.profitPerMonth, f.netProfit / 6), 'profit/month = net/6', `got ${f.profitPerMonth}`);
  assert(f.seventyPercentRule === false, '70% rule: 200k > 184k, correctly fails', `got ${f.seventyPercentRule}`);
  assert(f.verdict === 'good' || f.verdict === 'borderline', 'verdict set', `got ${f.verdict}`);
}

console.log('\n=== Refinance Break-Even ===');
{
  const ref = analyzeRefinance({
    currentRate: 7.0, currentBalance: 300000, newRate: 5.5, newLoanTermYears: 30,
    closingCosts: 6000, currentRemainingYears: 28,
  });
  assert(ref.monthlySavings > 0, 'monthly savings positive (rate dropped)', `got ${ref.monthlySavings}`);
  assert(close(ref.breakEvenMonths, 6000 / ref.monthlySavings, 1), 'break-even = closing/savings', `got ${ref.breakEvenMonths}`);
  assert(ref.fiveYearSavings > 0, '5-year savings positive', `got ${ref.fiveYearSavings}`);
  assert(ref.verdict === 'good' || ref.verdict === 'borderline', 'verdict set', `got ${ref.verdict}`);
}

console.log('\n=== Rent vs Buy ===');
{
  const rvb = analyzeRentVsBuy({
    homePrice: 300000, downPaymentPct: 20, mortgageRate: 6.5, loanTermYears: 30,
    propertyTaxRate: 1.2, annualInsurance: 1500, annualMaintenancePct: 1, monthlyHoa: 100,
    monthlyRent: 1800, rentGrowthPct: 3, homeAppreciationPct: 3, investmentReturnPct: 7, timeHorizonYears: 10,
  });
  assert(rvb.totalCostRenting > 0, 'renting cost positive', `got ${rvb.totalCostRenting}`);
  assert(rvb.totalCostBuying > 0, 'buying cost positive', `got ${rvb.totalCostBuying}`);
  assert(typeof rvb.breakEvenYear === 'number' || rvb.breakEvenYear === null, 'break-even year is number or null', `got ${rvb.breakEvenYear}`);
  assert(['buy', 'rent', 'break-even'].includes(rvb.verdict), 'verdict valid', `got ${rvb.verdict}`);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
