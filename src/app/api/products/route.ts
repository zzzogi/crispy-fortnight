import { prisma } from "../../libs/prisma";
import { Type } from "../../../../generated/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const limit = searchParams.get("limit") || undefined;
  const offset = searchParams.get("offset") || undefined;
  const search = searchParams.get("search") || undefined;
  const type = searchParams.get("type") || undefined;
  const priceDesc = searchParams.get("priceDesc") || undefined;
  const priceAsc = searchParams.get("priceAsc") || undefined;

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: search || undefined,
        mode: "insensitive",
      },
      type: {
        equals: type as Type | undefined,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit ? parseInt(limit as string) : undefined,
    skip: offset ? parseInt(offset as string) : undefined,
    ...(priceDesc && {
      orderBy: { price: "desc" },
    }),
    ...(priceAsc && {
      orderBy: { price: "asc" },
    }),
  });
  return NextResponse.json(
    {
      products: products,
      total: products.length,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, price, available, description, imageUrl, category, type } =
    body;
  const product = await prisma.product.create({
    data: {
      name,
      price,
      available,
      description,
      imageUrl,
      category,
      type,
    },
  });
  return NextResponse.json(product, {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, name, price, available, description, imageUrl, category, type } =
    body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      available,
      description,
      imageUrl,
      category,
      type,
    },
  });
  return NextResponse.json(product, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
  const product = await prisma.product.delete({
    where: { id },
  });
  return NextResponse.json(product, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
