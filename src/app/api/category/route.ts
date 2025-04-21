import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../libs/prisma";

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// CREATE new category
export async function POST(req: NextRequest) {
  try {
    const { name, label } = await req.json();

    if (!name || !label) {
      return NextResponse.json(
        { error: "Missing name or label" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name, label: label },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
