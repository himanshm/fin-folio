import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPercent = (part: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 100));
};
