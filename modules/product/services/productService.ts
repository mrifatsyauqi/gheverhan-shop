import { productRepository } from "../repository/productRepository";
import type { ListProductsQuery } from "../types";

export const productService = {
  listProducts(filter: ListProductsQuery = {}) {
    return productRepository.findAll(filter);
  },
};
