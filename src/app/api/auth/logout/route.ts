import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Đăng xuất thành công" },
    { status: 200 }
  );

  // Clear the auth token cookie
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    expires: new Date(0), // Immediately expire the cookie
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
