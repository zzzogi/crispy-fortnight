import { prisma } from "../../libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const limit = searchParams.get("limit") || undefined;
  const offset = searchParams.get("offset") || undefined;
  const search = searchParams.get("search") || undefined;
  const priceDesc = searchParams.get("priceDesc") || undefined;
  const priceAsc = searchParams.get("priceAsc") || undefined;

  const gifts = await prisma.gift.findMany({
    where: {
      name: {
        contains: search || undefined,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    ...(priceDesc && {
      orderBy: { price: "desc" },
    }),
    ...(priceAsc && {
      orderBy: { price: "asc" },
    }),
    take: limit ? parseInt(limit as string) : undefined,
    skip: offset ? parseInt(offset as string) : undefined,
  });
  return NextResponse.json(
    {
      gifts: gifts,
      total: await prisma.gift.count(),
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
  const { name, price, available, description, imageUrl, category } = body;
  const gift = await prisma.gift.create({
    data: {
      name,
      price,
      available,
      description,
      imageUrl,
      category,
    },
  });
  return NextResponse.json(gift, {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, name, price, available, description, imageUrl, category } = body;

  const gift = await prisma.gift.update({
    where: { id },
    data: {
      name,
      price,
      available,
      description,
      imageUrl,
      category,
    },
  });
  return NextResponse.json(gift, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
  const gift = await prisma.gift.delete({
    where: { id },
  });
  return NextResponse.json(gift, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
