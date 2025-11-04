import { AppDataSource } from "@/data-source";
import { logger } from "@/utils";
import { DatabaseError, ResourceNotFoundError } from "@/utils/custom-error";
import {
  DataSource,
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository
} from "typeorm";

export class BaseRepository<T extends ObjectLiteral> {
  protected readonly repository: Repository<T>;
  protected readonly entityName: string;

  constructor(
    protected readonly context: DataSource | EntityManager = AppDataSource,
    entity: EntityTarget<T>
  ) {
    this.repository = context.getRepository(entity) as Repository<T>;
    this.entityName =
      typeof entity === "string"
        ? entity
        : typeof entity === "function"
          ? entity.name
          : "Entity";
  }

  /**
   * Creates and saves an entity in one operation
   */
  async createAndSave(data: DeepPartial<T>): Promise<T> {
    try {
      console.log({
        componentName: "BaseRepository",
        method: "createAndSave",
        entityName: this.entityName,
        data
      });
      const entity = this.repository.create(data);
      const saved = await this.repository.save(entity);
      logger.debug(
        { entityName: this.entityName, id: (saved as T & { id?: unknown }).id },
        `BaseRepository ===> Created and saved ${this.entityName}`
      );
      return saved;
    } catch (error) {
      logger.error(
        { entityName: this.entityName, error, data },
        `BaseRepository ===> Failed to create and save ${this.entityName}`
      );
      throw new DatabaseError(
        `Failed to create ${this.entityName}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Creates an entity instance without saving (synchronous)
   */
  create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }

  /**
   * Saves an entity to the database
   */
  async save(entity: T): Promise<T> {
    try {
      console.log({
        componentName: "BaseRepository",
        method: "save",
        entityName: this.entityName,
        entity
      });
      const saved = await this.repository.save(entity);
      logger.debug(
        { entityName: this.entityName, id: (saved as T & { id?: unknown }).id },
        `BaseRepository ===> Saved ${this.entityName}`
      );
      return saved;
    } catch (error) {
      logger.error(
        { entityName: this.entityName, error, entity },
        `BaseRepository ===> Failed to save ${this.entityName}`
      );
      throw new DatabaseError(
        `Failed to save ${this.entityName}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Finds a single entity by options
   */
  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    try {
      const entity = await this.repository.findOne(options);
      return entity;
    } catch (error) {
      logger.error(
        { entityName: this.entityName, error, options },
        `BaseRepository ===> Failed to find ${this.entityName}`
      );
      throw new DatabaseError(
        `Failed to find ${this.entityName}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Finds a single entity by ID
   */
  async findById(id: number | string): Promise<T | null> {
    try {
      return await this.repository.findOne({
        where: { id } as unknown as FindOptionsWhere<T>
      });
    } catch (error) {
      logger.error(
        { entityName: this.entityName, error, id },
        `BaseRepository ===> Failed to find ${this.entityName} by id`
      );
      throw new DatabaseError(
        `Failed to find ${this.entityName} by id: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Finds a single entity by ID or throws ResourceNotFoundError
   */
  async findByIdOrFail(id: number | string): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new ResourceNotFoundError(`${this.entityName} with id ${id}`);
    }
    return entity;
  }

  /**
   * Checks if an entity exists by ID
   */
  async exists(id: number | string): Promise<boolean> {
    try {
      const count = await this.repository.count({
        where: { id } as unknown as FindOptionsWhere<T>
      });
      return count > 0;
    } catch (error) {
      logger.error(
        { entityName: this.entityName, error, id },
        `BaseRepository ===> Failed to check existence of ${this.entityName}`
      );
      throw new DatabaseError(
        `Failed to check existence of ${this.entityName}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Finds all entities matching the options
   */
  async findAll(options: FindManyOptions<T> = {}): Promise<T[]> {
    try {
      return await this.repository.find(options);
    } catch (error) {
      logger.error(
        { entityName: this.entityName, error, options },
        `BaseRepository ===> Failed to find all ${this.entityName}`
      );
      throw new DatabaseError(
        `Failed to find all ${this.entityName}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Updates entities matching the criteria
   */
  async update(criteria: Partial<T>, data: Partial<T>): Promise<void> {
    try {
      console.log({
        componentName: "BaseRepository",
        method: "update",
        entityName: this.entityName,
        criteria,
        data
      });
      await this.repository.update(criteria, data);
      logger.debug(
        { entityName: this.entityName, criteria },
        `BaseRepository ===> Updated ${this.entityName}`
      );
    } catch (error) {
      logger.error(
        { entityName: this.entityName, error, criteria, data },
        `BaseRepository ===> Failed to update ${this.entityName}`
      );
      throw new DatabaseError(
        `Failed to update ${this.entityName}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Updates an entity by ID
   */
  async updateById(id: number | string, data: Partial<T>): Promise<void> {
    try {
      console.log({
        componentName: "BaseRepository",
        method: "updateById",
        entityName: this.entityName,
        id,
        data
      });
      await this.repository.update(id, data);
      logger.debug(
        { entityName: this.entityName, id },
        `BaseRepository ===> Updated ${this.entityName} by id`
      );
    } catch (error) {
      logger.error(
        { entityName: this.entityName, error, id, data },
        `BaseRepository ===> Failed to update ${this.entityName} by id`
      );
      throw new DatabaseError(
        `Failed to update ${this.entityName} by id: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Deletes entities matching the criteria
   */
  async delete(criteria: Partial<T>): Promise<void> {
    try {
      console.log({
        componentName: "BaseRepository",
        method: "delete",
        entityName: this.entityName,
        criteria
      });
      await this.repository.delete(criteria);
      logger.debug(
        { entityName: this.entityName, criteria },
        `BaseRepository ===> Deleted ${this.entityName}`
      );
    } catch (error) {
      logger.error(
        { entityName: this.entityName, error, criteria },
        `BaseRepository ===> Failed to delete ${this.entityName}`
      );
      throw new DatabaseError(
        `Failed to delete ${this.entityName}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Deletes an entity by ID
   */
  async deleteById(id: number | string): Promise<void> {
    try {
      console.log({
        componentName: "BaseRepository",
        method: "deleteById",
        entityName: this.entityName,
        id
      });
      await this.repository.delete(id);
      logger.debug(
        { entityName: this.entityName, id },
        `BaseRepository ===> Deleted ${this.entityName} by id`
      );
    } catch (error) {
      logger.error(
        { entityName: this.entityName, error, id },
        `BaseRepository ===> Failed to delete ${this.entityName} by id`
      );
      throw new DatabaseError(
        `Failed to delete ${this.entityName} by id: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Counts entities matching the options
   */
  async count(options?: FindManyOptions<T>): Promise<number> {
    try {
      return await this.repository.count(options);
    } catch (error) {
      logger.error(
        { entityName: this.entityName, error, options },
        `BaseRepository ===> Failed to count ${this.entityName}`
      );
      throw new DatabaseError(
        `Failed to count ${this.entityName}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Finds entities with pagination
   */
  async findAllWithPagination(
    options: FindManyOptions<T> = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    try {
      const limit = pagination.limit ?? 10;
      const page = pagination.page ?? 1;
      const skip = (page - 1) * limit;

      const [data, total] = await this.repository.findAndCount({
        ...options,
        skip,
        take: limit
      });

      logger.debug(
        { entityName: this.entityName, page, limit, total, count: data.length },
        `BaseRepository ===> Retrieved ${this.entityName} with pagination`
      );

      return { data, total, page, limit };
    } catch (error) {
      logger.error(
        { entityName: this.entityName, error, options, pagination },
        `BaseRepository ===> Failed to find ${this.entityName} with pagination`
      );
      throw new DatabaseError(
        `Failed to find ${this.entityName} with pagination: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Gets access to the underlying TypeORM repository for advanced operations
   */
  getRepository(): Repository<T> {
    return this.repository;
  }
}
