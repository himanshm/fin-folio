import type { BudgetCategoryType } from "./budget.types";
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  country?: string;
  currency?: string;
  currencySymbol?: string;
  locale?: string;
}

export interface BudgetItem {
  publicId: string;
  category: string;
  categoryType: BudgetCategoryType;
  budgetAmount: number;
  consumedAmount: number;
}

export type BudgetOverview = {
  budgetAmount: number;
  consumedAmount: number;
  income: number;
  items: BudgetItem[];
};
