import {
    createBudget,
    createBudgetItem
} from "@/controllers/budget.controller";
import { Router } from "express";

const budgetRouter: Router = Router();

budgetRouter.post("/", createBudget);
budgetRouter.post("/:budgetId/items", createBudgetItem);

export default budgetRouter;
