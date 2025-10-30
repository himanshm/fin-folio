import { PinoTypeOrmLogger } from "@/utils";
import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./config";
import { Budget } from "./models/Budget";
import { BudgetItem } from "./models/BudgetItem";
import { Category } from "./models/Category";
import { Investment } from "./models/Investment";
import { Transaction } from "./models/Transaction";
import { User } from "./models/User";
import { UserSession } from "./models/UserSession";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.postgres.host,
  port: config.postgres.port,
  username: config.postgres.username,
  password: config.postgres.password,
  database: config.postgres.database,
  synchronize: true,
  logging: true,
  logger: new PinoTypeOrmLogger(),
  maxQueryExecutionTime: 1000,
  entities: [
    User,
    Budget,
    Transaction,
    BudgetItem,
    Category,
    UserSession,
    Investment
  ],
  migrations: [],
  subscribers: []
});
