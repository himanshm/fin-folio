import { AppDataSource } from "@/data-source";
import { UserSession } from "@/models/UserSession";
import { DataSource, EntityManager } from "typeorm";
import { BaseRepository } from "./base.repository";

export class UserSessionRepository extends BaseRepository<UserSession> {
  constructor(context: DataSource | EntityManager = AppDataSource) {
    super(context, UserSession);
  }
}
