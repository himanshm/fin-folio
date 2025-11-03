import { logger } from "@/utils";
import type { QueryRunner, Logger as TypeOrmLogger } from "typeorm";
/**
 * Custom TypeORM Logger that routes logs through pino.
 */

export class PinoTypeOrmLogger implements TypeOrmLogger {
  /**
   * Removes escape characters from query string for cleaner logging
   */
  private formatQuery(query: string): string {
    // Remove escaped quotes and other common escape sequences
    return query
      .replace(/\\"/g, '"') // \" -> "
      .replace(/\\'/g, "'") // \' -> '
      .replace(/\\n/g, "\n") // \n -> actual newline
      .replace(/\\t/g, "\t") // \t -> actual tab
      .replace(/\\\\/g, "\\") // \\ -> \
      .trim();
  }

  logQuery(
    query: string,
    parameters?: unknown[],
    _queryRunner?: QueryRunner
  ): void {
    const formattedQuery = this.formatQuery(query);
    logger.debug(
      { parameters },
      "🧩 TypeORM Query\n    query: %s",
      formattedQuery
    );
  }

  logQueryError(
    error: unknown,
    query: string,
    parameters?: unknown[],
    _queryRunner?: QueryRunner
  ): void {
    const formattedQuery = this.formatQuery(query);
    logger.error(
      { error, parameters },
      "❌ TypeORM Query Error\n    query: %s",
      formattedQuery
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: unknown[],
    _queryRunner?: QueryRunner
  ): void {
    const formattedQuery = this.formatQuery(query);
    logger.warn(
      { time, parameters },
      "🐢 Slow Query (%dms)\n    query: %s",
      time,
      formattedQuery
    );
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
