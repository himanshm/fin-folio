import { AppDataSource } from "@/data-source";
import { BudgetItem } from "@/models/BudgetItem";
import { DataSource, EntityManager, FindOneOptions } from "typeorm";
import { BaseRepository } from "./base.repository";

export class BudgetItemRepository extends BaseRepository<BudgetItem> {
  constructor(context: DataSource | EntityManager = AppDataSource) {
    super(context, BudgetItem);
  }

  findByPublicIdForBudget(
    publicId: string,
    budgetId: number
  ): Promise<BudgetItem | null> {
    const options: FindOneOptions<BudgetItem> = {
      where: {
        publicId,
        budget: { id: budgetId }
      },
      relations: {
        budget: true,
        category: true
      }
    };

    return this.findOne(options);
  }
}
