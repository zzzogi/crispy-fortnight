// app/api/user/profile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/libs/authOptions";

export async function PUT(request: Request) {
  try {
    // Get session to verify user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name } = await request.json();

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Cập nhật thông tin thành công",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}
