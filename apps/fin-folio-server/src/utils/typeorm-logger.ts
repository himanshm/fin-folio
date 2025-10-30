import { logger } from "@/utils";
import type { QueryRunner, Logger as TypeOrmLogger } from "typeorm";
/**
 * Custom TypeORM Logger that routes logs through pino.
 */

export class PinoTypeOrmLogger implements TypeOrmLogger {
  logQuery(
    query: string,
    parameters?: unknown[],
    _queryRunner?: QueryRunner
  ): void {
    logger.debug({ query, parameters }, "🧩 TypeORM Query");
  }

  logQueryError(
    error: unknown,
    query: string,
    parameters?: unknown[],
    _queryRunner?: QueryRunner
  ): void {
    logger.error({ error, query, parameters }, "❌ TypeORM Query Error");
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: unknown[],
    _queryRunner?: QueryRunner
  ): void {
    logger.warn({ time, query, parameters }, "🐢 Slow Query");
  }

  logSchemaBuild(message: string, _queryRunner?: QueryRunner): void {
    logger.info({ message }, "🏗️ Schema Build");
  }

  logMigration(message: string, _queryRunner?: QueryRunner): void {
    logger.info({ message }, "🧭 Migration");
  }

  log(
    level: "log" | "info" | "warn",
    message: unknown,
    _queryRunner?: QueryRunner
  ): void {
    if (level === "log" || level === "info")
      logger.info({ message }, "ℹ️ TypeORM");
    else if (level === "warn") logger.warn({ message }, "⚠️ TypeORM");
  }
}
