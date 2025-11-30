import { AppDataSource } from "@/data-source";
import { Category } from "@/models/Category";
import { DataSource, EntityManager, FindOneOptions } from "typeorm";
import { BaseRepository } from "./base.repository";

export class CategoryRepository extends BaseRepository<Category> {
  constructor(context: DataSource | EntityManager = AppDataSource) {
    super(context, Category);
  }

  findByPublicIdForUser(
    publicId: string,
    userId: number
  ): Promise<Category | null> {
    const options: FindOneOptions<Category> = {
      where: {
        publicId,
        user: { id: userId }
      },
      relations: { user: true }
    };

    return this.findOne(options);
  }

  findByTitleForUser(title: string, userId: number): Promise<Category | null> {
    const options: FindOneOptions<Category> = {
      where: {
        title,
        user: { id: userId }
      }
    };

    return this.findOne(options);
  }
}
