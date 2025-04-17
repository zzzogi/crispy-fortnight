import { prisma } from "../../libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const limit = searchParams.get("limit") || undefined;
  const offset = searchParams.get("offset") || undefined;
  const search = searchParams.get("search") || undefined;

  const contacts = await prisma.contact.findMany({
    where: {
      name: {
        contains: search || undefined,
        mode: "insensitive",
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
      contacts: contacts,
      total: await prisma.contact.count(),
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
  const { name, email, phone, subject, message } = body;
  const contact = await prisma.contact.create({
    data: {
      name,
      email,
      phone,
      subject: subject ? subject : "Thư không có chủ đề",
      message,
    },
  });
  return NextResponse.json(contact, {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
  const contact = await prisma.contact.delete({
    where: {
      id,
    },
  });
  return NextResponse.json(contact, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
