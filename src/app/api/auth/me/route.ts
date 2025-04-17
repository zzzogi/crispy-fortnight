import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.NEXT_PULBLIC_JWT_SECRET!
    );
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      success: true,
      user: {
        userId: payload.userId,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}
