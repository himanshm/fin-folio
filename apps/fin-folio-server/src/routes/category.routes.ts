import { createCategory } from "@/controllers/category.controller";
import { Router } from "express";

const categoryRouter: Router = Router();

categoryRouter.post("/", createCategory);

export default categoryRouter;
