import { prisma } from "@/lib/prisma";
import type { ListProductsQuery } from "../types";

export const productRepository = {
  findAll(filter: ListProductsQuery = {}) {
    return prisma.product.findMany({
      where: filter.categoryId ? { categoryId: filter.categoryId } : undefined,
      orderBy: { createdAt: "desc" },
    });
  },
};
