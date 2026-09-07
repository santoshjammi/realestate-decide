// House-Flip Profit Calculator — pure math functions
// Protects a $50k–$300k flip decision.

export interface HouseFlipInput {
  purchasePrice: number;
  rehabCost: number;
  holdingPeriodMonths: number;
  monthlyHoldingCosts: number; // taxes + insurance + utilities + interest during hold
  sellingPrice: number;
  buyerClosingCostsPct: number; // % of selling price, e.g. 3
  realtorCommissionPct: number; // % of selling price, e.g. 6
  financingCost: number; // total financing/interest cost
}

export interface HouseFlipResult {
  totalInvestment: number;
  netProfit: number;
  roi: number; // %
  profitPerMonth: number;
  seventyPercentRule: boolean;
  verdict: 'good' | 'borderline' | 'bad';
}

export function analyzeHouseFlip(input: HouseFlipInput): HouseFlipResult {
  const {
    purchasePrice, rehabCost, holdingPeriodMonths, monthlyHoldingCosts,
    sellingPrice, buyerClosingCostsPct, realtorCommissionPct, financingCost,
  } = input;

  const holdingCosts = monthlyHoldingCosts * holdingPeriodMonths;
  const closingCosts = sellingPrice * (buyerClosingCostsPct / 100);
  const commission = sellingPrice * (realtorCommissionPct / 100);

  const totalInvestment =
    purchasePrice + rehabCost + holdingCosts + closingCosts + commission + financingCost;

  const netProfit = sellingPrice - totalInvestment;
  const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
  const profitPerMonth = holdingPeriodMonths > 0 ? netProfit / holdingPeriodMonths : 0;

  // 70% rule: buy price should be ≤ 70% of ARV (after-repair value) minus rehab
  const arv = sellingPrice;
  const seventyPercentRule = purchasePrice <= arv * 0.7 - rehabCost;

  let verdict: HouseFlipResult['verdict'];
  if (netProfit > 0 && roi >= 15) verdict = 'good';
  else if (netProfit > 0) verdict = 'borderline';
  else verdict = 'bad';

  return {
    totalInvestment, netProfit, roi, profitPerMonth, seventyPercentRule, verdict,
  };
}
