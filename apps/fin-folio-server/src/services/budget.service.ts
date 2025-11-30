import { AppDataSource } from "@/data-source";
import { Budget } from "@/models/Budget";
import { BudgetItem } from "@/models/BudgetItem";
import {
  BudgetItemRepository,
  BudgetRepository,
  CategoryRepository
} from "@/repositories";
import { AppAuth, CreateBudgetItemPayload, CreateBudgetPayload } from "@/types";
import {
  AuthenticationError,
  ResourceNotFoundError,
  ValidationError,
  runTransaction
} from "@/utils";
import { DataSource, EntityManager } from "typeorm";
import { createUserService } from "./user.service";

const normalizeMonthValue = (month: string): Date => {
  if (!month) {
    throw new ValidationError("Budget month is required");
  }
  const parsed = new Date(month);
  if (Number.isNaN(parsed.getTime())) {
    throw new ValidationError("Invalid month value");
  }
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), 1));
};

const mapBudgetItemToResponse = (item: BudgetItem) => ({
  id: item.publicId,
  budgetAmount: Number(item.budgetAmount),
  consumedAmount: Number(item.consumedAmount ?? 0),
  category: item.category
    ? {
        id: item.category.publicId,
        title: item.category.title,
        type: item.category.type,
        bucket: item.category.bucket
      }
    : undefined
});

const mapBudgetToResponse = (budget: Budget) => ({
  id: budget.publicId,
  month: budget.month,
  plannedAmount: Number(budget.budgetAmount),
  consumedAmount: Number(budget.consumedAmount),
  items: budget.items ? budget.items.map(mapBudgetItemToResponse) : []
});

export const createBudgetService = (
  dataContext: DataSource | EntityManager = AppDataSource
) => {
  const createBudget = async (payload: CreateBudgetPayload, auth: AppAuth) => {
    const execute = async (manager: EntityManager) => {
      const txnBudgetRepo = new BudgetRepository(manager);
      const txnBudgetItemRepo = new BudgetItemRepository(manager);
      const txnCategoryRepo = new CategoryRepository(manager);
      const { getUserIdentity } = createUserService(manager);
      const userId = auth?.userId;

      if (!userId) {
        throw new AuthenticationError("User not authenticated");
      }
      const user = await getUserIdentity(userId);

      const monthDate = normalizeMonthValue(payload.month);
      const existingBudget = await txnBudgetRepo.findByUserAndMonth(
        user.id,
        monthDate
      );
      if (existingBudget) {
        throw new ValidationError(
          "Budget for this month already exists. Update the existing budget instead."
        );
      }

      const budget = await txnBudgetRepo.createAndSave({
        month: monthDate,
        budgetAmount: payload.plannedAmount ?? 0,
        consumedAmount: payload.consumedAmount ?? 0,
        user
      });

      if (payload.items?.length) {
        let plannedTotal = Number(budget.budgetAmount);
        let consumedTotal = Number(budget.consumedAmount ?? 0);

        for (const item of payload.items) {
          if (!item.categoryId) {
            throw new ValidationError(
              "Category ID is required for budget items"
            );
          }
          if (typeof item.budgetAmount !== "number") {
            throw new ValidationError(
              "Budget amount is required for each item"
            );
          }
          const category = await txnCategoryRepo.findByPublicIdForUser(
            item.categoryId,
            user.id
          );
          if (!category) {
            throw new ResourceNotFoundError("Category");
          }

          const createdItem = await txnBudgetItemRepo.createAndSave({
            budget,
            category,
            budgetAmount: item.budgetAmount,
            consumedAmount: item.consumedAmount ?? 0
          });

          plannedTotal += Number(createdItem.budgetAmount);
          consumedTotal += Number(createdItem.consumedAmount ?? 0);
        }

        budget.budgetAmount = plannedTotal;
        budget.consumedAmount = consumedTotal;
        await txnBudgetRepo.save(budget);
      }

      const hydratedBudget =
        (await txnBudgetRepo.findByPublicIdWithItems(
          budget.publicId,
          user.id
        )) ?? budget;

      return mapBudgetToResponse(hydratedBudget);
    };

    return dataContext instanceof EntityManager
      ? execute(dataContext as EntityManager)
      : runTransaction({ label: "Create Budget" }, execute);
  };

  const createBudgetItem = async (
    payload: CreateBudgetItemPayload,
    auth: AppAuth
  ) => {
    const execute = async (manager: EntityManager) => {
      const txnBudgetRepo = new BudgetRepository(manager);
      const txnBudgetItemRepo = new BudgetItemRepository(manager);
      const txnCategoryRepo = new CategoryRepository(manager);
      const { getUserIdentity } = createUserService(manager);

      const userId = auth?.userId;

      if (!userId) {
        throw new AuthenticationError("User not authenticated");
      }
      const user = await getUserIdentity(userId);

      if (!payload.budgetId) {
        throw new ValidationError("Budget ID is required");
      }
      if (!payload.categoryId) {
        throw new ValidationError("Category ID is required");
      }
      if (typeof payload.budgetAmount !== "number") {
        throw new ValidationError("budgetAmount must be a number");
      }

      const budget = await txnBudgetRepo.findByPublicIdWithItems(
        payload.budgetId,
        user.id
      );
      if (!budget) {
        throw new ResourceNotFoundError("Budget");
      }

      const category = await txnCategoryRepo.findByPublicIdForUser(
        payload.categoryId,
        user.id
      );
      if (!category) {
        throw new ResourceNotFoundError("Category");
      }

      const createdItem = await txnBudgetItemRepo.createAndSave({
        budget,
        category,
        budgetAmount: payload.budgetAmount,
        consumedAmount: payload.consumedAmount ?? 0
      });

      budget.budgetAmount =
        Number(budget.budgetAmount) + Number(createdItem.budgetAmount);
      budget.consumedAmount =
        Number(budget.consumedAmount ?? 0) +
        Number(createdItem.consumedAmount ?? 0);

      await txnBudgetRepo.save(budget);

      const hydratedBudget =
        (await txnBudgetRepo.findByPublicIdWithItems(
          budget.publicId,
          user.id
        )) ?? budget;

      return {
        item: mapBudgetItemToResponse(createdItem),
        budget: mapBudgetToResponse(hydratedBudget)
      };
    };

    return dataContext instanceof EntityManager
      ? execute(dataContext as EntityManager)
      : runTransaction({ label: "Create Budget Item" }, execute);
  };

  return {
    createBudget,
    createBudgetItem
  };
};
