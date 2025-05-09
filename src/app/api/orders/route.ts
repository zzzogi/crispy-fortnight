/* eslint-disable  @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../libs/prisma";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const limit = searchParams.get("limit") || undefined;
  const offset = searchParams.get("offset") || undefined;
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;

  // First get the total count for pagination
  const totalCount = await prisma.order.count({
    where: {
      OR: search
        ? [
            { buyerName: { contains: search, mode: "insensitive" } },
            { buyerAddress: { contains: search, mode: "insensitive" } },
            { buyerEmail: { contains: search, mode: "insensitive" } },
            { buyerPhone: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
      ...(status && {
        status: {
          equals: status,
        },
      }),
    },
  });

  // Then get the orders with included items and products
  const orders = await prisma.order.findMany({
    where: {
      OR: search
        ? [
            { buyerName: { contains: search, mode: "insensitive" } },
            { buyerAddress: { contains: search, mode: "insensitive" } },
            { buyerEmail: { contains: search, mode: "insensitive" } },
            { buyerPhone: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
      ...(status && {
        status: {
          equals: status,
        },
      }),
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit ? parseInt(limit as string) : undefined,
    skip: offset ? parseInt(offset as string) : undefined,
  });

  return NextResponse.json(
    {
      orders: orders,
      total: totalCount,
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

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    buyerId,
    buyerName,
    buyerEmail,
    buyerPhone,
    buyerAddress,
    products,
    totalPrice,
  } = body;

  const order = await prisma.order.create({
    data: {
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerAddress,
      items: {
        create: products.map((product: any) => ({
          product: { connect: { id: product.id } },
          quantity: product.quantity,
        })),
      },
      totalPrice,
      totalItems: products.reduce(
        (acc: number, product: any) => acc + product.quantity,
        0
      ),
      status: "paid",
      userId: buyerId,
    },
  });
  return NextResponse.json(order, {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, status } = body;
  const order = await prisma.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
  return NextResponse.json(order, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { id } = body;
  const order = await prisma.order.delete({
    where: {
      id,
    },
  });
  return NextResponse.json(order, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
