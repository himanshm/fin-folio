import { AppDataSource } from "@/data-source";
import { BudgetItemRepository } from "./budget-item.repository";
import { BudgetRepository } from "./budget.repository";
import { CategoryRepository } from "./category.repository";
import { UserSessionRepository } from "./session.repository";
import { UserRepository } from "./user.repository";

// Export classes for use in services that need to create instances with custom contexts
export {
    BudgetItemRepository,
    BudgetRepository,
    CategoryRepository,
    UserRepository,
    UserSessionRepository
};

// Export singleton instances for use in controllers/middlewares (default DataSource)
const userRepository = new UserRepository(AppDataSource);
const userSessionRepository = new UserSessionRepository(AppDataSource);
const categoryRepository = new CategoryRepository(AppDataSource);
const budgetRepository = new BudgetRepository(AppDataSource);
const budgetItemRepository = new BudgetItemRepository(AppDataSource);

export {
    budgetItemRepository,
    budgetRepository,
    categoryRepository,
    userRepository,
    userSessionRepository
};

