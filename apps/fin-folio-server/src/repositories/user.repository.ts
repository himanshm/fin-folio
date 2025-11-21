import { AppDataSource } from "@/data-source";
import { User } from "@/models/User";
import { DataSource, EntityManager, FindOneOptions } from "typeorm";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<User> {
  constructor(context: DataSource | EntityManager = AppDataSource) {
    super(context, User);
  }

  findOneByPublicIdForAuth(publicId: string): Promise<User | null> {
    const filter: FindOneOptions<User> = {
      where: {
        publicId
      },
      select: {
        id: true,
        publicId: true,
        email: true,
        refreshTokenVersion: true
      }
    };
    return this.findOne(filter);
  }

  findOneByEmailForAuth(email: string): Promise<User | null> {
    const filter: FindOneOptions<User> = {
      where: {
        email
      },
      select: {
        id: true,
        publicId: true,
        name: true,
        email: true,
        password: true,
        refreshTokenVersion: true,
        currency: true,
        currencySymbol: true,
        locale: true
      }
      // relations: { sessions: true }
    };
    return this.findOne(filter);
  }

  findOneByPublicIdForProfile(publicId: string): Promise<User | null> {
    const filter: FindOneOptions<User> = {
      where: {
        publicId
      },
      select: {
        id: true,
        publicId: true,
        name: true,
        email: true,
        avatarUrl: true,
        country: true,
        currency: true,
        currencySymbol: true
      }
    };
    return this.findOne(filter);
  }
}
