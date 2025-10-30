export enum InstrumentType {
  STOCK = "STOCK",
  MUTUAL_FUND = "MUTUAL_FUND",
  ETF = "ETF",
  BOND = "BOND",
  CRYPTO = "CRYPTO",
  REAL_ESTATE = "REAL_ESTATE",
  OTHER = "OTHER"
}

export type RiskLevel = "Low" | "Medium" | "High";
export type Liquidity = "High" | "Medium" | "Low";
export type InvestmentCategory =
  | "Equity"
  | "Debt"
  | "Hybrid"
  | "Alternative"
  | "Other";

export interface InstrumentMetadata {
  label: string;
  category: InvestmentCategory;
  riskLevel: RiskLevel;
  liquidity: Liquidity;
  expectedReturnRange: { min: number; max: number }; // in percentage terms
  isTaxable: boolean;
}

export const InstrumentTypeMeta: Record<InstrumentType, InstrumentMetadata> = {
  [InstrumentType.STOCK]: {
    label: "Stocks",
    category: "Equity",
    riskLevel: "High",
    liquidity: "High",
    expectedReturnRange: { min: 8, max: 15 },
    isTaxable: true
  },
  [InstrumentType.MUTUAL_FUND]: {
    label: "Mutual Funds",
    category: "Hybrid",
    riskLevel: "Medium",
    liquidity: "High",
    expectedReturnRange: { min: 6, max: 12 },
    isTaxable: true
  },
  [InstrumentType.ETF]: {
    label: "Exchange Traded Fund (ETF)",
    category: "Equity",
    riskLevel: "Medium",
    liquidity: "High",
    expectedReturnRange: { min: 7, max: 13 },
    isTaxable: true
  },
  [InstrumentType.BOND]: {
    label: "Bonds",
    category: "Debt",
    riskLevel: "Low",
    liquidity: "Medium",
    expectedReturnRange: { min: 3, max: 7 },
    isTaxable: true
  },
  [InstrumentType.CRYPTO]: {
    label: "Cryptocurrency",
    category: "Alternative",
    riskLevel: "High",
    liquidity: "High",
    expectedReturnRange: { min: -20, max: 50 },
    isTaxable: true
  },
  [InstrumentType.REAL_ESTATE]: {
    label: "Real Estate",
    category: "Alternative",
    riskLevel: "Low",
    liquidity: "Low",
    expectedReturnRange: { min: 4, max: 10 },
    isTaxable: true
  },
  [InstrumentType.OTHER]: {
    label: "Other",
    category: "Other",
    riskLevel: "Medium",
    liquidity: "Medium",
    expectedReturnRange: { min: 0, max: 8 },
    isTaxable: false
  }
};
