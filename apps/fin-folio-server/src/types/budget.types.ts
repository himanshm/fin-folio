export interface CreateBudgetItemInput {
  categoryId: string;
  budgetAmount: number;
  consumedAmount?: number;
}

export interface CreateBudgetPayload {
  month: string;
  plannedAmount?: number;
  consumedAmount?: number;
  items?: CreateBudgetItemInput[];
}

export interface CreateBudgetItemPayload extends CreateBudgetItemInput {
  budgetId: string;
}
