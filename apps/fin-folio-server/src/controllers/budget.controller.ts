import { asyncHandler } from "@/middlewares";
import { budgetService } from "@/services";
import type { CreateBudgetItemPayload, CreateBudgetPayload } from "@/types";
import { NextFunction, Request, RequestHandler, Response } from "express";

export const createBudget: RequestHandler = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { month, plannedAmount, consumedAmount, items } =
      req.body as Partial<CreateBudgetPayload>;

    const payload: CreateBudgetPayload = {
      month: month ?? "",
      plannedAmount,
      consumedAmount,
      items
    };

    const budget = await budgetService.createBudget(payload, req.appAuth!);

    return res.status(201).json({
      meta: { success: true },
      message: "Budget created successfully",
      data: { budget }
    });
  }
);

export const createBudgetItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { categoryId, budgetAmount, consumedAmount, budgetId } =
      req.body as Partial<CreateBudgetItemPayload>;

    const payload: CreateBudgetItemPayload = {
      budgetId: req.params.budgetId || budgetId || "",
      categoryId: categoryId ?? "",
      budgetAmount: budgetAmount ?? 0,
      consumedAmount
    };

    const result = await budgetService.createBudgetItem(payload, req.appAuth!);

    return res.status(201).json({
      meta: { success: true },
      message: "Budget item created successfully",
      data: result
    });
  }
);
