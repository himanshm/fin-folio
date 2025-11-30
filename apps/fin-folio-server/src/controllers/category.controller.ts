import { asyncHandler } from "@/middlewares";
import { categoryService } from "@/services";
import type { CreateCategoryPayload } from "@/types";
import { NextFunction, Request, RequestHandler, Response } from "express";

export const createCategory: RequestHandler = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { title, type, bucket, accumulatedAmount, origin } =
      req.body as Partial<CreateCategoryPayload>;

    const payload: CreateCategoryPayload = {
      title: title ?? "",
      type,
      bucket,
      accumulatedAmount,
      origin
    };

    const category = await categoryService.createCategory(
      payload,
      req.appAuth!
    );

    return res.status(201).json({
      meta: { success: true },
      message: "Category created successfully",
      data: { category }
    });
  }
);
