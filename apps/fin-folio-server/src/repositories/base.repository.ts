import { AppDataSource } from "@/data-source";
import {
  DataSource,
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  Repository
} from "typeorm";

export class BaseRepository<T extends ObjectLiteral> {
  protected readonly repository: Repository<T>;

  constructor(
    protected readonly context: DataSource | EntityManager = AppDataSource,
    entity: EntityTarget<T>
  ) {
    this.repository = context.getRepository(entity) as Repository<T>;
  }

  async createAndSave(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async findAll(options: FindManyOptions<T> = {}): Promise<T[]> {
    return this.repository.find(options);
  }

  async update(criteria: Partial<T>, data: Partial<T>): Promise<void> {
    await this.repository.update(criteria, data);
  }

  async updateById(id: number, data: Partial<T>): Promise<void> {
    await this.repository.update(id, data);
  }

  async delete(criteria: Partial<T>): Promise<void> {
    await this.repository.delete(criteria);
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }

  async findAllWithPagination(
    options: FindManyOptions<T> = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<{ data: T[]; total: number }> {
    const limit = pagination.limit ?? 10;
    const page = pagination.page ?? 1;
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      ...options,
      skip,
      take: limit
    });
    return { data, total };
  }
}
