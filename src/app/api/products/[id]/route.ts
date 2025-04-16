import { prisma } from "../../../libs/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const id = (await context.params).id;
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    return NextResponse.json(
      { message: "Product not found" },
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  return NextResponse.json(product, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
