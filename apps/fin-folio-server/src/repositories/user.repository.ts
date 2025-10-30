import { AppDataSource } from "@/data-source";
import { User } from "@/models/User";
import { DataSource, EntityManager } from "typeorm";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<User> {
  constructor(context: DataSource | EntityManager = AppDataSource) {
    super(context, User);
  }

  findOneByPublicIdForAuth(publicId: string): Promise<User | null> {
    const filter = {
      where: {
        publicId
      },
      select: {
        id: true,
        publicId: true,
        email: true,
        password: true
      }
    };
    return this.findOne(filter);
  }

  findOneByEmailForAuth(email: string): Promise<User | null> {
    const filter = {
      where: {
        email
      },
      select: {
        id: true,
        publicId: true,
        name: true,
        email: true,
        password: true,
        refreshTokenVersion: true
      }
    };
    return this.findOne(filter);
  }
}
