import { AppDataSource } from "@/data-source";
import { UserSession } from "@/models/UserSession";
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  MoreThan
} from "typeorm";
import { BaseRepository } from "./base.repository";

export class UserSessionRepository extends BaseRepository<UserSession> {
  constructor(context: DataSource | EntityManager = AppDataSource) {
    super(context, UserSession);
  }

  findOneByUserIdForAuth(userId: number): Promise<UserSession | null> {
    const filter: FindOneOptions<UserSession> = {
      where: {
        user: {
          id: userId
        },
        revoked: false
      }
    };
    return this.findOne(filter);
  }

  findOneBySessionIdForAuth(sessionId: string): Promise<UserSession | null> {
    const filter: FindOneOptions<UserSession> = {
      where: {
        id: sessionId,
        revoked: false,
        expiresAt: MoreThan(new Date())
      },
      relations: { user: true }
    };
    return this.findOne(filter);
  }

  findAllActiveByUserIdForAuth(userId: number): Promise<UserSession[]> {
    const filter: FindManyOptions<UserSession> = {
      where: {
        user: { id: userId },
        revoked: false,
        expiresAt: MoreThan(new Date())
      }
    };
    return this.findAll(filter);
  }
}
