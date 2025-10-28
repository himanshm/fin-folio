import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from './config';
import { Budget } from './models/Budget';
import { BudgetItem } from './models/BudgetItem';
import { Category } from './models/Category';
import { Transaction } from './models/Transaction';
import { User } from './models/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.postgres.host,
  port: config.postgres.port,
  username: config.postgres.username,
  password: config.postgres.password,
  database: config.postgres.database,
  synchronize: true,
  logging: false,
  entities: [User, Budget, Transaction, BudgetItem, Category],
  migrations: [],
  subscribers: []
});
