import { AppDataSource } from "@/data-source";
import { logger } from "@/utils";
import { EntityManager } from "typeorm";

interface TransactionOptions {
  label: string;
  silent?: boolean;
}

/**
 * Strongly-typed TypeORM transaction helper with pino logging and optional silence.
 */

export async function runTransaction<T>(
  options: TransactionOptions,
  fn: (manager: EntityManager) => Promise<T>
): Promise<T> {
  const { label, silent = false } = options;
  const startTime = Date.now();

  if (!silent) logger.info({ label }, `🟢 [${label}] Transaction started`);

  try {
    const result = await AppDataSource.transaction(async manager =>
      fn(manager)
    );
    const duration = Date.now() - startTime;
    if (!silent)
      logger.info({ label, duration }, `✅ [${label}] Transaction committed`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    if (!silent)
      logger.error(
        { label, duration, error },
        `🔴 [${label}] Transaction rolled back`
      );
    throw error;
  } finally {
    if (!silent) logger.debug({ label }, `⚪️ [${label}] Transaction finished`);
  }
}

export async function runManualTransaction<T>(
  options: TransactionOptions,
  fn: (manager: EntityManager) => Promise<T>
): Promise<T> {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  const { label, silent = false } = options;
  const startTime = Date.now();

  if (!silent) logger.info({ label }, `🟢 [${label}] Transaction started`);

  try {
    const result = await fn(queryRunner.manager);
    await queryRunner.commitTransaction();
    const duration = Date.now() - startTime;
    if (!silent)
      logger.info({ label, duration }, `✅ [${label}] Transaction committed`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    if (!silent)
      logger.error(
        { label, duration, error },
        `🔴 [${label}] Transaction rolled back`
      );
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
    if (!silent) logger.debug({ label }, `⚪️ [${label}] Transaction finished`);
  }
}
