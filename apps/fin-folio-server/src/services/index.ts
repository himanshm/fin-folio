import { AppDataSource } from "@/data-source";
import { createAuthService } from "./auth.service";
import { createBudgetService } from "./budget.service";
import { createCategoryService } from "./category.service";
import { createUserService } from "./user.service";

export const authService = createAuthService(AppDataSource);
export const categoryService = createCategoryService(AppDataSource);
export const budgetService = createBudgetService(AppDataSource);
export const userService = createUserService(AppDataSource);
