import type { z } from "zod";
import type { listProductsQuerySchema, productSchema } from "./schema";

export type Product = z.infer<typeof productSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
