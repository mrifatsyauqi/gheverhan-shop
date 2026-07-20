import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  categoryId: z.string(),
  createdAt: z.date(),
});

export const listProductsQuerySchema = z.object({
  categoryId: z.string().optional(),
});
