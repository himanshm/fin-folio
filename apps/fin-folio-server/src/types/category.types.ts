import {
  CategoryBucket,
  CategoryOrigin,
  CategoryType
} from "@/enums/CategoryType";

export type ClientBucket =
  | "needs"
  | "wants"
  | "savings"
  | "income"
  | "debt"
  | "investment";

export interface CreateCategoryPayload {
  title: string;
  type?: CategoryType | string;
  bucket?: CategoryBucket | string;
  accumulatedAmount?: number;
  origin?: CategoryOrigin;
}
