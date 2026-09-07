// Rental Property Analyzer — pure math functions
// Protects a $150k–$500k decision. Core value of the app.

export interface RentalPropertyInput {
  purchasePrice: number;
  downPaymentPct: number; // e.g. 20 = 20%
  interestRate: number; // annual, e.g. 6.5
  loanTermYears: number; // e.g. 30
  monthlyRent: number;
  propertyTaxRate: number; // annual % of purchase price, e.g. 1.2
  annualInsurance: number;
  maintenancePct: number; // % of rent, e.g. 10
  vacancyPct: number; // % of rent, e.g. 5
  managementPct: number; // % of rent, e.g. 8
  monthlyHoa: number;
  otherMonthlyExpenses: number;
}

export interface RentalPropertyResult {
  downPayment: number;
  loanAmount: number;
  monthlyPmi: number;
  monthlyPandI: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyMaintenance: number;
  monthlyVacancy: number;
  monthlyManagement: number;
  monthlyHoa: number;
  monthlyOther: number;
  totalMonthlyExpenses: number;
  grossMonthlyRent: number;
  netOperatingIncomeMonthly: number;
  netOperatingIncomeAnnual: number;
  annualCashFlow: number;
  monthlyCashFlow: number;
  capRate: number; // %
  cashOnCashReturn: number; // %
  onePercentRule: boolean;
  fiftyPercentRule: boolean;
  dscr: number;
  totalCashInvested: number;
  verdict: 'good' | 'borderline' | 'bad';
}

function monthlyPayment(principal: number, annualRate: number, years: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function analyzeRentalProperty(input: RentalPropertyInput): RentalPropertyResult {
  const {
    purchasePrice, downPaymentPct, interestRate, loanTermYears, monthlyRent,
    propertyTaxRate, annualInsurance, maintenancePct, vacancyPct, managementPct,
    monthlyHoa, otherMonthlyExpenses,
  } = input;

  const downPayment = purchasePrice * (downPaymentPct / 100);
  const loanAmount = purchasePrice - downPayment;

  // PMI when down payment < 20%
  const monthlyPmi = downPaymentPct < 20 ? loanAmount * 0.005 / 12 : 0;

  const monthlyPandI = monthlyPayment(loanAmount, interestRate, loanTermYears);
  const monthlyTaxes = purchasePrice * (propertyTaxRate / 100) / 12;
  const monthlyInsurance = annualInsurance / 12;
  const monthlyMaintenance = monthlyRent * (maintenancePct / 100);
  const monthlyVacancy = monthlyRent * (vacancyPct / 100);
  const monthlyManagement = monthlyRent * (managementPct / 100);

  const totalMonthlyExpenses =
    monthlyPandI + monthlyPmi + monthlyTaxes + monthlyInsurance +
    monthlyMaintenance + monthlyVacancy + monthlyManagement + monthlyHoa + otherMonthlyExpenses;

  const grossMonthlyRent = monthlyRent;
  const netOperatingIncomeMonthly =
    monthlyRent - monthlyVacancy - monthlyMaintenance - monthlyManagement - monthlyHoa - otherMonthlyExpenses;
  const netOperatingIncomeAnnual = netOperatingIncomeMonthly * 12;

  const annualDebtService = (monthlyPandI + monthlyPmi) * 12;
  const annualCashFlow = netOperatingIncomeAnnual - annualDebtService;
  const monthlyCashFlow = annualCashFlow / 12;

  const totalCashInvested = downPayment; // closing costs excluded for simplicity
  const capRate = purchasePrice > 0 ? (netOperatingIncomeAnnual / purchasePrice) * 100 : 0;
  const cashOnCashReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;

  const onePercentRule = monthlyRent >= purchasePrice * 0.01;
  const fiftyPercentRule = (monthlyMaintenance + monthlyVacancy + monthlyManagement + monthlyHoa + otherMonthlyExpenses) <= monthlyRent * 0.5;
  const dscr = annualDebtService > 0 ? netOperatingIncomeAnnual / annualDebtService : 0;

  let verdict: RentalPropertyResult['verdict'];
  if (monthlyCashFlow > 0 && cashOnCashReturn >= 8) verdict = 'good';
  else if (monthlyCashFlow >= 0 && cashOnCashReturn >= 4) verdict = 'borderline';
  else verdict = 'bad';

  return {
    downPayment, loanAmount, monthlyPmi, monthlyPandI, monthlyTaxes, monthlyInsurance,
    monthlyMaintenance, monthlyVacancy, monthlyManagement, monthlyHoa, monthlyOther: otherMonthlyExpenses,
    totalMonthlyExpenses, grossMonthlyRent, netOperatingIncomeMonthly, netOperatingIncomeAnnual,
    annualCashFlow, monthlyCashFlow, capRate, cashOnCashReturn, onePercentRule, fiftyPercentRule,
    dscr, totalCashInvested, verdict,
  };
}
