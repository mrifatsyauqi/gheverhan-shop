import { NextRequest, NextResponse } from "next/server";
import { listProductsQuerySchema } from "@/modules/product/schema";
import { productService } from "@/modules/product/services/productService";

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = listProductsQuerySchema.safeParse(searchParams);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const products = await productService.listProducts(parsed.data);
  return NextResponse.json(products);
}
