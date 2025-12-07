import type { BudgetCategoryType } from "./budget.types";

export type CategoryType =
  | "INCOME"
  | "EXPENSE"
  | "SAVINGS"
  | "DEBT"
  | "INVESTMENT";
export type CategoryBucket = "NEEDS" | "WANTS" | "SAVINGS";
export type CategoryOrigin = "SYSTEM" | "USER";

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
  id: string;
  category: string;
  categoryType: BudgetCategoryType;
  budgetAmount: number;
  consumedAmount: number;
}

export interface BudgetOverview {
  budgetAmount: number;
  consumedAmount: number;
  income: number;
  items: BudgetItem[];
}

export interface Category {
  id: string;
  title: string;
  type: CategoryType;
  bucket: CategoryBucket;
  origin: CategoryOrigin;
  accumulatedAmount: number;
}
