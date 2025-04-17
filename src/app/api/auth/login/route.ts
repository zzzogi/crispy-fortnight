import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { success: false, message: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // Check if user has admin or staff role
    if (!["admin", "staff"].includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Bạn không có quyền truy cập vào trang quản trị",
        },
        { status: 403 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.NEXT_PUBLIC_JWT_SECRET!,
      { expiresIn: "8h" }
    );

    // Set cookie with JWT token
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
