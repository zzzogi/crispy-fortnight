// app/api/admin/banners/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { prisma } from "@/app/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/libs/authOptions";

// Initialize S3 client
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

// GET /api/admin/banners/[id] - Retrieve a specific banner
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const id = (await context.params).id;

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

    // Get the current banner
    const currentBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!currentBanner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    let imageUrl = currentBanner.imageUrl;

    // Upload new image to S3 if provided
    if (imageFile) {
      // If there's an existing image, delete it from S3
      if (currentBanner.imageUrl) {
        // Extract key from URL
        const oldImageUrl = new URL(currentBanner.imageUrl);
        const key = oldImageUrl.pathname.substring(1); // Remove leading slash

        try {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
            Key: key,
          });
          await s3Client.send(deleteCommand);
        } catch (error) {
          console.error("Error deleting old image:", error);
          // Continue even if delete fails
        }
      }

      // Upload new image
      const fileExtension = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${slugify(imageFile.name)}`;
      const key = `banners/${fileName}.${fileExtension}`;

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: getMimeType(imageFile.name),
        ACL: "public-read",
      });

      await s3Client.send(command);

      // Construct the URL for the uploaded image
      imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
    }

    // Update banner in database
    const updateprismaanner = await prisma.banner.update({
      where: { id },
      data: {
        imageUrl,
        caption: caption || null,
      },
    });

    return NextResponse.json({ success: true, banner: updateprismaanner });
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update banner" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/banners/[id] - Delete a banner
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params.id;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the current banner
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    // Delete image from S3 if exists
    if (banner.imageUrl) {
      try {
        // Extract key from URL
        const oldImageUrl = new URL(banner.imageUrl);
        const key = oldImageUrl.pathname.substring(1); // Remove leading slash

        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
          Key: key,
        });
        await s3Client.send(deleteCommand);
      } catch (error) {
        console.error("Error deleting image from S3:", error);
        // Continue even if delete fails
      }
    }

    // Delete banner from database
    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
