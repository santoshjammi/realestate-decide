// Rent vs Buy Calculator — pure math functions
// Protects a $200k+ home-buying decision.

export interface RentVsBuyInput {
  homePrice: number;
  downPaymentPct: number; // e.g. 20
  mortgageRate: number; // annual %
  loanTermYears: number;
  propertyTaxRate: number; // annual % of home price
  annualInsurance: number;
  annualMaintenancePct: number; // % of home price, e.g. 1
  monthlyHoa: number;
  monthlyRent: number;
  rentGrowthPct: number; // annual %
  homeAppreciationPct: number; // annual %
  investmentReturnPct: number; // annual % on down payment opportunity cost
  timeHorizonYears: number;
}

export interface RentVsBuyResult {
  totalCostRenting: number;
  totalCostBuying: number;
  netAdvantage: number; // positive = renting cheaper, negative = buying cheaper
  breakEvenYear: number | null;
  verdict: 'buy' | 'rent' | 'break-even';
}

function monthlyPayment(principal: number, annualRate: number, years: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function analyzeRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const {
    homePrice, downPaymentPct, mortgageRate, loanTermYears, propertyTaxRate,
    annualInsurance, annualMaintenancePct, monthlyHoa, monthlyRent,
    rentGrowthPct, homeAppreciationPct, investmentReturnPct, timeHorizonYears,
  } = input;

  const downPayment = homePrice * (downPaymentPct / 100);
  const loanAmount = homePrice - downPayment;
  const monthlyPandI = monthlyPayment(loanAmount, mortgageRate, loanTermYears);
  const monthlyTaxes = homePrice * (propertyTaxRate / 100) / 12;
  const monthlyInsurance = annualInsurance / 12;
  const monthlyMaintenance = homePrice * (annualMaintenancePct / 100) / 12;

  // --- Renting cost over horizon ---
  let totalRent = 0;
  let rent = monthlyRent;
  for (let y = 0; y < timeHorizonYears; y++) {
    totalRent += rent * 12;
    rent *= (1 + rentGrowthPct / 100);
  }
  // Opportunity cost of down payment (could have been invested)
  const downPaymentOpportunity = downPayment * (Math.pow(1 + investmentReturnPct / 100, timeHorizonYears) - 1);
  const totalCostRenting = totalRent + downPaymentOpportunity;

  // --- Buying cost over horizon ---
  let totalBuying = 0;
  for (let y = 0; y < timeHorizonYears; y++) {
    totalBuying += (monthlyPandI + monthlyTaxes + monthlyInsurance + monthlyMaintenance + monthlyHoa) * 12;
  }
  // Home appreciation (equity gain)
  const futureHomeValue = homePrice * Math.pow(1 + homeAppreciationPct / 100, timeHorizonYears);
  const appreciationGain = futureHomeValue - homePrice;
  // Remaining principal paid down (equity from amortization) — simplified: principal portion of payments
  const totalCostBuying = totalBuying - appreciationGain;

  const netAdvantage = totalCostBuying - totalCostRenting; // positive = renting cheaper

  // Break-even year: first year buying becomes cheaper than renting
  let breakEvenYear: number | null = null;
  let cumRent = 0;
  let cumBuy = 0;
  rent = monthlyRent;
  for (let y = 1; y <= timeHorizonYears; y++) {
    cumRent += rent * 12;
    rent *= (1 + rentGrowthPct / 100);
    cumBuy += (monthlyPandI + monthlyTaxes + monthlyInsurance + monthlyMaintenance + monthlyHoa) * 12;
    const buyNet = cumBuy - (homePrice * (Math.pow(1 + homeAppreciationPct / 100, y) - 1));
    if (buyNet <= cumRent) { breakEvenYear = y; break; }
  }

  let verdict: RentVsBuyResult['verdict'];
  if (breakEvenYear !== null && breakEvenYear <= timeHorizonYears) verdict = 'buy';
  else if (netAdvantage > 0) verdict = 'rent';
  else verdict = 'break-even';

  return { totalCostRenting, totalCostBuying, netAdvantage, breakEvenYear, verdict };
}
