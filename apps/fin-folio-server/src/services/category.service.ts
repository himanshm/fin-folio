import { AppDataSource } from "@/data-source";
import {
  CategoryBucket,
  CategoryOrigin,
  CategoryType
} from "@/enums/CategoryType";
import { Category } from "@/models/Category";
import { CategoryRepository } from "@/repositories";
import type { AppAuth, ClientBucket, CreateCategoryPayload } from "@/types";
import {
  AuthenticationError,
  BUCKET_ENUM_TO_CATEGORY_TYPE,
  CATEGORY_TYPE_TO_BUCKET,
  CLIENT_BUCKET_TO_ENUM,
  ENUM_BUCKET_TO_CLIENT,
  ValidationError,
  runTransaction
} from "@/utils";
import { DataSource, EntityManager } from "typeorm";
import { createUserService } from "./user.service";

const normalizeBucket = (bucket?: string): CategoryBucket | undefined => {
  if (!bucket) return undefined;
  const normalized = bucket.trim().toLowerCase() as ClientBucket;
  return CLIENT_BUCKET_TO_ENUM[normalized];
};

const normalizeCategoryType = (type?: string): CategoryType | undefined => {
  if (!type) {
    return undefined;
  }
  const normalized = type.trim().toUpperCase();
  if ((CategoryType as Record<string, string>)[normalized]) {
    return CategoryType[normalized as keyof typeof CategoryType];
  }
  return undefined;
};

const mapCategoryToResponse = (category: Category) => ({
  id: category.publicId,
  title: category.title,
  type: category.type,
  bucket: ENUM_BUCKET_TO_CLIENT[category.bucket] ?? "needs",
  origin: category.origin,
  accumulatedAmount: Number(category.accumulatedAmount ?? 0)
});

export const createCategoryService = (
  dataContext: DataSource | EntityManager = AppDataSource
) => {
  const createCategory = async (
    payload: CreateCategoryPayload,
    auth: AppAuth
  ) => {
    console.log("auth", auth);
    const userId = auth?.userId;

    if (!userId) {
      throw new AuthenticationError("User not authenticated");
    }
    const execute = async (manager: EntityManager) => {
      const txnCategoryRepo = new CategoryRepository(manager);
      const { getUserIdentity } = createUserService(manager);
      const user = await getUserIdentity(userId);

      const title = payload.title?.trim();
      if (!title) {
        throw new ValidationError("Category title is required");
      }

      const normalizedType = normalizeCategoryType(payload.type);

      const normalizedBucket =
        normalizeBucket(payload.bucket) ??
        (normalizedType
          ? CATEGORY_TYPE_TO_BUCKET[normalizedType]
          : undefined) ??
        CategoryBucket.NEEDS;

      const resolvedType =
        normalizedType ?? BUCKET_ENUM_TO_CATEGORY_TYPE[normalizedBucket];

      const existingCategory = await txnCategoryRepo.findByTitleForUser(
        title,
        user.id
      );
      if (existingCategory) {
        throw new ValidationError("Category with this title already exists");
      }

      const category = await txnCategoryRepo.createAndSave({
        title,
        type: resolvedType,
        bucket: normalizedBucket,
        accumulatedAmount: payload.accumulatedAmount ?? 0,
        origin: payload.origin ?? CategoryOrigin.USER,
        user
      });

      return mapCategoryToResponse(category);
    };

    return dataContext instanceof EntityManager
      ? execute(dataContext)
      : runTransaction({ label: "Create Category" }, execute);
  };

  return {
    createCategory
  };
};
