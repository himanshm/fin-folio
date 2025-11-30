import { AppDataSource } from "@/data-source";
import { Budget } from "@/models/Budget";
import { DataSource, EntityManager, FindOneOptions } from "typeorm";
import { BaseRepository } from "./base.repository";

export class BudgetRepository extends BaseRepository<Budget> {
  constructor(context: DataSource | EntityManager = AppDataSource) {
    super(context, Budget);
  }

  findByPublicIdForUser(
    publicId: string,
    userId: number
  ): Promise<Budget | null> {
    const options: FindOneOptions<Budget> = {
      where: {
        publicId,
        user: { id: userId }
      },
      relations: { user: true }
    };

    return this.findOne(options);
  }

  findByUserAndMonth(userId: number, month: Date): Promise<Budget | null> {
    const options: FindOneOptions<Budget> = {
      where: {
        user: { id: userId },
        month
      }
    };

    return this.findOne(options);
  }

  findByPublicIdWithItems(
    publicId: string,
    userId: number
  ): Promise<Budget | null> {
    const options: FindOneOptions<Budget> = {
      where: {
        publicId,
        user: { id: userId }
      },
      relations: {
        user: true,
        items: {
          category: true
        }
      }
    };

    return this.findOne(options);
  }
}
