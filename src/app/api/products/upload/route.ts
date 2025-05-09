import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

// Configure S3 client
const s3Client = new S3Client({
  region:
    process.env.NODE_ENV === "production"
      ? process.env.AWS_REGION!
      : process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId:
      process.env.NODE_ENV === "production"
        ? process.env.AWS_ACCESS_KEY_ID!
        : process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey:
      process.env.NODE_ENV === "production"
        ? process.env.AWS_SECRET_ACCESS_KEY!
        : process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
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

function slugify(text: string): string {
  return text
    .toLowerCase() // lowercase
    .normalize("NFD") // remove accents
    .replace(/[\u0300-\u036f]/g, "") // remove accent marks
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .trim() // remove leading/trailing spaces
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/-+/g, "-"); // collapse multiple dashes
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const productName = formData.get("productName") as string;

    if (!productName) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Create a unique folder name using product ID
    const folderName = `products/${slugify(productName)}/`;

    const imageFiles = formData.getAll("images") as File[];
    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json(
        { error: "No images were uploaded" },
        { status: 400 }
      );
    }

    const uploadedUrls = [];

    // Upload each image to S3
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileExtension = file.name.split(".").pop();
      const fileName = `${i + 1}.${fileExtension}`;
      const key = folderName + fileName;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket:
          process.env.NODE_ENV === "production"
            ? process.env.AWS_S3_BUCKET!
            : process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: getMimeType(file.name),
        ACL: "public-read", // Make the file publicly accessible
      });

      await s3Client.send(command);

      // Construct the URL for the uploaded image
      const imageUrl = `https://${
        process.env.NODE_ENV === "production"
          ? process.env.AWS_S3_BUCKET
          : process.env.NEXT_PUBLIC_AWS_S3_BUCKET
      }.s3.${
        process.env.NODE_ENV === "production"
          ? process.env.AWS_REGION
          : process.env.NEXT_PUBLIC_AWS_REGION
      }.amazonaws.com/${key}`;
      uploadedUrls.push(imageUrl);
    }

    // Return the first image as the main product image URL
    return NextResponse.json({
      success: true,
      allImages: uploadedUrls,
    });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // For DELETE requests, get the productId from the URL params
    const { searchParams } = new URL(request.url);
    const productName = searchParams.get("productName");

    if (!productName) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // List all objects with the product's folder prefix
    const folderPrefix = `products/${slugify(productName)}/`;

    const listCommand = new ListObjectsV2Command({
      Bucket:
        process.env.NODE_ENV === "production"
          ? process.env.AWS_S3_BUCKET!
          : process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
      Prefix: folderPrefix,
    });

    const listedObjects = await s3Client.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      // No objects found to delete
      return NextResponse.json({
        success: true,
        message: "No images found for this product",
      });
    }

    // Delete each object
    for (const object of listedObjects.Contents) {
      if (object.Key) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket:
            process.env.NODE_ENV === "production"
              ? process.env.AWS_S3_BUCKET!
              : process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
          Key: object.Key,
        });

        await s3Client.send(deleteCommand);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${listedObjects.Contents.length} images for product ${productName}`,
    });
  } catch (error) {
    console.error("Error deleting from S3:", error);
    return NextResponse.json(
      { error: "Failed to delete images" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // For GET requests, get the productId from the URL params
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // List all objects with the product's folder prefix
    const folderPrefix = `products/${productId}/`;

    const listCommand = new ListObjectsV2Command({
      Bucket:
        process.env.NODE_ENV === "production"
          ? process.env.AWS_S3_BUCKET!
          : process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
      Prefix: folderPrefix,
    });

    const listedObjects = await s3Client.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      // No objects found
      return NextResponse.json({ images: [] });
    }

    // Construct URLs for each image
    const imageUrls = listedObjects.Contents.map((object) => {
      return `https://${
        process.env.NODE_ENV === "production"
          ? process.env.AWS_S3_BUCKET
          : process.env.NEXT_PUBLIC_AWS_S3_BUCKET
      }.s3.${
        process.env.NODE_ENV === "production"
          ? process.env.AWS_REGION
          : process.env.NEXT_PUBLIC_AWS_REGION
      }.amazonaws.com/${object.Key}`;
    });

    return NextResponse.json({
      success: true,
      images: imageUrls,
    });
  } catch (error) {
    console.error("Error fetching images from S3:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
