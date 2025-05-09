// app/api/admin/banners/route.ts
import { authOptions } from "@/app/libs/authOptions";
import { prisma } from "@/app/libs/prisma";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Configure S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper function to get MIME type from file extension
function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };
  return mimeTypes[ext || ""] || "application/octet-stream";
}

// Helper function to create a slug from text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// GET /api/admin/banners - Retrieve all banners
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: {
        id: "desc", // You can change to createdAt when added
      },
    });

    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

// POST /api/admin/banners - Create a new banner
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const caption = formData.get("caption") as string;
    const imageFile = formData.get("image") as File | null;

    let imageUrl = null;

    // Upload image to S3 if provided
    if (imageFile) {
      // Create a unique key for the banner image
      const fileExtension = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${slugify(caption)}`;
      const key = `banners/${fileName}.${fileExtension}`;

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: getMimeType(imageFile.name),
        ACL: "public-read", // Make the file publicly accessible
      });

      await s3Client.send(command);

      // Construct the URL for the uploaded image
      imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
    }

    // Create banner in database
    const banner = await prisma.banner.create({
      data: {
        imageUrl,
        caption: caption || null,
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create banner" },
      { status: 500 }
    );
  }
}
