// middleware.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    if (!token) {
      console.log("No token, redirecting...");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_JWT_SECRET!
      );

      await jwtVerify(token, secret);
      console.log("Token valid, proceeding...");
      return NextResponse.next();
    } catch (error) {
      console.log(error);
      console.log("Invalid token, redirecting...");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
