import { AppDataSource } from "@/data-source";
import { createAuthService } from "./auth.service";

/**
 * Singleton services - created once at module load, reused across all requests
 *
 * These services use AppDataSource by default, which is fine for most operations.
 * When services need transactions, they handle it internally via runTransaction.
 */
export const authService = createAuthService(AppDataSource);

// Future services would be added here:
// export const userService = createUserService(AppDataSource);
// export const transactionService = createTransactionService(AppDataSource);
// export const budgetService = createBudgetService(AppDataSource);
