import { CategoryBucket, CategoryType } from "@/enums/CategoryType";
import { ClientBucket } from "@/types";

export const EMAIL_VALIDATION_REGEX =
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const EMAIL_VALIDATION_MESSAGE =
  "Use an email with alphanumeric characters, dots, underscores, percent signs, plus signs, or hyphens before @, followed by a valid domain with at least 2 letters after the dot";

export const PASSWORD_VALIDATION_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

export const PASSWORD_VALIDATION_MESSAGE =
  "Password must contain at least 8 characters, including at least one letter and one number";

export const CLIENT_BUCKET_TO_ENUM: Record<ClientBucket, CategoryBucket> = {
  needs: CategoryBucket.NEEDS,
  wants: CategoryBucket.WANTS,
  savings: CategoryBucket.SAVINGS,
  income: CategoryBucket.INCOME,
  debt: CategoryBucket.DEBT,
  investment: CategoryBucket.INVESTMENT
};

export const ENUM_BUCKET_TO_CLIENT: Record<CategoryBucket, ClientBucket> = {
  [CategoryBucket.NEEDS]: "needs",
  [CategoryBucket.WANTS]: "wants",
  [CategoryBucket.SAVINGS]: "savings",
  [CategoryBucket.INCOME]: "income",
  [CategoryBucket.DEBT]: "debt",
  [CategoryBucket.INVESTMENT]: "investment"
};

export const BUCKET_ENUM_TO_CATEGORY_TYPE: Record<
  CategoryBucket,
  CategoryType
> = {
  [CategoryBucket.NEEDS]: CategoryType.EXPENSE,
  [CategoryBucket.WANTS]: CategoryType.EXPENSE,
  [CategoryBucket.SAVINGS]: CategoryType.SAVINGS,
  [CategoryBucket.INCOME]: CategoryType.INCOME,
  [CategoryBucket.DEBT]: CategoryType.DEBT,
  [CategoryBucket.INVESTMENT]: CategoryType.INVESTMENT
};

export const CATEGORY_TYPE_TO_BUCKET: Record<CategoryType, CategoryBucket> = {
  [CategoryType.EXPENSE]: CategoryBucket.NEEDS,
  [CategoryType.INCOME]: CategoryBucket.INCOME,
  [CategoryType.SAVINGS]: CategoryBucket.SAVINGS,
  [CategoryType.DEBT]: CategoryBucket.DEBT,
  [CategoryType.INVESTMENT]: CategoryBucket.INVESTMENT
};
